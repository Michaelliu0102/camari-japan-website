import { chineseCopy } from "../china/copy";
import type { HomePageSettings, Material, MaterialCategory, ProductType } from "./content";
import type { ProductCategory } from "@/content/products/categories";
import productCategoryJapaneseContentData from "@/data/product-category-ja.json";
import { alignJapaneseDetails, requireUniqueMatch } from "./product-detail-localization";

export const JAPANESE_PRODUCT_SURFACE_DESCRIPTION =
  "製品の用途や使い心地に合わせた最適なデザイン・加工をご提案します。";

type ProductCategoryJapaneseContent = {
  title: string;
  subtitle: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  highlights: Array<{
    sourceTitle: string;
    title: string;
    body: string;
  }>;
  carouselItems: Array<{
    sourceTitle: string;
    title: string;
    customizedOption: string;
    description: string;
    details: Array<{ source: string; text: string }>;
  }>;
};

const productCategoryJapaneseContent = productCategoryJapaneseContentData as Record<
  string,
  ProductCategoryJapaneseContent
>;

export function applyJapaneseProductCategoryCopy(
  categories: ProductCategory[],
): ProductCategory[] {
  return categories.map((category) => {
    const copy = productCategoryJapaneseContent[category.slug];

    if (!copy) {
      return category;
    }

    return {
      ...category,
      title: { ...category.title, ja: copy.title },
      subtitle: { ...category.subtitle, ja: copy.subtitle },
      description: { ...category.description, ja: copy.description },
      highlights: category.highlights.map((highlight, index) => {
        const highlightCopy = copy.highlights[index];

        return highlightCopy
          ? {
              title: { ...highlight.title, ja: highlightCopy.title },
              body: { ...highlight.body, ja: highlightCopy.body },
            }
          : highlight;
      }),
      curvedCarouselImages: category.curvedCarouselImages?.map((item) => {
        const itemCopy = requireUniqueMatch(copy.carouselItems,
          candidate => candidate.sourceTitle === item.title.en,
          `${category.slug}/${item.title.en}`);

        return {
          ...item,
          title: { ...item.title, ja: itemCopy.title },
          description: { ...item.description, ja: itemCopy.description },
          customizedOption: {
            zh: chineseCopy(item.customizedOption?.en ?? ""), en: item.customizedOption?.en ?? "",
            ja: itemCopy.customizedOption,
          },
          details: alignJapaneseDetails(item.details, itemCopy.details, `${category.slug}/${item.title.en}`),
        };
      }),
    };
  });
}

export function getJapaneseProductCategorySeo(slug: string) {
  const copy = productCategoryJapaneseContent[slug];

  return copy
    ? { title: copy.seoTitle, description: copy.seoDescription }
    : undefined;
}

const leatherProductTypeJapaneseSummaries: Record<string, string> = {
  "automotive-nappa":
    "厳選したヨーロッパ産の牛革を、芯まで染め上げたレザーです。革本来の表情を生かした、柔らかくしなやかな手触りと、落ち着いたセミマットの質感が特徴。深みのある均一な色合いで、シートやステアリング、さまざまな内装パーツを上質に仕上げます。",
  roma:
    "ローマは、ヨーロッパ産の牛革を使用した家具用レザーです。クロムなめしとピグメント仕上げを施し、マスター外観基準への適合を前提に仕様を定めています。また、REACH要件に準拠して生産されています。",
  heritage:
    "ヘリテージは、ヨーロッパ産の牛革を使用した家具用レザーです。クロムなめしとアニリン仕上げにより、革本来の傷跡や模様を生かしています。使い込むほどに色や艶が深まり、一枚ごとに異なる表情を楽しめます。",
  linea:
    "リネアは、洗練された現代的なカラーを揃えたレザーです。革本来の上品な表情と美しい仕上がりに加え、耐久性と色堅牢度にも優れています。インテリアやデザイン製品、ファッション、ボートの内装など、幅広い用途に対応します。",
  aida:
    "アイーダは、ヨーロッパ産の上質な牛革を使ったナッパレザーです。オイルとワックスを加えたアニリン仕上げで、柔らかな手触りと、ほのかに濃淡のある表情が特徴です。わずかな色の違いや自然に残る跡も、革本来の魅力として楽しめます。",
  capri:
    "カプリは、傷やムラの少ない上質な牛革を厳選して作られたレザーです。繊細なセミアニリン仕上げが革本来の自然な表情を生かし、奥行きのある色合いと豊かな手触りを引き出します。流行に左右されない、上品さが特徴です。",
  classic:
    "クラシックコレクションは、ヨーロッパ産の上質なフルグレイン牛革を使用しています。天然オイルとワックスを用いた独自の仕上げにより、なめらかでしっとりとした手触りと、鮮やかな色合い、美しい艶を引き出しました。耐久性と色堅牢度にも優れ、ラグジュアリー家具に長く続く上品さを添えます。",
  luna:
    "ルナは、上質なヌバックのマットな美しさと、セミアニリンレザーの耐久性・お手入れのしやすさを兼ね備えた素材です。非常に柔らかな起毛感に、ほのかなワックスの質感が重なり、空間や製品の主役になる存在感を生み出します。",
  seta:
    "セタコレクションは、厳選したヨーロッパ産の原皮を使用した上質なナッパレザーです。薄く繊細な革にセミアニリン仕上げを施し、しっとりとした柔らかさと、透明感のある革本来の表情を生かしています。過度な加工を控えることで一枚ごとの個性が際立ち、高級レザーグッズやこだわりのインテリアに、軽やかで上品な印象を添えます。",
};

export function applyJapaneseLeatherProductTypeCopy(
  productTypes: ProductType[],
): ProductType[] {
  return productTypes.map((productType) => {
    if (productType.materialSlug !== "leather") {
      return productType;
    }

    const summary = leatherProductTypeJapaneseSummaries[productType.slug]
      ?? (productType.slug === "verona"
        ? productType.summary.ja.replace(/^Verona(?=は)/, "ヴェロナ")
        : productType.slug === "tuscania"
          ? productType.summary.ja.replace(/^Tuscania(?=は)/, "トスカニア")
          : productType.summary.ja);

    return {
      ...productType,
      name: productType.slug === "verona"
        ? { ...productType.name, ja: "ヴェロナ" }
        : productType.name,
      summary: { ...productType.summary, ja: summary },
    };
  });
}

export { default as JAPANESE_ABOUT_PAGE_COPY } from "../data/about-page-ja.json";

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
    introTitle: { zh: chineseCopy(""), en: "", ja: "イタリアの技術と美意識の融合" },
    introBody: {
      zh: chineseCopy(""), en: "",
      ja: "アルカンターラは、1972年にイタリアで誕生した独自素材です。上質な手触りと軽さ、耐久性、通気性などを兼ね備え、自動車やインテリア、ファッションなど幅広い分野で世界のトップブランドに採用されています。豊富なカラーや加工に対応し、多様なデザインを実現できることも特長です。また、カーボンニュートラル認証の継続やリサイクル素材の活用など、環境に配慮したものづくりにも取り組んでいます。",
    },
    quote: { zh: chineseCopy(""), en: "", ja: "" },
  },
  fabric: {
    introTitle: { zh: chineseCopy(""), en: "", ja: "名車にふさわしい品質" },
    introBody: {
      zh: chineseCopy(""), en: "",
      ja: "欧州クラシックカーの純正仕様を忠実に再現したファブリックです。千鳥格子やタータンチェック、ウールなど、多彩な生地を取り揃え、当時のインテリアを美しく再現します。現代の基準に対応した耐久性を備え、クラシックカーの価値を大切にしたレストアを支えます。",
    },
    quote: { zh: chineseCopy(""), en: "", ja: "" },
  },
  leather: {
    introTitle: { zh: chineseCopy(""), en: "", ja: "職人の技が息づくイタリア製本革" },
    introBody: {
      zh: chineseCopy(""), en: "",
      ja: "原皮の選定から鞣し、仕上げまで、熟練した職人の技術によってイタリア国内で一貫してつくられるレザーコレクションです。アニリンレザーやナッパレザー、ヴィンテージレザーなど、多彩なラインアップを展開し、家具や自動車、空間デザインなど、さまざまなシーンに上質な質感と高い耐久性をもたらします。",
    },
    quote: { zh: chineseCopy(""), en: "", ja: "" },
  },
};

export function applyJapaneseMaterialCategoryCopy(
  categories: MaterialCategory[],
): MaterialCategory[] {
  return categories.map((category) => {
    const copy = materialCategoryCopy[category.slug === "italian-genuine-leather" ? "leather" : category.slug];

    if (!copy) {
      return category;
    }

    return {
      ...category,
      name:
        category.slug === "vegan-leather"
          ? { ...category.name, ja: "合成皮革" }
          : category.name,
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
    const localizedMaterial =
      material.slug === "vegan-leather"
        ? {
            ...material,
            name: { ...material.name, ja: "合成皮革" },
            heroTitle: { ...material.heroTitle, ja: "合成皮革" },
            seo: {
              ...material.seo,
              title: {
                ...material.seo.title,
                ja: "合成皮革素材 | カマリ・インターナショナル",
              },
            },
          }
        : material;

    if (!copy) {
      return localizedMaterial;
    }

    return {
      ...localizedMaterial,
      introTitle: { ...localizedMaterial.introTitle, ja: copy.introTitle.ja },
      introBody: { ...localizedMaterial.introBody, ja: copy.introBody.ja },
      quote: { ...localizedMaterial.quote, ja: copy.quote.ja },
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
