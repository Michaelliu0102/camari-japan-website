import { sendNewsletterSubscriptionToNetSuite, type NewsletterDeliveryResult } from "../../../../lib/netsuite-newsletter.js";
import { isNewsletterEnabled, parseNewsletterSubscriptionPayload, type NewsletterSubmission } from "../../../../lib/newsletter.js";

export type NewsletterDeliveryFn = (
  submission: NewsletterSubmission,
) => Promise<NewsletterDeliveryResult>;

export function createNewsletterSubscribeHandler(
  deliver: NewsletterDeliveryFn = sendNewsletterSubscriptionToNetSuite,
  siteKey = process.env.NEXT_PUBLIC_SITE_KEY,
) {
  return async function POST(request: Request): Promise<Response> {
    if (!isNewsletterEnabled(undefined, siteKey)) {
      return Response.json({ error: "Newsletter subscriptions are not available on this site." }, { status: 404 });
    }

    let payload: unknown;

    try {
      payload = await request.json();
    } catch {
      return Response.json({ error: "Invalid JSON payload." }, { status: 400 });
    }

    const parsed = parseNewsletterSubscriptionPayload(payload);
    if (!parsed.ok) {
      return Response.json({ error: parsed.error }, { status: 400 });
    }

    if (!isNewsletterEnabled(parsed.value.locale, siteKey)) {
      return Response.json({ error: "Newsletter subscriptions are not available on this site." }, { status: 404 });
    }

    try {
      const result = await deliver(parsed.value);

      if (!result.ok) {
        return Response.json({ error: "Subscription service unavailable." }, { status: 502 });
      }

      return Response.json({ ok: true }, { status: 201 });
    } catch {
      return Response.json({ error: "Internal server error." }, { status: 500 });
    }
  };
}
