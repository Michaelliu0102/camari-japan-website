import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-05-12" });
const extraParagraphPatterns = [
  "Our work balances European material expressiveness",
  "欧州素材の表現力と日本的な抑制"
];

const aboutPage = await client.fetch(`*[_id == "aboutPage"][0]{bodyParagraphs}`);
const bodyParagraphs = aboutPage?.bodyParagraphs ?? [];
const filteredParagraphs = bodyParagraphs.filter((paragraph) => {
  const text = `${paragraph?.en ?? ""}\n${paragraph?.ja ?? ""}`;
  return !extraParagraphPatterns.some((pattern) => text.includes(pattern));
});

if (filteredParagraphs.length === bodyParagraphs.length) {
  console.log("No extra About Page paragraphs found.");
  process.exit(0);
}

await client.patch("aboutPage").set({ bodyParagraphs: filteredParagraphs }).commit();

console.log(`Pruned About Page paragraphs: ${bodyParagraphs.length} -> ${filteredParagraphs.length}`);
