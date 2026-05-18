import type { Locale } from "./locales";
import generatedCatalog from "../data/product-catalog.generated.json" with { type: "json" };

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
  summary: LocalizedString;
  materialSlug: string;
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

function mergeBySlug<T extends { slug: string }>(defaults: T[], imported: T[]): T[] {
  const merged = new Map(defaults.map((item) => [item.slug, item]));
  for (const item of imported) {
    merged.set(item.slug, item);
  }
  return [...merged.values()];
}

function mergeSkusByProductType(defaults: Sku[], imported: Sku[]): Sku[] {
  const importedProductTypes = new Set(imported.map((sku) => sku.productTypeSlug));
  const retainedDefaults = defaults.filter((sku) => !importedProductTypes.has(sku.productTypeSlug));
  return [...retainedDefaults, ...imported];
}

export const site = {
  name: "CAMARI JAPAN",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://camari-japan.example.com",
  slogan: {
    en: "The Intersection of Texture and Precision",
    ja: "質感と精密さの交差点"
  },
  description: {
    en: "Premium materials, Alcantara collections, and OEM/ODM surfaces for refined automotive, interior, and product spaces.",
    ja: "上質な素材、Alcantara コレクション、OEM/ODM による空間・車両・プロダクト向けサーフェス。"
  },
  contact: {
    email: "contact@camari.jp",
    phone: "+81 3 0000 0000",
    address: {
      en: "Tokyo showroom by appointment",
      ja: "東京ショールーム 予約制"
    }
  }
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
        title: { en: "Applied Precision", ja: "応用される精密性" },
        category: { en: "Product — ODM", ja: "Product — ODM" },
        description: {
          en: "Case-led development from concept, material matching, and surface execution.",
          ja: "コンセプト、素材選定、サーフェス実装までのケース主導型開発。"
        },
        image: images.interior,
        href: "/projects"
      }
    ]
  }
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
  {
    slug: "leather",
    name: { en: "Leather", ja: "レザー" },
    tagline: { en: "Natural depth and architectural warmth", ja: "自然な奥行きと建築的な温度" },
    description: {
      en: "Premium hides and finishes for bespoke interior and mobility programs.",
      ja: "特注インテリアとモビリティ開発に向けたプレミアムレザー。"
    },
    coverImage: images.interior,
    accent: "#2A4386"
  }
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
      en: "Born at the intersection of avant-garde technology and artisanal heritage, Alcantara is a carbon-neutral canvas for contemporary luxury that balances softness, performance, and architectural control.",
      ja: "先端技術と職人性の交点から生まれた Alcantara は、柔らかさ、性能、建築的な抑制を兼ね備えたカーボンニュートラルなラグジュアリー素材です。"
    },
    introImage: images.interior,
    quote: {
      en: "Alcantara transforms the experience of touch into an architectural statement.",
      ja: "Alcantara は触れる体験を、空間の意思へと変える。"
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
    slug: "leather",
    categorySlug: "leather",
    name: { en: "Leather", ja: "レザー" },
    eyebrow: { en: "Full-Grain Collection", ja: "フルグレインコレクション" },
    heroTitle: { en: "Leather", ja: "Leather" },
    heroSubtitle: { en: "Natural depth and architectural warmth", ja: "自然な奥行きと建築的な温度" },
    heroImage: images.interior,
    introTitle: { en: "The Character of Natural Grain", ja: "天然の木目が持つ個性" },
    introBody: {
      en: "Premium full-grain and top-grain hides selected for their supple hand, natural markings, and ability to patina with intention. Each hide carries the trace of its origin, bringing warmth and presence to cabins, lounges, and bespoke product programs.",
      ja: "しなやかな手触り、自然な風合い、意図を持った経年変化のために選ばれたプレミアムフルグレインおよびトップグレインレザー。一枚一枚がその起源の痕跡を持ち、キャビン、ラウンジ、特注プロダクトに温もりと存在感をもたらします。"
    },
    introImage: images.alcantaraSoft,
    quote: {
      en: "Leather is not a surface. It is a record of time.",
      ja: "レザーは表面ではない。それは時間の記録である。"
    },
    applications: [
      { slug: "automotive", name: { en: "Automotive", ja: "自動車" }, colorCount: 42, image: images.interior },
      { slug: "interior", name: { en: "Interior", ja: "インテリア" }, colorCount: 55, image: images.alcantaraSoft },
      { slug: "product", name: { en: "Product Design", ja: "プロダクトデザイン" }, colorCount: 28, image: images.alcantara },
      { slug: "marine", name: { en: "Marine", ja: "マリン" }, colorCount: 18, image: images.outdoor }
    ],
    seo: {
      title: { en: "Leather Materials | CAMARI JAPAN", ja: "レザー素材 | CAMARI JAPAN" },
      description: {
        en: "Full-grain and top-grain leather collections for automotive, interior, and bespoke product applications.",
        ja: "自動車、インテリア、特注プロダクト向けのフルグレインおよびトップグレインレザーコレクション。"
      },
      image: images.interior
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
    slug: "leather-panel",
    materialSlug: "leather",
    name: { en: "Leather Panel", ja: "レザーパネル" },
    summary: {
      en: "Full-grain leather panel for automotive interiors, seating, and bespoke upholstery. Natural grain with supple hand and architectural warmth.",
      ja: "自動車内装、シート、特注張り地向けのフルグレインレザーパネル。自然な木目としなやかな手触り。"
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
      title: { en: "Leather Panel | CAMARI JAPAN", ja: "レザーパネル | CAMARI JAPAN" },
      description: { en: "Technical data and finish guidance for leather panels.", ja: "レザーパネルの技術仕様と仕上げガイダンス。" },
      image: images.interior
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
  {
    slug: "c-alc-4991-shadow-black",
    materialSlug: "alcantara",
    productTypeSlug: "alcantara-panel",
    code: "C-ALC-4991",
    colorName: { en: "Shadow Black", ja: "シャドウブラック" },
    hex: "#1A1A1A",
    image: images.sku,
    caseGallery: [
      { image: images.interior, alt: { en: "Shadow Black applied in a lounge chair detail", ja: "ラウンジチェアに使用されたシャドウブラックのディテール" } },
      { image: images.alcantara, alt: { en: "Shadow Black material in an automotive cabin", ja: "車両キャビンで使用されたシャドウブラック素材" } }
    ],
    summary: {
      en: "A deep charcoal tone with refined nap movement for automotive cabins, product panels, and quiet hospitality interiors.",
      ja: "車両キャビン、プロダクトパネル、静謐なホスピタリティ空間に適した、深いチャコールカラー。"
    },
    specs: [
      { label: { en: "Thickness", ja: "厚み" }, value: { en: "0.95 mm", ja: "0.95 mm" } },
      { label: { en: "Unit Weight", ja: "単位重量" }, value: { en: "380 g/m2", ja: "380 g/m2" } },
      { label: { en: "Width", ja: "幅" }, value: { en: "142 cm", ja: "142 cm" } },
      { label: { en: "Breaking Load", ja: "破断荷重" }, value: { en: "Warp 420 N / Weft 350 N", ja: "タテ 420 N / ヨコ 350 N" } },
      { label: { en: "Wear Resistance", ja: "耐摩耗性" }, value: { en: "Martindale 100,000 cycles", ja: "マーチンデール 100,000 回" } },
      { label: { en: "To Light", ja: "耐光性" }, value: { en: "Blue scale 5", ja: "ブルースケール 5 級" } },
      { label: { en: "To Rubbings", ja: "摩擦堅牢度" }, value: { en: "Dry 4.5 / Wet 4", ja: "乾燥 4.5 / 湿潤 4" } },
      { label: { en: "FR Version", ja: "FR 仕様" }, value: { en: "Available on request", ja: "ご要望に応じて対応" } }
    ],
    certifications: [
      { en: "Carbon neutral production program", ja: "カーボンニュートラル生産プログラム" },
      { en: "Interior and mobility grade surface performance", ja: "インテリア・モビリティ向け表面性能" }
    ],
    downloads: [
      {
        title: { en: "Alcantara Technical Sheet", ja: "Alcantara 技術資料" },
        description: { en: "Composition, width, care, and performance notes.", ja: "組成、幅、ケア、性能情報。" },
        href: "/catalogs/alcantara-technical-sheet.pdf",
        type: "technical"
      },
      {
        title: { en: "Care and Maintenance Guide", ja: "ケア・メンテナンスガイド" },
        description: { en: "Use and maintenance guidance for installed surfaces.", ja: "施工後の使用とメンテナンスのガイド。" },
        href: "/catalogs/alcantara-care-guide.pdf",
        type: "care"
      }
    ],
    seo: {
      title: { en: "C-ALC-4991 Shadow Black | CAMARI JAPAN", ja: "C-ALC-4991 シャドウブラック | CAMARI JAPAN" },
      description: {
        en: "View Shadow Black Alcantara specifications, downloads, and sales contact details.",
        ja: "シャドウブラック Alcantara の仕様、資料、問い合わせ先をご覧ください。"
      },
      image: images.sku
    }
  },
  {
    slug: "c-alc-735b-umber-brown",
    materialSlug: "alcantara",
    productTypeSlug: "alcantara-panel",
    code: "C-ALC-735B",
    colorName: { en: "Umber Brown", ja: "アンバーブラウン" },
    hex: "#735B33",
    image: images.alcantaraSoft,
    summary: {
      en: "A warm brown shade for refined lounge interiors and tactile product applications.",
      ja: "上質なラウンジ空間と触感を重視したプロダクトに向けた温かみのあるブラウン。"
    },
    specs: [
      { label: { en: "Thickness", ja: "厚み" }, value: { en: "0.95 mm", ja: "0.95 mm" } },
      { label: { en: "Unit Weight", ja: "単位重量" }, value: { en: "380 g/m2", ja: "380 g/m2" } },
      { label: { en: "Width", ja: "幅" }, value: { en: "142 cm", ja: "142 cm" } },
      { label: { en: "Breaking Load", ja: "破断荷重" }, value: { en: "Warp 420 N / Weft 350 N", ja: "タテ 420 N / ヨコ 350 N" } },
      { label: { en: "Wear Resistance", ja: "耐摩耗性" }, value: { en: "Martindale 100,000 cycles", ja: "マーチンデール 100,000 回" } },
      { label: { en: "To Light", ja: "耐光性" }, value: { en: "Blue scale 5", ja: "ブルースケール 5 級" } },
      { label: { en: "To Rubbings", ja: "摩擦堅牢度" }, value: { en: "Dry 4.5 / Wet 4", ja: "乾燥 4.5 / 湿潤 4" } },
      { label: { en: "FR Version", ja: "FR 仕様" }, value: { en: "Available on request", ja: "ご要望に応じて対応" } }
    ],
    certifications: [{ en: "Interior grade surface performance", ja: "インテリア向け表面性能" }],
    downloads: [],
    seo: {
      title: { en: "C-ALC-735B Umber Brown | CAMARI JAPAN", ja: "C-ALC-735B アンバーブラウン | CAMARI JAPAN" },
      description: {
        en: "View Umber Brown Alcantara color and specification details.",
        ja: "アンバーブラウン Alcantara のカラーと仕様をご覧ください。"
      },
      image: images.alcantaraSoft
    }
  },
  {
    slug: "c-alc-a68a-desert-sand",
    materialSlug: "alcantara",
    productTypeSlug: "alcantara-panel",
    code: "C-ALC-A68A",
    colorName: { en: "Desert Sand", ja: "デザートサンド" },
    hex: "#A68A5E",
    image: images.interior,
    summary: {
      en: "A quiet sand tone that softens architectural environments without losing technical precision.",
      ja: "建築空間を柔らかく整えながら、技術的な精密さを保つ静かなサンドカラー。"
    },
    specs: [
      { label: { en: "Thickness", ja: "厚み" }, value: { en: "0.95 mm", ja: "0.95 mm" } },
      { label: { en: "Unit Weight", ja: "単位重量" }, value: { en: "380 g/m2", ja: "380 g/m2" } },
      { label: { en: "Width", ja: "幅" }, value: { en: "142 cm", ja: "142 cm" } },
      { label: { en: "Breaking Load", ja: "破断荷重" }, value: { en: "Warp 420 N / Weft 350 N", ja: "タテ 420 N / ヨコ 350 N" } },
      { label: { en: "Wear Resistance", ja: "耐摩耗性" }, value: { en: "Martindale 100,000 cycles", ja: "マーチンデール 100,000 回" } },
      { label: { en: "To Light", ja: "耐光性" }, value: { en: "Blue scale 5", ja: "ブルースケール 5 級" } },
      { label: { en: "To Rubbings", ja: "摩擦堅牢度" }, value: { en: "Dry 4.5 / Wet 4", ja: "乾燥 4.5 / 湿潤 4" } },
      { label: { en: "FR Version", ja: "FR 仕様" }, value: { en: "Available on request", ja: "ご要望に応じて対応" } }
    ],
    certifications: [{ en: "Carbon neutral production program", ja: "カーボンニュートラル生産プログラム" }],
    downloads: [],
    seo: {
      title: { en: "C-ALC-A68A Desert Sand | CAMARI JAPAN", ja: "C-ALC-A68A デザートサンド | CAMARI JAPAN" },
      description: {
        en: "View Desert Sand Alcantara color and specification details.",
        ja: "デザートサンド Alcantara のカラーと仕様をご覧ください。"
      },
      image: images.interior
    }
  },
  // Leather SKUs
  {
    slug: "l-ftg-2101-ebony-black",
    materialSlug: "leather",
    productTypeSlug: "leather-panel",
    code: "L-FTG-2101",
    colorName: { en: "Ebony Black", ja: "エボニーブラック" },
    hex: "#1C1B1B",
    image: images.interior,
    summary: {
      en: "Full-grain aniline leather in deep black with natural grain visible under low light. Suited for luxury automotive cabins and executive interiors.",
      ja: "低光量下で自然な木目が見えるディープブラックのフルグレインアニリンレザー。ラグジュアリー自動車キャビンおよびエグゼクティブインテリアに最適。"
    },
    specs: [
      { label: { en: "Unit", ja: "単位" }, value: { en: "Square meters", ja: "平方メートル" } },
      { label: { en: "Code", ja: "コード" }, value: { en: "L-FTG-2101", ja: "L-FTG-2101" } },
      { label: { en: "Grain", ja: "木目" }, value: { en: "Full-grain aniline", ja: "フルグレインアニリン" } },
      { label: { en: "Thickness", ja: "厚さ" }, value: { en: "1.2–1.4 mm", ja: "1.2–1.4 mm" } }
    ],
    certifications: [
      { en: "Automotive-grade abrasion resistance", ja: "自動車グレード耐摩耗性" },
      { en: "European tannery traceability protocol", ja: "欧州タンナリー追跡プロトコル" }
    ],
    downloads: [
      {
        title: { en: "Leather Grade Guide", ja: "レザーグレードガイド" },
        description: { en: "Full-grain, top-grain, and finish comparisons.", ja: "フルグレイン、トップグレイン、仕上げの比較。" },
        href: "/catalogs/leather-grade-guide.pdf",
        type: "technical"
      }
    ],
    seo: {
      title: { en: "L-FTG-2101 Ebony Black | CAMARI JAPAN", ja: "L-FTG-2101 エボニーブラック | CAMARI JAPAN" },
      description: {
        en: "Full-grain aniline leather in deep black for luxury automotive and interior applications.",
        ja: "ラグジュアリー自動車およびインテリア向けディープブラックのフルグレインアニリンレザー。"
      },
      image: images.interior
    }
  },
  {
    slug: "l-tpg-3345-cognac",
    materialSlug: "leather",
    productTypeSlug: "leather-panel",
    code: "L-TPG-3345",
    colorName: { en: "Cognac", ja: "コニャック" },
    hex: "#8B5E3C",
    image: images.alcantaraSoft,
    summary: {
      en: "Top-grain semi-aniline leather in warm cognac tones. Balanced hand-feel with UV-stable pigment for hospitality and residential seating.",
      ja: "ウォームコニャックトーンのトップグレインセミアニリンレザー。ホスピタリティおよび住宅用シート向けに、バランスの良い手触りと UV 安定顔料を採用。"
    },
    specs: [
      { label: { en: "Unit", ja: "単位" }, value: { en: "Square meters", ja: "平方メートル" } },
      { label: { en: "Code", ja: "コード" }, value: { en: "L-TPG-3345", ja: "L-TPG-3345" } },
      { label: { en: "Grain", ja: "木目" }, value: { en: "Top-grain semi-aniline", ja: "トップグレインセミアニリン" } },
      { label: { en: "Thickness", ja: "厚さ" }, value: { en: "1.0–1.2 mm", ja: "1.0–1.2 mm" } }
    ],
    certifications: [
      { en: "UV-stable pigment finish", ja: "紫外線安定顔料仕上げ" }
    ],
    downloads: [],
    seo: {
      title: { en: "L-TPG-3345 Cognac | CAMARI JAPAN", ja: "L-TPG-3345 コニャック | CAMARI JAPAN" },
      description: {
        en: "Top-grain semi-aniline leather in warm cognac for hospitality and residential use.",
        ja: "ホスピタリティおよび住宅用のウォームコニャックトップグレインセミアニリンレザー。"
      },
      image: images.alcantaraSoft
    }
  },
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
    summary: {
      en: "A restrained cabin material program using deep Alcantara surfaces and precision panel transitions.",
      ja: "深い Alcantara サーフェスと精密なパネル遷移で構成した、抑制されたキャビンプログラム。"
    },
    materialSlug: "alcantara",
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
    summary: {
      en: "Warm stone palettes, tactile panels, and quiet upholstery for an intimate lounge environment.",
      ja: "ウォームストーンの色調、触感のあるパネル、静かな張地で構成したラウンジ空間。"
    },
    materialSlug: "alcantara",
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
