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

- Use an administrator or deployment role with access to SuiteScript, RESTlets, SDF, custom records, and integrations.
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
- `customrecord_camari_inquiry`
- `customscript_camari_inquiry_rl`
- `customdeploy_camari_inquiry_rl`

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

## 5. Configure OAuth 2.0 M2M

In NetSuite:

1. Create an enabled Integration Record with only `Client Credentials (Machine to Machine) Grant`
   and the `RESTlets` scope selected.
2. Assign `CAMARI Website Integration` to the employee used as the M2M entity.
3. Give that role `Log in using OAuth 2.0 Access Tokens` and Full access to the two CAMARI custom records.
4. Add that role to the Audience of both RESTlet deployments.
5. Go to `Setup > Integration > Manage Authentication > OAuth 2.0 Client Credentials (M2M) Setup`.
6. Map the Integration Record, entity, role, and `.secrets/netsuite/public.pem` certificate.
7. Copy the resulting Certificate ID. Keep `.secrets/netsuite/private.pem` local and server-side only.

## 6. Configure website environment variables

Set these values in the website environment:

```bash
NETSUITE_RESTLET_URL="https://ACCOUNT.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=customscript_camari_newsletter_rl&deploy=customdeploy_camari_newsletter_rl"
NETSUITE_INQUIRY_RESTLET_URL="https://ACCOUNT.restlets.api.netsuite.com/app/site/hosting/restlet.nl?script=customscript_camari_inquiry_rl&deploy=customdeploy_camari_inquiry_rl"
NETSUITE_ACCOUNT_ID="..."
NETSUITE_OAUTH2_CLIENT_ID="..."
NETSUITE_OAUTH2_CERTIFICATE_ID="..."
NETSUITE_OAUTH2_PRIVATE_KEY_BASE64="..."
```

For local development only, `NETSUITE_OAUTH2_PRIVATE_KEY_PATH` may be used instead of
`NETSUITE_OAUTH2_PRIVATE_KEY_BASE64`.

Optional:

```bash
NETSUITE_OAUTH2_TOKEN_URL="https://ACCOUNT.suitetalk.api.netsuite.com/services/rest/auth/oauth2/v1/token"
```

Defaults:

- `NETSUITE_OAUTH2_TOKEN_URL` is derived from `NETSUITE_ACCOUNT_ID`
- OAuth 2.0 access tokens are cached server-side until shortly before their 60-minute expiry

## 7. Run the website smoke test in dry-run mode

Start the website with the NetSuite environment variables loaded, then run:

```bash
cd /Users/michael/Documents/Website
npm run netsuite:newsletter:smoke -- test-newsletter@example.com
INQUIRY_SMOKE_BASE_URL="http://localhost:3001" npm run netsuite:inquiry:smoke -- en US
```

Expected result:

- The website returns success from `/api/newsletter/subscribe`
- NetSuite responds successfully while `Dry Run` is enabled
- No newsletter or inquiry custom record is written yet

If needed, target another base URL:

```bash
NEWSLETTER_SMOKE_BASE_URL="https://your-site.example" npm run netsuite:newsletter:smoke -- test-newsletter@example.com
```

## 8. Turn on real writes

Only do this after the dry-run smoke test succeeds.

In NetSuite:

1. Open `Customization > Scripting > Script Deployments`
2. Open `CAMARI Newsletter RESTlet`
3. Clear the `Dry Run` checkbox
4. Save

## 9. Verify one real submission

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
- A `CAMARI Website Inquiry` record is created for the inquiry smoke test
- English inquiry records contain the selected `Country / Region` and ISO code
- Japanese inquiry records default to `Japan (JP)`

## 10. Final production checks

Confirm:

- The website can still submit after deployment
- No secrets are exposed in browser responses
- NetSuite permissions are limited to the intended integration role
- The External URL and OAuth 2.0 certificate mapping match the correct production account

## Quick command set

```bash
cd /Users/michael/Documents/Website/suitecloud
suitecloud account:setup
suitecloud project:validate
suitecloud project:deploy

cd /Users/michael/Documents/Website
npm run netsuite:newsletter:smoke -- test-newsletter@example.com
```
