import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-05-12" });

await client
  .patch("aboutPage")
  .set({
    manufacturingLabel: { en: "Manufacturing", ja: "Manufacturing" },
    manufacturingTitle: { en: "OUR FACTORY", ja: "OUR FACTORY" },
    manufacturingParagraphs: [
      {
        _key: "manufacturing-paragraph-1",
        en: "SHENGHUA is factory from 2000.",
        ja: "SHENGHUA is factory from 2000."
      }
    ]
  })
  .commit();

console.log("Patched About Page manufacturing section.");
