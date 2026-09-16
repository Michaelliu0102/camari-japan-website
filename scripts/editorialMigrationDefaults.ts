import { homePageCopy } from "../src/content/home-page-copy";
import { materialFaqs } from "../src/content/material-faqs";
import { getNewsArticleContent } from "../src/content/news-articles";
import { createDownloadGroups, downloadPageCopy } from "../src/content/downloads";
import { newsItems } from "../src/lib/content";
import { loadProductTypes, loadCatalogs, withLocalAlcantaraDownloads, withLocalLeatherSpecDownloads } from "../src/sanity/lib/loaders";

export async function getEditorialMigrationDefaults() {
  const productTypes = withLocalLeatherSpecDownloads(withLocalAlcantaraDownloads(await loadProductTypes()));
  const catalogs = await loadCatalogs("ja");
  return {
    homePageCopy, materialFaqs,
    news: newsItems.filter(item => item.slug !== "new-material-study").map(item => ({
      ...item, articleContent: { en: getNewsArticleContent(item.slug, "en"), ja: getNewsArticleContent(item.slug, "ja") }
    })),
    downloadPage: { ...downloadPageCopy, groups: createDownloadGroups(catalogs, productTypes.flatMap(item => item.downloads)) },
    productDownloads: Object.fromEntries(productTypes.filter(item => ["alcantara", "leather"].includes(item.materialSlug)).map(item => [item.slug, item.downloads]))
  };
}
