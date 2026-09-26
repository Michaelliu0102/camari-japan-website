import type { ContactInquiry } from "./contact-inquiry";
import {
  getNetSuiteAccessToken,
  getNetSuiteOAuth2Config,
  NetSuiteOAuth2TokenError,
} from "./netsuite-oauth2";
import type { NetSuiteRestletConfig } from "./netsuite-newsletter";

export type NetSuiteInquiryDeliveryResult =
  | { ok: true; upstreamStatus: number }
  | { ok: false; status: number; detail?: string };

type DeliveryOptions = {
  env?: Record<string, string | undefined>;
  fetchImpl?: typeof fetch;
  nowSeconds?: number;
};

function readRequiredEnv(env: Record<string, string | undefined>, key: string): string {
  const value = env[key]?.trim();
  if (!value) {
    throw new Error(`Missing required NetSuite configuration: ${key}`);
  }
  return value;
}

export function isNetSuiteInquiryConfigured(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return Boolean(env.NETSUITE_INQUIRY_RESTLET_URL?.trim());
}

export function getNetSuiteInquiryConfig(
  env: Record<string, string | undefined> = process.env,
): NetSuiteRestletConfig {
  return {
    ...getNetSuiteOAuth2Config(env),
    endpointUrl: readRequiredEnv(env, "NETSUITE_INQUIRY_RESTLET_URL"),
  };
}

export async function sendContactInquiryToNetSuite(
  inquiry: ContactInquiry,
  options: DeliveryOptions = {},
): Promise<NetSuiteInquiryDeliveryResult> {
  const config = getNetSuiteInquiryConfig(options.env);
  const fetchImpl = options.fetchImpl ?? fetch;
  let accessToken: string;

  try {
    accessToken = await getNetSuiteAccessToken(config, {
      fetchImpl,
      nowSeconds: options.nowSeconds,
    });
  } catch (error) {
    if (error instanceof NetSuiteOAuth2TokenError) {
      return error.detail
        ? { ok: false, status: error.status, detail: error.detail }
        : { ok: false, status: error.status };
    }
    throw error;
  }

  const response = await fetchImpl(config.endpointUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inquiry),
  });

  if (response.ok) {
    return { ok: true, upstreamStatus: response.status };
  }

  const detail = (await response.text()).slice(0, 300);
  return detail
    ? { ok: false, status: response.status, detail }
    : { ok: false, status: response.status };
}
