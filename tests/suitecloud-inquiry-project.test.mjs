import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";

const projectRoot = path.resolve(import.meta.dirname, "..");

async function readProjectFile(relativePath) {
  return readFile(path.join(projectRoot, relativePath), "utf8");
}

test("SuiteCloud project includes a dry-run website inquiry RESTlet", async () => {
  const [deployXml, scriptXml, customRecordXml, restletSource] = await Promise.all([
    readProjectFile("suitecloud/src/deploy.xml"),
    readProjectFile("suitecloud/src/Objects/customscript_camari_inquiry_rl.xml"),
    readProjectFile("suitecloud/src/Objects/customrecord_camari_inquiry.xml"),
    readProjectFile("suitecloud/src/FileCabinet/SuiteScripts/Camari/Inquiry/inquiry-restlet.js"),
  ]);

  assert.match(deployXml, /customscript_camari_inquiry_rl\.xml/);
  assert.match(deployXml, /customrecord_camari_inquiry\.xml/);
  assert.match(scriptXml, /<scriptdeployment scriptid="customdeploy_camari_inquiry_rl">/);
  assert.match(scriptXml, /custscript_camari_inquiry_dryrun/);
  assert.match(scriptXml, /<defaultchecked>T<\/defaultchecked>/);
  assert.match(customRecordXml, /custrecord_camari_inquiry_countrycode/);
  assert.match(customRecordXml, /custrecord_camari_inquiry_country/);
  assert.match(customRecordXml, /custrecord_camari_inquiry_submission/);
  assert.match(restletSource, /findExistingInquiry/);
  assert.match(restletSource, /locale === "ja" \? "JP"/);
});
