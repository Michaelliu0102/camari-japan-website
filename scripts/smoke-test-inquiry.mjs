const baseUrl = process.env.INQUIRY_SMOKE_BASE_URL || "http://localhost:3001";
const locale = process.argv[2] === "ja" ? "ja" : "en";
const countryCode = locale === "ja" ? "JP" : process.argv[3] || "US";
const timestamp = new Date().toISOString();

const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/contact/inquiry`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    locale,
    name: "CAMARI CRM Smoke Test",
    email: `inquiry-smoke+${timestamp.replace(/[^0-9]/g, "")}@example.com`,
    phone: "+81 00 0000 0000",
    company: "CAMARI Test",
    countryCode,
    message: "Dry-run website inquiry integration test.",
    interests: ["Material"],
    submissionId: crypto.randomUUID(),
    pageUrl: `${baseUrl.replace(/\/$/, "")}/${locale}/contact`,
  }),
});

const responseText = await response.text();
let body = responseText;

try {
  body = JSON.parse(responseText);
} catch {
  // Keep plain text responses readable.
}

console.log(JSON.stringify({ ok: response.ok, status: response.status, locale, countryCode, body }, null, 2));

if (!response.ok) {
  process.exitCode = 1;
}
