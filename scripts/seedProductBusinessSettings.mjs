import { getCliClient } from "sanity/cli";

process.loadEnvFile(".env.local");

const client = getCliClient({
  apiVersion: "2026-09-03",
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false
});

await client.createIfNotExists({
  _id: "productBusinessSettings",
  _type: "productBusinessSettings"
});

await client
  .patch("productBusinessSettings")
  .set({
    eyebrow: { en: "B2B Manufacturing", ja: "法人向け製品開発" },
    title: { en: "From specification to production.", ja: "仕様確認から、試作・量産まで。" },
    body: {
      en: "CAMARI provides B2B product development and made-to-spec manufacturing services. Available materials and customization options vary by product and project requirements. MOQ, sampling time, production lead time, and applicable testing or certification requirements are confirmed after reviewing the product specification and order quantity.",
      ja: "CAMARIでは、法人向けの製品開発およびオーダーメイド生産に対応しています。対応可能な素材やカスタマイズ内容は、製品およびプロジェクト要件によって異なります。最小発注数量、試作期間、量産納期、試験・認証条件については、製品仕様と数量を確認したうえでご案内します。"
    },
    accordionLabel: { en: "Customization & Production", ja: "カスタマイズ・生産について" },
    accordionSummary: {
      en: "B2B development, sampling and made-to-spec production",
      ja: "法人向け開発・試作・オーダーメイド生産"
    }
  })
  .commit();

console.log("Seeded Product Business Information document: productBusinessSettings");
