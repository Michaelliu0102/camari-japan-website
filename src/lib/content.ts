import type { Locale } from "./locales";
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
  name: LocalizedString;
  tagline: LocalizedString;
  description: LocalizedString;
  coverImage: string;
  accent: string;
};

export type Application = {
  slug: string;
  name: LocalizedString;
  colorCount: number;
  image: string;
  productTypeSlug?: string;
};

export type Material = {
  slug: string;
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
  slug: string;
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

export type HomePageSettings = {
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
  bodyParagraphs: LocalizedString[];
  manufacturingLabel: LocalizedString;
  manufacturingTitle: LocalizedString;
  manufacturingParagraphs: LocalizedString[];
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

const muxPlaybackId = "JSVVPfT9fUoZwnzXbIIXXOV16g4wPdmXBF9pRWA49mI";

export const heroVideo = {
  poster: `https://image.mux.com/${muxPlaybackId}/thumbnail.jpg`,
  src: `https://stream.mux.com/${muxPlaybackId}.m3u8`
};

export const homePageSettings: HomePageSettings = {
  brandValueImage: images.alcantaraSoft,
  showroomBackgroundImage: images.interior,
  hero: {
    title: { en: "The Intersection of", ja: "The Intersection of" },
    subtitle: { en: "Texture and Precision", ja: "質感と精密さの交差点" },
    videoSrc: heroVideo.src,
    poster: heroVideo.poster,
    ctaLabel: { en: "Discover the Collection", ja: "コレクションを見る" },
    ctaHref: "/materials"
  },
  explore: {
    categorySlugs: ["alcantara", "fabric", "vegan-leather"],
    productSlides: [
      {
        slug: "oem-odm",
        title: { en: "Bespoke Surfaces", ja: "特注サーフェス" },
        category: { en: "Product — OEM", ja: "Product — OEM" },
        description: {
          en: "Material programs for automotive, product, hospitality, and architectural teams.",
          ja: "車両、プロダクト、ホスピタリティ、建築チームに向けた素材プログラム。"
        },
        image: images.alcantaraSoft,
        href: "/oem-odm"
      },
      {
        slug: "projects",
        title: { en: "PRODUCT", ja: "PRODUCT" },
        category: { en: "Product", ja: "Product" },
        description: {
          en: "Surface programs organized by product context and customer use.",
          ja: "製品用途と顧客体験に合わせたサーフェスプログラム。"
        },
        image: "/uploads/product/product-hero.jpg",
        href: "/products"
      }
    ]
  }
};

export const aboutPageSettings: AboutPageSettings = {
  seo: {
    title: { en: `About | ${site.name}`, ja: `会社情報 | ${site.name}` },
    description: {
      en: `Learn about ${site.organizationName}'s material philosophy, company values, and contact information.`,
      ja: `${site.organizationName} の素材哲学、企業価値、連絡先について。`
    },
    image: "/uploads/hero/showroom.png"
  },
  heroImage: "/uploads/hero/showroom.png",
  heroAlt: { en: "CAMARI showroom interior", ja: "CAMARI ショールーム内観" },
  heroTitle: { en: "CAMARI", ja: "CAMARI" },
  exploreLabel: { en: "Explore", ja: "Explore" },
  bodyLabel: { en: "Company", ja: "Company" },
  bodyTitle: { en: "ABOUT CAMARI", ja: "ABOUT CAMARI" },
  bodyParagraphs: [
    {
      en: `${site.organizationName} curates premium surface materials for teams who treat texture as an essential part of brand, space, and product quality.`,
      ja: `${site.organizationName} は、質感をブランド、空間、プロダクト品質の中核として扱うチームに向けて、上質なサーフェス素材を選定します。`
    }
  ],
  manufacturingLabel: { en: "Manufacturing", ja: "Manufacturing" },
  manufacturingTitle: { en: "OUR FACTORY", ja: "OUR FACTORY" },
  manufacturingParagraphs: [
    {
      en: "SHENGHUA is factory from 2000.",
      ja: "SHENGHUA is factory from 2000."
    }
  ]
};

export const materialCategories: MaterialCategory[] = [
  {
    slug: "alcantara",
    name: { en: "Alcantara", ja: "アルカンターラ" },
    tagline: { en: "Italian precision / carbon neutral", ja: "イタリアの精密性 / カーボンニュートラル" },
    description: {
      en: "A sensory microfiber surface for automotive, interiors, aviation, and product spaces.",
      ja: "車両、インテリア、航空、プロダクト空間に向けた感性的なマイクロファイバー素材。"
    },
    coverImage: images.alcantaraSoft,
    accent: "#1A1A1A"
  },
  {
    slug: "fabric",
    name: { en: "Fabric", ja: "ファブリック" },
    tagline: { en: "Washi, weave, and quiet tactility", ja: "和紙、織り、静かな触感" },
    description: {
      en: "Architectural textiles selected for spatial restraint and practical durability.",
      ja: "空間の余白と実用性を両立する建築的テキスタイル。"
    },
    coverImage: images.fabric,
    accent: "#A68A5E"
  },
  {
    slug: "vegan-leather",
    name: { en: "Vegan Leather", ja: "ヴィーガンレザー" },
    tagline: { en: "Sustainable luxury alternatives", ja: "持続可能なラグジュアリー素材" },
    description: {
      en: "Matte, refined surfaces for contemporary spaces and brand-led product programs.",
      ja: "現代的な空間とブランドプロダクトに向けた、上品なマットサーフェス。"
    },
    coverImage: images.vegan,
    accent: "#735B33"
  },
];

export const materials: Material[] = [
  {
    slug: "alcantara",
    categorySlug: "alcantara",
    name: { en: "Alcantara", ja: "アルカンターラ" },
    eyebrow: { en: "Premium Collection", ja: "プレミアムコレクション" },
    heroTitle: { en: "Alcantara", ja: "Alcantara" },
    heroSubtitle: { en: "The sensory revolution", ja: "触感の革新" },
    heroImage: images.alcantara,
    introTitle: { en: "The Art of Italian Innovation", ja: "イタリアンイノベーションの美学" },
    introBody: {
      en: "Alcantara represents a singular vision: one company, one brand, and one remarkable material. Founded in 1972, this symbol of Italian excellence is built on a unique, proprietary technology that blends advanced science with premium craftsmanship.\n\nAlcantara brings together advanced technology and great craftsmanship. It is uniquely soft, comfortable, and distinct to the touch, yet it is also durable, lightweight, breathable, temperature-regulating, and completely washable. These excellent qualities allow it to easily wrap around complex shapes and surfaces while keeping a clean, premium look.\n\nChosen by leading brands in automotive, interiors, marine, aviation, fashion, and consumer electronics, Alcantara turns high performance into a true design language. It supports custom solutions for demanding creative and technical projects through a wide range of options, including personalized colors, textures, printing, perforation, laser processing, embossing, embroidery, and lamination.\n\nSustainability is a core part of its industrial culture. Alcantara has maintained its Carbon Neutral certification since 2009.",
      ja: "Alcantara は、ひとつの企業、ひとつのブランド、ひとつの素材として成立するイタリアのエクセレンスです。1972年にイタリアで生産が始まり、独自の専有技術から発展してきました。\n\nこの素材は、先端技術とクラフツマンシップを結びつけています。柔らかく包み込むような独自の触感を持ちながら、耐久性、軽さ、通気性、温度調整性、メンテナンス性、耐摩耗性にも優れています。複雑な形状や多様な表面に適応しながら、洗練された視覚的な存在感を保つことができます。\n\n自動車、インテリア、船舶、航空、ファッション、コンシューマーエレクトロニクスまで、Alcantara は世界の主要ブランドに選ばれています。カラー、テクスチャー、プリント、パンチング、レーザー加工、エンボス、刺繍、ラミネーションなどのカスタマイズに対応し、高度な意匠性と技術要件を持つプロジェクトに合わせたソリューションを提供します。\n\nサステナビリティも Alcantara の産業文化の一部です。2009年からカーボンニュートラル認証を継続し、責任ある生産、製品認証、リサイクル素材、循環型経済に向けた研究開発を進めています。"
    },
    introImage: images.interior,
    quote: {
      en: "Alcantara turns technical performance into a sensory language for contemporary design.",
      ja: "Alcantara は、技術性能を現代デザインのための触感の言語へと変える。"
    },
    applications: [
      { slug: "automotive", name: { en: "Automotive", ja: "自動車" }, colorCount: 71, image: images.alcantara },
      { slug: "interior", name: { en: "Interior", ja: "インテリア" }, colorCount: 76, image: images.interior, productTypeSlug: "alcantara-master" },
      { slug: "outdoor", name: { en: "Outdoor", ja: "アウトドア" }, colorCount: 14, image: images.outdoor, productTypeSlug: "alcantara-exo" },
      { slug: "electronics", name: { en: "Consumer Electronics", ja: "コンシューマー機器" }, colorCount: 20, image: images.vegan, productTypeSlug: "alcantara-04" }
    ],
    seo: {
      title: { en: "Alcantara Materials | CAMARI JAPAN", ja: "Alcantara 素材 | CAMARI JAPAN" },
      description: {
        en: "Explore Alcantara applications, performance, colors, and technical downloads for premium interiors and mobility.",
        ja: "プレミアムインテリアとモビリティ向け Alcantara の用途、性能、カラー、技術資料を紹介します。"
      },
      image: images.alcantara
    }
  },
  {
    slug: "vegan-leather",
    categorySlug: "vegan-leather",
    name: { en: "Vegan Leather", ja: "ヴィーガンレザー" },
    eyebrow: { en: "Sustainable Collection", ja: "サステナブルコレクション" },
    heroTitle: { en: "Vegan Leather", ja: "Vegan Leather" },
    heroSubtitle: { en: "Performance without compromise", ja: "妥協なき性能" },
    heroImage: images.vegan,
    introTitle: { en: "High-Performance Alternatives", ja: "ハイパフォーマンスな選択肢" },
    introBody: {
      en: "Engineered surface materials that match or exceed the tactile and durability standards of traditional leather, without animal content. Matte finishes, micro-textures, and colorfast pigments define a collection built for contemporary product and interior programs.",
      ja: "伝統的なレザーの触感と耐久性基準を満たし、それを超えるように設計された素材。マット仕上げ、マイクロテクスチャ、退色しにくい顔料が、現代的なプロダクトとインテリアのためのコレクションを形作ります。"
    },
    introImage: images.outdoor,
    quote: {
      en: "Sustainability is not a constraint. It is a material discipline.",
      ja: "持続可能性は制約ではない。それは素材の規律である。"
    },
    applications: [
      { slug: "interior", name: { en: "Interior", ja: "インテリア" }, colorCount: 48, image: images.vegan },
      { slug: "outdoor", name: { en: "Outdoor", ja: "アウトドア" }, colorCount: 22, image: images.outdoor },
      { slug: "electronics", name: { en: "Consumer Electronics", ja: "コンシューマー機器" }, colorCount: 16, image: images.alcantara },
      { slug: "fashion", name: { en: "Fashion", ja: "ファッション" }, colorCount: 35, image: images.fabric }
    ],
    seo: {
      title: { en: "Vegan Leather Materials | CAMARI JAPAN", ja: "ヴィーガンレザー素材 | CAMARI JAPAN" },
      description: {
        en: "Sustainable vegan leather alternatives with matte finishes and micro-textures for interior and product spaces.",
        ja: "マット仕上げとマイクロテクスチャを備えた、インテリアとプロダクト空間のためのサステナブルなヴィーガンレザー素材。"
      },
      image: images.vegan
    }
  },
  {
    slug: "fabric",
    categorySlug: "fabric",
    name: { en: "Fabric", ja: "ファブリック" },
    eyebrow: { en: "Textile Collection", ja: "テキスタイルコレクション" },
    heroTitle: { en: "Fabric", ja: "Fabric" },
    heroSubtitle: { en: "Washi, weave, and quiet tactility", ja: "和紙、織り、静かな触感" },
    heroImage: images.fabric,
    introTitle: { en: "The Architecture of Weave", ja: "織りの建築" },
    introBody: {
      en: "Architectural textiles selected for spatial restraint and practical durability. From Japanese washi paper weaves to high-performance technical fabrics, each selection balances acoustic softness with structural integrity for interior, hospitality, and product applications.",
      ja: "空間の余白と実用性のために選ばれた建築的テキスタイル。和紙の織りから高機能テクニカルファブリックまで、それぞれがインテリア、ホスピタリティ、プロダクト用途における吸音性と構造的な完全性のバランスを取ります。"
    },
    introImage: images.alcantara,
    quote: {
      en: "Fabric does not decorate space. It completes it.",
      ja: "ファブリックは空間を飾らない。それを完成させる。"
    },
    applications: [
      { slug: "interior", name: { en: "Interior", ja: "インテリア" }, colorCount: 62, image: images.fabric },
      { slug: "hospitality", name: { en: "Hospitality", ja: "ホスピタリティ" }, colorCount: 38, image: images.interior },
      { slug: "retail", name: { en: "Retail", ja: "リテール" }, colorCount: 25, image: images.outdoor },
      { slug: "workspace", name: { en: "Workspace", ja: "ワークスペース" }, colorCount: 30, image: images.alcantaraSoft }
    ],
    seo: {
      title: { en: "Fabric Materials | CAMARI JAPAN", ja: "ファブリック素材 | CAMARI JAPAN" },
      description: {
        en: "Architectural textiles and technical fabrics for interior, hospitality, and workspace environments.",
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
    name: { en: "Alcantara Panel", ja: "Alcantara パネル" },
    summary: {
      en: "Alcantara panel for automotive door panels, dashboards, and headliners. Italian microfibre with soft-touch finish, UV-stable, and carbon neutral.",
      ja: "自動車のドアパネル、ダッシュボード、ヘッドライナー向け Alcantara パネル。ソフトタッチ仕上げのイタリア製マイクロファイバー。"
    },
    downloads: [],
    specTemplate: [
      { key: "thickness", label: { en: "THICKNESS", ja: "厚み" }, aliases: ["thickness"] },
      { key: "unit-weight", label: { en: "UNIT WEIGHT", ja: "単位重量" }, aliases: ["unit weight", "weight"] },
      { key: "width", label: { en: "WIDTH", ja: "幅" }, aliases: ["width"] },
      { key: "breaking-load", label: { en: "BREAKING LOAD", ja: "破断荷重" }, aliases: ["breaking load"] },
      { key: "wear-resistance", label: { en: "WEAR RESISTANCE", ja: "耐摩耗性" }, aliases: ["wear resistance", "martindale"] },
      { key: "to-light", label: { en: "TO LIGHT", ja: "耐光性" }, aliases: ["to light", "lightfastness"] },
      { key: "to-rubbery", label: { en: "TO RUBBERY", ja: "摩擦堅牢度" }, aliases: ["to rubbings", "to rubbery", "rub fastness"] },
      { key: "fr-version", label: { en: "FR VERSION", ja: "FR 仕様" }, aliases: ["fr version", "fr"] }
    ],
    certifications: [
      { en: "Carbon neutral production program", ja: "カーボンニュートラル生産プログラム" },
      { en: "Interior and mobility grade surface performance", ja: "インテリア・モビリティ向け表面性能" }
    ],
    maintenance: [
      {
        title: { en: "Care and Maintenance Guide", ja: "ケア・メンテナンスガイド" },
        description: { en: "Use and maintenance guidance for installed surfaces.", ja: "施工後の使用とメンテナンスのガイド。" }
      }
    ],
    seo: {
      title: { en: "Alcantara Panel | CAMARI JAPAN", ja: "Alcantara パネル | CAMARI JAPAN" },
      description: { en: "Technical data, certifications, and maintenance guidance for Alcantara panels.", ja: "Alcantara パネルの技術仕様、認証、メンテナンス情報。" },
      image: images.alcantara
    }
  },
  {
    slug: "automotive-nappa",
    materialSlug: "leather",
    name: { en: "Automotive Nappa", ja: "オートモーティブナッパ" },
    summary: {
      en: "Premium Nappa leather for automotive interiors. Supple hand, natural grain, and exceptional durability for seating and trim.",
      ja: "自動車内装向けプレミアムナッパレザー。しなやかな手触り、自然な木目、優れた耐久性。"
    },
    downloads: [],
    specTemplate: [
      { key: "unit", label: { en: "UNIT", ja: "単位" }, aliases: ["unit"] },
      { key: "code", label: { en: "CODE", ja: "コード" }, aliases: ["code"] },
      { key: "grain", label: { en: "GRAIN", ja: "木目" }, aliases: ["grain"] },
      { key: "thickness", label: { en: "THICKNESS", ja: "厚み" }, aliases: ["thickness"] }
    ],
    certifications: [],
    maintenance: [],
    seo: {
      title: { en: "Automotive Nappa | CAMARI JAPAN", ja: "オートモーティブナッパ | CAMARI JAPAN" },
      description: { en: "Premium Nappa leather for automotive interiors.", ja: "自動車内装向けプレミアムナッパレザー。" },
      image: images.interior
    }
  },
  {
    slug: "verona",
    materialSlug: "leather",
    name: { en: "Verona", ja: "ヴェローナ" },
    summary: {
      en: "Verona leather with a refined matte finish and soft touch. Ideal for luxury interiors and bespoke upholstery.",
      ja: "洗練されたマット仕上げとソフトなタッチのヴェローナレザー。ラグジュアリーインテリアと特注張り地に最適。"
    },
    downloads: [],
    specTemplate: [
      { key: "unit", label: { en: "UNIT", ja: "単位" }, aliases: ["unit"] },
      { key: "code", label: { en: "CODE", ja: "コード" }, aliases: ["code"] },
      { key: "grain", label: { en: "GRAIN", ja: "木目" }, aliases: ["grain"] },
      { key: "thickness", label: { en: "THICKNESS", ja: "厚み" }, aliases: ["thickness"] }
    ],
    certifications: [],
    maintenance: [],
    seo: {
      title: { en: "Verona Leather | CAMARI JAPAN", ja: "ヴェローナレザー | CAMARI JAPAN" },
      description: { en: "Verona leather with refined matte finish and soft touch.", ja: "洗練されたマット仕上げのヴェローナレザー。" },
      image: images.alcantaraSoft
    }
  },
  {
    slug: "roma",
    materialSlug: "leather",
    name: { en: "Roma", ja: "ローマ" },
    summary: {
      en: "Roma leather with a rich, saturated finish and architectural grain. Designed for statement interiors and product surfaces.",
      ja: "深みのある発色と建築的な木目を持つローマレザー。印象的なインテリアとプロダクト表面のためにデザイン。"
    },
    downloads: [],
    specTemplate: [
      { key: "unit", label: { en: "UNIT", ja: "単位" }, aliases: ["unit"] },
      { key: "code", label: { en: "CODE", ja: "コード" }, aliases: ["code"] },
      { key: "grain", label: { en: "GRAIN", ja: "木目" }, aliases: ["grain"] },
      { key: "thickness", label: { en: "THICKNESS", ja: "厚み" }, aliases: ["thickness"] }
    ],
    certifications: [],
    maintenance: [],
    seo: {
      title: { en: "Roma Leather | CAMARI JAPAN", ja: "ローマレザー | CAMARI JAPAN" },
      description: { en: "Roma leather with rich saturated finish and architectural grain.", ja: "深みのある発色と建築的な木目のローマレザー。" },
      image: images.alcantara
    }
  },
  {
    slug: "heritage",
    materialSlug: "leather",
    name: { en: "Heritage", ja: "ヘリテージ" },
    summary: {
      en: "Heritage leather crafted with traditional tanning methods. Develops a distinctive patina over time, celebrating natural markings and authentic character.",
      ja: "伝統的な鞣し製法で作られたヘリテージレザー。時を経て独特のパティナを醸成し、自然な風合いと本物の個性を称えます。"
    },
    downloads: [],
    specTemplate: [
      { key: "unit", label: { en: "UNIT", ja: "単位" }, aliases: ["unit"] },
      { key: "code", label: { en: "CODE", ja: "コード" }, aliases: ["code"] },
      { key: "grain", label: { en: "GRAIN", ja: "木目" }, aliases: ["grain"] },
      { key: "thickness", label: { en: "THICKNESS", ja: "厚み" }, aliases: ["thickness"] }
    ],
    certifications: [],
    maintenance: [],
    seo: {
      title: { en: "Heritage Leather | CAMARI JAPAN", ja: "ヘリテージレザー | CAMARI JAPAN" },
      description: { en: "Heritage leather with traditional tanning and distinctive patina.", ja: "伝統的な鞣しと独特のパティナを持つヘリテージレザー。" },
      image: images.outdoor
    }
  },
  {
    slug: "vegan-leather-panel",
    materialSlug: "vegan-leather",
    name: { en: "Vegan Leather Panel", ja: "ヴィーガンレザーパネル" },
    summary: {
      en: "Sustainable vegan leather panel with matte finish and micro-texture. High-performance alternative for contemporary interiors and product surfaces.",
      ja: "マット仕上げとマイクロテクスチャを持つサステナブルなヴィーガンレザーパネル。現代的なインテリアとプロダクト表面のための高性能な選択肢。"
    },
    downloads: [],
    specTemplate: [
      { key: "unit", label: { en: "UNIT", ja: "単位" }, aliases: ["unit"] },
      { key: "code", label: { en: "CODE", ja: "コード" }, aliases: ["code"] },
      { key: "finish", label: { en: "FINISH", ja: "仕上げ" }, aliases: ["finish"] },
      { key: "thickness", label: { en: "THICKNESS", ja: "厚み" }, aliases: ["thickness"] }
    ],
    certifications: [],
    maintenance: [],
    seo: {
      title: { en: "Vegan Leather Panel | CAMARI JAPAN", ja: "ヴィーガンレザーパネル | CAMARI JAPAN" },
      description: { en: "Technical data and care guidance for vegan leather panels.", ja: "ヴィーガンレザーパネルの技術仕様とケア情報。" },
      image: images.vegan
    }
  },
  {
    slug: "fabric-panel",
    materialSlug: "fabric",
    name: { en: "Fabric Panel", ja: "ファブリックパネル" },
    summary: {
      en: "Architectural fabric panel for interior, hospitality, and workspace applications. Washi, linen, and technical weaves with acoustic softness.",
      ja: "インテリア、ホスピタリティ、ワークスペース向けの建築的ファブリックパネル。和紙、リネン、テクニカル織りが吸音性と空間の余白を両立。"
    },
    downloads: [],
    specTemplate: [
      { key: "unit", label: { en: "UNIT", ja: "単位" }, aliases: ["unit"] },
      { key: "code", label: { en: "CODE", ja: "コード" }, aliases: ["code"] },
      { key: "composition", label: { en: "COMPOSITION", ja: "組成" }, aliases: ["composition"] },
      { key: "width", label: { en: "WIDTH", ja: "幅" }, aliases: ["width"] }
    ],
    certifications: [],
    maintenance: [],
    seo: {
      title: { en: "Fabric Panel | CAMARI JAPAN", ja: "ファブリックパネル | CAMARI JAPAN" },
      description: { en: "Technical data and maintenance guidance for fabric panels.", ja: "ファブリックパネルの技術仕様とメンテナンス情報。" },
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
    colorName: { en: "Obsidian", ja: "オブシディアン" },
    hex: "#1A1A1A",
    image: images.vegan,
    summary: {
      en: "Deep matte black vegan leather with micro-texture surface. High abrasion resistance for product panels and consumer electronics.",
      ja: "マイクロテクスチャ表面を持つ深いマットブラックのヴィーガンレザー。プロダクトパネルおよびコンシューマー機器向けの高い耐摩耗性。"
    },
    specs: [
      { label: { en: "Unit", ja: "単位" }, value: { en: "Meters", ja: "メートル" } },
      { label: { en: "Code", ja: "コード" }, value: { en: "VL-MTT-8801", ja: "VL-MTT-8801" } },
      { label: { en: "Composition", ja: "組成" }, value: { en: "PU face, recycled polyester backing", ja: "PU 表面、リサイクルポリエステル裏地" } },
      { label: { en: "Width", ja: "幅" }, value: { en: "140 cm", ja: "140 cm" } }
    ],
    certifications: [
      { en: "OEKO-TEX Standard 100 certified", ja: "エコテックス スタンダード 100 認証" },
      { en: "Recycled content minimum 40%", ja: "リサイクル含有率 最低 40%" }
    ],
    downloads: [
      {
        title: { en: "Vegan Leather Performance Data", ja: "ヴィーガンレザー性能データ" },
        description: { en: "Abrasion, UV, and hydrolytic stability test results.", ja: "耐摩耗性、紫外線、耐加水分解性の試験結果。" },
        href: "/catalogs/vegan-leather-performance.pdf",
        type: "technical"
      }
    ],
    seo: {
      title: { en: "VL-MTT-8801 Obsidian | CAMARI JAPAN", ja: "VL-MTT-8801 オブシディアン | CAMARI JAPAN" },
      description: {
        en: "Matte black vegan leather with micro-texture for product and electronics applications.",
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
    colorName: { en: "Terracotta", ja: "テラコッタ" },
    hex: "#C1664B",
    image: images.outdoor,
    summary: {
      en: "Soft-touch vegan leather in warm terracotta. Smooth finish with subtle sheen for interior accessories and fashion applications.",
      ja: "ウォームテラコッタのソフトタッチヴィーガンレザー。インテリアアクセサリーおよびファッション用途向けの、控えめな光沢を持つスムース仕上げ。"
    },
    specs: [
      { label: { en: "Unit", ja: "単位" }, value: { en: "Meters", ja: "メートル" } },
      { label: { en: "Code", ja: "コード" }, value: { en: "VL-SFT-5520", ja: "VL-SFT-5520" } },
      { label: { en: "Composition", ja: "組成" }, value: { en: "PU face, cotton backing", ja: "PU 表面、コットン裏地" } },
      { label: { en: "Width", ja: "幅" }, value: { en: "138 cm", ja: "138 cm" } }
    ],
    certifications: [
      { en: "OEKO-TEX Standard 100 certified", ja: "エコテックス スタンダード 100 認証" }
    ],
    downloads: [],
    seo: {
      title: { en: "VL-SFT-5520 Terracotta | CAMARI JAPAN", ja: "VL-SFT-5520 テラコッタ | CAMARI JAPAN" },
      description: {
        en: "Soft-touch vegan leather in warm terracotta for interior and fashion use.",
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
    colorName: { en: "Washi Ivory", ja: "和紙アイボリー" },
    hex: "#F2EFE9",
    image: images.fabric,
    summary: {
      en: "Japanese washi paper weave with metallic gold thread accent. Light-filtering and acoustically soft for hospitality and residential interiors.",
      ja: "金属的な金糸のアクセントを持つ和紙織り。光を透過し吸音性に優れ、ホスピタリティおよび住宅インテリアに最適。"
    },
    specs: [
      { label: { en: "Unit", ja: "単位" }, value: { en: "Meters", ja: "メートル" } },
      { label: { en: "Code", ja: "コード" }, value: { en: "F-WSH-1120", ja: "F-WSH-1120" } },
      { label: { en: "Composition", ja: "組成" }, value: { en: "60% Washi, 40% Polyester", ja: "和紙 60%、ポリエステル 40%" } },
      { label: { en: "Width", ja: "幅" }, value: { en: "150 cm", ja: "150 cm" } }
    ],
    certifications: [
      { en: "Japanese washi paper certified origin", ja: "日本産和紙認証" }
    ],
    downloads: [
      {
        title: { en: "Fabric Collection Lookbook", ja: "ファブリックコレクションルックブック" },
        description: { en: "Washi, linen, and technical weave catalog.", ja: "和紙、リネン、テクニカル織りのカタログ。" },
        href: "/catalogs/fabric-collection-lookbook.pdf",
        type: "catalog"
      }
    ],
    seo: {
      title: { en: "F-WSH-1120 Washi Ivory | CAMARI JAPAN", ja: "F-WSH-1120 和紙アイボリー | CAMARI JAPAN" },
      description: {
        en: "Japanese washi paper weave fabric in ivory with gold thread for hospitality and residential use.",
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
    colorName: { en: "Charcoal Linen", ja: "チャコールリネン" },
    hex: "#3A3A3A",
    image: images.alcantara,
    summary: {
      en: "Belgian linen blend in charcoal with slub texture. Breathable and naturally fire-retardant for workspace and retail environments.",
      ja: "スラブテクスチャを持つチャコールのベルギーリネン混紡。通気性があり自然難燃性で、ワークスペースおよびリテール環境に適しています。"
    },
    specs: [
      { label: { en: "Unit", ja: "単位" }, value: { en: "Meters", ja: "メートル" } },
      { label: { en: "Code", ja: "コード" }, value: { en: "F-LNN-2801", ja: "F-LNN-2801" } },
      { label: { en: "Composition", ja: "組成" }, value: { en: "55% Linen, 45% Cotton", ja: "リネン 55%、コットン 45%" } },
      { label: { en: "Width", ja: "幅" }, value: { en: "145 cm", ja: "145 cm" } }
    ],
    certifications: [
      { en: "European Flax certified", ja: "ヨーロピアンフラックス認証" },
      { en: "Naturally fire-retardant", ja: "自然難燃性" }
    ],
    downloads: [],
    seo: {
      title: { en: "F-LNN-2801 Charcoal Linen | CAMARI JAPAN", ja: "F-LNN-2801 チャコールリネン | CAMARI JAPAN" },
      description: {
        en: "Belgian linen blend in charcoal with slub texture for workspace and retail use.",
        ja: "ワークスペースおよびリテール向けスラブテクスチャチャコールのベルギーリネン混紡。"
      },
      image: images.alcantara
    }
  }
];

export const productTypes: ProductType[] = mergeBySlug(
  fixtureProductTypes,
  (generatedCatalog.productTypes ?? []) as ProductType[]
);

export const skus: Sku[] = mergeSkusByProductType(
  fixtureSkus,
  (generatedCatalog.skus ?? []) as Sku[]
);

export const projectCases: ProjectCase[] = [
  {
    slug: "private-automotive-cabin",
    title: { en: "Private Automotive Cabin", ja: "プライベートオートモーティブキャビン" },
    industry: { en: "Automotive", ja: "自動車" },
    image: images.alcantara,
    projectImages: [images.alcantara],
    summary: {
      en: "A restrained cabin material program using deep Alcantara surfaces and precision panel transitions.",
      ja: "深い Alcantara サーフェスと精密なパネル遷移で構成した、抑制されたキャビンプログラム。"
    },
    materialSlug: "alcantara",
    linkedMaterials: [{ slug: "alcantara", name: { en: "Alcantara", ja: "アルカンターラ" } }],
    linkedArticles: [{ slug: "alcantara-panel", materialSlug: "alcantara", name: { en: "Alcantara Panel", ja: "Alcantara パネル" } }],
    seo: {
      title: { en: "Private Automotive Cabin | CAMARI JAPAN", ja: "プライベートオートモーティブキャビン | CAMARI JAPAN" },
      description: {
        en: "OEM/ODM automotive material case using Alcantara surfaces.",
        ja: "Alcantara サーフェスを用いた OEM/ODM 自動車素材事例。"
      },
      image: images.alcantara
    }
  },
  {
    slug: "hospitality-lounge-surface",
    title: { en: "Hospitality Lounge Surface", ja: "ホスピタリティラウンジサーフェス" },
    industry: { en: "Interior", ja: "インテリア" },
    image: images.interior,
    projectImages: [images.interior],
    summary: {
      en: "Warm stone palettes, tactile panels, and quiet upholstery for an intimate lounge environment.",
      ja: "ウォームストーンの色調、触感のあるパネル、静かな張地で構成したラウンジ空間。"
    },
    materialSlug: "alcantara",
    linkedMaterials: [{ slug: "alcantara", name: { en: "Alcantara", ja: "アルカンターラ" } }],
    linkedArticles: [{ slug: "alcantara-panel", materialSlug: "alcantara", name: { en: "Alcantara Panel", ja: "Alcantara パネル" } }],
    seo: {
      title: { en: "Hospitality Lounge Surface | CAMARI JAPAN", ja: "ホスピタリティラウンジサーフェス | CAMARI JAPAN" },
      description: {
        en: "Interior material case for premium hospitality environments.",
        ja: "プレミアムホスピタリティ空間向けのインテリア素材事例。"
      },
      image: images.interior
    }
  }
];

export const newsItems: NewsItem[] = [
  {
    slug: "new-material-study",
    title: { en: "New Material Study for Quiet Luxury Interiors", ja: "静かなラグジュアリー空間に向けた新素材研究" },
    category: { en: "Material", ja: "素材" },
    date: "2026-05-12",
    image: images.fabric,
    summary: {
      en: "A short editorial note on texture, restraint, and how surfaces guide perception in premium spaces.",
      ja: "質感、抑制、そして上質な空間におけるサーフェスの知覚についての編集ノート。"
    },
    seo: {
      title: { en: "New Material Study | CAMARI JAPAN", ja: "新素材研究 | CAMARI JAPAN" },
      description: {
        en: "Material research notes from CAMARI JAPAN.",
        ja: "CAMARI JAPAN の素材研究ノート。"
      },
      image: images.fabric
    }
  }
];

export const catalogs: Download[] = [
  {
    title: { en: "CAMARI Material Catalog", ja: "CAMARI 素材カタログ" },
    description: {
      en: "A PDF overview of the core material collection, applications, and contact details.",
      ja: "主要素材コレクション、用途、連絡先をまとめた PDF カタログ。"
    },
    href: "/catalogs/camari-material-catalog.pdf",
    type: "catalog"
  },
  {
    title: { en: "Alcantara Technical Sheet", ja: "Alcantara 技術資料" },
    description: {
      en: "Technical specifications for selected Alcantara articles and colors.",
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
