import type { Locale } from "@/lib/locales";
import type { LocalizedString } from "@/lib/content";

export type ProductCategory = {
  slug: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  heroImage: string;
  curvedCarouselImages?: Array<{
    src: string;
    title: LocalizedString;
    description: LocalizedString;
    details: LocalizedString[];
    galleryImages: string[];
  }>;
  description: LocalizedString;
  highlights: Array<{
    title: LocalizedString;
    body: LocalizedString;
  }>;
};

const images = {
  automotive:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC7ZrAd47bJyNDiZsYFqvWZwSesH95st08txaMeziENnQ9oVj60KmSmH8L1RUPKONbB6SH5NOdP1ZVQ0mnJEtDKP1q9klE2_yW3BixnJftaYgJbp_0nomc8mgh17p_ONOlq-xjAFyyf1bSmz5MOq7CyoPatzBO9uaCgJCRpYYco-u6GF9cp9zGho6oF1-8FYAobZa7OKcKdcvEN3gsrs7v8iBBsTie5ZmZi6bnlyV767sszweKxgX4bFgxtm2e66al3C74Bh8SLlm8",
  tech: "https://lh3.googleusercontent.com/aida-public/AB6AXuAnc7qr4LfkNusa6-3AYYMm4P7Vd3v1cvziPm5EcJ93nyaOUSe93zquyQGmB5gyrp2U9Wrt0bX2YBeQnb2W19Fta49E_IBvdF4qn90-enQRurONkI4Xg-LNZvwft789RLcZVXxwrXJE4qp5JoPctPytXNv3XEZtBgPoGefSyib7iD-vadAbTfnMa6o_DsLzZ8UM-mXRKPBiQla8EIhctC83Z_oG3-Xk5FwJCAtFtucc4nufgPu4WmIrBxzY6-u30J7D2X-6SA94pT0",
  lifestyle:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCM0uRLWCIEBqOsn3QxjsiTFZJr4Shq4OYrUcfH30PF5PjwnD7j6CVwE36gtDd-EFTwfGVsc7lZ7OgwjQS3i_yo8YHYBgwQ7-AV-QDYr4KvfrIPOLgEEVWFGMxIEVydxRU5fq1IuuGFMFmTGA3pfi-lQxcHmPbhzIoYZQZzqJVNPKguTDv3ubQqeMSJlUIdw00rkmVrdQOfJhTuzPHL1XEuoUxXaXr6NwCvmS0r0WhTWoPAJcQt-evKTyNZX9VaB1m9ikRiH44hKnA",
  gift: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1_m0k_z4v_--owRaTXIMZ132FJNMCqJ_D7IA2ICmNfH6e-bwbBxJjOYxb5BBugzjTcEIumHX4dY5KAdgdcGFtPdAYKObeHQN5rPpkmDmaHs05UvQbXjWqgSh_w2q85m9QP277PJjwPrA8vVhu400hqqS3y0QWdOUxu4iK_mMZ2t_OaHfOVvCNL-y1Ko3ASO7VOoDGh86wE9xEyl9ZS3_HIoGnAFxbTpVd5h65HDePp-GceZ8Mc9JmW3q-E-v4j-D472alRGpUUskyGxl9S4"
};

export const productCategories: ProductCategory[] = [
  {
    slug: "automotive-interior-accessories",
    title: { en: "Automotive Interior Accessories", ja: "自動車インテリアアクセサリー" },
    subtitle: {
      en: "From concept material strategy to finished surface execution",
      ja: "素材戦略から完成されたサーフェス実装まで"
    },
    heroImage: images.automotive,
    curvedCarouselImages: [
      {
        src: "/uploads/gallery/fabric/Ferrari-SF90-Denim.jpg",
        title: { en: "Denim Performance Seat", ja: "デニム パフォーマンスシート" },
        description: {
          en: "A tailored denim textile expression for sport seats, balancing visual character with cabin durability.",
          ja: "スポーツシート向けのデニム調テキスタイル。視覚的な個性とキャビン用途の耐久性を両立します。"
        },
        details: [
          { en: "Seat insert and bolster application", ja: "シートインサート、ボルスター用途" },
          { en: "Textile hand-feel with automotive-grade execution", ja: "自動車グレードで仕上げるテキスタイル感" },
          { en: "Designed for custom interior programs", ja: "カスタムインテリアプログラム向け" }
        ],
        galleryImages: ["/uploads/gallery/fabric/Ferrari-SF90-Denim.jpg"]
      },
      {
        src: "/uploads/gallery/fabric/Toyto-FA8074.jpeg",
        title: { en: "Classic Woven Cabin", ja: "クラシック ウーブンキャビン" },
        description: {
          en: "A warm woven surface for heritage-inspired seating and trim, made for cabins that need a softer material language.",
          ja: "ヘリテージ感のあるシートやトリム向けの温かみある織物表面。柔らかな素材表現が必要なキャビンに適しています。"
        },
        details: [
          { en: "Seat centers, door inserts, and armrest accents", ja: "シート中央、ドアインサート、アームレストアクセント" },
          { en: "Patterned textile surface with refined tactility", ja: "上質な触感を持つ柄入りテキスタイル表面" },
          { en: "Suitable for vintage and lifestyle mobility interiors", ja: "ヴィンテージ、ライフスタイル系モビリティ内装向け" }
        ],
        galleryImages: ["/uploads/gallery/fabric/Toyto-FA8074.jpeg"]
      },
      {
        src: "/uploads/gallery/fabric/Branco-FA8045.jpg",
        title: { en: "Light Cabin Textile", ja: "ライト キャビンテキスタイル" },
        description: {
          en: "A clean light-toned textile option for bright cabins, pairing technical repeatability with a softer passenger-zone feel.",
          ja: "明るいキャビン向けのクリーンなライトトーン素材。技術的な安定性と柔らかな乗員空間の印象を両立します。"
        },
        details: [
          { en: "Passenger-facing seating and panel zones", ja: "乗員側のシート、パネルゾーン" },
          { en: "Neutral base for contrast stitching or trim details", ja: "コントラストステッチやトリムディテールに合うニュートラルベース" },
          { en: "Balanced for modern, quiet interior schemes", ja: "モダンで落ち着いたインテリア計画向け" }
        ],
        galleryImages: ["/uploads/gallery/fabric/Branco-FA8045.jpg"]
      },
      {
        src: "/uploads/gallery/fabric/Porsche-FA8626.jpeg",
        title: { en: "Sport Heritage Fabric", ja: "スポーツ ヘリテージファブリック" },
        description: {
          en: "A graphic automotive fabric direction for seat centers and statement panels where pattern becomes part of the cabin identity.",
          ja: "シート中央や印象的なパネル向けのグラフィックな自動車用ファブリック。柄そのものがキャビンの個性になります。"
        },
        details: [
          { en: "Performance seat centers and decorative inserts", ja: "パフォーマンスシート中央、装飾インサート" },
          { en: "High-contrast textile identity", ja: "コントラストの強いテキスタイル表現" },
          { en: "Pairs with leather, Alcantara, or technical trims", ja: "レザー、Alcantara、テクニカルトリムとの組み合わせに対応" }
        ],
        galleryImages: ["/uploads/gallery/fabric/Porsche-FA8626.jpeg"]
      },
      {
        src: "/uploads/gallery/leather/Aston-Martin-Heritage-5362.jpeg",
        title: { en: "Heritage Leather Surface", ja: "ヘリテージ レザーサーフェス" },
        description: {
          en: "A premium leather cabin surface for seating and stitched trim, focused on a refined grain and classic automotive warmth.",
          ja: "シートやステッチ入りトリム向けのプレミアムレザー表面。上質なシボ感とクラシックな自動車内装の温かみを重視しています。"
        },
        details: [
          { en: "Seat facings, headrests, and door panels", ja: "シート表面、ヘッドレスト、ドアパネル" },
          { en: "Premium grain with stitch-friendly finishing", ja: "ステッチ加工に適したプレミアムグレイン" },
          { en: "Developed for high-touch interior zones", ja: "高接触インテリアゾーン向け" }
        ],
        galleryImages: ["/uploads/gallery/leather/Aston-Martin-Heritage-5362.jpeg"]
      },
      {
        src: "/uploads/gallery/leather/Rolls-Royce-nappa-3251.jpeg",
        title: { en: "Soft Nappa Cabin", ja: "ソフト ナッパキャビン" },
        description: {
          en: "A smooth nappa leather direction for luxury seating, headrests, consoles, and soft-touch cabin architecture.",
          ja: "ラグジュアリーシート、ヘッドレスト、コンソール、ソフトタッチなキャビン構成向けの滑らかなナッパレザー方向性。"
        },
        details: [
          { en: "Luxury seat and console surfaces", ja: "ラグジュアリーシート、コンソール表面" },
          { en: "Soft hand-feel for passenger contact areas", ja: "乗員接触部に適した柔らかな手触り" },
          { en: "Supports quilting, piping, and contrast stitch details", ja: "キルティング、パイピング、コントラストステッチに対応" }
        ],
        galleryImages: ["/uploads/gallery/leather/Rolls-Royce-nappa-3251.jpeg"]
      },
      {
        src: "/uploads/gallery/alcantara/McLaren Senna Alcantara 4175.jpeg",
        title: { en: "Alcantara Driver Zone", ja: "Alcantara ドライバーゾーン" },
        description: {
          en: "A technical Alcantara surface for driver-focused zones, bringing grip, matte color, and performance tactility into the cockpit.",
          ja: "ドライバー中心のゾーン向けのテクニカルなAlcantara表面。グリップ感、マットな色調、パフォーマンス感のある触感をコックピットに与えます。"
        },
        details: [
          { en: "Steering, seat, and console touch points", ja: "ステアリング、シート、コンソール接触部" },
          { en: "Matte visual finish with tactile grip", ja: "触感的なグリップを持つマットな外観" },
          { en: "Suited to performance and limited-edition cabins", ja: "パフォーマンス、限定仕様キャビン向け" }
        ],
        galleryImages: ["/uploads/gallery/alcantara/McLaren Senna Alcantara 4175.jpeg"]
      },
      {
        src: "/uploads/gallery/alcantara/McLaren Alcantara 9002 Nappa 6927.jpeg",
        title: { en: "Alcantara and Nappa Contrast", ja: "Alcantara とナッパのコントラスト" },
        description: {
          en: "A mixed-material cabin study combining Alcantara structure with nappa accents for visual contrast and tactile zoning.",
          ja: "Alcantaraの構成感とナッパのアクセントを組み合わせたミックスマテリアルのキャビン提案。視覚的なコントラストと触感ゾーニングを実現します。"
        },
        details: [
          { en: "Mixed seat, console, and trim applications", ja: "シート、コンソール、トリムのミックス用途" },
          { en: "Contrast color blocking and touch-zone separation", ja: "配色コントラストと接触ゾーンの分離" },
          { en: "Designed for performance luxury interiors", ja: "パフォーマンスラグジュアリー内装向け" }
        ],
        galleryImages: ["/uploads/gallery/alcantara/McLaren Alcantara 9002 Nappa 6927.jpeg"]
      }
    ],
    description: {
      en: "Material programs for automotive cabins, mobility interiors, and transport surfaces. From steering touch points and seating to door panels and headliners, surface execution that balances sensory quality with structural performance.",
      ja: "自動車キャビン、モビリティインテリア、輸送サーフェス向けの素材プログラム。ステアリング周辺、シート、ドアパネル、ヘッドライナーまで、質感的品質と構造性能のバランスを取るサーフェス実装。"
    },
    highlights: [
      {
        title: { en: "Cabin and trim surfaces", ja: "キャビンパネル・トリムサーフェス" },
        body: {
          en: "Door panels, center consoles, instrument clusters, and decorative trim with material programs tailored to automotive lifecycle and environmental requirements.",
          ja: "ドアパネル、センターコンソール、インパネ、装飾トリムなど、汽车ライフサイクルと環境要件に合わせた素材プログラム。"
        }
      },
      {
        title: { en: "Seating and soft-touch zones", ja: "シート・ソフトタッチゾーン" },
        body: {
          en: "Seat facings, bolsters, headrest surfaces, and soft-touch interior zones with tactile refinement and durability performance.",
          ja: "シート表面、ボルスター、ヘッドレスト表面、触感の精緻さと耐久性能を備えたソフトタッチインテリアゾーン。"
        }
      },
      {
        title: { en: "Steering and driver contact surfaces", ja: "ステアリング・ドライバー接触面" },
        body: {
          en: "Steering wheel covers, driver-side armrests, and high-contact surfaces designed for grip, wear resistance, and premium hand-feel.",
          ja: "ステアリングホイールカバー、ドライバーサイドのアームレスト、握り心地、耐摩耗性、上質な手触りを考慮した高接触面。"
        }
      }
    ]
  },
  {
    slug: "tech-accessories",
    title: { en: "Tech Accessories", ja: "テックアクセサリー" },
    subtitle: {
      en: "Surface programs for consumer electronics and wearable technology",
      ja: "コンシューマー電子機器とウェアラブル技術向け素材プログラム"
    },
    heroImage: images.tech,
    description: {
      en: "Surface material programs for consumer electronics, wearables, device accessories, and tech-adjacent products. From matte smartphone cases to tactile wearable bands, materials that communicate quality at the point of daily contact.",
      ja: "コンシューマー電子機器、ウェアラブル、デバイスアクセサリー向け表面素材プログラム。マットなスマートフォンケースから触感的なウェアラブルバンドまで、毎日の接点で品質を伝える素材。"
    },
    highlights: [
      {
        title: { en: "Consumer electronics enclosures", ja: "コンシューマー電子機器筐体" },
        body: {
          en: "Laptop sleeves, tablet cases, speaker surfaces, and device housings with micro-texture finishes and brand-appropriate tactility.",
          ja: "ノート PC スリーブ、タブレットケース、スピーカー表面、デバイス筐体など、マイクロテクスチャ仕上げとブランドに合った触感を備えます。"
        }
      },
      {
        title: { en: "Wearables and band surfaces", ja: "ウェアラブル・バンドサーフェス" },
        body: {
          en: "Watch bands, fitness tracker surfaces, AR glass temples, and wearable device contact points designed for skin compatibility and long-term wear.",
          ja: "ウォッチバンド、フィットネストラッカー表面、AR グラスのテンプル、ウェアラブルデバイスの接触点など、肌に安全で長期着用を考慮して設計。"
        }
      },
      {
        title: { en: "Audio and peripheral surfaces", ja: "オーディオ・周辺機器のサーフェス" },
        body: {
          en: "Headphone ear cups, game controller grips, keyboard wrist rests, and peripheral surfaces with grip-focused texture and acoustic-dampening properties.",
          ja: "ヘッドフォンイヤーカップ、ゲームコントローラーグリップ、キーボードのリストレストなど、握り心地を重視したテクスチャと吸音特性を備えた周辺機器。"
        }
      }
    ]
  },
  {
    slug: "lifestyle",
    title: { en: "Lifestyle", ja: "ライフスタイル" },
    subtitle: {
      en: "Material solutions for lifestyle products and personal goods",
      ja: "ライフスタイル商品とパーソナルグッズ向け素材ソリューション"
    },
    heroImage: images.lifestyle,
    description: {
      en: "Material programs for lifestyle products, packaging, personal goods, and consumer accessories. From premium bag interiors to watch boxes and stationery, surfaces that reward close inspection and daily touch.",
      ja: "ライフスタイル商品、パッケージ、パーソナルグッズ、コンシューマーアクセサリー向け素材プログラム。プレミアムバッグの内装からウォッチボックス、文房具まで、毎日の手触りに応えるサーフェス。"
    },
    highlights: [
      {
        title: { en: "Bag and luggage interiors", ja: "バッグ・荷物の内装" },
        body: {
          en: "Suitcase interiors, bag linings, travel accessories, and luggage surfaces with lightweight durability and premium hand-feel.",
          ja: "スーツケース内装、バッグ裏地、旅行アクセサリー、軽量性と上質な手触りを備えたラゲージサーフェス。"
        }
      },
      {
        title: { en: "Personal goods and accessories", ja: "パーソナル商品・アクセサリー" },
        body: {
          en: "Watch boxes, eyewear cases, stationery surfaces, and small leather goods with refined finishing and gifting-appropriate presentation.",
          ja: "ウォッチボックス、メガネケース、文房具表面、ギフトに適した精緻な仕上げの小物。"
        }
      },
      {
        title: { en: "Premium packaging surfaces", ja: "プレミアムパッケージサーフェス" },
        body: {
          en: "High-end product packaging, gift boxes, and branded packaging materials with tactile finishing and unboxing experience design.",
          ja: "ハイエンドプロダクトパッケージ、ギフトボックス、没入感のある開梱体験の設計を持つブランディングパッケージ素材。"
        }
      }
    ]
  },
  {
    slug: "corporation-gift",
    title: { en: "Corporate Gifts", ja: "法人ギフト" },
    subtitle: {
      en: "Premium material programs for corporate gifting and brand merchandise",
      ja: "法人ギフト・ブランド商品向けプレミアム素材プログラム"
    },
    heroImage: images.gift,
    description: {
      en: "Surface material programs for corporate gifting, executive awards, brand merchandise, and B2B promotional products. From award plaques to desk accessories, materials that represent brand values at the moment of gifting.",
      ja: "法人ギフト、エグゼクティブ表彰、ブランド商品、B2B プロモーション商品向けの表面素材プログラム。受賞表彰牌からデスクアクセサリーまで、ギフトの瞬間にブランド価値観を伝える素材。"
    },
    highlights: [
      {
        title: { en: "Corporate awards and plaques", ja: "法人表彰・額" },
        body: {
          en: "Award plaques, trophy surfaces, recognition objects, and ceremonial items with engraving-compatible finishes and premium presentation quality.",
          ja: "受賞表彰牌、トロフィーサーフェス、認定オブジェクト、彫刻可能な仕上げと上質なプレゼンテーション品質を持つ式典アイテム。"
        }
      },
      {
        title: { en: "Executive desk accessories", ja: "エグゼクティブデスクアクセサリー" },
        body: {
          en: "Pen holders, desk organizers, card holders, and desk surfaces with brand-appropriate material presence and long-term tactile satisfaction.",
          ja: "ペン立て、デスクオーガナイザー、カードホルダー、ブランドに合った素材感と長期的な触感満足を備えたデスクサーフェス。"
        }
      },
      {
        title: { en: "Brand merchandise and promotional items", ja: "ブランド商品・プロモーションアイテム" },
        body: {
          en: "Branded merchandise, event giveaways, and B2B promotional items with consistent material quality and brand identity alignment.",
          ja: "ブランド商品、イベント景品、B2B プロモーションアイテムなど、一貫した素材品質とブランドアイデンティティの整合性。"
        }
      }
    ]
  }
];

export function getProductCategory(slug: string): ProductCategory | undefined {
  return productCategories.find((cat) => cat.slug === slug);
}
