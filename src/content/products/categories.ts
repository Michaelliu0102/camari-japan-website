import type { LocalizedString } from "@/lib/content";
import carouselContentOverridesData from "@/data/product-category-carousel-overrides.json";

export type ProductCategory = {
  slug: string;
  title: LocalizedString;
  subtitle: LocalizedString;
  heroImage: string;
  curvedCarouselImages?: Array<{
    src: string;
    title: LocalizedString;
    description: LocalizedString;
    customizedOption?: LocalizedString;
    details: LocalizedString[];
    galleryImages: string[];
  }>;
  description: LocalizedString;
  highlights: Array<{
    title: LocalizedString;
    body: LocalizedString;
  }>;
};

const productCategoryFixtures: ProductCategory[] = [
  {
    slug: "automotive-interior-accessories",
    title: { en: "Automotive Interior Accessories", ja: "自動車インテリアアクセサリー" },
    subtitle: { en: "Custom-fit cabin accessories in premium leather, Alcantara, and technical textiles.", ja: "プレミアムレザー、Alcantara、テクニカルテキスタイルで仕立てる自動車インテリアアクセサリー。" },
    heroImage: "/uploads/product/product/cover-photo/headrest-pillow-cover.jpg",
    curvedCarouselImages: [
      {
        src: "/uploads/product/product/cover-photo/floormat-cover.jpg",
        title: { en: "Floor Mat", ja: "フロアマット" },
        description: { en: "Custom automotive floor mats that protect the cabin while carrying the same premium material language as the interior.", ja: "キャビンを保護しながら、インテリアと同じ上質な素材表現を保つカスタム自動車フロアマット。" },
        details: [{ en: "Protective cabin floor surface", ja: "キャビン床面の保護" }, { en: "Leather and textile finish options", ja: "レザー・テキスタイル仕上げに対応" }, { en: "Designed for coordinated interiors", ja: "統一感のある内装に向けた設計" }],
        galleryImages: ["/uploads/product/product/automotive-interior/floor mat/floor mat-cover.jpg", "/uploads/product/product/automotive-interior/floor mat/floor mat-01.jpg", "/uploads/product/product/automotive-interior/floor mat/floor mat-03.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/headrest-pillow-cover.jpg",
        title: { en: "Headrest Pillow", ja: "ヘッドレストピロー" },
        description: { en: "Soft headrest pillows for premium cabins, adding comfort, material contrast, and a tailored accessory detail.", ja: "プレミアムキャビンに快適性、素材のコントラスト、仕立て感のあるアクセサリーディテールを加えるヘッドレストピロー。" },
        details: [{ en: "Neck and head support", ja: "首・頭部のサポート" }, { en: "Soft-touch premium surface", ja: "ソフトタッチなプレミアム表面" }, { en: "Suitable for front and rear seats", ja: "前席・後席に対応" }],
        galleryImages: ["/uploads/product/product/automotive-interior/headrest pillow/headrest pillow-cover.jpg", "/uploads/product/product/automotive-interior/headrest pillow/headrest pillow-01.jpg", "/uploads/product/product/automotive-interior/headrest pillow/headrest pillow-02.jpg", "/uploads/product/product/automotive-interior/headrest pillow/headrest pillow-03.jpg", "/uploads/product/product/automotive-interior/headrest pillow/headrest pillow-04.jpg", "/uploads/product/product/automotive-interior/headrest pillow/headrest pillow-06.jpg", "/uploads/product/product/automotive-interior/headrest pillow/headrest pillow-07.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/key-fob-cover.jpg",
        title: { en: "Key Fob", ja: "キーフォブ" },
        description: { en: "Premium key fob covers that turn a daily automotive touch point into a small branded material object.", ja: "毎日触れる自動車キーを、小さなブランド素材オブジェクトへ変えるプレミアムキーフォブカバー。" },
        details: [{ en: "Daily carry touch point", ja: "日常携行の接点" }, { en: "Precision fit and stitched finish", ja: "精密なフィットとステッチ仕上げ" }, { en: "Brandable leather accessory", ja: "ブランド展開可能なレザーアクセサリー" }],
        galleryImages: ["/uploads/product/product/automotive-interior/key fob/key fob-cover.jpg", "/uploads/product/product/automotive-interior/key fob/key fob-01.jpg", "/uploads/product/product/automotive-interior/key fob/key fob-02.jpg", "/uploads/product/product/automotive-interior/key fob/key fob-04.jpg", "/uploads/product/product/automotive-interior/key fob/key fob-05.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/keychain-cover.jpg",
        title: { en: "Leather Keychain P1", ja: "レザーキーチェーン P1" },
        description: { en: "A compact leather keychain format for automotive, hospitality, and lifestyle gifting programs.", ja: "自動車、ホスピタリティ、ライフスタイルギフト向けのコンパクトなレザーキーチェーン。" },
        details: [{ en: "Compact gift format", ja: "コンパクトなギフト形式" }, { en: "Premium edge and stitch detail", ja: "上質なエッジとステッチディテール" }, { en: "Suitable for branded programs", ja: "ブランドプログラムに対応" }],
        galleryImages: ["/uploads/product/product/automotive-interior/keychain p1/keychain p1-cover.jpg", "/uploads/product/product/automotive-interior/keychain p1/keychain p1-01.jpg", "/uploads/product/product/automotive-interior/keychain p1/keychain p1-02.jpg", "/uploads/product/product/automotive-interior/keychain p1/keychain p1-03.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/keychain-p2-cover.jpg",
        title: { en: "Leather Keychain P2", ja: "レザーキーチェーン P2" },
        description: { en: "A refined keychain silhouette with tactile leather finishing for daily carry and corporate gifting.", ja: "日常携行と法人ギフトに適した、触感的なレザー仕上げの洗練されたキーチェーンシルエット。" },
        details: [{ en: "Refined carry silhouette", ja: "洗練された携行シルエット" }, { en: "Leather loop and metal hardware", ja: "レザーループとメタル金具" }, { en: "Designed for daily handling", ja: "日常的な使用に向けた設計" }],
        galleryImages: ["/uploads/product/product/automotive-interior/keychain p2/keychain p2-cover.jpg", "/uploads/product/product/automotive-interior/keychain p2/keychain p2-01.jpg", "/uploads/product/product/automotive-interior/keychain p2/keychain p2-03.jpg", "/uploads/product/product/automotive-interior/keychain p2/keychain p2-04.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/keychain-carbon-cover.jpg",
        title: { en: "Leather Keychain P3", ja: "レザーキーチェーン P3" },
        description: { en: "A statement keychain variation for premium automotive accessories and branded merchandise.", ja: "プレミアム自動車アクセサリーとブランド商品に向けた、存在感のあるキーチェーンバリエーション。" },
        details: [{ en: "Statement accessory profile", ja: "存在感のあるアクセサリープロファイル" }, { en: "Durable daily-use construction", ja: "日常使用に耐える構造" }, { en: "Works across vehicle and lifestyle programs", ja: "車両・ライフスタイルプログラムに対応" }],
        galleryImages: ["/uploads/product/product/automotive-interior/keychain p3/keychain p3-01.jpg", "/uploads/product/product/automotive-interior/keychain p3/keychain p3-02.jpg", "/uploads/product/product/automotive-interior/keychain p3/keychain p3-03.jpg", "/uploads/product/product/automotive-interior/keychain p3/keychain p3-04.jpg", "/uploads/product/product/automotive-interior/keychain p3/keychain p3-05.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/lumbar-cushion-cover.jpg",
        title: { en: "Lumbar Cushion", ja: "ランバークッション" },
        description: { en: "Lumbar support cushions that add comfort to long drives while matching the cabin material direction.", ja: "長距離ドライブの快適性を高め、キャビンの素材方向性と調和するランバーサポートクッション。" },
        details: [{ en: "Lower-back support", ja: "腰部サポート" }, { en: "Soft-touch cabin accessory", ja: "ソフトタッチなキャビンアクセサリー" }, { en: "Designed for long-distance comfort", ja: "長距離快適性に向けた設計" }],
        galleryImages: ["/uploads/product/product/automotive-interior/lumbar cushion/lumbar cushion-cover.jpg", "/uploads/product/product/automotive-interior/lumbar cushion/lumbar cushion-01.jpg", "/uploads/product/product/automotive-interior/lumbar cushion/lumbar cushion-03.jpg", "/uploads/product/product/automotive-interior/lumbar cushion/lumbar cushion-04.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/seatbelt-cover.jpg",
        title: { en: "Seat Belt Cover", ja: "シートベルトカバー" },
        description: { en: "Seat belt covers that soften high-contact zones and introduce a refined material detail near the shoulder line.", ja: "肩まわりの高接触ゾーンをやわらげ、上質な素材ディテールを加えるシートベルトカバー。" },
        details: [{ en: "High-contact comfort detail", ja: "高接触部の快適ディテール" }, { en: "Leather and Alcantara-ready formats", ja: "レザー・Alcantara展開に対応" }, { en: "Easy accessory installation", ja: "取り付けやすいアクセサリー設計" }],
        galleryImages: ["/uploads/product/product/automotive-interior/seat belt cover/seat belt cover-cover.jpg", "/uploads/product/product/automotive-interior/seat belt cover/seat belt cover-01.jpg", "/uploads/product/product/automotive-interior/seat belt cover/seat belt cover-02.jpg", "/uploads/product/product/automotive-interior/seat belt cover/seat belt cover-03.jpg", "/uploads/product/product/automotive-interior/seat belt cover/seat belt cover-04.jpg", "/uploads/product/product/automotive-interior/seat belt cover/seat belt cover-06.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/steering-wheel-cover.jpg",
        title: { en: "Steering Wheel Cover", ja: "ステアリングホイールカバー" },
        description: { en: "Steering wheel covers built for grip, comfort, and a premium driver touch point.", ja: "グリップ感、快適性、上質なドライバー接点に向けたステアリングホイールカバー。" },
        details: [{ en: "Driver grip surface", ja: "ドライバーのグリップ面" }, { en: "Premium tactile finish", ja: "上質な触感仕上げ" }, { en: "Supports coordinated cabin packages", ja: "統一されたキャビンパッケージに対応" }],
        galleryImages: ["/uploads/product/product/automotive-interior/steering wheel cover/steering wheel cover-cover.jpg", "/uploads/product/product/automotive-interior/steering wheel cover/steering wheel cover-01.jpg", "/uploads/product/product/automotive-interior/steering wheel cover/steering wheel cover-02.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/storage-box-cover.jpg",
        title: { en: "Storage Box", ja: "ストレージボックス" },
        description: { en: "Automotive storage boxes that organize daily items while adding a premium soft-surface accent.", ja: "日常の小物を整理しながら、上質なソフトサーフェスのアクセントを加える自動車用ストレージボックス。" },
        details: [{ en: "Organized cabin storage", ja: "キャビン収納の整理" }, { en: "Soft-surface exterior detail", ja: "ソフトサーフェスの外装ディテール" }, { en: "Useful for rear-seat and trunk zones", ja: "後席・トランクエリアに有用" }],
        galleryImages: ["/uploads/product/product/automotive-interior/storage box/storage box-cover.jpg", "/uploads/product/product/automotive-interior/storage box/storage box-02.jpg", "/uploads/product/product/automotive-interior/storage box/storage box-03.jpg", "/uploads/product/product/automotive-interior/storage box/storage box-04.jpg"]
      }
    ],
    description: { en: "A complete accessory program for automotive interiors, from protective floor mats and support cushions to steering, seat-belt, key, and storage touch points.", ja: "フロアマットやサポートクッションからステアリング、シートベルト、キー、収納まわりまで、自動車内装向けアクセサリーを体系化したプログラム。" },
    highlights: [
      {
        title: { en: "Driver contact surfaces", ja: "ドライバー接触面" },
        body: { en: "Steering wheel covers, seat belt covers, key fobs, and keychains designed for daily grip, wear resistance, and premium hand-feel.", ja: "ステアリングホイールカバー、シートベルトカバー、キーフォブ、キーチェーンなど、日常の握り心地、耐摩耗性、上質な触感を考慮したアイテム。" }
      },
      {
        title: { en: "Comfort and support accessories", ja: "快適性・サポートアクセサリー" },
        body: { en: "Headrest pillows, lumbar cushions, and seat cushions tailored for refined cabin comfort and long-distance support.", ja: "ヘッドレストピロー、ランバークッション、シートクッションなど、上質なキャビン快適性と長距離サポートに向けた製品。" }
      },
      {
        title: { en: "Protection and storage systems", ja: "保護・収納システム" },
        body: { en: "Floor mats and storage boxes that protect cabin surfaces while preserving a coordinated interior material language.", ja: "キャビン表面を保護しながら、統一されたインテリア素材表現を保つフロアマットと収納ボックス。" }
      }
    ]
  },
  {
    slug: "tech-accessories",
    title: { en: "Tech Accessories", ja: "テックアクセサリー" },
    subtitle: { en: "Device accessories that bring premium tactile materials into everyday technology.", ja: "日常のテクノロジーにプレミアムな触感素材を取り入れるデバイスアクセサリー。" },
    heroImage: "/uploads/product/product/cover-photo/magsafe-cover.jpg",
    curvedCarouselImages: [
      {
        src: "/uploads/product/product/cover-photo/airpod-case-cover.jpg",
        title: { en: "AirPods Case", ja: "AirPodsケース" },
        description: { en: "Compact AirPods cases with a premium surface finish for daily carry and coordinated tech accessories.", ja: "日常携行と統一感のあるテックアクセサリーに向けた、上質な表面仕上げのコンパクトなAirPodsケース。" },
        details: [{ en: "Compact protective case", ja: "コンパクトな保護ケース" }, { en: "Daily pocket and bag carry", ja: "ポケット・バッグでの日常携行" }, { en: "Coordinates with phone and laptop accessories", ja: "スマートフォン・ラップトップアクセサリーと調和" }],
        galleryImages: ["/uploads/product/product/tech/airpod case/airpod case-01.jpg", "/uploads/product/product/tech/airpod case/airpod case-02.jpg", "/uploads/product/product/tech/airpod case/airpod case-03.jpg", "/uploads/product/product/tech/airpod case/airpod case-04.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/ipad-case-cover.jpg",
        title: { en: "iPad Cover", ja: "iPadカバー" },
        description: { en: "Tablet covers that combine device protection with a refined leather or Alcantara hand-feel.", ja: "デバイス保護と洗練されたレザーまたはAlcantaraの手触りを組み合わせたタブレットカバー。" },
        details: [{ en: "Tablet protection surface", ja: "タブレット保護サーフェス" }, { en: "Slim daily-use profile", ja: "日常使いに適したスリムな形状" }, { en: "Premium tactile exterior", ja: "上質な触感の外装" }],
        galleryImages: ["/uploads/product/product/tech/ipad cover/ipad cover-01.jpg", "/uploads/product/product/tech/ipad cover/ipad cover-02.jpg", "/uploads/product/product/tech/ipad cover/ipad cover-03.jpg", "/uploads/product/product/tech/ipad cover/ipad cover-04.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/iwatch-strape-cover.jpg",
        title: { en: "iWatch Strap", ja: "iWatchストラップ" },
        description: { en: "Wearable straps with soft-touch material character and a refined finish for daily skin contact.", ja: "日常的に肌に触れる用途に向けた、ソフトタッチな素材感と上質な仕上げのウェアラブルストラップ。" },
        details: [{ en: "Wearable contact surface", ja: "ウェアラブル接触面" }, { en: "Soft hand-feel for daily use", ja: "日常使用に適した柔らかな手触り" }, { en: "Premium alternative to silicone bands", ja: "シリコンバンドに代わる上質な選択肢" }],
        galleryImages: ["/uploads/product/product/tech/iwatch strape/iwatch strape-cover.png", "/uploads/product/product/tech/iwatch strape/iwatch strape-02.jpg", "/uploads/product/product/tech/iwatch strape/iwatch strape-03.jpg", "/uploads/product/product/tech/iwatch strape/iwatch strape-04.jpg", "/uploads/product/product/tech/iwatch strape/iwatch strape-05.jpg", "/uploads/product/product/tech/iwatch strape/iwatch strape-06.jpg", "/uploads/product/product/tech/iwatch strape/iwatch strape-07.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/macbook-cover.jpg",
        title: { en: "MacBook Cover", ja: "MacBookカバー" },
        description: { en: "Laptop covers that protect the device while giving the workspace a warmer material expression.", ja: "デバイスを保護しながら、ワークスペースに温かみのある素材表現を加えるラップトップカバー。" },
        details: [{ en: "Laptop protection layer", ja: "ラップトップ保護レイヤー" }, { en: "Desk-ready tactile finish", ja: "デスクに映える触感仕上げ" }, { en: "Suitable for leather and Alcantara programs", ja: "レザー・Alcantaraプログラムに対応" }],
        galleryImages: ["/uploads/product/product/tech/macbook cover/macbook cover-01.jpg", "/uploads/product/product/tech/macbook cover/macbook cover-02.jpg", "/uploads/product/product/tech/macbook cover/macbook cover-03.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/magsafe-cover.jpg",
        title: { en: "MagSafe Accessory", ja: "MagSafeアクセサリー" },
        description: { en: "MagSafe accessories that add a premium material touch to charging, mounting, and daily phone handling.", ja: "充電、マウント、日常のスマートフォン操作に上質な素材感を加えるMagSafeアクセサリー。" },
        details: [{ en: "Magnetic phone accessory", ja: "マグネット式スマートフォンアクセサリー" }, { en: "Premium daily touch point", ja: "日常的に触れる上質な接点" }, { en: "Coordinates with phone case programs", ja: "スマートフォンケースプログラムと調和" }],
        galleryImages: ["/uploads/product/product/tech/magsafe/magsafe-cover.jpg", "/uploads/product/product/tech/magsafe/magsafe-01.jpg", "/uploads/product/product/tech/magsafe/magsafe-02.jpg", "/uploads/product/product/tech/magsafe/magsafe-03.jpg", "/uploads/product/product/tech/magsafe/magsafe-04.jpg", "/uploads/product/product/tech/magsafe/magsafe-05.jpg", "/uploads/product/product/tech/magsafe/magsafe-07.jpg", "/uploads/product/product/tech/magsafe/magsafe-08.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/phone-case-alcantara-cover.jpg",
        title: { en: "Alcantara Phone Case", ja: "Alcantaraスマートフォンケース" },
        description: { en: "Alcantara phone cases with a matte, tactile surface for a warmer and more distinctive device feel.", ja: "マットで触感的な表面により、デバイスへ温かみと個性を加えるAlcantaraスマートフォンケース。" },
        details: [{ en: "Matte Alcantara surface", ja: "マットなAlcantara表面" }, { en: "Soft grip for daily handling", ja: "日常操作に適したソフトグリップ" }, { en: "Distinctive alternative to plastic cases", ja: "プラスチックケースに代わる個性的な選択肢" }],
        galleryImages: ["/uploads/product/product/tech/phone case alcantara/phone case alcantara-cover.jpg", "/uploads/product/product/tech/phone case alcantara/phone case alcantara-01.jpg", "/uploads/product/product/tech/phone case alcantara/phone case alcantara-02.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/iphone-case-leather-cover.jpg",
        title: { en: "Leather Phone Case", ja: "レザースマートフォンケース" },
        description: { en: "Leather phone cases that bring heritage material character and refined edge finishing to everyday devices.", ja: "日常のデバイスにヘリテージ素材の表情と洗練されたエッジ仕上げをもたらすレザースマートフォンケース。" },
        details: [{ en: "Premium leather exterior", ja: "プレミアムレザー外装" }, { en: "Refined edge and stitch detail", ja: "洗練されたエッジとステッチディテール" }, { en: "Daily device protection", ja: "日常的なデバイス保護" }],
        galleryImages: ["/uploads/product/product/tech/phone case leather/phone case leather-01.jpg", "/uploads/product/product/tech/phone case leather/phone case leather-02.jpg", "/uploads/product/product/tech/phone case leather/phone case leather-03.jpg", "/uploads/product/product/tech/phone case leather/phone case leather-04.jpg", "/uploads/product/product/tech/phone case leather/phone case leather-05.jpg"]
      }
    ],
    description: { en: "Surface programs for phone cases, MagSafe accessories, tablet and laptop covers, wearable straps, and audio-device cases.", ja: "スマートフォンケース、MagSafeアクセサリー、タブレット・ラップトップカバー、ウェアラブルストラップ、オーディオデバイスケース向けの表面素材プログラム。" },
    highlights: [
      {
        title: { en: "Device protection", ja: "デバイス保護" },
        body: { en: "Phone, tablet, laptop, and AirPods cases with soft-touch finishes, precise fit, and elevated material presence.", ja: "スマートフォン、タブレット、ラップトップ、AirPods向けに、ソフトタッチ仕上げ、精密なフィット感、上質な素材感を備えたケース。" }
      },
      {
        title: { en: "Magnetic and wearable details", ja: "マグネット・ウェアラブルディテール" },
        body: { en: "MagSafe accessories and watch straps that turn daily device contact into a tactile brand moment.", ja: "MagSafeアクセサリーとウォッチストラップにより、毎日のデバイス接点を触感的なブランド体験へ変えます。" }
      },
      {
        title: { en: "Leather and Alcantara options", ja: "レザー・Alcantaraオプション" },
        body: { en: "Material executions in premium leather and Alcantara for brands seeking a warmer alternative to plastic and silicone.", ja: "プラスチックやシリコンとは異なる温かみを求めるブランドに向けた、プレミアムレザーとAlcantaraの素材展開。" }
      }
    ]
  },
  {
    slug: "lifestyle",
    title: { en: "Lifestyle", ja: "ライフスタイル" },
    subtitle: { en: "Travel, carry, and personal accessories shaped by premium European materials.", ja: "プレミアムな欧州素材で仕立てるトラベル、キャリー、パーソナルアクセサリー。" },
    heroImage: "/uploads/product/product/cover-photo/bagpack-cover.jpg",
    curvedCarouselImages: [
      {
        src: "/uploads/product/product/cover-photo/bagpack-cover.jpg",
        title: { en: "Backpack", ja: "バックパック" },
        description: { en: "Premium backpacks for daily carry, travel, and branded lifestyle collections.", ja: "日常携行、旅行、ブランドライフスタイルコレクションに向けたプレミアムバックパック。" },
        details: [{ en: "Daily carry format", ja: "日常携行フォーマット" }, { en: "Premium exterior and interior touch points", ja: "上質な外装・内装接点" }, { en: "Suitable for lifestyle merchandise", ja: "ライフスタイル商品に対応" }],
        galleryImages: ["/uploads/product/product/lifestyle/bagpack/bagpack-cover.jpg", "/uploads/product/product/lifestyle/bagpack/bagpack-02.jpg", "/uploads/product/product/lifestyle/bagpack/bagpack-03.jpg", "/uploads/product/product/lifestyle/bagpack/bagpack-04.jpg", "/uploads/product/product/lifestyle/bagpack/bagpack-05.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/cap-cover.jpg",
        title: { en: "Cap", ja: "キャップ" },
        description: { en: "Material-forward caps for branded lifestyle programs and gift-ready merchandise.", ja: "ブランドライフスタイルプログラムとギフト向け商品に適した、素材感を活かしたキャップ。" },
        details: [{ en: "Wearable brand accessory", ja: "身につけるブランドアクセサリー" }, { en: "Soft material accent", ja: "柔らかな素材アクセント" }, { en: "Suitable for event and retail programs", ja: "イベント・リテールプログラムに対応" }],
        galleryImages: ["/uploads/product/product/lifestyle/cap/cap-01.jpg", "/uploads/product/product/lifestyle/cap/cap-02.jpg", "/uploads/product/product/lifestyle/cap/cap-03.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/cardholder-cover.jpg",
        title: { en: "Cardholder", ja: "カードホルダー" },
        description: { en: "Slim cardholders with refined leather finishing for personal carry and premium gifting.", ja: "個人携行とプレミアムギフトに適した、洗練されたレザー仕上げのスリムなカードホルダー。" },
        details: [{ en: "Slim personal carry", ja: "スリムな個人携行" }, { en: "Refined leather finish", ja: "洗練されたレザー仕上げ" }, { en: "Gift-ready small leather good", ja: "ギフトに適した小物レザーグッズ" }],
        galleryImages: ["/uploads/product/product/lifestyle/cardholder/cardholder-cover.jpg", "/uploads/product/product/lifestyle/cardholder/cardholder-01.jpg", "/uploads/product/product/lifestyle/cardholder/cardholder-02.jpg", "/uploads/product/product/lifestyle/cardholder/cardholder-04.jpg", "/uploads/product/product/lifestyle/cardholder/cardholder-05.jpg", "/uploads/product/product/lifestyle/cardholder/cardholder-06.jpg", "/uploads/product/product/lifestyle/cardholder/cardholder-07.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/duffle-bag-cover.jpg",
        title: { en: "Duffle Bag", ja: "ダッフルバッグ" },
        description: { en: "Duffle bags for travel and weekend use, balancing soft structure with premium material character.", ja: "旅行や週末使いに向けて、柔らかな構造と上質な素材感を両立するダッフルバッグ。" },
        details: [{ en: "Travel and weekend carry", ja: "旅行・週末の携行" }, { en: "Soft structured silhouette", ja: "柔らかな構造のシルエット" }, { en: "Premium leather and textile detailing", ja: "上質なレザー・テキスタイルディテール" }],
        galleryImages: ["/uploads/product/product/lifestyle/duffle bag/duffle bag-cover.jpg", "/uploads/product/product/lifestyle/duffle bag/duffle bag-02.jpg", "/uploads/product/product/lifestyle/duffle bag/duffle bag-03.jpg", "/uploads/product/product/lifestyle/duffle bag/duffle bag-04.jpg", "/uploads/product/product/lifestyle/duffle bag/duffle bag-05.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/luggage-case-cover.jpg",
        title: { en: "Luggage Case", ja: "ラゲージケース" },
        description: { en: "Luggage cases that bring premium surface materials into travel storage and presentation.", ja: "トラベル収納とプレゼンテーションにプレミアムな表面素材を取り入れるラゲージケース。" },
        details: [{ en: "Travel storage format", ja: "トラベル収納フォーマット" }, { en: "Premium material surface", ja: "プレミアム素材サーフェス" }, { en: "Designed for coordinated travel sets", ja: "統一感のあるトラベルセットに向けた設計" }],
        galleryImages: ["/uploads/product/product/lifestyle/luggage case /luggage case -cover.jpg", "/uploads/product/product/lifestyle/luggage case /luggage case -02.jpg", "/uploads/product/product/lifestyle/luggage case /luggage case -03.jpg", "/uploads/product/product/lifestyle/luggage case /luggage case -04.jpg", "/uploads/product/product/lifestyle/luggage case /luggage case -05.jpg", "/uploads/product/product/lifestyle/luggage case /luggage case -06.jpg", "/uploads/product/product/lifestyle/luggage case /luggage case -07.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/passport-holder-cover.jpg",
        title: { en: "Passport Holder", ja: "パスポートホルダー" },
        description: { en: "Passport holders that protect travel documents with a refined, tactile material finish.", ja: "洗練された触感素材の仕上げで旅行書類を保護するパスポートホルダー。" },
        details: [{ en: "Travel document protection", ja: "旅行書類の保護" }, { en: "Slim leather carry format", ja: "スリムなレザー携行形式" }, { en: "Suitable for travel gifting", ja: "トラベルギフトに対応" }],
        galleryImages: ["/uploads/product/product/lifestyle/passport holder/passport holder-cover.jpg", "/uploads/product/product/lifestyle/passport holder/passport holder-01.jpg", "/uploads/product/product/lifestyle/passport holder/passport holder-03.jpg", "/uploads/product/product/lifestyle/passport holder/passport holder-04.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/pouch-cover.jpg",
        title: { en: "Pouch", ja: "ポーチ" },
        description: { en: "Compact pouches for organizing daily essentials with a premium soft-touch surface.", ja: "日常の必需品を整理するための、上質なソフトタッチ表面を備えたコンパクトポーチ。" },
        details: [{ en: "Daily essentials organizer", ja: "日常必需品の整理" }, { en: "Compact soft-good format", ja: "コンパクトなソフトグッズ形式" }, { en: "Works for retail and gift programs", ja: "リテール・ギフトプログラムに対応" }],
        galleryImages: ["/uploads/product/product/lifestyle/pouch/pouch-cover.jpg", "/uploads/product/product/lifestyle/pouch/pouch-01.jpg", "/uploads/product/product/lifestyle/pouch/pouch-03.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/spectacle-case-cover.jpg",
        title: { en: "Spectacle Case", ja: "メガネケース" },
        description: { en: "Spectacle cases that protect eyewear while adding a tactile premium moment to daily accessories.", ja: "アイウェアを保護しながら、日常アクセサリーに触感的な上質感を加えるメガネケース。" },
        details: [{ en: "Eyewear protection", ja: "アイウェア保護" }, { en: "Structured case format", ja: "構造的なケース形式" }, { en: "Premium gift accessory", ja: "プレミアムギフトアクセサリー" }],
        galleryImages: ["/uploads/product/product/lifestyle/spectacle case /spectacle case -cover.jpg", "/uploads/product/product/lifestyle/spectacle case /spectacle case -01.jpg", "/uploads/product/product/lifestyle/spectacle case /spectacle case -03.jpg", "/uploads/product/product/lifestyle/spectacle case /spectacle case -04.jpg", "/uploads/product/product/lifestyle/spectacle case /spectacle case -05.jpg", "/uploads/product/product/lifestyle/spectacle case /spectacle case -06.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/wallet-cover.jpg",
        title: { en: "Wallet", ja: "ウォレット" },
        description: { en: "Wallets with refined material finishing for everyday carry and gifting.", ja: "日常携行とギフトに適した、洗練された素材仕上げのウォレット。" },
        details: [{ en: "Everyday carry essential", ja: "日常携行の必需品" }, { en: "Refined leather construction", ja: "洗練されたレザー構造" }, { en: "Gift-ready presentation", ja: "ギフトに適したプレゼンテーション" }],
        galleryImages: ["/uploads/product/product/lifestyle/wallet/wallet-01.jpg", "/uploads/product/product/lifestyle/wallet/wallet-02.jpg", "/uploads/product/product/lifestyle/wallet/wallet-03.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/washbag-cover.jpg",
        title: { en: "Washbag", ja: "ウォッシュバッグ" },
        description: { en: "Washbags for travel grooming essentials, finished with durable premium materials.", ja: "旅行用グルーミング用品を収納する、耐久性のあるプレミアム素材仕上げのウォッシュバッグ。" },
        details: [{ en: "Travel grooming storage", ja: "旅行用グルーミング収納" }, { en: "Durable soft-good construction", ja: "耐久性のあるソフトグッズ構造" }, { en: "Coordinates with bag and luggage sets", ja: "バッグ・ラゲージセットと調和" }],
        galleryImages: ["/uploads/product/product/lifestyle/washbag/washbag-cover.jpg", "/uploads/product/product/lifestyle/washbag/washbag-02.jpg", "/uploads/product/product/lifestyle/washbag/washbag-03.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/watch-case-cover.jpg",
        title: { en: "Watch Case", ja: "ウォッチケース" },
        description: { en: "Watch cases that protect timepieces with a soft, presentation-ready material interior.", ja: "柔らかくプレゼンテーションに適した素材内装で時計を保護するウォッチケース。" },
        details: [{ en: "Timepiece protection", ja: "時計の保護" }, { en: "Soft interior surface", ja: "柔らかな内装表面" }, { en: "Suitable for luxury gifting", ja: "ラグジュアリーギフトに対応" }],
        galleryImages: ["/uploads/product/product/lifestyle/watch case/watch case-01.jpg", "/uploads/product/product/lifestyle/watch case/watch case-02.jpg"]
      }
    ],
    description: { en: "Lifestyle collections spanning bags, luggage, wallets, cases, pouches, caps, and travel accessories for daily use and gifting.", ja: "バッグ、ラゲージ、ウォレット、ケース、ポーチ、キャップ、トラベルアクセサリーまで、日常使いとギフトに向けたライフスタイルコレクション。" },
    highlights: [
      {
        title: { en: "Travel and carry goods", ja: "トラベル・キャリーグッズ" },
        body: { en: "Backpacks, duffle bags, luggage cases, washbags, and passport holders built for repeated travel touch points.", ja: "バックパック、ダッフルバッグ、ラゲージケース、ウォッシュバッグ、パスポートホルダーなど、旅の接点に耐える製品。" }
      },
      {
        title: { en: "Personal accessories", ja: "パーソナルアクセサリー" },
        body: { en: "Wallets, cardholders, pouches, caps, spectacle cases, and watch cases with refined finishing for daily carry.", ja: "ウォレット、カードホルダー、ポーチ、キャップ、メガネケース、ウォッチケースなど、日常携行に適した上質な仕上げ。" }
      },
      {
        title: { en: "Gift-ready material stories", ja: "ギフトに適した素材表現" },
        body: { en: "Coordinated product families that translate tactile material quality into memorable lifestyle gifts.", ja: "触感的な素材品質を印象的なライフスタイルギフトへ展開する、統一感のある製品ファミリー。" }
      }
    ]
  },
  {
    slug: "corporation-gift",
    title: { en: "Corporate Gifts", ja: "法人ギフト" },
    subtitle: { en: "Executive workspace essentials crafted for brand gifting and business presentation.", ja: "ブランドギフトとビジネスシーンに向けて仕立てるエグゼクティブワークスペース用品。" },
    heroImage: "/uploads/product/product/cover-photo/tray-cover.jpg",
    curvedCarouselImages: [
      {
        src: "/uploads/product/product/cover-photo/business-cardholder-cover.jpg",
        title: { en: "Business Card Holder", ja: "名刺ホルダー" },
        description: { en: "Business card holders for executive desks, reception areas, and corporate gifting programs.", ja: "エグゼクティブデスク、受付エリア、法人ギフトプログラムに向けた名刺ホルダー。" },
        details: [{ en: "Desk and reception accessory", ja: "デスク・受付アクセサリー" }, { en: "Premium business presentation", ja: "上質なビジネスプレゼンテーション" }, { en: "Suitable for branded office sets", ja: "ブランドオフィスセットに対応" }],
        galleryImages: ["/uploads/product/product/office/business card holder/business card holder-01.jpg", "/uploads/product/product/office/business card holder/business card holder-02.jpg", "/uploads/product/product/office/business card holder/business card holder-03.jpg", "/uploads/product/product/office/business card holder/business card holder-04.jpg", "/uploads/product/product/office/business card holder/business card holder-05.jpg", "/uploads/product/product/office/business card holder/business card holder-06.jpg", "/uploads/product/product/office/business card holder/business card holder-07.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/desk-mat-cover.jpg",
        title: { en: "Desk Mat", ja: "デスクマット" },
        description: { en: "Desk mats that define the workspace with a premium tactile surface and clean visual order.", ja: "上質な触感表面と整った視覚秩序でワークスペースを整えるデスクマット。" },
        details: [{ en: "Workspace surface layer", ja: "ワークスペースの表面レイヤー" }, { en: "Premium desk touch point", ja: "上質なデスク接点" }, { en: "Works with corporate gift sets", ja: "法人ギフトセットと調和" }],
        galleryImages: ["/uploads/product/product/office/desk mat/desk mat-cover.jpg", "/uploads/product/product/office/desk mat/desk mat-02.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/mouse-mat-cover.jpg",
        title: { en: "Mouse Mat", ja: "マウスマット" },
        description: { en: "Mouse mats that add a soft, premium surface to everyday desk interaction.", ja: "日常のデスク操作に柔らかく上質な表面を加えるマウスマット。" },
        details: [{ en: "Daily desk interaction surface", ja: "日常のデスク操作面" }, { en: "Soft-touch material finish", ja: "ソフトタッチ素材仕上げ" }, { en: "Compact branded gift option", ja: "コンパクトなブランドギフトオプション" }],
        galleryImages: ["/uploads/product/product/office/mouse mat/mouse mat-cover.jpg", "/uploads/product/product/office/mouse mat/mouse mat-02.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/notebook-cover.jpg",
        title: { en: "Notebook", ja: "ノートブック" },
        description: { en: "Notebook covers and stationery surfaces that bring premium materials into meetings and daily work.", ja: "会議や日常業務にプレミアム素材を取り入れるノートブックカバーとステーショナリー表面。" },
        details: [{ en: "Meeting and desk accessory", ja: "会議・デスクアクセサリー" }, { en: "Premium cover material", ja: "プレミアムカバー素材" }, { en: "Suitable for executive gifting", ja: "エグゼクティブギフトに対応" }],
        galleryImages: ["/uploads/product/product/office/notebook/notebook-cover.jpg", "/uploads/product/product/office/notebook/notebook-02.jpg", "/uploads/product/product/office/notebook/notebook-03.jpg", "/uploads/product/product/office/notebook/notebook-04.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/seat-cushion-cover.jpg",
        title: { en: "Seat Cushion", ja: "シートクッション" },
        description: { en: "Seat cushions for offices, lounges, and hospitality spaces where comfort and surface quality both matter.", ja: "快適性と表面品質の両方が重要なオフィス、ラウンジ、ホスピタリティ空間向けシートクッション。" },
        details: [{ en: "Comfort-focused seating accessory", ja: "快適性を重視した座席アクセサリー" }, { en: "Soft premium surface", ja: "柔らかなプレミアム表面" }, { en: "Suitable for office and lounge programs", ja: "オフィス・ラウンジプログラムに対応" }],
        galleryImages: ["/uploads/product/product/office/seat cushion/seat cushion-cover.jpg", "/uploads/product/product/office/seat cushion/seat cushion-02.jpg", "/uploads/product/product/office/seat cushion/seat cushion-03.jpg", "/uploads/product/product/office/seat cushion/seat cushion-04.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/tray-cover.jpg",
        title: { en: "Tray", ja: "トレイ" },
        description: { en: "Desk and valet trays that organize essentials while creating a refined branded touch point.", ja: "必需品を整理しながら、洗練されたブランド接点をつくるデスク・バレットトレイ。" },
        details: [{ en: "Desk and valet organization", ja: "デスク・バレット整理" }, { en: "Premium catch-all surface", ja: "上質なキャッチオール表面" }, { en: "Ideal for corporate gift sets", ja: "法人ギフトセットに最適" }],
        galleryImages: ["/uploads/product/product/office/tray/tray-cover.jpg", "/uploads/product/product/office/tray/tray-01.jpg", "/uploads/product/product/office/tray/tray-02.jpg", "/uploads/product/product/office/tray/tray-03.jpg", "/uploads/product/product/office/tray/tray-04.jpg", "/uploads/product/product/office/tray/tray-05.jpg", "/uploads/product/product/office/tray/tray-07.jpg"]
      }
    ],
    description: { en: "Corporate gift programs for desks, meeting rooms, events, and executive presentation, including trays, mats, notebooks, card holders, and seat cushions.", ja: "トレイ、マット、ノートブック、カードホルダー、シートクッションなど、デスク、会議室、イベント、エグゼクティブ向けプレゼンテーションに対応する法人ギフトプログラム。" },
    highlights: [
      {
        title: { en: "Executive desk accessories", ja: "エグゼクティブデスクアクセサリー" },
        body: { en: "Trays, desk mats, mouse mats, notebooks, and business card holders that bring a consistent material language to the workspace.", ja: "トレイ、デスクマット、マウスマット、ノートブック、名刺ホルダーにより、ワークスペースへ統一された素材表現をもたらします。" }
      },
      {
        title: { en: "Meeting and presentation pieces", ja: "会議・プレゼンテーション用品" },
        body: { en: "Objects suited to boardrooms, client gifts, showrooms, and event presentation where tactile quality reflects the brand.", ja: "役員会議室、顧客ギフト、ショールーム、イベント展示など、触感品質がブランドを映す場面に適したアイテム。" }
      },
      {
        title: { en: "Comfort-focused office details", ja: "快適性を高めるオフィスディテール" },
        body: { en: "Seat cushions and soft-touch accessories that make long work sessions feel more considered and premium.", ja: "シートクッションやソフトタッチアクセサリーにより、長時間のワークセッションに配慮と上質感を加えます。" }
      }
    ]
  }
];

type CarouselContentOverride = {
  customizedOption: LocalizedString;
  description?: LocalizedString;
};

const carouselContentOverrides = carouselContentOverridesData as Record<string, CarouselContentOverride[]>;

export const productCategories: ProductCategory[] = productCategoryFixtures.map((category) => ({
  ...category,
  curvedCarouselImages: category.curvedCarouselImages?.map((item, index) => {
    const override = carouselContentOverrides[category.slug]?.[index];

    return {
      ...item,
      customizedOption: override?.customizedOption,
      description: override?.description ?? item.description
    };
  })
}));

export function getProductCategory(slug: string): ProductCategory | undefined {
  return productCategories.find((cat) => cat.slug === slug);
}
