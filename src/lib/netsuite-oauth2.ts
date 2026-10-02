import {
  constants,
  createSign,
} from "node:crypto";
import { readFileSync } from "node:fs";

const CLIENT_ASSERTION_TYPE = "urn:ietf:params:oauth:client-assertion-type:jwt-bearer";
const TOKEN_EXPIRY_SAFETY_SECONDS = 60;
const ASSERTION_VALIDITY_SECONDS = 300;

export type NetSuiteOAuth2Config = {
  accountId: string;
  clientId: string;
  certificateId: string;
  privateKeyPem: string;
  tokenUrl: string;
};

type TokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

type CachedToken = {
  accessToken: string;
  expiresAt: number;
};

type AccessTokenOptions = {
  fetchImpl?: typeof fetch;
  nowSeconds?: number;
};

export class NetSuiteOAuth2TokenError extends Error {
  readonly status: number;
  readonly detail?: string;

  constructor(status: number, detail?: string) {
    super("NetSuite OAuth 2.0 token request failed.");
    this.name = "NetSuiteOAuth2TokenError";
    this.status = status;
    this.detail = detail;
  }
}

const tokenCache = new Map<string, CachedToken>();

function readRequiredEnv(env: Record<string, string | undefined>, key: string): string {
  const value = env[key]?.trim();
  if (!value) {
    throw new Error(`Missing required NetSuite configuration: ${key}`);
  }
  return value;
}

function normalizeAccountIdForDomain(accountId: string): string {
  return accountId.toLowerCase().replaceAll("_", "-");
}

function decodePrivateKey(value: string): string {
  let privateKeyPem: string;

  try {
    privateKeyPem = Buffer.from(value, "base64").toString("utf8").trim();
  } catch {
    throw new Error("Invalid NetSuite OAuth 2.0 private key encoding.");
  }

  if (!privateKeyPem.includes("-----BEGIN PRIVATE KEY-----")) {
    throw new Error("Invalid NetSuite OAuth 2.0 private key.");
  }

  return `${privateKeyPem}\n`;
}

function validatePrivateKey(privateKeyPem: string): string {
  const normalized = privateKeyPem.trim();

  if (!normalized.includes("-----BEGIN PRIVATE KEY-----")) {
    throw new Error("Invalid NetSuite OAuth 2.0 private key.");
  }

  return `${normalized}\n`;
}

function readPrivateKey(env: Record<string, string | undefined>): string {
  const encodedPrivateKey = env.NETSUITE_OAUTH2_PRIVATE_KEY_BASE64?.trim();
  if (encodedPrivateKey) {
    return decodePrivateKey(encodedPrivateKey);
  }

  const privateKeyPath = env.NETSUITE_OAUTH2_PRIVATE_KEY_PATH?.trim();
  if (privateKeyPath) {
    try {
      return validatePrivateKey(readFileSync(privateKeyPath, "utf8"));
    } catch (error) {
      if (error instanceof Error && error.message === "Invalid NetSuite OAuth 2.0 private key.") {
        throw error;
      }
      throw new Error("Unable to read the NetSuite OAuth 2.0 private key file.");
    }
  }

  throw new Error(
    "Missing required NetSuite configuration: NETSUITE_OAUTH2_PRIVATE_KEY_BASE64 or NETSUITE_OAUTH2_PRIVATE_KEY_PATH",
  );
}

function encodeBase64Url(value: string | Buffer): string {
  return Buffer.from(value).toString("base64url");
}

function isTokenResponse(value: unknown): value is TokenResponse {
  return Boolean(
    value &&
      typeof value === "object" &&
      "access_token" in value &&
      typeof value.access_token === "string" &&
      "expires_in" in value &&
      typeof value.expires_in === "number" &&
      "token_type" in value &&
      typeof value.token_type === "string",
  );
}

function cacheKey(config: NetSuiteOAuth2Config): string {
  return `${config.accountId}:${config.clientId}:${config.certificateId}:${config.tokenUrl}`;
}

export function getNetSuiteOAuth2Config(
  env: Record<string, string | undefined> = process.env,
): NetSuiteOAuth2Config {
  const accountId = readRequiredEnv(env, "NETSUITE_ACCOUNT_ID");
  const defaultTokenUrl = `https://${normalizeAccountIdForDomain(accountId)}.suitetalk.api.netsuite.com/services/rest/auth/oauth2/v1/token`;

  return {
    accountId,
    clientId: readRequiredEnv(env, "NETSUITE_OAUTH2_CLIENT_ID"),
    certificateId: readRequiredEnv(env, "NETSUITE_OAUTH2_CERTIFICATE_ID"),
    privateKeyPem: readPrivateKey(env),
    tokenUrl: env.NETSUITE_OAUTH2_TOKEN_URL?.trim() || defaultTokenUrl,
  };
}

export function buildNetSuiteClientAssertion(
  config: NetSuiteOAuth2Config,
  nowSeconds = Math.floor(Date.now() / 1000),
): string {
  const header = {
    typ: "JWT",
    alg: "PS256",
    kid: config.certificateId,
  };
  const payload = {
    iss: config.clientId,
    scope: "restlets",
    aud: config.tokenUrl,
    iat: nowSeconds,
    exp: nowSeconds + ASSERTION_VALIDITY_SECONDS,
  };
  const signingInput = `${encodeBase64Url(JSON.stringify(header))}.${encodeBase64Url(JSON.stringify(payload))}`;
  const signer = createSign("sha256");
  signer.update(signingInput);
  signer.end();
  const signature = signer.sign({
    key: config.privateKeyPem,
    padding: constants.RSA_PKCS1_PSS_PADDING,
    saltLength: 32,
  });

  return `${signingInput}.${encodeBase64Url(signature)}`;
}

export async function getNetSuiteAccessToken(
  config: NetSuiteOAuth2Config,
  options: AccessTokenOptions = {},
): Promise<string> {
  const nowSeconds = options.nowSeconds ?? Math.floor(Date.now() / 1000);
  const key = cacheKey(config);
  const cached = tokenCache.get(key);

  if (cached && cached.expiresAt - TOKEN_EXPIRY_SAFETY_SECONDS > nowSeconds) {
    return cached.accessToken;
  }

  const clientAssertion = buildNetSuiteClientAssertion(config, nowSeconds);
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_assertion_type: CLIENT_ASSERTION_TYPE,
    client_assertion: clientAssertion,
  });
  const fetchImpl = options.fetchImpl ?? fetch;
  const response = await fetchImpl(config.tokenUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 300);
    throw new NetSuiteOAuth2TokenError(response.status, detail || undefined);
  }

  const payload: unknown = await response.json();
  if (!isTokenResponse(payload)) {
    throw new NetSuiteOAuth2TokenError(502, "Invalid token response.");
  }

  tokenCache.set(key, {
    accessToken: payload.access_token,
    expiresAt: nowSeconds + payload.expires_in,
  });

  return payload.access_token;
}
