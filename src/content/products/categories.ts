import { normalizeLocalizedBrandNames } from "../../lib/locales";
import { chineseCopy } from "../../china/copy";
import type { LocalizedString, Seo } from "@/lib/content";
import carouselContentOverridesData from "@/data/product-category-carousel-overrides.json";

export type ProductCategory = {
  slug: string;
  updatedAt?: string;
  seo?: Seo;
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
    title: { zh: chineseCopy("Automotive Interior Accessories"), en: "Automotive Interior Accessories", ja: "自動車インテリアアクセサリー" },
    subtitle: { zh: chineseCopy("Custom-fit cabin accessories in premium leather, Alcantara, and technical textiles."), en: "Custom-fit cabin accessories in premium leather, Alcantara, and technical textiles.", ja: "プレミアムレザー、Alcantara、テクニカルテキスタイルで仕立てる自動車インテリアアクセサリー。" },
    heroImage: "/uploads/product/product/cover-photo/headrest-pillow-cover.jpg",
    curvedCarouselImages: [
      {
        src: "/uploads/product/product/cover-photo/floormat-cover.jpg",
        title: { zh: chineseCopy("Floor Mat"), en: "Floor Mat", ja: "フロアマット" },
        description: { zh: chineseCopy("Custom automotive floor mats that protect the cabin while carrying the same premium material language as the interior."), en: "Custom automotive floor mats that protect the cabin while carrying the same premium material language as the interior.", ja: "キャビンを保護しながら、インテリアと同じ上質な素材表現を保つカスタム自動車フロアマット。" },
        details: [{ zh: chineseCopy("Protective cabin floor surface"), en: "Protective cabin floor surface", ja: "キャビン床面の保護" }, { zh: chineseCopy("Leather and textile finish options"), en: "Leather and textile finish options", ja: "レザー・テキスタイル仕上げに対応" }, { zh: chineseCopy("Designed for coordinated interiors"), en: "Designed for coordinated interiors", ja: "統一感のある内装に向けた設計" }],
        galleryImages: ["/uploads/product/product/automotive-interior/floor mat/floor mat-cover.jpg", "/uploads/product/product/automotive-interior/floor mat/floor mat-01.jpg", "/uploads/product/product/automotive-interior/floor mat/floor mat-03.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/headrest-pillow-cover.jpg",
        title: { zh: chineseCopy("Headrest Pillow"), en: "Headrest Pillow", ja: "ヘッドレストピロー" },
        description: { zh: chineseCopy("Soft headrest pillows for premium cabins, adding comfort, material contrast, and a tailored accessory detail."), en: "Soft headrest pillows for premium cabins, adding comfort, material contrast, and a tailored accessory detail.", ja: "プレミアムキャビンに快適性、素材のコントラスト、仕立て感のあるアクセサリーディテールを加えるヘッドレストピロー。" },
        details: [{ zh: chineseCopy("Neck and head support"), en: "Neck and head support", ja: "首・頭部のサポート" }, { zh: chineseCopy("Soft-touch premium surface"), en: "Soft-touch premium surface", ja: "ソフトタッチなプレミアム表面" }, { zh: chineseCopy("Suitable for front and rear seats"), en: "Suitable for front and rear seats", ja: "前席・後席に対応" }],
        galleryImages: ["/uploads/product/product/automotive-interior/headrest pillow/headrest pillow-cover.jpg", "/uploads/product/product/automotive-interior/headrest pillow/headrest pillow-01.jpg", "/uploads/product/product/automotive-interior/headrest pillow/headrest pillow-02.jpg", "/uploads/product/product/automotive-interior/headrest pillow/headrest pillow-03.jpg", "/uploads/product/product/automotive-interior/headrest pillow/headrest pillow-04.jpg", "/uploads/product/product/automotive-interior/headrest pillow/headrest pillow-06.jpg", "/uploads/product/product/automotive-interior/headrest pillow/headrest pillow-07.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/key-fob-cover.jpg",
        title: { zh: chineseCopy("Key Fob"), en: "Key Fob", ja: "キーフォブ" },
        description: { zh: chineseCopy("Premium key fob covers that turn a daily automotive touch point into a small branded material object."), en: "Premium key fob covers that turn a daily automotive touch point into a small branded material object.", ja: "毎日触れる自動車キーを、小さなブランド素材オブジェクトへ変えるプレミアムキーフォブカバー。" },
        details: [{ zh: chineseCopy("Daily carry touch point"), en: "Daily carry touch point", ja: "日常携行の接点" }, { zh: chineseCopy("Precision fit and stitched finish"), en: "Precision fit and stitched finish", ja: "精密なフィットとステッチ仕上げ" }, { zh: chineseCopy("Brandable leather accessory"), en: "Brandable leather accessory", ja: "ブランド展開可能なレザーアクセサリー" }],
        galleryImages: ["/uploads/product/product/automotive-interior/key fob/key fob-cover.jpg", "/uploads/product/product/automotive-interior/key fob/key fob-01.jpg", "/uploads/product/product/automotive-interior/key fob/key fob-02.jpg", "/uploads/product/product/automotive-interior/key fob/key fob-04.jpg", "/uploads/product/product/automotive-interior/key fob/key fob-05.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/keychain-cover.jpg",
        title: { zh: chineseCopy("Leather Keychain P1"), en: "Leather Keychain P1", ja: "レザーキーチェーン P1" },
        description: { zh: chineseCopy("A compact leather keychain format for automotive, hospitality, and lifestyle gifting programs."), en: "A compact leather keychain format for automotive, hospitality, and lifestyle gifting programs.", ja: "自動車、ホスピタリティ、ライフスタイルギフト向けのコンパクトなレザーキーチェーン。" },
        details: [{ zh: chineseCopy("Compact gift format"), en: "Compact gift format", ja: "コンパクトなギフト形式" }, { zh: chineseCopy("Premium edge and stitch detail"), en: "Premium edge and stitch detail", ja: "上質なエッジとステッチディテール" }, { zh: chineseCopy("Suitable for branded programs"), en: "Suitable for branded programs", ja: "ブランドプログラムに対応" }],
        galleryImages: ["/uploads/product/product/automotive-interior/keychain p1/keychain p1-cover.jpg", "/uploads/product/product/automotive-interior/keychain p1/keychain p1-01.jpg", "/uploads/product/product/automotive-interior/keychain p1/keychain p1-02.jpg", "/uploads/product/product/automotive-interior/keychain p1/keychain p1-03.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/keychain-p2-cover.jpg",
        title: { zh: chineseCopy("Leather Keychain P2"), en: "Leather Keychain P2", ja: "レザーキーチェーン P2" },
        description: { zh: chineseCopy("A refined keychain silhouette with tactile leather finishing for daily carry and corporate gifting."), en: "A refined keychain silhouette with tactile leather finishing for daily carry and corporate gifting.", ja: "日常携行と法人ギフトに適した、触感的なレザー仕上げの洗練されたキーチェーンシルエット。" },
        details: [{ zh: chineseCopy("Refined carry silhouette"), en: "Refined carry silhouette", ja: "洗練された携行シルエット" }, { zh: chineseCopy("Leather loop and metal hardware"), en: "Leather loop and metal hardware", ja: "レザーループとメタル金具" }, { zh: chineseCopy("Designed for daily handling"), en: "Designed for daily handling", ja: "日常的な使用に向けた設計" }],
        galleryImages: ["/uploads/product/product/automotive-interior/keychain p2/keychain p2-cover.jpg", "/uploads/product/product/automotive-interior/keychain p2/keychain p2-01.jpg", "/uploads/product/product/automotive-interior/keychain p2/keychain p2-03.jpg", "/uploads/product/product/automotive-interior/keychain p2/keychain p2-04.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/keychain-carbon-cover.jpg",
        title: { zh: chineseCopy("Leather Keychain P3"), en: "Leather Keychain P3", ja: "レザーキーチェーン P3" },
        description: { zh: chineseCopy("A statement keychain variation for premium automotive accessories and branded merchandise."), en: "A statement keychain variation for premium automotive accessories and branded merchandise.", ja: "プレミアム自動車アクセサリーとブランド商品に向けた、存在感のあるキーチェーンバリエーション。" },
        details: [{ zh: chineseCopy("Statement accessory profile"), en: "Statement accessory profile", ja: "存在感のあるアクセサリープロファイル" }, { zh: chineseCopy("Durable daily-use construction"), en: "Durable daily-use construction", ja: "日常使用に耐える構造" }, { zh: chineseCopy("Works across vehicle and lifestyle programs"), en: "Works across vehicle and lifestyle programs", ja: "車両・ライフスタイルプログラムに対応" }],
        galleryImages: ["/uploads/product/product/automotive-interior/keychain p3/keychain p3-01.jpg", "/uploads/product/product/automotive-interior/keychain p3/keychain p3-02.jpg", "/uploads/product/product/automotive-interior/keychain p3/keychain p3-03.jpg", "/uploads/product/product/automotive-interior/keychain p3/keychain p3-04.jpg", "/uploads/product/product/automotive-interior/keychain p3/keychain p3-05.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/lumbar-cushion-cover.jpg",
        title: { zh: chineseCopy("Lumbar Cushion"), en: "Lumbar Cushion", ja: "ランバークッション" },
        description: { zh: chineseCopy("Lumbar support cushions that add comfort to long drives while matching the cabin material direction."), en: "Lumbar support cushions that add comfort to long drives while matching the cabin material direction.", ja: "長距離ドライブの快適性を高め、キャビンの素材方向性と調和するランバーサポートクッション。" },
        details: [{ zh: chineseCopy("Lower-back support"), en: "Lower-back support", ja: "腰部サポート" }, { zh: chineseCopy("Soft-touch cabin accessory"), en: "Soft-touch cabin accessory", ja: "ソフトタッチなキャビンアクセサリー" }, { zh: chineseCopy("Designed for long-distance comfort"), en: "Designed for long-distance comfort", ja: "長距離快適性に向けた設計" }],
        galleryImages: ["/uploads/product/product/automotive-interior/lumbar cushion/lumbar cushion-cover.jpg", "/uploads/product/product/automotive-interior/lumbar cushion/lumbar cushion-01.jpg", "/uploads/product/product/automotive-interior/lumbar cushion/lumbar cushion-03.jpg", "/uploads/product/product/automotive-interior/lumbar cushion/lumbar cushion-04.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/seatbelt-cover.jpg",
        title: { zh: chineseCopy("Seat Belt Cover"), en: "Seat Belt Cover", ja: "シートベルトカバー" },
        description: { zh: chineseCopy("Seat belt covers that soften high-contact zones and introduce a refined material detail near the shoulder line."), en: "Seat belt covers that soften high-contact zones and introduce a refined material detail near the shoulder line.", ja: "肩まわりの高接触ゾーンをやわらげ、上質な素材ディテールを加えるシートベルトカバー。" },
        details: [{ zh: chineseCopy("High-contact comfort detail"), en: "High-contact comfort detail", ja: "高接触部の快適ディテール" }, { zh: chineseCopy("Leather and Alcantara-ready formats"), en: "Leather and Alcantara-ready formats", ja: "レザー・Alcantara展開に対応" }, { zh: chineseCopy("Easy accessory installation"), en: "Easy accessory installation", ja: "取り付けやすいアクセサリー設計" }],
        galleryImages: ["/uploads/product/product/automotive-interior/seat belt cover/seat belt cover-cover.jpg", "/uploads/product/product/automotive-interior/seat belt cover/seat belt cover-01.jpg", "/uploads/product/product/automotive-interior/seat belt cover/seat belt cover-02.jpg", "/uploads/product/product/automotive-interior/seat belt cover/seat belt cover-03.jpg", "/uploads/product/product/automotive-interior/seat belt cover/seat belt cover-04.jpg", "/uploads/product/product/automotive-interior/seat belt cover/seat belt cover-06.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/steering-wheel-cover.jpg",
        title: { zh: chineseCopy("Steering Wheel Cover"), en: "Steering Wheel Cover", ja: "ステアリングホイールカバー" },
        description: { zh: chineseCopy("Steering wheel covers built for grip, comfort, and a premium driver touch point."), en: "Steering wheel covers built for grip, comfort, and a premium driver touch point.", ja: "グリップ感、快適性、上質なドライバー接点に向けたステアリングホイールカバー。" },
        details: [{ zh: chineseCopy("Driver grip surface"), en: "Driver grip surface", ja: "ドライバーのグリップ面" }, { zh: chineseCopy("Premium tactile finish"), en: "Premium tactile finish", ja: "上質な触感仕上げ" }, { zh: chineseCopy("Supports coordinated cabin packages"), en: "Supports coordinated cabin packages", ja: "統一されたキャビンパッケージに対応" }],
        galleryImages: ["/uploads/product/product/automotive-interior/steering wheel cover/steering wheel cover-cover.jpg", "/uploads/product/product/automotive-interior/steering wheel cover/steering wheel cover-01.jpg", "/uploads/product/product/automotive-interior/steering wheel cover/steering wheel cover-02.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/storage-box-cover.jpg",
        title: { zh: chineseCopy("Storage Box"), en: "Storage Box", ja: "ストレージボックス" },
        description: { zh: chineseCopy("Automotive storage boxes that organize daily items while adding a premium soft-surface accent."), en: "Automotive storage boxes that organize daily items while adding a premium soft-surface accent.", ja: "日常の小物を整理しながら、上質なソフトサーフェスのアクセントを加える自動車用ストレージボックス。" },
        details: [{ zh: chineseCopy("Organized cabin storage"), en: "Organized cabin storage", ja: "キャビン収納の整理" }, { zh: chineseCopy("Soft-surface exterior detail"), en: "Soft-surface exterior detail", ja: "ソフトサーフェスの外装ディテール" }, { zh: chineseCopy("Useful for rear-seat and trunk zones"), en: "Useful for rear-seat and trunk zones", ja: "後席・トランクエリアに有用" }],
        galleryImages: ["/uploads/product/product/automotive-interior/storage box/storage box-cover.jpg", "/uploads/product/product/automotive-interior/storage box/storage box-02.jpg", "/uploads/product/product/automotive-interior/storage box/storage box-03.jpg", "/uploads/product/product/automotive-interior/storage box/storage box-04.jpg"]
      }
    ],
    description: { zh: chineseCopy("A complete accessory program for automotive interiors, from protective floor mats and support cushions to steering, seat-belt, key, and storage touch points."), en: "A complete accessory program for automotive interiors, from protective floor mats and support cushions to steering, seat-belt, key, and storage touch points.", ja: "フロアマットやサポートクッションからステアリング、シートベルト、キー、収納まわりまで、自動車内装向けアクセサリーを体系化したプログラム。" },
    highlights: [
      {
        title: { zh: chineseCopy("Driver contact surfaces"), en: "Driver contact surfaces", ja: "ドライバー接触面" },
        body: { zh: chineseCopy("Steering wheel covers, seat belt covers, key fobs, and keychains designed for daily grip, wear resistance, and premium hand-feel."), en: "Steering wheel covers, seat belt covers, key fobs, and keychains designed for daily grip, wear resistance, and premium hand-feel.", ja: "ステアリングホイールカバー、シートベルトカバー、キーフォブ、キーチェーンなど、日常の握り心地、耐摩耗性、上質な触感を考慮したアイテム。" }
      },
      {
        title: { zh: chineseCopy("Comfort and support accessories"), en: "Comfort and support accessories", ja: "快適性・サポートアクセサリー" },
        body: { zh: chineseCopy("Headrest pillows, lumbar cushions, and seat cushions tailored for refined cabin comfort and long-distance support."), en: "Headrest pillows, lumbar cushions, and seat cushions tailored for refined cabin comfort and long-distance support.", ja: "ヘッドレストピロー、ランバークッション、シートクッションなど、上質なキャビン快適性と長距離サポートに向けた製品。" }
      },
      {
        title: { zh: chineseCopy("Protection and storage systems"), en: "Protection and storage systems", ja: "保護・収納システム" },
        body: { zh: chineseCopy("Floor mats and storage boxes that protect cabin surfaces while preserving a coordinated interior material language."), en: "Floor mats and storage boxes that protect cabin surfaces while preserving a coordinated interior material language.", ja: "キャビン表面を保護しながら、統一されたインテリア素材表現を保つフロアマットと収納ボックス。" }
      }
    ]
  },
  {
    slug: "tech-accessories",
    title: { zh: chineseCopy("Tech Accessories"), en: "Tech Accessories", ja: "デジタルアクセサリー" },
    subtitle: { zh: chineseCopy("Device accessories that bring premium tactile materials into everyday technology."), en: "Device accessories that bring premium tactile materials into everyday technology.", ja: "日常のテクノロジーにプレミアムな触感素材を取り入れるデバイスアクセサリー。" },
    heroImage: "/uploads/product/product/cover-photo/magsafe-cover.jpg",
    curvedCarouselImages: [
      {
        src: "/uploads/product/product/cover-photo/airpod-case-cover.jpg",
        title: { zh: chineseCopy("AirPods Case"), en: "AirPods Case", ja: "AirPodsケース" },
        description: { zh: chineseCopy("Compact AirPods cases with a premium surface finish for daily carry and coordinated tech accessories."), en: "Compact AirPods cases with a premium surface finish for daily carry and coordinated tech accessories.", ja: "日常携行と統一感のあるデジタルアクセサリーに向けた、上質な表面仕上げのコンパクトなAirPodsケース。" },
        details: [{ zh: chineseCopy("Compact protective case"), en: "Compact protective case", ja: "コンパクトな保護ケース" }, { zh: chineseCopy("Daily pocket and bag carry"), en: "Daily pocket and bag carry", ja: "ポケット・バッグでの日常携行" }, { zh: chineseCopy("Coordinates with phone and laptop accessories"), en: "Coordinates with phone and laptop accessories", ja: "スマートフォン・ラップトップアクセサリーと調和" }],
        galleryImages: ["/uploads/product/product/tech/airpod case/airpod case-01.jpg", "/uploads/product/product/tech/airpod case/airpod case-02.jpg", "/uploads/product/product/tech/airpod case/airpod case-03.jpg", "/uploads/product/product/tech/airpod case/airpod case-04.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/ipad-case-cover.jpg",
        title: { zh: chineseCopy("iPad Cover"), en: "iPad Cover", ja: "iPadカバー" },
        description: { zh: chineseCopy("Tablet covers that combine device protection with a refined leather or Alcantara hand-feel."), en: "Tablet covers that combine device protection with a refined leather or Alcantara hand-feel.", ja: "デバイス保護と洗練されたレザーまたはAlcantaraの手触りを組み合わせたタブレットカバー。" },
        details: [{ zh: chineseCopy("Tablet protection surface"), en: "Tablet protection surface", ja: "タブレット保護サーフェス" }, { zh: chineseCopy("Slim daily-use profile"), en: "Slim daily-use profile", ja: "日常使いに適したスリムな形状" }, { zh: chineseCopy("Premium tactile exterior"), en: "Premium tactile exterior", ja: "上質な触感の外装" }],
        galleryImages: ["/uploads/product/product/tech/ipad cover/ipad cover-01.jpg", "/uploads/product/product/tech/ipad cover/ipad cover-02.jpg", "/uploads/product/product/tech/ipad cover/ipad cover-03.jpg", "/uploads/product/product/tech/ipad cover/ipad cover-04.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/iwatch-strape-cover.jpg",
        title: { zh: chineseCopy("iWatch Strap"), en: "iWatch Strap", ja: "iWatchストラップ" },
        description: { zh: chineseCopy("Wearable straps with soft-touch material character and a refined finish for daily skin contact."), en: "Wearable straps with soft-touch material character and a refined finish for daily skin contact.", ja: "日常的に肌に触れる用途に向けた、ソフトタッチな素材感と上質な仕上げのウェアラブルストラップ。" },
        details: [{ zh: chineseCopy("Wearable contact surface"), en: "Wearable contact surface", ja: "ウェアラブル接触面" }, { zh: chineseCopy("Soft hand-feel for daily use"), en: "Soft hand-feel for daily use", ja: "日常使用に適した柔らかな手触り" }, { zh: chineseCopy("Premium alternative to silicone bands"), en: "Premium alternative to silicone bands", ja: "シリコンバンドに代わる上質な選択肢" }],
        galleryImages: ["/uploads/product/product/tech/iwatch strape/iwatch strape-cover.png", "/uploads/product/product/tech/iwatch strape/iwatch strape-02.jpg", "/uploads/product/product/tech/iwatch strape/iwatch strape-03.jpg", "/uploads/product/product/tech/iwatch strape/iwatch strape-04.jpg", "/uploads/product/product/tech/iwatch strape/iwatch strape-05.jpg", "/uploads/product/product/tech/iwatch strape/iwatch strape-06.jpg", "/uploads/product/product/tech/iwatch strape/iwatch strape-07.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/macbook-cover.jpg",
        title: { zh: chineseCopy("MacBook Cover"), en: "MacBook Cover", ja: "MacBookカバー" },
        description: { zh: chineseCopy("Laptop covers that protect the device while giving the workspace a warmer material expression."), en: "Laptop covers that protect the device while giving the workspace a warmer material expression.", ja: "デバイスを保護しながら、ワークスペースに温かみのある素材表現を加えるラップトップカバー。" },
        details: [{ zh: chineseCopy("Laptop protection layer"), en: "Laptop protection layer", ja: "ラップトップ保護レイヤー" }, { zh: chineseCopy("Desk-ready tactile finish"), en: "Desk-ready tactile finish", ja: "デスクに映える触感仕上げ" }, { zh: chineseCopy("Suitable for leather and Alcantara programs"), en: "Suitable for leather and Alcantara programs", ja: "レザー・Alcantaraプログラムに対応" }],
        galleryImages: ["/uploads/product/product/tech/macbook cover/macbook cover-01.jpg", "/uploads/product/product/tech/macbook cover/macbook cover-02.jpg", "/uploads/product/product/tech/macbook cover/macbook cover-03.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/magsafe-cover.jpg",
        title: { zh: chineseCopy("MagSafe Accessory"), en: "MagSafe Accessory", ja: "MagSafeアクセサリー" },
        description: { zh: chineseCopy("MagSafe accessories that add a premium material touch to charging, mounting, and daily phone handling."), en: "MagSafe accessories that add a premium material touch to charging, mounting, and daily phone handling.", ja: "充電、マウント、日常のスマートフォン操作に上質な素材感を加えるMagSafeアクセサリー。" },
        details: [{ zh: chineseCopy("Magnetic phone accessory"), en: "Magnetic phone accessory", ja: "マグネット式スマートフォンアクセサリー" }, { zh: chineseCopy("Premium daily touch point"), en: "Premium daily touch point", ja: "日常的に触れる上質な接点" }, { zh: chineseCopy("Coordinates with phone case programs"), en: "Coordinates with phone case programs", ja: "スマートフォンケースプログラムと調和" }],
        galleryImages: ["/uploads/product/product/tech/magsafe/magsafe-cover.jpg", "/uploads/product/product/tech/magsafe/magsafe-01.jpg", "/uploads/product/product/tech/magsafe/magsafe-02.jpg", "/uploads/product/product/tech/magsafe/magsafe-03.jpg", "/uploads/product/product/tech/magsafe/magsafe-04.jpg", "/uploads/product/product/tech/magsafe/magsafe-05.jpg", "/uploads/product/product/tech/magsafe/magsafe-07.jpg", "/uploads/product/product/tech/magsafe/magsafe-08.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/phone-case-alcantara-cover.jpg",
        title: { zh: chineseCopy("Alcantara Phone Case"), en: "Alcantara Phone Case", ja: "Alcantaraスマートフォンケース" },
        description: { zh: chineseCopy("Alcantara phone cases with a matte, tactile surface for a warmer and more distinctive device feel."), en: "Alcantara phone cases with a matte, tactile surface for a warmer and more distinctive device feel.", ja: "マットで触感的な表面により、デバイスへ温かみと個性を加えるAlcantaraスマートフォンケース。" },
        details: [{ zh: chineseCopy("Matte Alcantara surface"), en: "Matte Alcantara surface", ja: "マットなAlcantara表面" }, { zh: chineseCopy("Soft grip for daily handling"), en: "Soft grip for daily handling", ja: "日常操作に適したソフトグリップ" }, { zh: chineseCopy("Distinctive alternative to plastic cases"), en: "Distinctive alternative to plastic cases", ja: "プラスチックケースに代わる個性的な選択肢" }],
        galleryImages: ["/uploads/product/product/tech/phone case alcantara/phone case alcantara-cover.jpg", "/uploads/product/product/tech/phone case alcantara/phone case alcantara-01.jpg", "/uploads/product/product/tech/phone case alcantara/phone case alcantara-02.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/iphone-case-leather-cover.jpg",
        title: { zh: chineseCopy("Leather Phone Case"), en: "Leather Phone Case", ja: "レザースマートフォンケース" },
        description: { zh: chineseCopy("Leather phone cases that bring heritage material character and refined edge finishing to everyday devices."), en: "Leather phone cases that bring heritage material character and refined edge finishing to everyday devices.", ja: "日常のデバイスにヘリテージ素材の表情と洗練されたエッジ仕上げをもたらすレザースマートフォンケース。" },
        details: [{ zh: chineseCopy("Premium leather exterior"), en: "Premium leather exterior", ja: "プレミアムレザー外装" }, { zh: chineseCopy("Refined edge and stitch detail"), en: "Refined edge and stitch detail", ja: "洗練されたエッジとステッチディテール" }, { zh: chineseCopy("Daily device protection"), en: "Daily device protection", ja: "日常的なデバイス保護" }],
        galleryImages: ["/uploads/product/product/tech/phone case leather/phone case leather-01.jpg", "/uploads/product/product/tech/phone case leather/phone case leather-02.jpg", "/uploads/product/product/tech/phone case leather/phone case leather-03.jpg", "/uploads/product/product/tech/phone case leather/phone case leather-04.jpg", "/uploads/product/product/tech/phone case leather/phone case leather-05.jpg"]
      }
    ],
    description: { zh: chineseCopy("Surface programs for phone cases, MagSafe accessories, tablet and laptop covers, wearable straps, and audio-device cases."), en: "Surface programs for phone cases, MagSafe accessories, tablet and laptop covers, wearable straps, and audio-device cases.", ja: "スマートフォンケース、MagSafeアクセサリー、タブレット・ラップトップカバー、ウェアラブルストラップ、オーディオデバイスケース向けの表面素材プログラム。" },
    highlights: [
      {
        title: { zh: chineseCopy("Device protection"), en: "Device protection", ja: "デバイス保護" },
        body: { zh: chineseCopy("Phone, tablet, laptop, and AirPods cases with soft-touch finishes, precise fit, and elevated material presence."), en: "Phone, tablet, laptop, and AirPods cases with soft-touch finishes, precise fit, and elevated material presence.", ja: "スマートフォン、タブレット、ラップトップ、AirPods向けに、ソフトタッチ仕上げ、精密なフィット感、上質な素材感を備えたケース。" }
      },
      {
        title: { zh: chineseCopy("Magnetic and wearable details"), en: "Magnetic and wearable details", ja: "マグネット・ウェアラブルディテール" },
        body: { zh: chineseCopy("MagSafe accessories and watch straps that turn daily device contact into a tactile brand moment."), en: "MagSafe accessories and watch straps that turn daily device contact into a tactile brand moment.", ja: "MagSafeアクセサリーとウォッチストラップにより、毎日のデバイス接点を触感的なブランド体験へ変えます。" }
      },
      {
        title: { zh: chineseCopy("Leather and Alcantara options"), en: "Leather and Alcantara options", ja: "レザー・Alcantaraオプション" },
        body: { zh: chineseCopy("Material executions in premium leather and Alcantara for brands seeking a warmer alternative to plastic and silicone."), en: "Material executions in premium leather and Alcantara for brands seeking a warmer alternative to plastic and silicone.", ja: "プラスチックやシリコンとは異なる温かみを求めるブランドに向けた、プレミアムレザーとAlcantaraの素材展開。" }
      }
    ]
  },
  {
    slug: "lifestyle",
    title: { zh: chineseCopy("Lifestyle"), en: "Lifestyle", ja: "ライフスタイル" },
    subtitle: { zh: chineseCopy("Travel, carry, and personal accessories shaped by premium European materials."), en: "Travel, carry, and personal accessories shaped by premium European materials.", ja: "プレミアムな欧州素材で仕立てるトラベル、キャリー、パーソナルアクセサリー。" },
    heroImage: "/uploads/product/product/cover-photo/bagpack-cover.jpg",
    curvedCarouselImages: [
      {
        src: "/uploads/product/product/cover-photo/bagpack-cover.jpg",
        title: { zh: chineseCopy("Backpack"), en: "Backpack", ja: "バックパック" },
        description: { zh: chineseCopy("Premium backpacks for daily carry, travel, and branded lifestyle collections."), en: "Premium backpacks for daily carry, travel, and branded lifestyle collections.", ja: "日常携行、旅行、ブランドライフスタイルコレクションに向けたプレミアムバックパック。" },
        details: [{ zh: chineseCopy("Daily carry format"), en: "Daily carry format", ja: "日常携行フォーマット" }, { zh: chineseCopy("Premium exterior and interior touch points"), en: "Premium exterior and interior touch points", ja: "上質な外装・内装接点" }, { zh: chineseCopy("Suitable for lifestyle merchandise"), en: "Suitable for lifestyle merchandise", ja: "ライフスタイル商品に対応" }],
        galleryImages: ["/uploads/product/product/lifestyle/bagpack/bagpack-cover.jpg", "/uploads/product/product/lifestyle/bagpack/bagpack-02.jpg", "/uploads/product/product/lifestyle/bagpack/bagpack-03.jpg", "/uploads/product/product/lifestyle/bagpack/bagpack-04.jpg", "/uploads/product/product/lifestyle/bagpack/bagpack-05.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/cap-cover.jpg",
        title: { zh: chineseCopy("Cap"), en: "Cap", ja: "キャップ" },
        description: { zh: chineseCopy("Material-forward caps for branded lifestyle programs and gift-ready merchandise."), en: "Material-forward caps for branded lifestyle programs and gift-ready merchandise.", ja: "ブランドライフスタイルプログラムとギフト向け商品に適した、素材感を活かしたキャップ。" },
        details: [{ zh: chineseCopy("Wearable brand accessory"), en: "Wearable brand accessory", ja: "身につけるブランドアクセサリー" }, { zh: chineseCopy("Soft material accent"), en: "Soft material accent", ja: "柔らかな素材アクセント" }, { zh: chineseCopy("Suitable for event and retail programs"), en: "Suitable for event and retail programs", ja: "イベント・リテールプログラムに対応" }],
        galleryImages: ["/uploads/product/product/lifestyle/cap/cap-01.jpg", "/uploads/product/product/lifestyle/cap/cap-02.jpg", "/uploads/product/product/lifestyle/cap/cap-03.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/cardholder-cover.jpg",
        title: { zh: chineseCopy("Cardholder"), en: "Cardholder", ja: "カードホルダー" },
        description: { zh: chineseCopy("Slim cardholders with refined leather finishing for personal carry and premium gifting."), en: "Slim cardholders with refined leather finishing for personal carry and premium gifting.", ja: "個人携行とプレミアムギフトに適した、洗練されたレザー仕上げのスリムなカードホルダー。" },
        details: [{ zh: chineseCopy("Slim personal carry"), en: "Slim personal carry", ja: "スリムな個人携行" }, { zh: chineseCopy("Refined leather finish"), en: "Refined leather finish", ja: "洗練されたレザー仕上げ" }, { zh: chineseCopy("Gift-ready small leather good"), en: "Gift-ready small leather good", ja: "ギフトに適した小物レザーグッズ" }],
        galleryImages: ["/uploads/product/product/lifestyle/cardholder/cardholder-cover.jpg", "/uploads/product/product/lifestyle/cardholder/cardholder-01.jpg", "/uploads/product/product/lifestyle/cardholder/cardholder-02.jpg", "/uploads/product/product/lifestyle/cardholder/cardholder-04.jpg", "/uploads/product/product/lifestyle/cardholder/cardholder-05.jpg", "/uploads/product/product/lifestyle/cardholder/cardholder-06.jpg", "/uploads/product/product/lifestyle/cardholder/cardholder-07.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/duffle-bag-cover.jpg",
        title: { zh: chineseCopy("Duffle Bag"), en: "Duffle Bag", ja: "ダッフルバッグ" },
        description: { zh: chineseCopy("Duffle bags for travel and weekend use, balancing soft structure with premium material character."), en: "Duffle bags for travel and weekend use, balancing soft structure with premium material character.", ja: "旅行や週末使いに向けて、柔らかな構造と上質な素材感を両立するダッフルバッグ。" },
        details: [{ zh: chineseCopy("Travel and weekend carry"), en: "Travel and weekend carry", ja: "旅行・週末の携行" }, { zh: chineseCopy("Soft structured silhouette"), en: "Soft structured silhouette", ja: "柔らかな構造のシルエット" }, { zh: chineseCopy("Premium leather and textile detailing"), en: "Premium leather and textile detailing", ja: "上質なレザー・テキスタイルディテール" }],
        galleryImages: ["/uploads/product/product/lifestyle/duffle bag/duffle bag-cover.jpg", "/uploads/product/product/lifestyle/duffle bag/duffle bag-02.jpg", "/uploads/product/product/lifestyle/duffle bag/duffle bag-03.jpg", "/uploads/product/product/lifestyle/duffle bag/duffle bag-04.jpg", "/uploads/product/product/lifestyle/duffle bag/duffle bag-05.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/luggage-case-cover.jpg",
        title: { zh: chineseCopy("Luggage Case"), en: "Luggage Case", ja: "ラゲージケース" },
        description: { zh: chineseCopy("Luggage cases that bring premium surface materials into travel storage and presentation."), en: "Luggage cases that bring premium surface materials into travel storage and presentation.", ja: "トラベル収納とプレゼンテーションにプレミアムな表面素材を取り入れるラゲージケース。" },
        details: [{ zh: chineseCopy("Travel storage format"), en: "Travel storage format", ja: "トラベル収納フォーマット" }, { zh: chineseCopy("Premium material surface"), en: "Premium material surface", ja: "プレミアム素材サーフェス" }, { zh: chineseCopy("Designed for coordinated travel sets"), en: "Designed for coordinated travel sets", ja: "統一感のあるトラベルセットに向けた設計" }],
        galleryImages: ["/uploads/product/product/lifestyle/luggage case /luggage case -cover.jpg", "/uploads/product/product/lifestyle/luggage case /luggage case -02.jpg", "/uploads/product/product/lifestyle/luggage case /luggage case -03.jpg", "/uploads/product/product/lifestyle/luggage case /luggage case -04.jpg", "/uploads/product/product/lifestyle/luggage case /luggage case -05.jpg", "/uploads/product/product/lifestyle/luggage case /luggage case -06.jpg", "/uploads/product/product/lifestyle/luggage case /luggage case -07.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/passport-holder-cover.jpg",
        title: { zh: chineseCopy("Passport Holder"), en: "Passport Holder", ja: "パスポートホルダー" },
        description: { zh: chineseCopy("Passport holders that protect travel documents with a refined, tactile material finish."), en: "Passport holders that protect travel documents with a refined, tactile material finish.", ja: "洗練された触感素材の仕上げで旅行書類を保護するパスポートホルダー。" },
        details: [{ zh: chineseCopy("Travel document protection"), en: "Travel document protection", ja: "旅行書類の保護" }, { zh: chineseCopy("Slim leather carry format"), en: "Slim leather carry format", ja: "スリムなレザー携行形式" }, { zh: chineseCopy("Suitable for travel gifting"), en: "Suitable for travel gifting", ja: "トラベルギフトに対応" }],
        galleryImages: ["/uploads/product/product/lifestyle/passport holder/passport holder-cover.jpg", "/uploads/product/product/lifestyle/passport holder/passport holder-01.jpg", "/uploads/product/product/lifestyle/passport holder/passport holder-03.jpg", "/uploads/product/product/lifestyle/passport holder/passport holder-04.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/pouch-cover.jpg",
        title: { zh: chineseCopy("Pouch"), en: "Pouch", ja: "ポーチ" },
        description: { zh: chineseCopy("Compact pouches for organizing daily essentials with a premium soft-touch surface."), en: "Compact pouches for organizing daily essentials with a premium soft-touch surface.", ja: "日常の必需品を整理するための、上質なソフトタッチ表面を備えたコンパクトポーチ。" },
        details: [{ zh: chineseCopy("Daily essentials organizer"), en: "Daily essentials organizer", ja: "日常必需品の整理" }, { zh: chineseCopy("Compact soft-good format"), en: "Compact soft-good format", ja: "コンパクトなソフトグッズ形式" }, { zh: chineseCopy("Works for retail and gift programs"), en: "Works for retail and gift programs", ja: "リテール・ギフトプログラムに対応" }],
        galleryImages: ["/uploads/product/product/lifestyle/pouch/pouch-cover.jpg", "/uploads/product/product/lifestyle/pouch/pouch-01.jpg", "/uploads/product/product/lifestyle/pouch/pouch-03.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/spectacle-case-cover.jpg",
        title: { zh: chineseCopy("Spectacle Case"), en: "Spectacle Case", ja: "メガネケース" },
        description: { zh: chineseCopy("Spectacle cases that protect eyewear while adding a tactile premium moment to daily accessories."), en: "Spectacle cases that protect eyewear while adding a tactile premium moment to daily accessories.", ja: "アイウェアを保護しながら、日常アクセサリーに触感的な上質感を加えるメガネケース。" },
        details: [{ zh: chineseCopy("Eyewear protection"), en: "Eyewear protection", ja: "アイウェア保護" }, { zh: chineseCopy("Structured case format"), en: "Structured case format", ja: "構造的なケース形式" }, { zh: chineseCopy("Premium gift accessory"), en: "Premium gift accessory", ja: "プレミアムギフトアクセサリー" }],
        galleryImages: ["/uploads/product/product/lifestyle/spectacle case /spectacle case -cover.jpg", "/uploads/product/product/lifestyle/spectacle case /spectacle case -01.jpg", "/uploads/product/product/lifestyle/spectacle case /spectacle case -03.jpg", "/uploads/product/product/lifestyle/spectacle case /spectacle case -04.jpg", "/uploads/product/product/lifestyle/spectacle case /spectacle case -05.jpg", "/uploads/product/product/lifestyle/spectacle case /spectacle case -06.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/wallet-cover.jpg",
        title: { zh: chineseCopy("Wallet"), en: "Wallet", ja: "ウォレット" },
        description: { zh: chineseCopy("Wallets with refined material finishing for everyday carry and gifting."), en: "Wallets with refined material finishing for everyday carry and gifting.", ja: "日常携行とギフトに適した、洗練された素材仕上げのウォレット。" },
        details: [{ zh: chineseCopy("Everyday carry essential"), en: "Everyday carry essential", ja: "日常携行の必需品" }, { zh: chineseCopy("Refined leather construction"), en: "Refined leather construction", ja: "洗練されたレザー構造" }, { zh: chineseCopy("Gift-ready presentation"), en: "Gift-ready presentation", ja: "ギフトに適したプレゼンテーション" }],
        galleryImages: ["/uploads/product/product/lifestyle/wallet/wallet-01.jpg", "/uploads/product/product/lifestyle/wallet/wallet-02.jpg", "/uploads/product/product/lifestyle/wallet/wallet-03.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/washbag-cover.jpg",
        title: { zh: chineseCopy("Washbag"), en: "Washbag", ja: "ウォッシュバッグ" },
        description: { zh: chineseCopy("Washbags for travel grooming essentials, finished with durable premium materials."), en: "Washbags for travel grooming essentials, finished with durable premium materials.", ja: "旅行用グルーミング用品を収納する、耐久性のあるプレミアム素材仕上げのウォッシュバッグ。" },
        details: [{ zh: chineseCopy("Travel grooming storage"), en: "Travel grooming storage", ja: "旅行用グルーミング収納" }, { zh: chineseCopy("Durable soft-good construction"), en: "Durable soft-good construction", ja: "耐久性のあるソフトグッズ構造" }, { zh: chineseCopy("Coordinates with bag and luggage sets"), en: "Coordinates with bag and luggage sets", ja: "バッグ・ラゲージセットと調和" }],
        galleryImages: ["/uploads/product/product/lifestyle/washbag/washbag-cover.jpg", "/uploads/product/product/lifestyle/washbag/washbag-02.jpg", "/uploads/product/product/lifestyle/washbag/washbag-03.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/watch-case-cover.jpg",
        title: { zh: chineseCopy("Watch Case"), en: "Watch Case", ja: "ウォッチケース" },
        description: { zh: chineseCopy("Watch cases that protect timepieces with a soft, presentation-ready material interior."), en: "Watch cases that protect timepieces with a soft, presentation-ready material interior.", ja: "柔らかくプレゼンテーションに適した素材内装で時計を保護するウォッチケース。" },
        details: [{ zh: chineseCopy("Timepiece protection"), en: "Timepiece protection", ja: "時計の保護" }, { zh: chineseCopy("Soft interior surface"), en: "Soft interior surface", ja: "柔らかな内装表面" }, { zh: chineseCopy("Suitable for luxury gifting"), en: "Suitable for luxury gifting", ja: "ラグジュアリーギフトに対応" }],
        galleryImages: [
          "/uploads/product/product/lifestyle/watch case/watch case-01.jpg",
          "/uploads/product/product/lifestyle/watch case/watch case-02.jpg",
          "/uploads/product/product/lifestyle/watch case/leather-watch-case.jpeg",
          "/uploads/product/product/lifestyle/watch case/leather-watch-case1.jpeg"
        ]
      }
    ],
    description: { zh: chineseCopy("Lifestyle collections spanning bags, luggage, wallets, cases, pouches, caps, and travel accessories for daily use and gifting."), en: "Lifestyle collections spanning bags, luggage, wallets, cases, pouches, caps, and travel accessories for daily use and gifting.", ja: "バッグ、ラゲージ、ウォレット、ケース、ポーチ、キャップ、トラベルアクセサリーまで、日常使いとギフトに向けたライフスタイルコレクション。" },
    highlights: [
      {
        title: { zh: chineseCopy("Travel and carry goods"), en: "Travel and carry goods", ja: "トラベル・キャリーグッズ" },
        body: { zh: chineseCopy("Backpacks, duffle bags, luggage cases, washbags, and passport holders built for repeated travel touch points."), en: "Backpacks, duffle bags, luggage cases, washbags, and passport holders built for repeated travel touch points.", ja: "バックパック、ダッフルバッグ、ラゲージケース、ウォッシュバッグ、パスポートホルダーなど、旅の接点に耐える製品。" }
      },
      {
        title: { zh: chineseCopy("Personal accessories"), en: "Personal accessories", ja: "パーソナルアクセサリー" },
        body: { zh: chineseCopy("Wallets, cardholders, pouches, caps, spectacle cases, and watch cases with refined finishing for daily carry."), en: "Wallets, cardholders, pouches, caps, spectacle cases, and watch cases with refined finishing for daily carry.", ja: "ウォレット、カードホルダー、ポーチ、キャップ、メガネケース、ウォッチケースなど、日常携行に適した上質な仕上げ。" }
      },
      {
        title: { zh: chineseCopy("Gift-ready material stories"), en: "Gift-ready material stories", ja: "ギフトに適した素材表現" },
        body: { zh: chineseCopy("Coordinated product families that translate tactile material quality into memorable lifestyle gifts."), en: "Coordinated product families that translate tactile material quality into memorable lifestyle gifts.", ja: "触感的な素材品質を印象的なライフスタイルギフトへ展開する、統一感のある製品ファミリー。" }
      }
    ]
  },
  {
    slug: "corporation-gift",
    title: { zh: chineseCopy("Corporate Gifts"), en: "Corporate Gifts", ja: "法人ギフト" },
    subtitle: { zh: chineseCopy("Executive workspace essentials crafted for brand gifting and business presentation."), en: "Executive workspace essentials crafted for brand gifting and business presentation.", ja: "ブランドギフトとビジネスシーンに向けて仕立てるエグゼクティブワークスペース用品。" },
    heroImage: "/uploads/product/product/cover-photo/tray-cover.jpg",
    curvedCarouselImages: [
      {
        src: "/uploads/product/product/cover-photo/business-cardholder-cover.jpg",
        title: { zh: chineseCopy("Business Card Holder"), en: "Business Card Holder", ja: "名刺ホルダー" },
        description: { zh: chineseCopy("Business card holders for executive desks, reception areas, and corporate gifting programs."), en: "Business card holders for executive desks, reception areas, and corporate gifting programs.", ja: "エグゼクティブデスク、受付エリア、法人ギフトプログラムに向けた名刺ホルダー。" },
        details: [{ zh: chineseCopy("Desk and reception accessory"), en: "Desk and reception accessory", ja: "デスク・受付アクセサリー" }, { zh: chineseCopy("Premium business presentation"), en: "Premium business presentation", ja: "上質なビジネスプレゼンテーション" }, { zh: chineseCopy("Suitable for branded office sets"), en: "Suitable for branded office sets", ja: "ブランドオフィスセットに対応" }],
        galleryImages: ["/uploads/product/product/office/business card holder/business card holder-01.jpg", "/uploads/product/product/office/business card holder/business card holder-02.jpg", "/uploads/product/product/office/business card holder/business card holder-03.jpg", "/uploads/product/product/office/business card holder/business card holder-04.jpg", "/uploads/product/product/office/business card holder/business card holder-05.jpg", "/uploads/product/product/office/business card holder/business card holder-06.jpg", "/uploads/product/product/office/business card holder/business card holder-07.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/desk-mat-cover.jpg",
        title: { zh: chineseCopy("Desk Mat"), en: "Desk Mat", ja: "デスクマット" },
        description: { zh: chineseCopy("Desk mats that define the workspace with a premium tactile surface and clean visual order."), en: "Desk mats that define the workspace with a premium tactile surface and clean visual order.", ja: "上質な触感表面と整った視覚秩序でワークスペースを整えるデスクマット。" },
        details: [{ zh: chineseCopy("Workspace surface layer"), en: "Workspace surface layer", ja: "ワークスペースの表面レイヤー" }, { zh: chineseCopy("Premium desk touch point"), en: "Premium desk touch point", ja: "上質なデスク接点" }, { zh: chineseCopy("Works with corporate gift sets"), en: "Works with corporate gift sets", ja: "法人ギフトセットと調和" }],
        galleryImages: ["/uploads/product/product/office/desk mat/desk mat-cover.jpg", "/uploads/product/product/office/desk mat/desk mat-02.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/mouse-mat-cover.jpg",
        title: { zh: chineseCopy("Mouse Mat"), en: "Mouse Mat", ja: "マウスマット" },
        description: { zh: chineseCopy("Mouse mats that add a soft, premium surface to everyday desk interaction."), en: "Mouse mats that add a soft, premium surface to everyday desk interaction.", ja: "日常のデスク操作に柔らかく上質な表面を加えるマウスマット。" },
        details: [{ zh: chineseCopy("Daily desk interaction surface"), en: "Daily desk interaction surface", ja: "日常のデスク操作面" }, { zh: chineseCopy("Soft-touch material finish"), en: "Soft-touch material finish", ja: "ソフトタッチ素材仕上げ" }, { zh: chineseCopy("Compact branded gift option"), en: "Compact branded gift option", ja: "コンパクトなブランドギフトオプション" }],
        galleryImages: ["/uploads/product/product/office/mouse mat/mouse mat-cover.jpg", "/uploads/product/product/office/mouse mat/mouse mat-02.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/notebook-cover.jpg",
        title: { zh: chineseCopy("Notebook"), en: "Notebook", ja: "ノートブック" },
        description: { zh: chineseCopy("Notebook covers and stationery surfaces that bring premium materials into meetings and daily work."), en: "Notebook covers and stationery surfaces that bring premium materials into meetings and daily work.", ja: "会議や日常業務にプレミアム素材を取り入れるノートブックカバーとステーショナリー表面。" },
        details: [{ zh: chineseCopy("Meeting and desk accessory"), en: "Meeting and desk accessory", ja: "会議・デスクアクセサリー" }, { zh: chineseCopy("Premium cover material"), en: "Premium cover material", ja: "プレミアムカバー素材" }, { zh: chineseCopy("Suitable for executive gifting"), en: "Suitable for executive gifting", ja: "エグゼクティブギフトに対応" }],
        galleryImages: ["/uploads/product/product/office/notebook/notebook-cover.jpg", "/uploads/product/product/office/notebook/notebook-02.jpg", "/uploads/product/product/office/notebook/notebook-03.jpg", "/uploads/product/product/office/notebook/notebook-04.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/seat-cushion-cover.jpg",
        title: { zh: chineseCopy("Seat Cushion"), en: "Seat Cushion", ja: "シートクッション" },
        description: { zh: chineseCopy("Seat cushions for offices, lounges, and hospitality spaces where comfort and surface quality both matter."), en: "Seat cushions for offices, lounges, and hospitality spaces where comfort and surface quality both matter.", ja: "快適性と表面品質の両方が重要なオフィス、ラウンジ、ホスピタリティ空間向けシートクッション。" },
        details: [{ zh: chineseCopy("Comfort-focused seating accessory"), en: "Comfort-focused seating accessory", ja: "快適性を重視した座席アクセサリー" }, { zh: chineseCopy("Soft premium surface"), en: "Soft premium surface", ja: "柔らかなプレミアム表面" }, { zh: chineseCopy("Suitable for office and lounge programs"), en: "Suitable for office and lounge programs", ja: "オフィス・ラウンジプログラムに対応" }],
        galleryImages: ["/uploads/product/product/office/seat cushion/seat cushion-cover.jpg", "/uploads/product/product/office/seat cushion/seat cushion-02.jpg", "/uploads/product/product/office/seat cushion/seat cushion-03.jpg", "/uploads/product/product/office/seat cushion/seat cushion-04.jpg"]
      },
      {
        src: "/uploads/product/product/cover-photo/tray-cover.jpg",
        title: { zh: chineseCopy("Tray"), en: "Tray", ja: "トレイ" },
        description: { zh: chineseCopy("Desk and valet trays that organize essentials while creating a refined branded touch point."), en: "Desk and valet trays that organize essentials while creating a refined branded touch point.", ja: "必需品を整理しながら、洗練されたブランド接点をつくるデスク・バレットトレイ。" },
        details: [{ zh: chineseCopy("Desk and valet organization"), en: "Desk and valet organization", ja: "デスク・バレット整理" }, { zh: chineseCopy("Premium catch-all surface"), en: "Premium catch-all surface", ja: "上質なキャッチオール表面" }, { zh: chineseCopy("Ideal for corporate gift sets"), en: "Ideal for corporate gift sets", ja: "法人ギフトセットに最適" }],
        galleryImages: ["/uploads/product/product/office/tray/tray-cover.jpg", "/uploads/product/product/office/tray/tray-01.jpg", "/uploads/product/product/office/tray/tray-02.jpg", "/uploads/product/product/office/tray/tray-03.jpg", "/uploads/product/product/office/tray/tray-04.jpg", "/uploads/product/product/office/tray/tray-05.jpg", "/uploads/product/product/office/tray/tray-07.jpg"]
      }
    ],
    description: { zh: chineseCopy("Corporate gift programs for desks, meeting rooms, events, and executive presentation, including trays, mats, notebooks, card holders, and seat cushions."), en: "Corporate gift programs for desks, meeting rooms, events, and executive presentation, including trays, mats, notebooks, card holders, and seat cushions.", ja: "トレイ、マット、ノートブック、カードホルダー、シートクッションなど、デスク、会議室、イベント、エグゼクティブ向けプレゼンテーションに対応する法人ギフトプログラム。" },
    highlights: [
      {
        title: { zh: chineseCopy("Executive desk accessories"), en: "Executive desk accessories", ja: "エグゼクティブデスクアクセサリー" },
        body: { zh: chineseCopy("Trays, desk mats, mouse mats, notebooks, and business card holders that bring a consistent material language to the workspace."), en: "Trays, desk mats, mouse mats, notebooks, and business card holders that bring a consistent material language to the workspace.", ja: "トレイ、デスクマット、マウスマット、ノートブック、名刺ホルダーにより、ワークスペースへ統一された素材表現をもたらします。" }
      },
      {
        title: { zh: chineseCopy("Meeting and presentation pieces"), en: "Meeting and presentation pieces", ja: "会議・プレゼンテーション用品" },
        body: { zh: chineseCopy("Objects suited to boardrooms, client gifts, showrooms, and event presentation where tactile quality reflects the brand."), en: "Objects suited to boardrooms, client gifts, showrooms, and event presentation where tactile quality reflects the brand.", ja: "役員会議室、顧客ギフト、ショールーム、イベント展示など、触感品質がブランドを映す場面に適したアイテム。" }
      },
      {
        title: { zh: chineseCopy("Comfort-focused office details"), en: "Comfort-focused office details", ja: "快適性を高めるオフィスディテール" },
        body: { zh: chineseCopy("Seat cushions and soft-touch accessories that make long work sessions feel more considered and premium."), en: "Seat cushions and soft-touch accessories that make long work sessions feel more considered and premium.", ja: "シートクッションやソフトタッチアクセサリーにより、長時間のワークセッションに配慮と上質感を加えます。" }
      }
    ]
  }
];

type CarouselContentOverride = {
  customizedOption: LocalizedString;
  description?: LocalizedString;
};

const carouselContentOverrides = normalizeLocalizedBrandNames(carouselContentOverridesData) as unknown as Record<string, CarouselContentOverride[]>;

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
