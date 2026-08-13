import type { HomePageSettings, Material, MaterialCategory } from "./content";

export const JAPANESE_PRODUCT_SURFACE_DESCRIPTION =
  "製品の用途や使い心地に合わせた最適なデザイン・加工をご提案します。";

const materialCategoryCopy: Record<
  string,
  Partial<Record<"description" | "tagline", string>>
> = {
  alcantara: {
    description:
      "スエードのような質感と優れた機能性を兼ね備えた、イタリア製プレミアム素材。",
    tagline: "イタリアの美意識と精密な技術が生み出す素材。",
  },
  leather: {
    description: "上品なマットな質感が魅力のイタリア製本革。",
    tagline: "イタリアで一貫生産された上質な本革。",
  },
  fabric: {
    description:
      "伝統技術が生み出す、クラシックカー向けの上質な内装素材。",
    tagline:
      "クラシックカーの魅力を受け継ぐ、高耐久な欧州製ファブリック。",
  },
  "vegan-leather": {
    description: "環境に配慮した次世代マイクロファイバーレザー。",
    tagline:
      "本革の質感と環境への配慮を両立した高機能マイクロファイバーレザー。",
  },
};

const materialDetailCopy: Record<
  string,
  Pick<Material, "introBody" | "introTitle" | "quote">
> = {
  alcantara: {
    introTitle: { en: "", ja: "イタリアの技術と美意識の融合" },
    introBody: {
      en: "",
      ja: "アルカンターラは、1972年にイタリアで誕生した独自素材です。上質な手触りと軽さ、耐久性、通気性などを兼ね備え、自動車やインテリア、ファッションなど幅広い分野で世界のトップブランドに採用されています。豊富なカラーや加工に対応し、多様なデザインを実現できることも特長です。また、カーボンニュートラル認証の継続やリサイクル素材の活用など、環境に配慮したものづくりにも取り組んでいます。",
    },
    quote: { en: "", ja: "" },
  },
  fabric: {
    introTitle: { en: "", ja: "名車にふさわしい品質" },
    introBody: {
      en: "",
      ja: "欧州クラシックカーの純正仕様を忠実に再現したファブリックです。千鳥格子やタータンチェック、ウールなど、多彩な生地を取り揃え、当時のインテリアを美しく再現します。現代の基準に対応した耐久性を備え、クラシックカーの価値を大切にしたレストアを支えます。",
    },
    quote: { en: "", ja: "" },
  },
  leather: {
    introTitle: { en: "", ja: "職人の技が息づくイタリア製本革" },
    introBody: {
      en: "",
      ja: "原皮の選定から鞣し、仕上げまで、熟練した職人の技術によってイタリア国内で一貫してつくられるレザーコレクションです。アニリンレザーやナッパレザー、ヴィンテージレザーなど、多彩なラインアップを展開し、家具や自動車、空間デザインなど、さまざまなシーンに上質な質感と高い耐久性をもたらします。",
    },
    quote: { en: "", ja: "" },
  },
};

export function applyJapaneseMaterialCategoryCopy(
  categories: MaterialCategory[],
): MaterialCategory[] {
  return categories.map((category) => {
    const copy = materialCategoryCopy[category.slug];

    if (!copy) {
      return category;
    }

    return {
      ...category,
      description: copy.description
        ? { ...category.description, ja: copy.description }
        : category.description,
      tagline: copy.tagline
        ? { ...category.tagline, ja: copy.tagline }
        : category.tagline,
    };
  });
}

export function applyJapaneseMaterialCopy(materials: Material[]): Material[] {
  return materials.map((material) => {
    const copy = materialDetailCopy[material.slug];

    if (!copy) {
      return material;
    }

    return {
      ...material,
      introTitle: { ...material.introTitle, ja: copy.introTitle.ja },
      introBody: { ...material.introBody, ja: copy.introBody.ja },
      quote: { ...material.quote, ja: copy.quote.ja },
    };
  });
}

export function applyJapaneseHomePageCopy(
  settings: HomePageSettings,
): HomePageSettings {
  return {
    ...settings,
    explore: {
      ...settings.explore,
      productSlides: settings.explore.productSlides.map((slide) =>
        slide.slug === "projects" || slide.href === "/products"
          ? {
              ...slide,
              description: {
                ...slide.description,
                ja: JAPANESE_PRODUCT_SURFACE_DESCRIPTION,
              },
            }
          : slide,
      ),
    },
  };
}
