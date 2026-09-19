import { normalizeLocalizedBrandNames } from "./locales";
import { chineseCopy } from "../china/copy";
import { homePageCopy } from "../content/home-page-copy";
import type { MaterialFaqItem } from "../content/material-faqs";
import type { NewsArticleContent } from "../content/news-articles";
import type { Locale } from "./locales";
import aboutJapaneseCopy from "../data/about-page-ja.json" with { type: "json" };
import generatedCatalog from "../data/product-catalog.generated.json" with { type: "json" };
import { siteConfig } from "./site-config";

export type LocalizedString = Record<Locale, string>;

export type Seo = {
  title: LocalizedString;
  description: LocalizedString;
  image?: string;
};

export type Download = {
  title: LocalizedString;
  description: LocalizedString;
  href: string;
  type: "catalog" | "technical" | "care";
  updatedAt?: string;
};

export type ProductTypeSpecificationField = {
  key: string;
  label: LocalizedString;
  aliases?: string[];
  defaultValue?: LocalizedString;
};

export type ProductTypeMaintenanceItem = {
  title: LocalizedString;
  description: LocalizedString;
};

export type MaterialCategory = {
  slug: string;
  updatedAt?: string;
  name: LocalizedString;
  tagline: LocalizedString;
  description: LocalizedString;
  coverImage: string;
  accent: string;
};

export type Application = {
  slug: string;
  name: LocalizedString;
  colorCount?: number;
  image: string;
  productTypeSlug?: string;
};

export type Material = {
  faq?: Partial<Record<Locale, MaterialFaqItem[]>>;
  slug: string;
  updatedAt?: string;
  categorySlug: string;
  name: LocalizedString;
  eyebrow: LocalizedString;
  heroTitle: LocalizedString;
  heroSubtitle: LocalizedString;
  heroImage: string;
  introTitle: LocalizedString;
  introBody: LocalizedString;
  introImage: string;
  quote: LocalizedString;
  applications: Application[];
  seo: Seo;
};

export type ProductType = {
  slug: string;
  updatedAt?: string;
  materialSlug: string;
  name: LocalizedString;
  summary: LocalizedString;
  productCode?: string;
  downloads: Download[];
  specTemplate: ProductTypeSpecificationField[];
  certifications: LocalizedString[];
  maintenance: ProductTypeMaintenanceItem[];
  seo: Seo;
};

export type Sku = {
  slug: string;
  updatedAt?: string;
  materialSlug: string;
  productTypeSlug: string;
  code: string;
  colorName?: LocalizedString;
  hex?: string;
  image: string;
  swatchImage?: string;
  previewImage?: string;
  caseGallery?: Array<{ image: string; alt: LocalizedString }>;
  summary: LocalizedString;
  specs: Array<{ label: LocalizedString; value: LocalizedString }>;
  certifications: LocalizedString[];
  downloads?: Download[];
  seo: Seo;
};

export type ProjectCase = {
  slug: string;
  updatedAt?: string;
  title: LocalizedString;
  industry: LocalizedString;
  image: string;
  projectImages: string[];
  summary: LocalizedString;
  materialSlug: string;
  linkedMaterials: Array<{ slug: string; name: LocalizedString }>;
  linkedArticles: Array<{ slug: string; materialSlug: string; name: LocalizedString }>;
  seo: Seo;
};

export type NewsItem = {
  articleContent?: Partial<Record<Locale, NewsArticleContent>>;
  slug: string;
  updatedAt?: string;
  availableLocales?: Locale[];
  title: LocalizedString;
  category: LocalizedString;
  date: string;
  image: string;
  summary: LocalizedString;
  seo: Seo;
};

export type HomeHero = {
  title: LocalizedString;
  subtitle: LocalizedString;
  videoSrc: string;
  poster: string;
  ctaLabel: LocalizedString;
  ctaHref: string;
};

export type HomeExploreSlide = {
  slug: string;
  title: LocalizedString;
  category: LocalizedString;
  description: LocalizedString;
  image: string;
  href: string;
};

export type HomeExploreSettings = {
  categorySlugs: string[];
  productSlides: HomeExploreSlide[];
};

export type HomePageSettings = typeof homePageCopy & {
  hero: HomeHero;
  explore: HomeExploreSettings;
  brandValueImage: string;
  showroomBackgroundImage: string;
};

export type AboutPageSettings = {
  seo: Seo;
  heroImage: string;
  heroAlt: LocalizedString;
  heroTitle: LocalizedString;
  exploreLabel: LocalizedString;
  bodyLabel: LocalizedString;
  bodyTitle: LocalizedString;
  bodySubtitle: LocalizedString;
  bodyParagraphs: LocalizedString[];
  missionLabel: LocalizedString;
  missionTitle: LocalizedString;
  missionParagraphs: LocalizedString[];
  businessLabel: LocalizedString;
  businessItems: Array<{ title: LocalizedString; body: LocalizedString }>;
  manufacturingLabel: LocalizedString;
  manufacturingTitle: LocalizedString;
  manufacturingParagraphs: LocalizedString[];
};

export type ProductBusinessSettings = {
  eyebrow: LocalizedString;
  title: LocalizedString;
  body: LocalizedString;
  accordionLabel: LocalizedString;
  accordionSummary: LocalizedString;
};

function mergeBySlug<T extends { slug: string }>(defaults: T[], imported: T[]): T[] {
  const merged = new Map(defaults.map((item) => [item.slug, item]));
  for (const item of imported) {
    merged.set(item.slug, item);
  }
  return [...merged.values()];
}

function mergeSkusByProductType(defaults: Sku[], imported: Sku[]): Sku[] {
  // Merge by slug: defaults provide hex/swatchImage, imported provide the catalog
  const merged = new Map<string, Sku>();
  for (const sku of defaults) {
    merged.set(sku.slug, sku);
  }
  for (const sku of imported) {
    const existing = merged.get(sku.slug);
    if (existing) {
      merged.set(sku.slug, { ...sku, hex: sku.hex || existing.hex, swatchImage: sku.swatchImage ?? existing.swatchImage });
    } else {
      merged.set(sku.slug, sku);
    }
  }
  return [...merged.values()];
}

export const site = {
  name: siteConfig.siteName,
  url: siteConfig.siteUrl,
  organizationName: siteConfig.organizationName,
  alternateSiteHomeUrl: siteConfig.alternateSiteHomeUrl,
  defaultLocale: siteConfig.defaultLocale,
  slogan: siteConfig.slogan,
  description: siteConfig.description,
  contact: siteConfig.contact
};

const images = {
  heroPoster:
    "https://lh3.googleusercontent.com/aida/ADBb0ui_kqHBrhUx5Qj2LNY3638K84BG6zEgILGYni_xEyPjGfO8DJnYi_tAvTeGVkxgPELfrWCrYFx_6VKneghzwqBx8I5LuqeV3HwaV3P4tLQnitKOlxuklct-0LcrdwTufifaTdgxlZ1Ti1JfS79kvjZ1Kho54RT9CtLy7RF77baXz-x2EKQmnGu0q7X3Pdq-024n_XLIzABOi4p3ZxzEJdZjZU6CodR7SdLiuo1dUbAJtOVuSwOyHlpBfS1_XM5F5cM53mPqEC9n",
  materialHero:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCM0uRLWCIEBqOsn3QxjsiTFZJr4Shq4OYrUcfH30PF5PjwnD7j6CVwE36gtDd-EFTwfGVsc7lZ7OgwjQS3i_yo8YHYBgwQ7-AV-QDYr4KvfrIPOLgEEVWFGMxIEVydxRU5fq1IuuGFMFmTGA3pfi-lQxcHmPbhzIoYZQZzqJVNPKguTDv3ubQqeMSJlUIdw00rkmVrdQOfJhTuzPHL1XEuoUxXaXr6NwCvmS0r0WhTWoPAJcQt-evKTyNZX9VaB1m9ikRiH44hKnA",
  alcantara:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDQ1xIH0pXuhyfw0yFqm5A9Z0aUDAqOHTk6_LjXdFcPZx0yVaHE_m0Yr4UXe_YHuy0tfoNY6A4x2nDuUuFu-yybyqeGk5CjZ3uQ_0tHW8kfU9xDgHBmdJg5YuZ3pS9Gv5dORZBsvdhSV9jT4xyAti8VSavkBq_iEgLexKv493y6qvNh9vhoPh91TQ2aY1e70CmzkZ2nnURmIU6yW84RWXVEQutle0uckOwig1EnkYPJLoythTMYn8j7q2tqmjj-_e5ovz_l7fEJS8o",
  alcantaraSoft:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBcADCldAXiMow9ixQSR_KLnroUJpFHrUS7jplymYAWopddWj5UXhghMUGD9I_PYTaYtMwJ6WdsXhTsvdMj_9wpj-wBr1beG1GB_A_qXkCZewARIIQTsvrvGZ34-Slo9PzIIWWKdvBedFchVP3-mR27zFN1CzaMY8pMyLkLFOk_l-V6AOL8Ct-XZ_oCF5lAl5OIDu3YYQWdhIH0zOA5ARMI2j3o0UkXSg76dQTj_Bwrrb44NT39TatN45tbCTdWCrImvMzzrJgd-UM",
  interior:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC7ZrAd47bJyNDiZsYFqvWZwSesH95st08txaMeziENnQ9oVj60KmSmH8L1RUPKONbB6SH5NOdP1ZVQ0mnJEtDKP1q9klE2_yW3BixnJftaYgJbp_0nomc8mgh17p_ONOlq-xjAFyyf1bSmz5MOq7CyoPatzBO9uaCgJCRpYYco-u6GF9cp9zGho6oF1-8FYAobZa7OKcKdcvEN3gsrs7v8iBBsTie5ZmZi6bnlyV767sszweKxgX4bFgxtm2e66al3C74Bh8SLlm8",
  fabric:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAqGy_9qwy8vDVzct7Xzi8Ej7fWyc_ZNJ4CkPqa3iwQ_8kMGkJ156KxWmRPzlZqtXewDGmysth6t5-tg1pvAfM1aMDZlMyWsvASnCEcSLx6vjtJcNn4sbv6oqJLT6K1CxyCyG12tg1ToPdP-wsaMA-xhwLZqtfKUODvAcyor4acTnE1JPvwZ9ViqSmE4MOY21Sr1-Ug5AfDO-BzYAyEmQz_ovAq9elPU7vF82kPi9TcaXfRIF8Ion2vlZGvk6UfWRPPrS6CVkOAGW4",
  vegan:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAnc7qr4LfkNusa6-3AYYMm4P7Vd3v1cvziPm5EcJ93nyaOUSe93zquyQGmB5gyrp2U9Wrt0bX2YBeQnb2W19Fta49E_IBvdF4qn90-enQRurONkI4Xg-LNZvwft789RLcZVXxwrXJE4qp5JoPctPytXNv3XEZtBgPoGefSyib7iD-vadAbTfnMa6o_DsLzZ8UM-mXRKPBiQla8EIhctC83Z_oG3-Xk5FwJCAtFtucc4nufgPu4WmIrBxzY6-u30J7D2X-6SA94pT0",
  outdoor:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC1_m0k_z4v_--owRaTXIMZ132FJNMCqJ_D7IA2ICmNfH6e-bwbBxJjOYxb5BBugzjTcEIumHX4dY5KAdgdcGFtPdAYKObeHQN5rPpkmDmaHs05UvQbXjWqgSh_w2q85m9QP277PJjwPrA8vVhu400hqqS3y0QWdOUxu4iK_mMZ2t_OaHfOVvCNL-y1Ko3ASO7VOoDGh86wE9xEyl9ZS3_HIoGnAFxbTpVd5h65HDePp-GceZ8Mc9JmW3q-E-v4j-D472alRGpUUskyGxl9S4",
  sku:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBkwrCmJel_tnN4FVxJfvhrYmrLtSVQxP1QAWAZFQ5klWej8HSzJcqjZnitNZ4JQAmddyfPvBmGx6bB5yq0_o5jPbmw4vUgltZchTBVjF81Ru258t0lQVqOChelwa3qdW8fvMiipFpa9q_DABEXoavvCG7TsXFDb0ZrZ9riwHK3BuZJSSaXsNXk7_uHXrFNp8gF0Ult5vm7DQ-ZeusOlFAGnzBeYei3K078qr27IWNV71ps6VAkEebGXfjw-CtW_wmPCwcGfxlWDJU"
};

const muxPlaybackId = "kvPIcT021KDW3ETit9N1AFzRyVapSU701RRE01e39IOVo4";

export const heroVideo = {
  poster: `https://image.mux.com/${muxPlaybackId}/thumbnail.jpg?width=1920&height=1080&time=2.285617`,
  src: `https://stream.mux.com/${muxPlaybackId}.m3u8`
};

export const homePageSettings: HomePageSettings = {
  ...homePageCopy,
  brandValueImage: images.alcantaraSoft,
  showroomBackgroundImage: images.interior,
  hero: {
    title: { zh: "臻选材质", en: "Premium Materials", ja: "選び抜かれた素材" },
    subtitle: { zh: "万千可能，由此而生", en: "A World of Choice", ja: "ここから広がる、無限の可能性" },
    videoSrc: heroVideo.src,
    poster: heroVideo.poster,
    ctaLabel: { zh: chineseCopy("Discover the Collection"), en: "Discover the Collection", ja: "コレクションを見る" },
    ctaHref: "/materials"
  },
  explore: {
    categorySlugs: ["alcantara", "fabric", "vegan-leather"],
    productSlides: [
      {
        slug: "oem-odm",
        title: { zh: chineseCopy("Bespoke Surfaces"), en: "Bespoke Surfaces", ja: "特注サーフェス" },
        category: { zh: chineseCopy("Product — OEM"), en: "Product — OEM", ja: "Product — OEM" },
        description: {
          zh: chineseCopy("Material programs for automotive, product, hospitality, and architectural teams."), en: "Material programs for automotive, product, hospitality, and architectural teams.",
          ja: "車両、プロダクト、ホスピタリティ、建築チームに向けた素材プログラム。"
        },
        image: images.alcantaraSoft,
        href: "/oem-odm"
      },
      {
        slug: "projects",
        title: { zh: chineseCopy("PRODUCT"), en: "PRODUCT", ja: "PRODUCT" },
        category: { zh: chineseCopy("Product"), en: "Product", ja: "Product" },
        description: {
          zh: chineseCopy("CUSTOMIZED PRODUCTS MADE OF ALCANTARA, LEATHER AND FABRIC"), en: "CUSTOMIZED PRODUCTS MADE OF ALCANTARA, LEATHER AND FABRIC",
          ja: "製品の用途や使い心地に合わせた最適なデザイン・加工をご提案します。"
        },
        image: "/uploads/product/product.jpg",
        href: "/products"
      }
    ]
  }
};

export const productBusinessSettings: ProductBusinessSettings = {
  eyebrow: { zh: chineseCopy("B2B Manufacturing"), en: "B2B Manufacturing", ja: "法人向け製品開発" },
  title: { zh: chineseCopy("From specification to production."), en: "From specification to production.", ja: "仕様確認から、試作・量産まで。" },
  body: {
    zh: chineseCopy("CAMARI provides B2B product development and made-to-spec manufacturing services. Available materials and customization options vary by product and project requirements. MOQ, sampling time, production lead time, and applicable testing or certification requirements are confirmed after reviewing the product specification and order quantity."), en: "CAMARI provides B2B product development and made-to-spec manufacturing services. Available materials and customization options vary by product and project requirements. MOQ, sampling time, production lead time, and applicable testing or certification requirements are confirmed after reviewing the product specification and order quantity.",
    ja: "CAMARIでは、法人向けの製品開発およびオーダーメイド生産に対応しています。対応可能な素材やカスタマイズ内容は、製品およびプロジェクト要件によって異なります。最小発注数量、試作期間、量産納期、試験・認証条件については、製品仕様と数量を確認したうえでご案内します。"
  },
  accordionLabel: { zh: chineseCopy("Customization & Production"), en: "Customization & Production", ja: "カスタマイズ・生産について" },
  accordionSummary: {
    zh: chineseCopy("B2B development, sampling and made-to-spec production"), en: "B2B development, sampling and made-to-spec production",
    ja: "法人向け開発・試作・オーダーメイド生産"
  }
};

export const aboutPageSettings: AboutPageSettings = {
  seo: {
    title: { zh: chineseCopy(`About | ${site.name}`), en: `About | ${site.name}`, ja: `会社情報 | ${site.name}` },
    description: {
      zh: chineseCopy(`Learn about ${site.organizationName}'s material philosophy, company values, and contact information.`), en: `Learn about ${site.organizationName}'s material philosophy, company values, and contact information.`,
      ja: `${site.organizationName} の素材哲学、企業価値、連絡先について。`
    },
    image: "/uploads/hero/showroom.png"
  },
  heroImage: "/uploads/hero/showroom.png",
  heroAlt: { zh: chineseCopy("CAMARI showroom interior"), en: "CAMARI showroom interior", ja: "CAMARI ショールーム内観" },
  heroTitle: { zh: chineseCopy("CAMARI"), en: "CAMARI", ja: "CAMARI" },
  exploreLabel: { zh: chineseCopy("Explore"), en: "Explore", ja: "Explore" },
  bodyLabel: { zh: chineseCopy("Company"), en: "Company", ja: aboutJapaneseCopy.intro.label },
  bodyTitle: { zh: chineseCopy("ABOUT CAMARI"), en: "ABOUT CAMARI", ja: aboutJapaneseCopy.intro.title },
  bodySubtitle: { zh: chineseCopy(""), en: "", ja: aboutJapaneseCopy.intro.subtitle },
  bodyParagraphs: aboutJapaneseCopy.intro.paragraphs.map((ja, index) => ({
    zh: chineseCopy(index === 0 ? `${site.organizationName} curates premium surface materials for teams who treat texture as an essential part of brand, space, and product quality.` : ""), en: index === 0 ? `${site.organizationName} curates premium surface materials for teams who treat texture as an essential part of brand, space, and product quality.` : "",
    ja
  })),
  missionLabel: { zh: chineseCopy(""), en: "", ja: aboutJapaneseCopy.mission.label },
  missionTitle: { zh: chineseCopy(""), en: "", ja: aboutJapaneseCopy.mission.title },
  missionParagraphs: aboutJapaneseCopy.mission.paragraphs.map((ja) => ({ zh: chineseCopy(""), en: "", ja })),
  businessLabel: { zh: chineseCopy(""), en: "", ja: aboutJapaneseCopy.business.label },
  businessItems: aboutJapaneseCopy.business.items.map((item) => ({
    title: { zh: chineseCopy(""), en: "", ja: item.title },
    body: { zh: chineseCopy(""), en: "", ja: item.body }
  })),
  manufacturingLabel: { zh: chineseCopy("Manufacturing"), en: "Manufacturing", ja: aboutJapaneseCopy.factory.label },
  manufacturingTitle: { zh: chineseCopy("OUR FACTORY"), en: "OUR FACTORY", ja: aboutJapaneseCopy.factory.label },
  manufacturingParagraphs: aboutJapaneseCopy.factory.paragraphs.map((ja, index) => ({
    zh: chineseCopy(index === 0 ? "SHENGHUA is factory from 2000." : ""), en: index === 0 ? "SHENGHUA is factory from 2000." : "",
    ja
  }))
};

export const materialCategories: MaterialCategory[] = [
  {
    slug: "alcantara",
    name: { zh: chineseCopy("Alcantara"), en: "Alcantara", ja: "アルカンターラ" },
    tagline: { zh: chineseCopy("Italian precision / carbon neutral"), en: "Italian precision / carbon neutral", ja: "イタリアの美意識と精密な技術が生み出す素材。" },
    description: {
      zh: chineseCopy("A sensory microfiber surface for automotive, interiors, aviation, and product spaces."), en: "A sensory microfiber surface for automotive, interiors, aviation, and product spaces.",
      ja: "スエードのような質感と優れた機能性を兼ね備えた、イタリア製プレミアム素材。"
    },
    coverImage: images.alcantaraSoft,
    accent: "#1A1A1A"
  },
  {
    slug: "fabric",
    name: { zh: chineseCopy("Fabric"), en: "Fabric", ja: "ファブリック" },
    tagline: { zh: chineseCopy("Washi, weave, and quiet tactility"), en: "Washi, weave, and quiet tactility", ja: "クラシックカーの魅力を受け継ぐ、高耐久な欧州製ファブリック。" },
    description: {
      zh: chineseCopy("Architectural textiles selected for spatial restraint and practical durability."), en: "Architectural textiles selected for spatial restraint and practical durability.",
      ja: "伝統技術が生み出す、クラシックカー向けの上質な内装素材。"
    },
    coverImage: images.fabric,
    accent: "#A68A5E"
  },
  {
    slug: "vegan-leather",
    name: { zh: chineseCopy("Vegan Leather"), en: "Vegan Leather", ja: "合成皮革" },
    tagline: { zh: chineseCopy("Sustainable luxury alternatives"), en: "Sustainable luxury alternatives", ja: "本革の質感と環境への配慮を両立した高機能マイクロファイバーレザー。" },
    description: {
      zh: chineseCopy("Matte, refined surfaces for contemporary spaces and brand-led product programs."), en: "Matte, refined surfaces for contemporary spaces and brand-led product programs.",
      ja: "環境に配慮した次世代マイクロファイバーレザー。"
    },
    coverImage: images.vegan,
    accent: "#735B33"
  },
];

export const materials: Material[] = [
  {
    slug: "alcantara",
    categorySlug: "alcantara",
    name: { zh: chineseCopy("Alcantara"), en: "Alcantara", ja: "アルカンターラ" },
    eyebrow: { zh: chineseCopy("Premium Collection"), en: "Premium Collection", ja: "プレミアムコレクション" },
    heroTitle: { zh: chineseCopy("Alcantara"), en: "Alcantara", ja: "Alcantara" },
    heroSubtitle: { zh: chineseCopy("The sensory revolution"), en: "The sensory revolution", ja: "触感の革新" },
    heroImage: images.alcantara,
    introTitle: { zh: chineseCopy("The Art of Italian Innovation"), en: "The Art of Italian Innovation", ja: "イタリアの技術と美意識の融合" },
    introBody: {
      zh: chineseCopy("Alcantara represents a singular vision: one company, one brand, and one remarkable material. Founded in 1972, this symbol of Italian excellence is built on a unique, proprietary technology that blends advanced science with premium craftsmanship.\n\nAlcantara brings together advanced technology and great craftsmanship. It is uniquely soft, comfortable, and distinct to the touch, yet it is also durable, lightweight, breathable, temperature-regulating, and completely washable. These excellent qualities allow it to easily wrap around complex shapes and surfaces while keeping a clean, premium look.\n\nChosen by leading brands in automotive, interiors, marine, aviation, fashion, and consumer electronics, Alcantara turns high performance into a true design language. It supports custom solutions for demanding creative and technical projects through a wide range of options, including personalized colors, textures, printing, perforation, laser processing, embossing, embroidery, and lamination.\n\nSustainability is a core part of its industrial culture. Alcantara has maintained its Carbon Neutral certification since 2009."), en: "Alcantara represents a singular vision: one company, one brand, and one remarkable material. Founded in 1972, this symbol of Italian excellence is built on a unique, proprietary technology that blends advanced science with premium craftsmanship.\n\nAlcantara brings together advanced technology and great craftsmanship. It is uniquely soft, comfortable, and distinct to the touch, yet it is also durable, lightweight, breathable, temperature-regulating, and completely washable. These excellent qualities allow it to easily wrap around complex shapes and surfaces while keeping a clean, premium look.\n\nChosen by leading brands in automotive, interiors, marine, aviation, fashion, and consumer electronics, Alcantara turns high performance into a true design language. It supports custom solutions for demanding creative and technical projects through a wide range of options, including personalized colors, textures, printing, perforation, laser processing, embossing, embroidery, and lamination.\n\nSustainability is a core part of its industrial culture. Alcantara has maintained its Carbon Neutral certification since 2009.",
      ja: "アルカンターラは、1972年にイタリアで誕生した独自素材です。上質な手触りと軽さ、耐久性、通気性などを兼ね備え、自動車やインテリア、ファッションなど幅広い分野で世界のトップブランドに採用されています。豊富なカラーや加工に対応し、多様なデザインを実現できることも特長です。また、カーボンニュートラル認証の継続やリサイクル素材の活用など、環境に配慮したものづくりにも取り組んでいます。"
    },
    introImage: images.interior,
    quote: {
      zh: chineseCopy("Alcantara turns technical performance into a sensory language for contemporary design."), en: "Alcantara turns technical performance into a sensory language for contemporary design.",
      ja: ""
    },
    applications: [
      { slug: "automotive", name: { zh: chineseCopy("Automotive"), en: "Automotive", ja: "自動車" }, colorCount: 71, image: images.alcantara },
      { slug: "interior", name: { zh: chineseCopy("Interior"), en: "Interior", ja: "インテリア" }, colorCount: 76, image: images.interior, productTypeSlug: "alcantara-master" },
      { slug: "outdoor", name: { zh: chineseCopy("Outdoor"), en: "Outdoor", ja: "アウトドア" }, colorCount: 14, image: images.outdoor, productTypeSlug: "alcantara-exo" },
      { slug: "electronics", name: { zh: chineseCopy("Consumer Electronics"), en: "Consumer Electronics", ja: "コンシューマー機器" }, colorCount: 20, image: images.vegan, productTypeSlug: "alcantara-04" }
    ],
    seo: {
      title: { zh: chineseCopy("Alcantara Materials | CAMARI JAPAN"), en: "Alcantara Materials | CAMARI JAPAN", ja: "Alcantara 素材 | CAMARI JAPAN" },
      description: {
        zh: chineseCopy("Explore Alcantara applications, performance, colors, and technical downloads for premium interiors and mobility."), en: "Explore Alcantara applications, performance, colors, and technical downloads for premium interiors and mobility.",
        ja: "プレミアムインテリアとモビリティ向け Alcantara の用途、性能、カラー、技術資料を紹介します。"
      },
      image: images.alcantara
    }
  },
  {
    slug: "vegan-leather",
    categorySlug: "vegan-leather",
    name: { zh: chineseCopy("Vegan Leather"), en: "Vegan Leather", ja: "合成皮革" },
    eyebrow: { zh: chineseCopy("Sustainable Collection"), en: "Sustainable Collection", ja: "サステナブルコレクション" },
    heroTitle: { zh: chineseCopy("Vegan Leather"), en: "Vegan Leather", ja: "合成皮革" },
    heroSubtitle: { zh: chineseCopy("Performance without compromise"), en: "Performance without compromise", ja: "妥協なき性能" },
    heroImage: "/uploads/veganleather/interior.jpg",
    introTitle: { zh: chineseCopy("High-Performance Alternatives"), en: "High-Performance Alternatives", ja: "ハイパフォーマンスな選択肢" },
    introBody: {
      zh: chineseCopy("Engineered surface materials that match or exceed the tactile and durability standards of traditional leather, without animal content. Matte finishes, micro-textures, and colorfast pigments define a collection built for contemporary product and interior programs."), en: "Engineered surface materials that match or exceed the tactile and durability standards of traditional leather, without animal content. Matte finishes, micro-textures, and colorfast pigments define a collection built for contemporary product and interior programs.",
      ja: "伝統的なレザーの触感と耐久性基準を満たし、それを超えるように設計された素材。マット仕上げ、マイクロテクスチャ、退色しにくい顔料が、現代的なプロダクトとインテリアのためのコレクションを形作ります。"
    },
    introImage: "/uploads/veganleather/vegan.jpeg",
    quote: {
      zh: chineseCopy("Aquapelle combines three-dimensional microfiber construction with waterborne and solvent-free PU technologies, delivering refined touch, durable performance, and consistent color, thickness, and batch quality."), en: "Aquapelle combines three-dimensional microfiber construction with waterborne and solvent-free PU technologies, delivering refined touch, durable performance, and consistent color, thickness, and batch quality.",
      ja: "Aquapelleは、三次元マイクロファイバー構造と水性・無溶剤PU技術を融合し、上質な触感、優れた耐久性、安定した色・厚み・ロット品質を実現します。"
    },
    applications: [
      {
        slug: "microfiber-leather",
        name: { zh: chineseCopy("AQUAPELLE Microfiber Leather"), en: "AQUAPELLE Microfiber Leather", ja: "マイクロファイバーレザー" },
        image: "/uploads/veganleather/color.png"
      }
    ],
    seo: {
      title: { zh: chineseCopy("Vegan Leather Materials | CAMARI JAPAN"), en: "Vegan Leather Materials | CAMARI JAPAN", ja: "合成皮革素材 | カマリ・インターナショナル" },
      description: {
        zh: chineseCopy("Sustainable vegan leather alternatives with matte finishes and micro-textures for interior and product spaces."), en: "Sustainable vegan leather alternatives with matte finishes and micro-textures for interior and product spaces.",
        ja: "マット仕上げとマイクロテクスチャを備えた、インテリアとプロダクト空間のためのサステナブルなヴィーガンレザー素材。"
      },
      image: images.vegan
    }
  },
  {
    slug: "fabric",
    categorySlug: "fabric",
    name: { zh: chineseCopy("Fabric"), en: "Fabric", ja: "ファブリック" },
    // Keep the offline fallback aligned with the published Fabric page.
    eyebrow: { zh: "织物", en: "European Fabric", ja: "欧州製生地" },
    heroTitle: { zh: chineseCopy("Fabric"), en: "Fabric", ja: "Fabric" },
    heroSubtitle: { zh: "", en: "", ja: "" },
    heroImage: "https://cdn.sanity.io/images/bfjhbpbx/production/05a659d8759809aa13ca017441100d5c86fa1edb-1280x960.jpg",
    introTitle: { zh: "传承汽车经典的织物", en: "The Fabric of Automotive Heritage", ja: "名車にふさわしい品質" },
    introBody: {
      zh: "通过精选经典汽车织物，重温欧洲汽车的黄金年代。从标志性的千鸟格与苏格兰格纹，到高级羊毛与结构感面料，我们为注重细节的收藏者提供适合的内饰选材，帮助经典老车恢复其原有、历久弥新的风采。", en: "Step back into the golden age of European motoring with our premium classic automotive fabrics. From iconic houndstooth and tartans to luxury wools and structured cloths, we provide the perfect finish for the discerning collector looking to restore their vintage classic cars to its true, timeless glory.",
      ja: "欧州クラシックカーの純正仕様を忠実に再現したファブリックです。千鳥格子やタータンチェック、ウールなど、多彩な生地を取り揃え、当時のインテリアを美しく再現します。現代の基準に対応した耐久性を備え、クラシックカーの価値を大切にしたレストアを支えます。"
    },
    introImage: "https://cdn.sanity.io/images/bfjhbpbx/production/3c393dbd31b3b5ec661de582b9186e38d0fea74c-1440x960.jpg",
    quote: {
      zh: chineseCopy("Fabric does not decorate space. It completes it."), en: "Fabric does not decorate space. It completes it.",
      ja: ""
    },
    applications: [
      { slug: "interior", name: { zh: chineseCopy("Interior"), en: "Interior", ja: "インテリア" }, colorCount: 62, image: images.fabric },
      { slug: "hospitality", name: { zh: chineseCopy("Hospitality"), en: "Hospitality", ja: "ホスピタリティ" }, colorCount: 38, image: images.interior },
      { slug: "retail", name: { zh: chineseCopy("Retail"), en: "Retail", ja: "リテール" }, colorCount: 25, image: images.outdoor },
      { slug: "workspace", name: { zh: chineseCopy("Workspace"), en: "Workspace", ja: "ワークスペース" }, colorCount: 30, image: images.alcantaraSoft }
    ],
    seo: {
      title: { zh: chineseCopy("Fabric Materials | CAMARI JAPAN"), en: "Fabric Materials | CAMARI JAPAN", ja: "ファブリック素材 | CAMARI JAPAN" },
      description: {
        zh: chineseCopy("Architectural textiles and technical fabrics for interior, hospitality, and workspace environments."), en: "Architectural textiles and technical fabrics for interior, hospitality, and workspace environments.",
        ja: "インテリア、ホスピタリティ、ワークスペース環境のための建築的テキスタイルとテクニカルファブリック。"
      },
      image: images.fabric
    }
  }
];

const fixtureProductTypes: ProductType[] = [
  {
    slug: "alcantara-panel",
    materialSlug: "alcantara",
    name: { zh: chineseCopy("Alcantara Panel"), en: "Alcantara Panel", ja: "Alcantara パネル" },
    summary: {
      zh: chineseCopy("Alcantara panel for automotive door panels, dashboards, and headliners. Italian microfibre with soft-touch finish, UV-stable, and carbon neutral."), en: "Alcantara panel for automotive door panels, dashboards, and headliners. Italian microfibre with soft-touch finish, UV-stable, and carbon neutral.",
      ja: "自動車のドアパネル、ダッシュボード、ヘッドライナー向け Alcantara パネル。ソフトタッチ仕上げのイタリア製マイクロファイバー。"
    },
    downloads: [],
    specTemplate: [
      { key: "thickness", label: { zh: chineseCopy("THICKNESS"), en: "THICKNESS", ja: "厚み" }, aliases: ["thickness"] },
      { key: "unit-weight", label: { zh: chineseCopy("UNIT WEIGHT"), en: "UNIT WEIGHT", ja: "単位重量" }, aliases: ["unit weight", "weight"] },
      { key: "width", label: { zh: chineseCopy("WIDTH"), en: "WIDTH", ja: "幅" }, aliases: ["width"] },
      { key: "breaking-load", label: { zh: chineseCopy("BREAKING LOAD"), en: "BREAKING LOAD", ja: "破断荷重" }, aliases: ["breaking load"] },
      { key: "wear-resistance", label: { zh: chineseCopy("WEAR RESISTANCE"), en: "WEAR RESISTANCE", ja: "耐摩耗性" }, aliases: ["wear resistance", "martindale"] },
      { key: "to-light", label: { zh: chineseCopy("TO LIGHT"), en: "TO LIGHT", ja: "耐光性" }, aliases: ["to light", "lightfastness"] },
      { key: "to-rubbery", label: { zh: chineseCopy("TO RUBBERY"), en: "TO RUBBERY", ja: "摩擦堅牢度" }, aliases: ["to rubbings", "to rubbery", "rub fastness"] },
      { key: "fr-version", label: { zh: chineseCopy("FR VERSION"), en: "FR VERSION", ja: "FR 仕様" }, aliases: ["fr version", "fr"] }
    ],
    certifications: [
      { zh: chineseCopy("Carbon neutral production program"), en: "Carbon neutral production program", ja: "カーボンニュートラル生産プログラム" },
      { zh: chineseCopy("Interior and mobility grade surface performance"), en: "Interior and mobility grade surface performance", ja: "インテリア・モビリティ向け表面性能" }
    ],
    maintenance: [
      {
        title: { zh: chineseCopy("Care and Maintenance Guide"), en: "Care and Maintenance Guide", ja: "ケア・メンテナンスガイド" },
        description: { zh: chineseCopy("Use and maintenance guidance for installed surfaces."), en: "Use and maintenance guidance for installed surfaces.", ja: "施工後の使用とメンテナンスのガイド。" }
      }
    ],
    seo: {
      title: { zh: chineseCopy("Alcantara Panel | CAMARI JAPAN"), en: "Alcantara Panel | CAMARI JAPAN", ja: "Alcantara パネル | CAMARI JAPAN" },
      description: { zh: chineseCopy("Technical data, certifications, and maintenance guidance for Alcantara panels."), en: "Technical data, certifications, and maintenance guidance for Alcantara panels.", ja: "Alcantara パネルの技術仕様、認証、メンテナンス情報。" },
      image: images.alcantara
    }
  },
  {
    slug: "automotive-nappa",
    materialSlug: "leather",
    name: { zh: chineseCopy("Automotive Nappa"), en: "Automotive Nappa", ja: "オートモーティブナッパ" },
    summary: {
      zh: chineseCopy("Premium Nappa leather for automotive interiors. Supple hand, natural grain, and exceptional durability for seating and trim."), en: "Premium Nappa leather for automotive interiors. Supple hand, natural grain, and exceptional durability for seating and trim.",
      ja: "自動車内装向けプレミアムナッパレザー。しなやかな手触り、自然な木目、優れた耐久性。"
    },
    downloads: [],
    specTemplate: [
      { key: "unit", label: { zh: chineseCopy("UNIT"), en: "UNIT", ja: "単位" }, aliases: ["unit"] },
      { key: "code", label: { zh: chineseCopy("CODE"), en: "CODE", ja: "コード" }, aliases: ["code"] },
      { key: "grain", label: { zh: chineseCopy("GRAIN"), en: "GRAIN", ja: "木目" }, aliases: ["grain"] },
      { key: "thickness", label: { zh: chineseCopy("THICKNESS"), en: "THICKNESS", ja: "厚み" }, aliases: ["thickness"] }
    ],
    certifications: [],
    maintenance: [],
    seo: {
      title: { zh: chineseCopy("Automotive Nappa | CAMARI JAPAN"), en: "Automotive Nappa | CAMARI JAPAN", ja: "オートモーティブナッパ | CAMARI JAPAN" },
      description: { zh: chineseCopy("Premium Nappa leather for automotive interiors."), en: "Premium Nappa leather for automotive interiors.", ja: "自動車内装向けプレミアムナッパレザー。" },
      image: images.interior
    }
  },
  {
    slug: "verona",
    materialSlug: "leather",
    name: { zh: chineseCopy("Verona"), en: "Verona", ja: "ヴェローナ" },
    summary: {
      zh: chineseCopy("Verona leather with a refined matte finish and soft touch. Ideal for luxury interiors and bespoke upholstery."), en: "Verona leather with a refined matte finish and soft touch. Ideal for luxury interiors and bespoke upholstery.",
      ja: "洗練されたマット仕上げとソフトなタッチのヴェローナレザー。ラグジュアリーインテリアと特注張り地に最適。"
    },
    downloads: [],
    specTemplate: [
      { key: "unit", label: { zh: chineseCopy("UNIT"), en: "UNIT", ja: "単位" }, aliases: ["unit"] },
      { key: "code", label: { zh: chineseCopy("CODE"), en: "CODE", ja: "コード" }, aliases: ["code"] },
      { key: "grain", label: { zh: chineseCopy("GRAIN"), en: "GRAIN", ja: "木目" }, aliases: ["grain"] },
      { key: "thickness", label: { zh: chineseCopy("THICKNESS"), en: "THICKNESS", ja: "厚み" }, aliases: ["thickness"] }
    ],
    certifications: [],
    maintenance: [],
    seo: {
      title: { zh: chineseCopy("Verona Leather | CAMARI JAPAN"), en: "Verona Leather | CAMARI JAPAN", ja: "ヴェローナレザー | CAMARI JAPAN" },
      description: { zh: chineseCopy("Verona leather with refined matte finish and soft touch."), en: "Verona leather with refined matte finish and soft touch.", ja: "洗練されたマット仕上げのヴェローナレザー。" },
      image: images.alcantaraSoft
    }
  },
  {
    slug: "roma",
    materialSlug: "leather",
    name: { zh: chineseCopy("Roma"), en: "Roma", ja: "ローマ" },
    summary: {
      zh: chineseCopy("Roma leather with a rich, saturated finish and architectural grain. Designed for statement interiors and product surfaces."), en: "Roma leather with a rich, saturated finish and architectural grain. Designed for statement interiors and product surfaces.",
      ja: "深みのある発色と建築的な木目を持つローマレザー。印象的なインテリアとプロダクト表面のためにデザイン。"
    },
    downloads: [],
    specTemplate: [
      { key: "unit", label: { zh: chineseCopy("UNIT"), en: "UNIT", ja: "単位" }, aliases: ["unit"] },
      { key: "code", label: { zh: chineseCopy("CODE"), en: "CODE", ja: "コード" }, aliases: ["code"] },
      { key: "grain", label: { zh: chineseCopy("GRAIN"), en: "GRAIN", ja: "木目" }, aliases: ["grain"] },
      { key: "thickness", label: { zh: chineseCopy("THICKNESS"), en: "THICKNESS", ja: "厚み" }, aliases: ["thickness"] }
    ],
    certifications: [],
    maintenance: [],
    seo: {
      title: { zh: chineseCopy("Roma Leather | CAMARI JAPAN"), en: "Roma Leather | CAMARI JAPAN", ja: "ローマレザー | CAMARI JAPAN" },
      description: { zh: chineseCopy("Roma leather with rich saturated finish and architectural grain."), en: "Roma leather with rich saturated finish and architectural grain.", ja: "深みのある発色と建築的な木目のローマレザー。" },
      image: images.alcantara
    }
  },
  {
    slug: "heritage",
    materialSlug: "leather",
    name: { zh: chineseCopy("Heritage"), en: "Heritage", ja: "ヘリテージ" },
    summary: {
      zh: chineseCopy("Heritage leather crafted with traditional tanning methods. Develops a distinctive patina over time, celebrating natural markings and authentic character."), en: "Heritage leather crafted with traditional tanning methods. Develops a distinctive patina over time, celebrating natural markings and authentic character.",
      ja: "伝統的な鞣し製法で作られたヘリテージレザー。時を経て独特のパティナを醸成し、自然な風合いと本物の個性を称えます。"
    },
    downloads: [],
    specTemplate: [
      { key: "unit", label: { zh: chineseCopy("UNIT"), en: "UNIT", ja: "単位" }, aliases: ["unit"] },
      { key: "code", label: { zh: chineseCopy("CODE"), en: "CODE", ja: "コード" }, aliases: ["code"] },
      { key: "grain", label: { zh: chineseCopy("GRAIN"), en: "GRAIN", ja: "木目" }, aliases: ["grain"] },
      { key: "thickness", label: { zh: chineseCopy("THICKNESS"), en: "THICKNESS", ja: "厚み" }, aliases: ["thickness"] }
    ],
    certifications: [],
    maintenance: [],
    seo: {
      title: { zh: chineseCopy("Heritage Leather | CAMARI JAPAN"), en: "Heritage Leather | CAMARI JAPAN", ja: "ヘリテージレザー | CAMARI JAPAN" },
      description: { zh: chineseCopy("Heritage leather with traditional tanning and distinctive patina."), en: "Heritage leather with traditional tanning and distinctive patina.", ja: "伝統的な鞣しと独特のパティナを持つヘリテージレザー。" },
      image: images.outdoor
    }
  },
  {
    slug: "vegan-leather-panel",
    materialSlug: "vegan-leather",
    name: { zh: chineseCopy("Vegan Leather Panel"), en: "Vegan Leather Panel", ja: "ヴィーガンレザーパネル" },
    summary: {
      zh: chineseCopy("Sustainable vegan leather panel with matte finish and micro-texture. High-performance alternative for contemporary interiors and product surfaces."), en: "Sustainable vegan leather panel with matte finish and micro-texture. High-performance alternative for contemporary interiors and product surfaces.",
      ja: "マット仕上げとマイクロテクスチャを持つサステナブルなヴィーガンレザーパネル。現代的なインテリアとプロダクト表面のための高性能な選択肢。"
    },
    downloads: [],
    specTemplate: [
      { key: "unit", label: { zh: chineseCopy("UNIT"), en: "UNIT", ja: "単位" }, aliases: ["unit"] },
      { key: "code", label: { zh: chineseCopy("CODE"), en: "CODE", ja: "コード" }, aliases: ["code"] },
      { key: "finish", label: { zh: chineseCopy("FINISH"), en: "FINISH", ja: "仕上げ" }, aliases: ["finish"] },
      { key: "thickness", label: { zh: chineseCopy("THICKNESS"), en: "THICKNESS", ja: "厚み" }, aliases: ["thickness"] }
    ],
    certifications: [],
    maintenance: [],
    seo: {
      title: { zh: chineseCopy("Vegan Leather Panel | CAMARI JAPAN"), en: "Vegan Leather Panel | CAMARI JAPAN", ja: "ヴィーガンレザーパネル | CAMARI JAPAN" },
      description: { zh: chineseCopy("Technical data and care guidance for vegan leather panels."), en: "Technical data and care guidance for vegan leather panels.", ja: "ヴィーガンレザーパネルの技術仕様とケア情報。" },
      image: images.vegan
    }
  },
  {
    slug: "fabric-panel",
    materialSlug: "fabric",
    name: { zh: chineseCopy("Fabric Panel"), en: "Fabric Panel", ja: "ファブリックパネル" },
    summary: {
      zh: chineseCopy("Architectural fabric panel for interior, hospitality, and workspace applications. Washi, linen, and technical weaves with acoustic softness."), en: "Architectural fabric panel for interior, hospitality, and workspace applications. Washi, linen, and technical weaves with acoustic softness.",
      ja: "インテリア、ホスピタリティ、ワークスペース向けの建築的ファブリックパネル。和紙、リネン、テクニカル織りが吸音性と空間の余白を両立。"
    },
    downloads: [],
    specTemplate: [
      { key: "unit", label: { zh: chineseCopy("UNIT"), en: "UNIT", ja: "単位" }, aliases: ["unit"] },
      { key: "code", label: { zh: chineseCopy("CODE"), en: "CODE", ja: "コード" }, aliases: ["code"] },
      { key: "composition", label: { zh: chineseCopy("COMPOSITION"), en: "COMPOSITION", ja: "組成" }, aliases: ["composition"] },
      { key: "width", label: { zh: chineseCopy("WIDTH"), en: "WIDTH", ja: "幅" }, aliases: ["width"] }
    ],
    certifications: [],
    maintenance: [],
    seo: {
      title: { zh: chineseCopy("Fabric Panel | CAMARI JAPAN"), en: "Fabric Panel | CAMARI JAPAN", ja: "ファブリックパネル | CAMARI JAPAN" },
      description: { zh: chineseCopy("Technical data and maintenance guidance for fabric panels."), en: "Technical data and maintenance guidance for fabric panels.", ja: "ファブリックパネルの技術仕様とメンテナンス情報。" },
      image: images.fabric
    }
  }
];

const fixtureSkus: Sku[] = [
  // Vegan Leather SKUs
  {
    slug: "vl-mtt-8801-obsidian",
    materialSlug: "vegan-leather",
    productTypeSlug: "vegan-leather-panel",
    code: "VL-MTT-8801",
    colorName: { zh: chineseCopy("Obsidian"), en: "Obsidian", ja: "オブシディアン" },
    hex: "#1A1A1A",
    image: images.vegan,
    summary: {
      zh: chineseCopy("Deep matte black vegan leather with micro-texture surface. High abrasion resistance for product panels and consumer electronics."), en: "Deep matte black vegan leather with micro-texture surface. High abrasion resistance for product panels and consumer electronics.",
      ja: "マイクロテクスチャ表面を持つ深いマットブラックのヴィーガンレザー。プロダクトパネルおよびコンシューマー機器向けの高い耐摩耗性。"
    },
    specs: [
      { label: { zh: chineseCopy("Unit"), en: "Unit", ja: "単位" }, value: { zh: chineseCopy("Meters"), en: "Meters", ja: "メートル" } },
      { label: { zh: chineseCopy("Code"), en: "Code", ja: "コード" }, value: { zh: chineseCopy("VL-MTT-8801"), en: "VL-MTT-8801", ja: "VL-MTT-8801" } },
      { label: { zh: chineseCopy("Composition"), en: "Composition", ja: "組成" }, value: { zh: chineseCopy("PU face, recycled polyester backing"), en: "PU face, recycled polyester backing", ja: "PU 表面、リサイクルポリエステル裏地" } },
      { label: { zh: chineseCopy("Width"), en: "Width", ja: "幅" }, value: { zh: chineseCopy("140 cm"), en: "140 cm", ja: "140 cm" } }
    ],
    certifications: [
      { zh: chineseCopy("OEKO-TEX Standard 100 certified"), en: "OEKO-TEX Standard 100 certified", ja: "エコテックス スタンダード 100 認証" },
      { zh: chineseCopy("Recycled content minimum 40%"), en: "Recycled content minimum 40%", ja: "リサイクル含有率 最低 40%" }
    ],
    downloads: [
      {
        title: { zh: chineseCopy("Vegan Leather Performance Data"), en: "Vegan Leather Performance Data", ja: "ヴィーガンレザー性能データ" },
        description: { zh: chineseCopy("Abrasion, UV, and hydrolytic stability test results."), en: "Abrasion, UV, and hydrolytic stability test results.", ja: "耐摩耗性、紫外線、耐加水分解性の試験結果。" },
        href: "/catalogs/vegan-leather-performance.pdf",
        type: "technical"
      }
    ],
    seo: {
      title: { zh: chineseCopy("VL-MTT-8801 Obsidian | CAMARI JAPAN"), en: "VL-MTT-8801 Obsidian | CAMARI JAPAN", ja: "VL-MTT-8801 オブシディアン | CAMARI JAPAN" },
      description: {
        zh: chineseCopy("Matte black vegan leather with micro-texture for product and electronics applications."), en: "Matte black vegan leather with micro-texture for product and electronics applications.",
        ja: "プロダクトおよび電子機器向けマイクロテクスチャマットブラックヴィーガンレザー。"
      },
      image: images.vegan
    }
  },
  {
    slug: "vl-sft-5520-terracotta",
    materialSlug: "vegan-leather",
    productTypeSlug: "vegan-leather-panel",
    code: "VL-SFT-5520",
    colorName: { zh: chineseCopy("Terracotta"), en: "Terracotta", ja: "テラコッタ" },
    hex: "#C1664B",
    image: images.outdoor,
    summary: {
      zh: chineseCopy("Soft-touch vegan leather in warm terracotta. Smooth finish with subtle sheen for interior accessories and fashion applications."), en: "Soft-touch vegan leather in warm terracotta. Smooth finish with subtle sheen for interior accessories and fashion applications.",
      ja: "ウォームテラコッタのソフトタッチヴィーガンレザー。インテリアアクセサリーおよびファッション用途向けの、控えめな光沢を持つスムース仕上げ。"
    },
    specs: [
      { label: { zh: chineseCopy("Unit"), en: "Unit", ja: "単位" }, value: { zh: chineseCopy("Meters"), en: "Meters", ja: "メートル" } },
      { label: { zh: chineseCopy("Code"), en: "Code", ja: "コード" }, value: { zh: chineseCopy("VL-SFT-5520"), en: "VL-SFT-5520", ja: "VL-SFT-5520" } },
      { label: { zh: chineseCopy("Composition"), en: "Composition", ja: "組成" }, value: { zh: chineseCopy("PU face, cotton backing"), en: "PU face, cotton backing", ja: "PU 表面、コットン裏地" } },
      { label: { zh: chineseCopy("Width"), en: "Width", ja: "幅" }, value: { zh: chineseCopy("138 cm"), en: "138 cm", ja: "138 cm" } }
    ],
    certifications: [
      { zh: chineseCopy("OEKO-TEX Standard 100 certified"), en: "OEKO-TEX Standard 100 certified", ja: "エコテックス スタンダード 100 認証" }
    ],
    downloads: [],
    seo: {
      title: { zh: chineseCopy("VL-SFT-5520 Terracotta | CAMARI JAPAN"), en: "VL-SFT-5520 Terracotta | CAMARI JAPAN", ja: "VL-SFT-5520 テラコッタ | CAMARI JAPAN" },
      description: {
        zh: chineseCopy("Soft-touch vegan leather in warm terracotta for interior and fashion use."), en: "Soft-touch vegan leather in warm terracotta for interior and fashion use.",
        ja: "インテリアおよびファッション向けウォームテラコッタのソフトタッチヴィーガンレザー。"
      },
      image: images.outdoor
    }
  },
  // Fabric SKUs
  {
    slug: "f-wsh-1120-ivory",
    materialSlug: "fabric",
    productTypeSlug: "fabric-panel",
    code: "F-WSH-1120",
    colorName: { zh: chineseCopy("Washi Ivory"), en: "Washi Ivory", ja: "和紙アイボリー" },
    hex: "#F2EFE9",
    image: images.fabric,
    summary: {
      zh: chineseCopy("Japanese washi paper weave with metallic gold thread accent. Light-filtering and acoustically soft for hospitality and residential interiors."), en: "Japanese washi paper weave with metallic gold thread accent. Light-filtering and acoustically soft for hospitality and residential interiors.",
      ja: "金属的な金糸のアクセントを持つ和紙織り。光を透過し吸音性に優れ、ホスピタリティおよび住宅インテリアに最適。"
    },
    specs: [
      { label: { zh: chineseCopy("Unit"), en: "Unit", ja: "単位" }, value: { zh: chineseCopy("Meters"), en: "Meters", ja: "メートル" } },
      { label: { zh: chineseCopy("Code"), en: "Code", ja: "コード" }, value: { zh: chineseCopy("F-WSH-1120"), en: "F-WSH-1120", ja: "F-WSH-1120" } },
      { label: { zh: chineseCopy("Composition"), en: "Composition", ja: "組成" }, value: { zh: chineseCopy("60% Washi, 40% Polyester"), en: "60% Washi, 40% Polyester", ja: "和紙 60%、ポリエステル 40%" } },
      { label: { zh: chineseCopy("Width"), en: "Width", ja: "幅" }, value: { zh: chineseCopy("150 cm"), en: "150 cm", ja: "150 cm" } }
    ],
    certifications: [
      { zh: chineseCopy("Japanese washi paper certified origin"), en: "Japanese washi paper certified origin", ja: "日本産和紙認証" }
    ],
    downloads: [
      {
        title: { zh: chineseCopy("Fabric Collection Lookbook"), en: "Fabric Collection Lookbook", ja: "ファブリックコレクションルックブック" },
        description: { zh: chineseCopy("Washi, linen, and technical weave catalog."), en: "Washi, linen, and technical weave catalog.", ja: "和紙、リネン、テクニカル織りのカタログ。" },
        href: "/catalogs/fabric-collection-lookbook.pdf",
        type: "catalog"
      }
    ],
    seo: {
      title: { zh: chineseCopy("F-WSH-1120 Washi Ivory | CAMARI JAPAN"), en: "F-WSH-1120 Washi Ivory | CAMARI JAPAN", ja: "F-WSH-1120 和紙アイボリー | CAMARI JAPAN" },
      description: {
        zh: chineseCopy("Japanese washi paper weave fabric in ivory with gold thread for hospitality and residential use."), en: "Japanese washi paper weave fabric in ivory with gold thread for hospitality and residential use.",
        ja: "ホスピタリティおよび住宅用の金糸入りアイボリー和紙織りファブリック。"
      },
      image: images.fabric
    }
  },
  {
    slug: "f-lnn-2801-charcoal",
    materialSlug: "fabric",
    productTypeSlug: "fabric-panel",
    code: "F-LNN-2801",
    colorName: { zh: chineseCopy("Charcoal Linen"), en: "Charcoal Linen", ja: "チャコールリネン" },
    hex: "#3A3A3A",
    image: images.alcantara,
    summary: {
      zh: chineseCopy("Belgian linen blend in charcoal with slub texture. Breathable and naturally fire-retardant for workspace and retail environments."), en: "Belgian linen blend in charcoal with slub texture. Breathable and naturally fire-retardant for workspace and retail environments.",
      ja: "スラブテクスチャを持つチャコールのベルギーリネン混紡。通気性があり自然難燃性で、ワークスペースおよびリテール環境に適しています。"
    },
    specs: [
      { label: { zh: chineseCopy("Unit"), en: "Unit", ja: "単位" }, value: { zh: chineseCopy("Meters"), en: "Meters", ja: "メートル" } },
      { label: { zh: chineseCopy("Code"), en: "Code", ja: "コード" }, value: { zh: chineseCopy("F-LNN-2801"), en: "F-LNN-2801", ja: "F-LNN-2801" } },
      { label: { zh: chineseCopy("Composition"), en: "Composition", ja: "組成" }, value: { zh: chineseCopy("55% Linen, 45% Cotton"), en: "55% Linen, 45% Cotton", ja: "リネン 55%、コットン 45%" } },
      { label: { zh: chineseCopy("Width"), en: "Width", ja: "幅" }, value: { zh: chineseCopy("145 cm"), en: "145 cm", ja: "145 cm" } }
    ],
    certifications: [
      { zh: chineseCopy("European Flax certified"), en: "European Flax certified", ja: "ヨーロピアンフラックス認証" },
      { zh: chineseCopy("Naturally fire-retardant"), en: "Naturally fire-retardant", ja: "自然難燃性" }
    ],
    downloads: [],
    seo: {
      title: { zh: chineseCopy("F-LNN-2801 Charcoal Linen | CAMARI JAPAN"), en: "F-LNN-2801 Charcoal Linen | CAMARI JAPAN", ja: "F-LNN-2801 チャコールリネン | CAMARI JAPAN" },
      description: {
        zh: chineseCopy("Belgian linen blend in charcoal with slub texture for workspace and retail use."), en: "Belgian linen blend in charcoal with slub texture for workspace and retail use.",
        ja: "ワークスペースおよびリテール向けスラブテクスチャチャコールのベルギーリネン混紡。"
      },
      image: images.alcantara
    }
  }
];

export const productTypes: ProductType[] = mergeBySlug(
  fixtureProductTypes,
  normalizeLocalizedBrandNames(generatedCatalog.productTypes ?? []) as unknown as ProductType[]
);

export const skus: Sku[] = mergeSkusByProductType(
  fixtureSkus,
  normalizeLocalizedBrandNames(generatedCatalog.skus ?? []) as unknown as Sku[]
);

export const projectCases: ProjectCase[] = [];

export const newsItems: NewsItem[] = [
  {
    slug: "aquapelle-waterborne-microfiber-launch",
    availableLocales: ["en", "ja"],
    title: {
      zh: chineseCopy("Introducing Aquapelle: Premium Waterborne Microfiber Leather"), en: "Introducing Aquapelle: Premium Waterborne Microfiber Leather",
      ja: "新品 Aquapelle：プレミアム水性マイクロファイバーレザー"
    },
    category: { zh: chineseCopy("Product Launch"), en: "Product Launch", ja: "新製品" },
    date: "2026-08-12",
    image: "/uploads/news/2026 Aquapelle/MF COVER.jpeg",
    summary: {
      zh: chineseCopy("Aquapelle combines a Nappa-inspired touch, durable four-layer construction, cleaner waterborne chemistry, and repeatable quality for automotive, interior, and lifestyle surfaces."), en: "Aquapelle combines a Nappa-inspired touch, durable four-layer construction, cleaner waterborne chemistry, and repeatable quality for automotive, interior, and lifestyle surfaces.",
      ja: "Aquapelleは、ナッパレザーを思わせる上質な触感、耐久性に優れた4層構造、よりクリーンな水性技術、安定した品質を、自動車・インテリア・ライフスタイル向けに提供します。"
    },
    seo: {
      title: {
        zh: chineseCopy("Aquapelle Waterborne Microfiber Leather | New Product"), en: "Aquapelle Waterborne Microfiber Leather | New Product",
        ja: "Aquapelle 水性マイクロファイバーレザー | 新製品"
      },
      description: {
        zh: chineseCopy("Discover Aquapelle, a premium waterborne microfiber leather with Nappa-inspired tactility, four-layer performance, cleaner processing, and customizable finishes."), en: "Discover Aquapelle, a premium waterborne microfiber leather with Nappa-inspired tactility, four-layer performance, cleaner processing, and customizable finishes.",
        ja: "ナッパ調の触感、4層構造による性能、よりクリーンな製造工程、多彩なカスタマイズ性を備えたプレミアム水性マイクロファイバーレザー、Aquapelleをご紹介します。"
      },
      image: "/uploads/news/2026 Aquapelle/MF COVER.jpeg"
    }
  },
  {
    slug: "camari-tokyo-auto-salon-2026",
    availableLocales: ["en", "ja"],
    title: { zh: chineseCopy("CAMARI INTERNATIONAL JAPAN Makes Its Tokyo Auto Salon Debut"), en: "CAMARI INTERNATIONAL JAPAN Makes Its Tokyo Auto Salon Debut", ja: "東京オートサロン初出展を無事終了いたしました" },
    category: { zh: chineseCopy("Exhibition"), en: "Exhibition", ja: "展示会" },
    date: "2026-01-11",
    image: "/uploads/news/2026 Tokyo Auto Salon/hero.jpg",
    summary: {
      zh: chineseCopy("CAMARI INTERNATIONAL JAPAN concluded its participation at the Tokyo Auto Salon after three days of highlighting premium materials, OEM capabilities, and finished products."), en: "CAMARI INTERNATIONAL JAPAN concluded its participation at the Tokyo Auto Salon after three days of highlighting premium materials, OEM capabilities, and finished products.",
      ja: "カマリ・インターナショナル・ジャパンは、「東京オートサロン」に初出展し、盛況のうちに3日間の会期を終えることができました。"
    },
    seo: {
      title: { zh: chineseCopy("CAMARI INTERNATIONAL JAPAN Makes Its Tokyo Auto Salon Debut"), en: "CAMARI INTERNATIONAL JAPAN Makes Its Tokyo Auto Salon Debut", ja: "東京オートサロン初出展を無事終了いたしました" },
      description: {
        zh: chineseCopy("Discover CAMARI INTERNATIONAL JAPAN's Tokyo Auto Salon 2026 debut, featuring Alcantara, Italian leathers, OEM manufacturing, automotive accessories, and lifestyle products."), en: "Discover CAMARI INTERNATIONAL JAPAN's Tokyo Auto Salon 2026 debut, featuring Alcantara, Italian leathers, OEM manufacturing, automotive accessories, and lifestyle products.",
        ja: "東京オートサロン初出展の様子と、アルカンターラ、イタリアンレザー、OEM製品、カー用品、ライフスタイル用品の展示をご紹介します。"
      },
      image: "/uploads/news/2026 Tokyo Auto Salon/hero.jpg"
    }
  },
  {
    slug: "alcantara-camari-third-strategic-chapter",
    availableLocales: ["en", "ja"],
    title: { zh: chineseCopy("ALCANTARA × CAMARI: A Third Strategic Chapter Begins"), en: "ALCANTARA × CAMARI: A Third Strategic Chapter Begins", ja: "ALCANTARA × CAMARI、3度目の戦略提携で新章へ" },
    category: { zh: chineseCopy("Partnership"), en: "Partnership", ja: "パートナーシップ" },
    date: "2025-04-15",
    image: "/uploads/news/2025 Alcantara distribution contract/hero.jpg",
    summary: {
      zh: chineseCopy("Alcantara and CAMARI have renewed their partnership for a third five-year term, continuing a decade-long collaboration across Asia Pacific."), en: "Alcantara and CAMARI have renewed their partnership for a third five-year term, continuing a decade-long collaboration across Asia Pacific.",
      ja: "アルカンターラとカマリは、アジア太平洋市場における10年以上の協業を基盤に、3期目となる5カ年契約を締結しました。"
    },
    seo: {
      title: { zh: chineseCopy("ALCANTARA × CAMARI: A Third Strategic Chapter Begins"), en: "ALCANTARA × CAMARI: A Third Strategic Chapter Begins", ja: "ALCANTARA × CAMARI、3度目の戦略提携で新章へ" },
      description: {
        zh: chineseCopy("Alcantara and CAMARI signed their third five-year distribution agreement in Milan, renewing a strategic partnership serving the Asia Pacific market."), en: "Alcantara and CAMARI signed their third five-year distribution agreement in Milan, renewing a strategic partnership serving the Asia Pacific market.",
        ja: "アルカンターラとカマリはミラノで3度目となる5カ年の販売代理店契約を締結し、アジア太平洋市場における戦略的パートナーシップを更新しました。"
      },
      image: "/uploads/news/2025 Alcantara distribution contract/hero.jpg"
    }
  },
  {
    slug: "alcantara-design-shanghai-2024",
    availableLocales: ["en", "ja"],
    title: { zh: chineseCopy("CAMARI at Design Shanghai 2024"), en: "CAMARI at Design Shanghai 2024", ja: "カマリ、Design Shanghai 2024に出展" },
    category: { zh: chineseCopy("Exhibition"), en: "Exhibition", ja: "展示会" },
    date: "2024-06-27",
    image: "/uploads/news/2024 Design Shanghai/ds1.jpg",
    summary: {
      zh: chineseCopy("CAMARI presented a comprehensive material portfolio at Design Shanghai 2024, spanning Alcantara, premium leather, automotive fabrics, and bespoke surface solutions."), en: "CAMARI presented a comprehensive material portfolio at Design Shanghai 2024, spanning Alcantara, premium leather, automotive fabrics, and bespoke surface solutions.",
      ja: "カマリは、Design Shanghai 2024に出展し、アルカンターラをはじめ、プレミアムレザー、自動車用ファブリック、特注サーフェスマテリアルまで、幅広い素材ポートフォリオを紹介しました。"
    },
    seo: {
      title: { zh: chineseCopy("CAMARI at Design Shanghai 2024"), en: "CAMARI at Design Shanghai 2024", ja: "カマリ、Design Shanghai 2024に出展" },
      description: {
        zh: chineseCopy("Discover CAMARI's presentation at Design Shanghai 2024, featuring Alcantara, premium leather, automotive fabrics, collectible furniture, and creative surface applications."), en: "Discover CAMARI's presentation at Design Shanghai 2024, featuring Alcantara, premium leather, automotive fabrics, collectible furniture, and creative surface applications.",
        ja: "Design Shanghai 2024でカマリが紹介したアルカンターラ、プレミアムレザー、自動車用ファブリック、コレクタブルファニチャー、多彩な表面加工をご覧ください。"
      },
      image: "/uploads/news/2024 Design Shanghai/ds1.jpg"
    }
  }
];

export const catalogs: Download[] = [
  {
    title: { zh: chineseCopy("CAMARI Material Catalog"), en: "CAMARI Material Catalog", ja: "CAMARI 素材カタログ" },
    description: {
      zh: chineseCopy("A PDF overview of the core material collection, applications, and contact details."), en: "A PDF overview of the core material collection, applications, and contact details.",
      ja: "主要素材コレクション、用途、連絡先をまとめた PDF カタログ。"
    },
    href: "/catalogs/camari-material-catalog.pdf",
    type: "catalog"
  },
  {
    title: { zh: chineseCopy("Alcantara Technical Sheet"), en: "Alcantara Technical Sheet", ja: "Alcantara 技術資料" },
    description: {
      zh: chineseCopy("Technical specifications for selected Alcantara articles and colors."), en: "Technical specifications for selected Alcantara articles and colors.",
      ja: "選定 Alcantara 品番とカラーの技術仕様。"
    },
    href: "/catalogs/alcantara-technical-sheet.pdf",
    type: "technical"
  }
];

export function getMaterial(slug: string): Material | undefined {
  return materials.find((material) => material.slug === slug);
}

export function getProductType(materialSlug: string, productTypeSlug: string): ProductType | undefined {
  return productTypes.find((productType) => productType.materialSlug === materialSlug && productType.slug === productTypeSlug);
}

export function getSkusForMaterial(materialSlug: string): Sku[] {
  return skus.filter((sku) => sku.materialSlug === materialSlug);
}

export function getSkusForProductType(materialSlug: string, productTypeSlug: string): Sku[] {
  return skus.filter((sku) => sku.materialSlug === materialSlug && sku.productTypeSlug === productTypeSlug);
}

export function getSku(materialSlug: string, productTypeSlug: string, skuSlug: string): Sku | undefined {
  return skus.find((sku) => sku.materialSlug === materialSlug && sku.productTypeSlug === productTypeSlug && sku.slug === skuSlug);
}

export function getLegacySku(materialSlug: string, skuSlug: string): Sku | undefined {
  return skus.find((sku) => sku.materialSlug === materialSlug && sku.slug === skuSlug);
}

export function getProject(slug: string): ProjectCase | undefined {
  return projectCases.find((project) => project.slug === slug);
}
