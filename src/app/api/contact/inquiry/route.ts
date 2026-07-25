import {
  CONTACT_INQUIRY_RECIPIENTS,
  buildContactInquiryText,
  parseContactInquiryPayload,
  type ContactInquiry
} from "@/lib/contact-inquiry";

export const runtime = "nodejs";

type EmailDeliveryResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

function getRecipient(locale: ContactInquiry["locale"]): string {
  return CONTACT_INQUIRY_RECIPIENTS[locale];
}

function buildSubject(inquiry: ContactInquiry): string {
  return `Website inquiry from ${inquiry.name} (${inquiry.company})`;
}

function buildHtmlBody(inquiry: ContactInquiry, recipient: string): string {
  const rows = [
    ["Recipient", recipient],
    ["Language", inquiry.locale],
    ["Name", inquiry.name],
    ["Business Email", inquiry.email],
    ["Phone", inquiry.phone || "Not provided"],
    ["Company Name", inquiry.company],
    ["Interest", inquiry.interests.length ? inquiry.interests.join(", ") : "Not specified"],
    ...(inquiry.article ? ([["Article", inquiry.article]] as Array<[string, string]>) : []),
    ...(inquiry.pageUrl ? ([["Page URL", inquiry.pageUrl]] as Array<[string, string]>) : [])
  ];

  const escapeHtml = (value: string) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  return `
    <div style="font-family: Arial, sans-serif; color: #1a1a1a; line-height: 1.6;">
      <h1 style="font-size: 20px; margin: 0 0 20px;">New website inquiry</h1>
      <table style="border-collapse: collapse; width: 100%; max-width: 720px;">
        <tbody>
          ${rows
            .map(
              ([label, value]) => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 10px 12px; font-weight: 700; width: 180px;">${escapeHtml(label)}</td>
                  <td style="border: 1px solid #ddd; padding: 10px 12px;">${escapeHtml(value)}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
      <h2 style="font-size: 15px; margin: 24px 0 8px;">Message / Project Specs</h2>
      <p style="white-space: pre-wrap; margin: 0; padding: 16px; border: 1px solid #ddd; max-width: 720px;">${escapeHtml(inquiry.message)}</p>
    </div>
  `;
}

async function sendViaWebhook(inquiry: ContactInquiry, recipient: string): Promise<EmailDeliveryResult> {
  const webhookUrl = process.env.CONTACT_FORM_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    return { ok: false, status: 503, error: "Contact form webhook is not configured." };
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "contact_inquiry",
      recipient,
      subject: buildSubject(inquiry),
      text: buildContactInquiryText(inquiry, recipient),
      inquiry
    })
  });

  if (!response.ok) {
    return { ok: false, status: 502, error: "Contact form webhook delivery failed." };
  }

  return { ok: true };
}

async function sendViaResend(inquiry: ContactInquiry, recipient: string): Promise<EmailDeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_FORM_FROM_EMAIL?.trim();

  if (!apiKey || !from) {
    return { ok: false, status: 503, error: "Contact form email delivery is not configured." };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [recipient],
      reply_to: inquiry.email,
      subject: buildSubject(inquiry),
      text: buildContactInquiryText(inquiry, recipient),
      html: buildHtmlBody(inquiry, recipient)
    })
  });

  if (!response.ok) {
    return { ok: false, status: 502, error: "Contact form email delivery failed." };
  }

  return { ok: true };
}

async function deliverInquiry(inquiry: ContactInquiry, recipient: string): Promise<EmailDeliveryResult> {
  if (process.env.CONTACT_FORM_WEBHOOK_URL?.trim()) {
    return sendViaWebhook(inquiry, recipient);
  }

  return sendViaResend(inquiry, recipient);
}

export async function POST(request: Request): Promise<Response> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = parseContactInquiryPayload(payload);
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  const recipient = getRecipient(parsed.value.locale);

  try {
    const result = await deliverInquiry(parsed.value, recipient);

    if (!result.ok) {
      return Response.json({ error: result.error }, { status: result.status });
    }

    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: "Internal server error." }, { status: 500 });
  }
}
