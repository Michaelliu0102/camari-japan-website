import { createHmac, randomUUID } from "node:crypto";
import type { NewsletterSubmission } from "./newsletter.js";

type NetSuiteSignatureMethod = "HMAC-SHA1" | "HMAC-SHA256";

type NetSuiteNewsletterConfig = {
  endpointUrl: string;
  accountId: string;
  consumerKey: string;
  consumerSecret: string;
  tokenId: string;
  tokenSecret: string;
  realm: string;
  signatureMethod: NetSuiteSignatureMethod;
};

export type NewsletterDeliveryResult =
  | { ok: true; upstreamStatus: number }
  | { ok: false; status: number; detail?: string };

type DeliveryOptions = {
  env?: Record<string, string | undefined>;
  fetchImpl?: typeof fetch;
  nonce?: string;
  timestamp?: string;
};

function readRequiredEnv(env: Record<string, string | undefined>, key: string): string {
  const value = env[key]?.trim();
  if (!value) {
    throw new Error(`Missing required NetSuite configuration: ${key}`);
  }
  return value;
}

export function getNetSuiteNewsletterConfig(
  env: Record<string, string | undefined> = process.env,
): NetSuiteNewsletterConfig {
  const accountId = readRequiredEnv(env, "NETSUITE_ACCOUNT_ID");

  return {
    endpointUrl: readRequiredEnv(env, "NETSUITE_RESTLET_URL"),
    accountId,
    consumerKey: readRequiredEnv(env, "NETSUITE_CONSUMER_KEY"),
    consumerSecret: readRequiredEnv(env, "NETSUITE_CONSUMER_SECRET"),
    tokenId: readRequiredEnv(env, "NETSUITE_TOKEN_ID"),
    tokenSecret: readRequiredEnv(env, "NETSUITE_TOKEN_SECRET"),
    realm: env.NETSUITE_REALM?.trim() || accountId,
    signatureMethod: env.NETSUITE_SIGNATURE_METHOD === "HMAC-SHA1" ? "HMAC-SHA1" : "HMAC-SHA256",
  };
}

function percentEncode(value: string): string {
  return encodeURIComponent(value)
    .replace(/[!'()*]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`);
}

function normalizedBaseUrl(url: URL): string {
  return `${url.protocol}//${url.host}${url.pathname}`;
}

function normalizedParameterString(url: URL, params: Record<string, string>): string {
  const entries: Array<[string, string]> = [];

  for (const [key, value] of url.searchParams.entries()) {
    entries.push([percentEncode(key), percentEncode(value)]);
  }

  for (const [key, value] of Object.entries(params)) {
    entries.push([percentEncode(key), percentEncode(value)]);
  }

  entries.sort(([leftKey, leftValue], [rightKey, rightValue]) => {
    if (leftKey === rightKey) {
      return leftValue.localeCompare(rightValue);
    }
    return leftKey.localeCompare(rightKey);
  });

  return entries.map(([key, value]) => `${key}=${value}`).join("&");
}

export function buildNetSuiteOAuthHeader({
  method,
  url,
  config,
  nonce = randomUUID(),
  timestamp = Math.floor(Date.now() / 1000).toString(),
}: {
  method: string;
  url: string;
  config: NetSuiteNewsletterConfig;
  nonce?: string;
  timestamp?: string;
}): string {
  const parsedUrl = new URL(url);
  const oauthParams = {
    oauth_consumer_key: config.consumerKey,
    oauth_nonce: nonce,
    oauth_signature_method: config.signatureMethod,
    oauth_timestamp: timestamp,
    oauth_token: config.tokenId,
    oauth_version: "1.0",
  };
  const parameterString = normalizedParameterString(parsedUrl, oauthParams);
  const baseString = [
    method.toUpperCase(),
    percentEncode(normalizedBaseUrl(parsedUrl)),
    percentEncode(parameterString),
  ].join("&");
  const signingKey = `${percentEncode(config.consumerSecret)}&${percentEncode(config.tokenSecret)}`;
  const algorithm = config.signatureMethod === "HMAC-SHA1" ? "sha1" : "sha256";
  const signature = createHmac(algorithm, signingKey).update(baseString).digest("base64");

  const headerParams = {
    realm: config.realm,
    ...oauthParams,
    oauth_signature: signature,
  };

  return `OAuth ${Object.entries(headerParams)
    .map(([key, value]) => `${percentEncode(key)}="${percentEncode(value)}"`)
    .join(", ")}`;
}

export async function sendNewsletterSubscriptionToNetSuite(
  submission: NewsletterSubmission,
  options: DeliveryOptions = {},
): Promise<NewsletterDeliveryResult> {
  const config = getNetSuiteNewsletterConfig(options.env);
  const authorization = buildNetSuiteOAuthHeader({
    method: "POST",
    url: config.endpointUrl,
    config,
    nonce: options.nonce,
    timestamp: options.timestamp,
  });
  const fetchImpl = options.fetchImpl ?? fetch;
  const response = await fetchImpl(config.endpointUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: authorization,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(submission),
  });

  if (response.ok) {
    return { ok: true, upstreamStatus: response.status };
  }

  const detail = (await response.text()).slice(0, 300);
  return detail
    ? { ok: false, status: response.status, detail }
    : { ok: false, status: response.status };
}
