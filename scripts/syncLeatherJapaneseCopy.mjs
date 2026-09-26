import nextEnv from "@next/env";
import { createClient } from "@sanity/client";
import { getCliClient } from "sanity/cli";

nextEnv.loadEnvConfig(process.cwd());

const apply = process.argv.includes("--apply");
const useCliAuth = process.env.SANITY_USE_CLI_AUTH === "1";
const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "bfjhbpbx",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2026-06-09",
  useCdn: false,
  perspective: "raw",
};
const client = !useCliAuth && process.env.SANITY_AUTH_TOKEN
  ? createClient({ ...config, token: process.env.SANITY_AUTH_TOKEN })
  : getCliClient({ apiVersion: config.apiVersion }).withConfig(config);

// Sanity client errors can include request headers. Never print raw error objects
// from this script, since they may contain authentication details.
const reportSafeError = (error) => {
  const message = error instanceof Error ? error.message : "Sanity request failed";
  console.error(message.replace(/Bearer\s+\S+/gi, "Bearer [redacted]").slice(0, 300));
  process.exit(1);
};
process.on("unhandledRejection", (error) => {
  reportSafeError(error);
});
process.on("uncaughtException", (error) => {
  reportSafeError(error);
});

const summaries = {
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
const slugs = [...Object.keys(summaries), "verona", "tuscania"];
const docs = await client.fetch(
  '*[_type == "productType" && slug.current in $slugs] {_id, _rev, "slug": slug.current, name, summary}',
  { slugs },
);

const desired = new Map(Object.entries(summaries));
const missing = slugs.filter((slug) => !docs.some((doc) => doc.slug === slug));
if (missing.length) throw new Error(`Missing Sanity product types: ${missing.join(", ")}`);

const updates = docs.flatMap((doc) => {
  const summary = desired.get(doc.slug)
    ?? (doc.slug === "verona"
      ? doc.summary?.ja?.replace(/^(?:Verona|ヴェローナ|ヴェロナ)(?=は)/, "ヴェロナ")
      : doc.summary?.ja?.replace(/^(?:Tuscania|トスカニア)(?=は)/, "トスカニア"));
  const fields = {};
  if (summary && summary !== doc.summary?.ja) fields["summary.ja"] = summary;
  if (doc.slug === "verona" && doc.name?.ja !== "ヴェロナ") fields["name.ja"] = "ヴェロナ";
  if (Object.keys(fields).length) return [{ doc, fields }];
  return [];
});

console.log(JSON.stringify({
  mode: apply ? "apply" : "dry-run",
  projectId: config.projectId,
  dataset: config.dataset,
  updates: updates.map(({ doc, fields }) => ({ slug: doc.slug, id: doc._id, fields })),
}, null, 2));

if (!apply || !updates.length) process.exit(0);

let transaction = client.transaction();
for (const { doc, fields } of updates) {
  transaction = transaction.patch(doc._id, (patch) =>
    patch.ifRevisionId(doc._rev).set(fields),
  );
}
await transaction.commit();

const after = await client.fetch(
  '*[_type == "productType" && slug.current in $slugs] {_id, "slug": slug.current, name, summary}',
  { slugs },
);
for (const { doc, fields } of updates) {
  const actual = after.find((item) => item._id === doc._id);
  if (!actual) throw new Error(`Missing updated document: ${doc._id}`);
  for (const [path, expected] of Object.entries(fields)) {
    const [root, locale] = path.split(".");
    if (actual[root]?.[locale] !== expected) {
      throw new Error(`Verification failed for ${doc.slug} ${path}`);
    }
  }
}
console.log(`Verified ${updates.length} Sanity product type updates.`);
