# NetSuite Newsletter RESTlet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a production-safe SuiteCloud deployment package for the newsletter RESTlet.

**Architecture:** Keep the website API route unchanged and add NetSuite-side infrastructure under `suitecloud/`. The RESTlet writes to a dedicated custom record only after its dry-run deployment parameter is turned off.

**Tech Stack:** Next.js API route, Node test runner, SuiteScript 2.1, SuiteCloud/SDF XML, SuiteCloud CLI for Node.js.

---

### Task 1: Static SuiteCloud Contract Test

**Files:**
- Create: `tests/suitecloud-newsletter-project.test.mjs`

- [x] **Step 1: Write failing tests**

```js
assert.match(scriptXml, /<status>RELEASED<\/status>/);
assert.match(scriptXml, /<defaultchecked>T<\/defaultchecked>/);
assert.match(restletSource, /customrecord_camari_newsletter/);
```

- [x] **Step 2: Verify the test fails**

Run: `node --test tests/suitecloud-newsletter-project.test.mjs`
Expected: FAIL because `suitecloud/src/deploy.xml` and `suitecloud/README.md` do not exist.

### Task 2: SuiteCloud Project

**Files:**
- Create: `suitecloud/suitecloud.config.js`
- Create: `suitecloud/src/manifest.xml`
- Create: `suitecloud/src/deploy.xml`
- Create: `suitecloud/src/Objects/customrecord_camari_newsletter.xml`
- Create: `suitecloud/src/Objects/customscript_camari_newsletter_rl.xml`
- Create: `suitecloud/src/FileCabinet/SuiteScripts/Camari/Newsletter/newsletter-restlet.js`

- [x] **Step 1: Add SDF files**

Create the SuiteCloud project with one custom record, one RESTlet script, one released deployment, and a dry-run script parameter defaulting to checked.

- [x] **Step 2: Run the static test**

Run: `node --test tests/suitecloud-newsletter-project.test.mjs`
Expected: PASS.

### Task 3: Deployment Instructions and Smoke Test

**Files:**
- Create: `suitecloud/README.md`
- Create: `scripts/smoke-test-newsletter.mjs`
- Modify: `docs/newsletter-netsuite-integration.md`
- Modify: `package.json`

- [x] **Step 1: Document the administrator flow**

Document SuiteCloud CLI install, `suitecloud account:setup`, validation, deploy, RESTlet URL capture, dry-run test, and enabling real writes.

- [x] **Step 2: Add local smoke test command**

Add `netsuite:newsletter:smoke` to post a test email through the website API.

- [x] **Step 3: Verify focused tests and typecheck**

Run: `node --test tests/suitecloud-newsletter-project.test.mjs tests/netsuite-newsletter.test.mjs tests/newsletter-lib.test.mjs tests/newsletter-route.test.mjs`
Run: `npm run typecheck`
