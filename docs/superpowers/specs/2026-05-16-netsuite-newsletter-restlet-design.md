# NetSuite Newsletter RESTlet Design

## Goal

Deploy the newsletter subscription receiver into NetSuite production with guardrails, because no sandbox is available.

## Approach

The website continues to POST newsletter submissions to a NetSuite RESTlet using Token-Based Authentication. The NetSuite side is managed as a SuiteCloud/SDF project in `suitecloud/`, so the RESTlet script, custom record, script record, and deployment can be versioned with the website.

The RESTlet deployment is `RELEASED`, because external server-to-server calls require a released deployment. Production risk is controlled by a script parameter named `custscript_camari_newsletter_dryrun`, which defaults to checked. While dry-run is enabled, the RESTlet validates the payload and reports whether it would create or update a subscription without writing a record.

## Data Storage

The RESTlet owns a small custom record type, `customrecord_camari_newsletter`, instead of writing directly to customer or lead records. It stores the email, locale, source, submitted timestamp, received timestamp, and last raw payload. This keeps the first production deployment low-risk and gives the business a clear review queue before any CRM automation is added.

## Payload Contract

The website sends:

```json
{
  "email": "user@example.com",
  "locale": "en",
  "source": "footer_newsletter",
  "submittedAt": "2026-05-16T12:34:56.000Z"
}
```

## Error Handling

The RESTlet rejects invalid payloads by throwing a SuiteScript error, which makes NetSuite return a non-2xx response to the website. Duplicate emails update the existing custom record once dry-run is disabled.

## Verification

Static Node tests assert that the SuiteCloud project includes the custom record, a released RESTlet deployment, dry-run defaulting to enabled, and deployment instructions. Runtime verification happens by running the website locally and using `scripts/smoke-test-newsletter.mjs` against `/api/newsletter/subscribe`.
