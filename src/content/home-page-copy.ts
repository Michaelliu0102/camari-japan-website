import { chineseCopy } from "../china/copy";
import { siteConfig } from "../lib/site-config";

export const homePageCopy = {
  seoTitle: {
    zh: "Alcantara、真皮与面料供应及产品定制｜CAMARI 卡玛瑞",
    en: "Alcantara, Leather & Fabric Supply · Custom Products | CAMARI",
    ja: "アルカンターラ・本革・生地の販売と製品製作｜CAMARI"
  },
  brandValueLabel: { zh: chineseCopy("Brand Value"), en: "Brand Value", ja: "ブランド価値" },
  brandValueTitle: { zh: chineseCopy("LOCAL SERVICE.\nGLOBAL REACH."), en: "LOCAL SERVICE.\nGLOBAL REACH.", ja: "欧州品質の素材感と、日本的な空間の抑制。" },
  brandValueBody: {
    zh: chineseCopy("Across China, Italy, Japan, and Australia, CAMARI connects local material expertise, certified manufacturing, and coordinated logistics in one responsive network, from concept to delivery."), en: "Across China, Italy, Japan, and Australia, CAMARI connects local material expertise, certified manufacturing, and coordinated logistics in one responsive network, from concept to delivery.",
    ja: `${siteConfig.organizationName} は、言葉より先に品質を伝えるサーフェスを求めるチームに向けて素材を選定します。車両キャビン、ホスピタリティ空間、プロダクトパネル、特注 OEM/ODM プログラムに対応します。`
  },
  brandValueLinkLabel: { zh: chineseCopy("About Us"), en: "About Us", ja: "会社情報" },
  ctaTitle: { zh: chineseCopy("Tailored Surfaces\nBespoke Creations"), en: "Tailored Surfaces\nBespoke Creations", ja: "先見性あるデザインのために、素材とカスタムプロダクトを最適化します。" },
  ctaBody: { zh: chineseCopy("Speak with our team about material specification,\nbespoke production, and project-fit solutions."), en: "Speak with our team about material specification,\nbespoke production, and project-fit solutions.", ja: "技術仕様やデザインコンセプトをお送りください。素材選定、カスタム試作、納品まで専門スタッフがサポートします。" },
  ctaLabel: { zh: chineseCopy("Our location"), en: "Our location", ja: "所在地" },
  ctaSecondaryLabel: { zh: chineseCopy("Inquiry Now"), en: "Inquiry Now", ja: "お問い合わせ" }
};
