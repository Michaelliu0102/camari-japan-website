import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";

const projectRoot = path.resolve(import.meta.dirname, "..");

async function readProjectFile(relativePath) {
  return readFile(path.join(projectRoot, relativePath), "utf8");
}

test("SuiteCloud newsletter project deploys a released dry-run RESTlet", async () => {
  const [deployXml, scriptXml, customRecordXml, restletSource] = await Promise.all([
    readProjectFile("suitecloud/src/deploy.xml"),
    readProjectFile("suitecloud/src/Objects/customscript_camari_newsletter_rl.xml"),
    readProjectFile("suitecloud/src/Objects/customrecord_camari_newsletter.xml"),
    readProjectFile("suitecloud/src/FileCabinet/SuiteScripts/Camari/Newsletter/newsletter-restlet.js"),
  ]);

  assert.match(deployXml, /customscript_camari_newsletter_rl\.xml/);
  assert.match(deployXml, /customrecord_camari_newsletter\.xml/);
  assert.match(scriptXml, /<scriptdeployment scriptid="customdeploy_camari_newsletter_rl">/);
  assert.match(scriptXml, /<status>RELEASED<\/status>/);
  assert.match(scriptXml, /custscript_camari_newsletter_dryrun/);
  assert.match(scriptXml, /<defaultchecked>T<\/defaultchecked>/);
  assert.match(restletSource, /@NScriptType Restlet/);
  assert.match(restletSource, /customrecord_camari_newsletter/);
  assert.match(restletSource, /custscript_camari_newsletter_dryrun/);
  assert.match(customRecordXml, /<ismandatory>T<\/ismandatory>/);
  assert.match(customRecordXml, /<fieldtype>CLOBTEXT<\/fieldtype>/);
  assert.doesNotMatch(customRecordXml, /<mandatory>/);
});

test("SuiteCloud newsletter RESTlet documents the website payload contract", async () => {
  const readme = await readProjectFile("suitecloud/README.md");

  assert.match(readme, /email/);
  assert.match(readme, /locale/);
  assert.match(readme, /source/);
  assert.match(readme, /submittedAt/);
  assert.match(readme, /suitecloud account:setup/);
  assert.match(readme, /suitecloud project:deploy/);
});
