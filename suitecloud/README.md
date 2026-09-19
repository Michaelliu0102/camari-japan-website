# CAMARI Website CRM SuiteCloud Project

This project deploys the NetSuite side of the website newsletter and business inquiry integrations.

## Website payload

The website backend sends this JSON payload to the RESTlet:

```json
{
  "email": "user@example.com",
  "locale": "en",
  "source": "footer_newsletter",
  "submittedAt": "2026-05-16T12:34:56.000Z"
}
```

## What this deploys

- `customrecord_camari_newsletter`: a dedicated custom record for website newsletter submissions.
- `customscript_camari_newsletter_rl`: a RESTlet that validates the payload and creates or updates a custom record by email.
- `customdeploy_camari_newsletter_rl`: a released deployment for server-to-server calls.
- `custscript_camari_newsletter_dryrun`: a checked-by-default script parameter. Keep it checked for the first production smoke test.
- `customrecord_camari_inquiry`: a dedicated, country-classified record for website inquiries.
- `customscript_camari_inquiry_rl`: an idempotent RESTlet that creates one inquiry per submission ID.
- `customdeploy_camari_inquiry_rl`: a released deployment for server-to-server calls.
- `custscript_camari_inquiry_dryrun`: a checked-by-default script parameter for safe production validation.

## One-time administrator setup

Install SuiteCloud CLI for Node.js:

```bash
npm install -g @oracle/suitecloud-cli
```

From this directory, link your NetSuite production account:

```bash
cd suitecloud
suitecloud account:setup
```

Use an administrator or deployment role that can manage SuiteScript, RESTlets, SDF, custom records, and integrations.

## Deploy

Validate the project first:

```bash
suitecloud project:validate
```

Deploy the project:

```bash
suitecloud project:deploy
```

After deployment, open the script deployment in NetSuite and copy the RESTlet External URL. Put that value in the website environment variable:

```bash
NETSUITE_RESTLET_URL="https://ACCOUNT.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=customscript_camari_newsletter_rl&deploy=customdeploy_camari_newsletter_rl"
NETSUITE_INQUIRY_RESTLET_URL="https://ACCOUNT.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=customscript_camari_inquiry_rl&deploy=customdeploy_camari_inquiry_rl"
```

The website runtime authenticates with OAuth 2.0 Client Credentials (M2M). Configure:

```bash
NETSUITE_ACCOUNT_ID="..."
NETSUITE_OAUTH2_CLIENT_ID="..."
NETSUITE_OAUTH2_CERTIFICATE_ID="..."
NETSUITE_OAUTH2_PRIVATE_KEY_BASE64="..."
```

The optional `NETSUITE_OAUTH2_TOKEN_URL` overrides the account-specific token endpoint. The
private key must remain server-side and must never be committed to the repository.

Keep `custscript_camari_newsletter_dryrun` checked for the first test. In dry-run mode, the RESTlet validates the request and reports whether it would create or update a record, without writing data.

## Enable real writes

After the website smoke test reaches NetSuite successfully:

1. Open `Customization > Scripting > Script Deployments`.
2. Open `CAMARI Newsletter RESTlet`.
3. Clear the `Dry Run` parameter.
4. Save.
5. Submit one test email and confirm a `CAMARI Newsletter Subscription` custom record is created or updated.
6. Open `CAMARI Website Inquiry RESTlet`, clear its `Dry Run` parameter, and save.
7. Submit English and Japanese test inquiries. Confirm the English country selection is stored and Japanese is classified as `Japan (JP)`.

## Website smoke test

Start the website locally with NetSuite environment variables loaded, then run:

```bash
npm run netsuite:newsletter:smoke -- test-newsletter@example.com
```

The command posts to `http://localhost:3000/api/newsletter/subscribe` by default. Override the base URL with:

```bash
NEWSLETTER_SMOKE_BASE_URL="https://your-site.example" npm run netsuite:newsletter:smoke -- test-newsletter@example.com
```

Test English and Japanese inquiries against the local 3001 server:

```bash
INQUIRY_SMOKE_BASE_URL="http://localhost:3001" npm run netsuite:inquiry:smoke -- en US
INQUIRY_SMOKE_BASE_URL="http://localhost:3001" npm run netsuite:inquiry:smoke -- ja
```
