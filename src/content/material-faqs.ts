import { chineseCopy } from "../china/copy";
import type { Locale } from "@/lib/locales";

export type MaterialFaqItem = {
  question: string;
  answer: string;
  link?: {
    href: string;
    label: string;
  };
};

export const materialFaqs: Partial<Record<string, Record<Locale, MaterialFaqItem[]>>> =
  {
    alcantara: {
      zh: chineseCopy([
        {
          question: "What is Alcantara?",
          answer:
            "Alcantara is a premium Italian material developed through a unique proprietary technology. It is known for its soft touch, refined appearance, and high-performance qualities.",
        },
        {
          question: "Where is Alcantara produced?",
          answer: "ALCANTARA is 100% made in Italy.",
        },
        {
          question: "Is Alcantara leather?",
          answer:
            "No. Alcantara is a high-tech material made with patented technology. It combines a premium luxury feel with unmatched durability.",
        },
        {
          question: "Where can Alcantara be used?",
          answer:
            "Alcantara is used across automotive interiors, residential and contract interiors, marine, aviation, fashion, and consumer electronics.",
        },
        {
          question: "Can Alcantara be customized?",
          answer:
            "Yes. Alcantara supports custom colors, textures, printing, perforation, laser processing, embossing, embroidery, and lamination for bespoke design programs.",
        },
        {
          question: "Is Alcantara sustainable?",
          answer:
            "Sustainability is part of Alcantara's industrial culture. The material has maintained Carbon Neutral certification since 2009.",
        },
      ]), en: [
        {
          question: "What is Alcantara?",
          answer:
            "Alcantara is a premium Italian material developed through a unique proprietary technology. It is known for its soft touch, refined appearance, and high-performance qualities.",
        },
        {
          question: "Where is Alcantara produced?",
          answer: "ALCANTARA is 100% made in Italy.",
        },
        {
          question: "Is Alcantara leather?",
          answer:
            "No. Alcantara is a high-tech material made with patented technology. It combines a premium luxury feel with unmatched durability.",
        },
        {
          question: "Where can Alcantara be used?",
          answer:
            "Alcantara is used across automotive interiors, residential and contract interiors, marine, aviation, fashion, and consumer electronics.",
        },
        {
          question: "Can Alcantara be customized?",
          answer:
            "Yes. Alcantara supports custom colors, textures, printing, perforation, laser processing, embossing, embroidery, and lamination for bespoke design programs.",
        },
        {
          question: "Is Alcantara sustainable?",
          answer:
            "Sustainability is part of Alcantara's industrial culture. The material has maintained Carbon Neutral certification since 2009.",
        },
      ],
      ja: [
        {
          question: "Alcantara とは何ですか？",
          answer:
            "Alcantara は、独自の専有技術によって開発されたプレミアムなイタリア素材です。柔らかな触感、洗練された表情、高い性能で知られています。",
        },
        {
          question: "Alcantara はどこで生産されていますか？",
          answer: "ALCANTARA は 100% イタリア製です。",
        },
        {
          question: "Alcantara はレザーですか？",
          answer:
            "いいえ。Alcantara は特許技術によって作られたハイテク素材です。上質でラグジュアリーな触感と、優れた耐久性を兼ね備えています。",
        },
        {
          question: "Alcantara はどこに使用できますか？",
          answer:
            "Alcantara は、自動車内装、住宅・コントラクトインテリア、船舶、航空、ファッション、コンシューマーエレクトロニクスなど幅広い分野で使用されています。",
        },
        {
          question: "Alcantara はカスタマイズできますか？",
          answer:
            "はい。カラー、テクスチャー、プリント、パンチング、レーザー加工、エンボス、刺繍、ラミネーションなど、プロジェクトに応じたカスタマイズに対応できます。",
        },
        {
          question: "Alcantara はサステナブルな素材ですか？",
          answer:
            "サステナビリティは Alcantara の産業文化の一部です。Alcantara は 2009年からカーボンニュートラル認証を継続しています。",
        },
      ],
    },
    leather: {
      zh: chineseCopy([
        {
          question: "Is leather a natural material?",
          answer:
            "Yes. Leather is a natural material, so subtle variation in grain, tone, and surface character is part of its identity. These variations should be considered during specification and production.",
        },
        {
          question:
            "Why does the leather have an irregular shape and natural markings?",
          answer:
            "Because it is a 100% natural product. Genuine leather naturally retains the organic shape of the animal's hide. To ensure the highest quality, we select only the top tier of premium European hides, which minimizes surface imperfections from the start. Any remaining minor variations are simply natural characteristics of premium grain leather, serving as proof of its authentic origin.",
        },
        {
          question:
            "What is the difference between Aniline, Semi-Aniline, and Pigmented leather?",
          answer:
            "The difference lies in the surface treatment, balancing natural luxury against durability:\n\nAniline (Pure Luxury): Treated with transparent dyes only. It leaves the natural grain 100% visible and offers the softest, most breathable feel, but lacks stain protection.\n\nSemi-Aniline (The Balanced Choice): Combines a natural grain and supple touch with a micro-thin protective topcoat, offering excellent resistance to fading and daily spills.\n\nPigmented / Corrected (Maximum Durability): Coated with an opaque layer and embossed with a uniform pattern. It is firmer to the touch but highly resistant to scratches, scuffs, and heavy wear.",
        },
        {
          question: "Which leather finish is right for my project?",
          answer:
            "Aniline: Elite, low-traffic residential furniture.\n\nSemi-Aniline: Premium automotive cabins, high-end furniture, and luxury contract projects.\n\nPigmented: Heavy-traffic commercial seating and high-use environments where 100% color uniformity and maximum cleanability are the top priorities.\n\nCAMARI staff can help match the right leather article to the design and technical brief.",
        },
        {
          question: "Can leather colors and finishes be customized?",
          answer:
            "Custom color and finish development may be available depending on the leather article, project quantity, and technical requirements.",
        },
      ]), en: [
        {
          question: "Is leather a natural material?",
          answer:
            "Yes. Leather is a natural material, so subtle variation in grain, tone, and surface character is part of its identity. These variations should be considered during specification and production.",
        },
        {
          question:
            "Why does the leather have an irregular shape and natural markings?",
          answer:
            "Because it is a 100% natural product. Genuine leather naturally retains the organic shape of the animal's hide. To ensure the highest quality, we select only the top tier of premium European hides, which minimizes surface imperfections from the start. Any remaining minor variations are simply natural characteristics of premium grain leather, serving as proof of its authentic origin.",
        },
        {
          question:
            "What is the difference between Aniline, Semi-Aniline, and Pigmented leather?",
          answer:
            "The difference lies in the surface treatment, balancing natural luxury against durability:\n\nAniline (Pure Luxury): Treated with transparent dyes only. It leaves the natural grain 100% visible and offers the softest, most breathable feel, but lacks stain protection.\n\nSemi-Aniline (The Balanced Choice): Combines a natural grain and supple touch with a micro-thin protective topcoat, offering excellent resistance to fading and daily spills.\n\nPigmented / Corrected (Maximum Durability): Coated with an opaque layer and embossed with a uniform pattern. It is firmer to the touch but highly resistant to scratches, scuffs, and heavy wear.",
        },
        {
          question: "Which leather finish is right for my project?",
          answer:
            "Aniline: Elite, low-traffic residential furniture.\n\nSemi-Aniline: Premium automotive cabins, high-end furniture, and luxury contract projects.\n\nPigmented: Heavy-traffic commercial seating and high-use environments where 100% color uniformity and maximum cleanability are the top priorities.\n\nCAMARI staff can help match the right leather article to the design and technical brief.",
        },
        {
          question: "Can leather colors and finishes be customized?",
          answer:
            "Custom color and finish development may be available depending on the leather article, project quantity, and technical requirements.",
        },
      ],
      ja: [
        {
          question: "レザーは天然素材ですか？",
          answer:
            "はい。レザーは天然素材のため、木目や色調、表面の表情が一点ずつ異なります。同じものが二つとない、その豊かな個性もレザーの魅力のひとつです。",
        },
        {
          question: "なぜレザーには不規則な形や自然な跡があるのですか？",
          answer:
            "それは、レザーが100％天然素材だからです。レザーには、動物の原皮が持つ自然な形が残ります。カマリでは、ヨーロッパ産の上質な原皮から、表面の傷やムラが少ない上位グレードを厳選しています。それでも残るわずかな違いは、レザーならではの特徴であり、本物の証です。",
        },
        {
          question:
            "アニリン、セミアニリン、ピグメントレザーの違いは何ですか？",
          answer:
            "違いは表面処理にあり、自然な高級感と耐久性のバランスが異なります。\n\nアニリン（Pure Luxury）：透明感のある染料で仕上げるため、革本来のシボや表情をそのまま楽しめます。仕上げの中でも特に柔らかく、通気性に優れていますが、汚れには注意が必要です。\n\nセミアニリン（The Balanced Choice）：自然な木目としなやかな触感を保ちながら、極薄の保護トップコートを加えることで、退色や日常的な汚れに対する優れた耐性を備えます。\n\nピグメント／コレクテッド（Maximum Durability）：不透明な層でコーティングし、均一なパターンを型押しした仕上げです。触感はやや硬くなりますが、傷、擦れ、激しい使用に対して高い耐久性があります。",
        },
        {
          question: "プロジェクトにはどのレザー仕上げが適していますか？",
          answer:
            "アニリン：革本来の風合いや自然な表情を楽しみたい、住宅用のソファや椅子に。\n\nセミアニリン仕上げ：高級車の内装や上質な家具、ホテルなどの空間に。\n\nピグメント仕上げ：色の均一さやお手入れのしやすさが求められる、商業施設の椅子などに。\n\nCAMARI スタッフが、デザインと技術条件に合う適切なレザー品番の選定をサポートできます。",
        },
        {
          question: "レザーの色や仕上げはカスタマイズできますか？",
          answer:
            "品番、プロジェクト数量、技術要件によっては、カスタムカラーや仕上げ開発に対応できる場合があります。",
        },
      ],
    },
    "vegan-leather": {
      zh: chineseCopy([
        {
          question: "What is vegan leather?",
          answer:
            "Vegan leather is a material designed to mimic the look, feel, and functionality of traditional animal leather, but made entirely without animal products. Technically, vegan leather includes Vinyl, PU leather and microfiber leather.",
        },
        {
          question:
            "What is the difference between vinyl (PVC), PU leather, and microfiber leather?",
          answer:
            "The main differences lie in their backing structure, durability, hand feel, breathability, and VOC profile:\n\nVinyl (PVC): A textile backing coated with polyvinyl chloride (PVC) mixed with plasticizers and pigments. It offers heavy-duty durability, waterproof performance, and a plasticky feel; it is less breathable and relatively higher in VOCs.\n\nPU Leather: A textile backing, often knitted or woven polyester, covered with a layer of polyurethane. It is frequently produced as a multi-layer construction with a microporous or foam intermediate layer to mimic real leather's grain and breathability. It is softer, more flexible, and generally lower in VOCs.\n\nMicrofiber Leather: A premium material that replicates the exact 3D fiber network of real animal hide using microscopic synthetic fibers. It is exceptionally soft, highly breathable, and lower in VOCs. Our sustainable water-borne, solvent-free microfiber is crafted through the greenest engineering. The entire process is free of toluene, DMF, and sodium hydroxide, setting a new ecological benchmark by eliminating the chemical residues traditional methods cannot avoid.",
          link: {
            href: "/uploads/veganleather/comparison.png",
            label: "See structural comparison of leather materials",
          },
        },
        {
          question: "What is Waterborne Microfiber?",
          answer:
            "Waterborne microfiber is defined by its fine fiber architecture and water-based production route. It uses water for fiber opening and PU impregnation, avoiding toluene, sodium hydroxide, and solvent-based PU while reducing manufacturing impact.",
        },
        {
          question: "What's the advantage of Aquapelle?",
          answer:
            "Aquapelle offers a natural leather-like hand, strong mechanical performance, breathable comfort, consistent color, and stable quality. Its waterborne, solvent-free process is also DMF-free and VOC-free.",
        },
      ]), en: [
        {
          question: "What is vegan leather?",
          answer:
            "Vegan leather is a material designed to mimic the look, feel, and functionality of traditional animal leather, but made entirely without animal products. Technically, vegan leather includes Vinyl, PU leather and microfiber leather.",
        },
        {
          question:
            "What is the difference between vinyl (PVC), PU leather, and microfiber leather?",
          answer:
            "The main differences lie in their backing structure, durability, hand feel, breathability, and VOC profile:\n\nVinyl (PVC): A textile backing coated with polyvinyl chloride (PVC) mixed with plasticizers and pigments. It offers heavy-duty durability, waterproof performance, and a plasticky feel; it is less breathable and relatively higher in VOCs.\n\nPU Leather: A textile backing, often knitted or woven polyester, covered with a layer of polyurethane. It is frequently produced as a multi-layer construction with a microporous or foam intermediate layer to mimic real leather's grain and breathability. It is softer, more flexible, and generally lower in VOCs.\n\nMicrofiber Leather: A premium material that replicates the exact 3D fiber network of real animal hide using microscopic synthetic fibers. It is exceptionally soft, highly breathable, and lower in VOCs. Our sustainable water-borne, solvent-free microfiber is crafted through the greenest engineering. The entire process is free of toluene, DMF, and sodium hydroxide, setting a new ecological benchmark by eliminating the chemical residues traditional methods cannot avoid.",
          link: {
            href: "/uploads/veganleather/comparison.png",
            label: "See structural comparison of leather materials",
          },
        },
        {
          question: "What is Waterborne Microfiber?",
          answer:
            "Waterborne microfiber is defined by its fine fiber architecture and water-based production route. It uses water for fiber opening and PU impregnation, avoiding toluene, sodium hydroxide, and solvent-based PU while reducing manufacturing impact.",
        },
        {
          question: "What's the advantage of Aquapelle?",
          answer:
            "Aquapelle offers a natural leather-like hand, strong mechanical performance, breathable comfort, consistent color, and stable quality. Its waterborne, solvent-free process is also DMF-free and VOC-free.",
        },
      ],
      ja: [
        {
          question: "ヴィーガンレザーとは何ですか？",
          answer:
            "ヴィーガンレザーは、従来の動物由来レザーの見た目、触感、機能性を再現するように設計された素材で、動物由来製品を一切使用していません。技術的には、ヴィーガンレザーにはビニール、PU レザー、マイクロファイバーレザーが含まれます。",
        },
        {
          question:
            "ビニール（PVC）、PU レザー、マイクロファイバーレザーの違いは何ですか？",
          answer:
            "主な違いは、裏基材の構造、耐久性、手触り、通気性、VOC の傾向にあります。\n\nビニール（PVC）：繊維基材に、可塑剤と顔料を混合したポリ塩化ビニル（PVC）をコーティングした素材です。高い耐久性、防水性、プラスチックらしい触感を備える一方で、通気性は低く、VOC は比較的高めです。\n\nPU レザー：多くの場合、ニットまたは織物のポリエステルなどの繊維基材にポリウレタン層を重ねた素材です。本革のシボ感や通気性を再現するため、微多孔質層やフォーム中間層を含む多層構造で作られることもあります。より柔らかく、柔軟性があり、一般的に VOC は低めです。\n\nマイクロファイバーレザー：微細な合成繊維を使い、本物の動物皮革に近い 3D 繊維ネットワークを再現したプレミアム素材です。非常に柔らかく、高い通気性を備え、VOC も低めです。当社のサステナブルな水性・無溶剤マイクロファイバーは、より環境に配慮したエンジニアリングで作られています。製造工程全体でトルエン、DMF、水酸化ナトリウムを使用せず、従来工法では避けにくかった化学残留物を排除することで、新しい環境基準を提示します。",
          link: {
            href: "/uploads/veganleather/comparison.png",
            label: "レザー素材の構造比較を見る",
          },
        },
      ],
    },
    fabric: {
      zh: chineseCopy([
        {
          question: "What automotive fabric does CAMARI offer?",
          answer:
            "CAMARI offers original or reproduced automotive fabric matching the original specification for classic cars.",
        },
        {
          question: "Where can CAMARI fabrics be used?",
          answer:
            "CAMARI fabrics can be specified for automotive seats, door panels, heritage restoration, and bespoke trim. The fabrics can also be used for car and fashion accessories, as displayed in our Product section.",
        },
        {
          question:
            "Will the pattern and texture of fabric match original classic interior?",
          answer:
            "Yes. We source the fabric from Europe to match the factory originals.",
        },
      ]), en: [
        {
          question: "What automotive fabric does CAMARI offer?",
          answer:
            "CAMARI offers original or reproduced automotive fabric matching the original specification for classic cars.",
        },
        {
          question: "Where can CAMARI fabrics be used?",
          answer:
            "CAMARI fabrics can be specified for automotive seats, door panels, heritage restoration, and bespoke trim. The fabrics can also be used for car and fashion accessories, as displayed in our Product section.",
        },
        {
          question:
            "Will the pattern and texture of fabric match original classic interior?",
          answer:
            "Yes. We source the fabric from Europe to match the factory originals.",
        },
      ],
      ja: [
        {
          question:
            "CAMARI ではどのような自動車用ファブリックを扱っていますか？",
          answer:
            "CAMARI では、クラシックカーの純正仕様に合わせたオリジナルまたは復刻の自動車用ファブリックを取り扱っています。",
        },
        {
          question: "CAMARI のファブリックはどこに使用できますか？",
          answer:
            "CAMARI のファブリックは、自動車のシート、ドアパネル、ヘリテージレストレーション、特注トリムに指定できます。また、Product セクションで紹介しているように、車両用アクセサリーやファッションアクセサリーにも使用できます。",
        },
        {
          question: "パターンや質感はクラシックカーの純正内装に合いますか？",
          answer:
            "はい。工場出荷時の純正仕様に合わせるため、ヨーロッパからファブリックを調達しています。",
        },
      ],
    },
  };
