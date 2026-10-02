import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { test } from "node:test";

const projectRoot = path.resolve(import.meta.dirname, "..");

test("Japanese contact page localizes its hero, company name, labels, and supporting copy", async () => {
  const pageSource = await readFile(path.join(projectRoot, "src/app/[locale]/contact/page.tsx"), "utf8");
  const heroSource = await readFile(path.join(projectRoot, "src/components/ContactNeonHero.tsx"), "utf8");

  assert.match(pageSource, /<ContactNeonHero locale=\{locale\} \/>/);
  assert.match(heroSource, /locale === "ja" \? "お問い合わせ" : "CONTACTS"/);
  assert.match(pageSource, /カマリ・インターナショナル・ジャパンへ直接ご相談ください。/);
  assert.match(pageSource, /label: "メール"/);
  assert.match(pageSource, /label: "電話"/);
  assert.match(pageSource, /label: "ファクス"/);
  assert.match(pageSource, /label: "ショールーム・オフィス"/);
  assert.match(pageSource, /label: "営業時間"/);
  assert.match(pageSource, /label: "ご来訪予約"/);
  assert.match(pageSource, /世界に広がるカマリ/);
  assert.match(pageSource, /CHINA: "中国"/);
  assert.match(pageSource, /AUSTRALIA: "オーストラリア"/);
  assert.match(pageSource, /ITALY: "イタリア"/);
  assert.match(pageSource, /\.filter\(\(location\) => location\.country !== "JAPAN"\)/);
  assert.match(pageSource, /住所：\{location\.address\}/);
  assert.doesNotMatch(pageSource, /v1 では問い合わせフォーム/);
});
