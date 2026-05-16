import { sendNewsletterSubscriptionToNetSuite, type NewsletterDeliveryResult } from "../../../../lib/netsuite-newsletter.js";
import { parseNewsletterSubscriptionPayload, type NewsletterSubmission } from "../../../../lib/newsletter.js";

export type NewsletterDeliveryFn = (
  submission: NewsletterSubmission,
) => Promise<NewsletterDeliveryResult>;

export function createNewsletterSubscribeHandler(
  deliver: NewsletterDeliveryFn = sendNewsletterSubscriptionToNetSuite,
) {
  return async function POST(request: Request): Promise<Response> {
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

export const POST = createNewsletterSubscribeHandler();
