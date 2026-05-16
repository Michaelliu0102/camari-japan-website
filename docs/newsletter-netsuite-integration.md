# Newsletter -> NetSuite Integration

## Frontend contract

The footer newsletter form submits to:

- `POST /api/newsletter/subscribe`

Request body:

```json
{
  "email": "user@example.com",
  "locale": "en",
  "source": "footer_newsletter",
  "submittedAt": "2026-05-15T12:34:56.000Z"
}
```

## Required environment variables

- `NETSUITE_RESTLET_URL`
- `NETSUITE_ACCOUNT_ID`
- `NETSUITE_CONSUMER_KEY`
- `NETSUITE_CONSUMER_SECRET`
- `NETSUITE_TOKEN_ID`
- `NETSUITE_TOKEN_SECRET`

## Optional environment variables

- `NETSUITE_REALM`
  Defaults to `NETSUITE_ACCOUNT_ID`
- `NETSUITE_SIGNATURE_METHOD`
  Defaults to `HMAC-SHA256`
  Supported values:
  - `HMAC-SHA256`
  - `HMAC-SHA1`

## NetSuite payload

The website backend forwards the normalized newsletter submission payload directly to the configured RESTlet as JSON.

## NetSuite setup

This repository includes a SuiteCloud/SDF project for the RESTlet in `suitecloud/`.

Recommended production flow, since no sandbox is available:

1. Deploy the SuiteCloud project with the RESTlet `Dry Run` parameter checked.
2. Configure the website environment variables, including the RESTlet External URL.
3. Run one smoke test through the website API.
4. Confirm NetSuite receives a dry-run response without creating records.
5. Clear the RESTlet `Dry Run` parameter only after the smoke test succeeds.
6. Submit one test email and confirm a `CAMARI Newsletter Subscription` custom record is created or updated.

See `suitecloud/README.md` for SuiteCloud CLI commands and deployment details.

## Local smoke test

Start the website locally with the NetSuite environment variables loaded:

```bash
npm run dev
```

Then run:

```bash
npm run netsuite:newsletter:smoke -- test-newsletter@example.com
```

The smoke test posts to `http://localhost:3000/api/newsletter/subscribe` by default. Set `NEWSLETTER_SMOKE_BASE_URL` to test another deployed website URL.
