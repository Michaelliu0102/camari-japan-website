const baseUrl = process.env.NEWSLETTER_SMOKE_BASE_URL || "http://localhost:3000";
const email =
  process.argv[2] ||
  `newsletter-smoke+${new Date().toISOString().replace(/[^0-9]/g, "")}@example.com`;

const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/newsletter/subscribe`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email,
    locale: "en",
    source: "footer_newsletter",
    submittedAt: new Date().toISOString(),
  }),
});

const responseText = await response.text();
let body = responseText;

try {
  body = JSON.parse(responseText);
} catch {
  // Keep plain text responses readable.
}

console.log(
  JSON.stringify(
    {
      ok: response.ok,
      status: response.status,
      email,
      body,
    },
    null,
    2,
  ),
);

if (!response.ok) {
  process.exitCode = 1;
}
