# SuiteCloud Newsletter Go-Live Checklist

Use this checklist when the NetSuite browser authentication flow is working again and the website is ready for launch.

## 1. Link the SuiteCloud project

From the repo root:

```bash
cd /Users/michael/Documents/Website/suitecloud
suitecloud account:setup
```

Recommended authentication ID:

- `jp-newsletter`

Notes:

- Use an administrator or deployment role with access to SuiteScript, RESTlets, SDF, custom records, integrations, and token-based authentication.
- If the browser callback stalls again, fix authentication before continuing. `project:validate` and `project:deploy` will not run until account setup completes.

## 2. Validate the SuiteCloud project

```bash
cd /Users/michael/Documents/Website/suitecloud
suitecloud project:validate
```

Expected result:

- Validation completes without XML, manifest, or file path errors.

If validation fails:

- Check `suitecloud/src/manifest.xml`
- Check `suitecloud/src/deploy.xml`
- Check the object definitions in `suitecloud/src/Objects/`
- Check the RESTlet source path in `suitecloud/src/FileCabinet/SuiteScripts/Camari/Newsletter/`

## 3. Deploy the project

```bash
cd /Users/michael/Documents/Website/suitecloud
suitecloud project:deploy
```

Expected deployed items:

- `customrecord_camari_newsletter`
- `customscript_camari_newsletter_rl`
- `customdeploy_camari_newsletter_rl`

## 4. Confirm the NetSuite deployment settings

In NetSuite, open:

- `Customization > Scripting > Scripts`
- Open `CAMARI Newsletter RESTlet`
- Open the deployment `CAMARI Newsletter RESTlet`

Confirm:

- Status is `Released`
- Deployment is active
- The deployment exposes an External URL
- The `Dry Run` parameter is still checked

Copy the External URL for the website environment variable.

## 5. Configure website environment variables

Set these values in the website environment:

```bash
NETSUITE_RESTLET_URL="https://ACCOUNT.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=customscript_camari_newsletter_rl&deploy=customdeploy_camari_newsletter_rl"
NETSUITE_ACCOUNT_ID="..."
NETSUITE_CONSUMER_KEY="..."
NETSUITE_CONSUMER_SECRET="..."
NETSUITE_TOKEN_ID="..."
NETSUITE_TOKEN_SECRET="..."
```

Optional:

```bash
NETSUITE_REALM="..."
NETSUITE_SIGNATURE_METHOD="HMAC-SHA256"
```

Defaults:

- `NETSUITE_REALM` falls back to `NETSUITE_ACCOUNT_ID`
- `NETSUITE_SIGNATURE_METHOD` defaults to `HMAC-SHA256`

## 6. Run the website smoke test in dry-run mode

Start the website with the NetSuite environment variables loaded, then run:

```bash
cd /Users/michael/Documents/Website
npm run netsuite:newsletter:smoke -- test-newsletter@example.com
```

Expected result:

- The website returns success from `/api/newsletter/subscribe`
- NetSuite responds successfully while `Dry Run` is enabled
- No newsletter custom record is written yet

If needed, target another base URL:

```bash
NEWSLETTER_SMOKE_BASE_URL="https://your-site.example" npm run netsuite:newsletter:smoke -- test-newsletter@example.com
```

## 7. Turn on real writes

Only do this after the dry-run smoke test succeeds.

In NetSuite:

1. Open `Customization > Scripting > Script Deployments`
2. Open `CAMARI Newsletter RESTlet`
3. Clear the `Dry Run` checkbox
4. Save

## 8. Verify one real submission

Submit one real test email through the website flow.

Confirm in NetSuite:

- A `CAMARI Newsletter Subscription` record is created if the email is new
- The existing record is updated if the email already exists
- The saved values look correct for:
  - email
  - locale
  - source
  - submitted timestamp
  - received timestamp
  - last payload

## 9. Final production checks

Confirm:

- The website can still submit after deployment
- No secrets are exposed in browser responses
- NetSuite permissions are limited to the intended integration role
- The External URL and token credentials match the correct production account

## Quick command set

```bash
cd /Users/michael/Documents/Website/suitecloud
suitecloud account:setup
suitecloud project:validate
suitecloud project:deploy

cd /Users/michael/Documents/Website
npm run netsuite:newsletter:smoke -- test-newsletter@example.com
```
