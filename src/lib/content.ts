import type { Locale } from "./locales";

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

export type Sku = {
  slug: string;
  materialSlug: string;
  code: string;
  colorName: LocalizedString;
  hex: string;
  image: string;
  swatchImage?: string;
  caseGallery?: Array<{ image: string; alt: LocalizedString }>;
  summary: LocalizedString;
  specs: Array<{ label: LocalizedString; value: LocalizedString }>;
  certifications: LocalizedString[];
  downloads: Download[];
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
      { slug: "interior", name: { en: "Interior", ja: "インテリア" }, colorCount: 76, image: images.interior },
      { slug: "outdoor", name: { en: "Outdoor", ja: "アウトドア" }, colorCount: 14, image: images.outdoor },
      { slug: "electronics", name: { en: "Consumer Electronics", ja: "コンシューマー機器" }, colorCount: 20, image: images.vegan }
    ],
    seo: {
      title: { en: "Alcantara Materials | CAMARI JAPAN", ja: "Alcantara 素材 | CAMARI JAPAN" },
      description: {
        en: "Explore Alcantara applications, performance, colors, and technical downloads for premium interiors and mobility.",
        ja: "プレミアムインテリアとモビリティ向け Alcantara の用途、性能、カラー、技術資料を紹介します。"
      },
      image: images.alcantara
    }
  }
];

export const skus: Sku[] = [
  {
    slug: "c-alc-4991-shadow-black",
    materialSlug: "alcantara",
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
      { label: { en: "Unit", ja: "単位" }, value: { en: "Meters", ja: "メートル" } },
      { label: { en: "Code", ja: "コード" }, value: { en: "C-ALC-4991", ja: "C-ALC-4991" } },
      { label: { en: "Composition", ja: "組成" }, value: { en: "68% Polyester, 32% Polyurethane", ja: "ポリエステル 68%、ポリウレタン 32%" } },
      { label: { en: "Width", ja: "幅" }, value: { en: "142 cm", ja: "142 cm" } }
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
    code: "C-ALC-735B",
    colorName: { en: "Umber Brown", ja: "アンバーブラウン" },
    hex: "#735B33",
    image: images.alcantaraSoft,
    summary: {
      en: "A warm brown shade for refined lounge interiors and tactile product applications.",
      ja: "上質なラウンジ空間と触感を重視したプロダクトに向けた温かみのあるブラウン。"
    },
    specs: [
      { label: { en: "Unit", ja: "単位" }, value: { en: "Meters", ja: "メートル" } },
      { label: { en: "Code", ja: "コード" }, value: { en: "C-ALC-735B", ja: "C-ALC-735B" } },
      { label: { en: "Composition", ja: "組成" }, value: { en: "68% Polyester, 32% Polyurethane", ja: "ポリエステル 68%、ポリウレタン 32%" } }
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
    code: "C-ALC-A68A",
    colorName: { en: "Desert Sand", ja: "デザートサンド" },
    hex: "#A68A5E",
    image: images.interior,
    summary: {
      en: "A quiet sand tone that softens architectural environments without losing technical precision.",
      ja: "建築空間を柔らかく整えながら、技術的な精密さを保つ静かなサンドカラー。"
    },
    specs: [
      { label: { en: "Unit", ja: "単位" }, value: { en: "Meters", ja: "メートル" } },
      { label: { en: "Code", ja: "コード" }, value: { en: "C-ALC-A68A", ja: "C-ALC-A68A" } }
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
  }
];

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

export function getSkusForMaterial(materialSlug: string): Sku[] {
  return skus.filter((sku) => sku.materialSlug === materialSlug);
}

export function getSku(materialSlug: string, skuSlug: string): Sku | undefined {
  return skus.find((sku) => sku.materialSlug === materialSlug && sku.slug === skuSlug);
}

export function getProject(slug: string): ProjectCase | undefined {
  return projectCases.find((project) => project.slug === slug);
}
