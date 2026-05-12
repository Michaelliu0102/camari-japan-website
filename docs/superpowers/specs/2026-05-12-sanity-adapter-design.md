# Sanity Adapter Design

## Goal

Connect the current CAMARI JAPAN Next.js site to Sanity content while preserving the existing page structure and adding a stable adapter layer between Sanity query results and page components.

## Existing CMS Baseline

This project already has a Sanity foundation. The implementation should extend it, not create a parallel integration.

- `src/sanity/lib/client.ts` owns the configured Sanity client.
- `sanity.config.ts` mounts Studio at `/studio` and uses the existing schema registry.
- `src/sanity/schemaTypes/*` already defines `materialCategory`, `material`, `sku`, `projectCase`, `news`, `catalog`, `seo`, and localized string/text helpers.
- `src/lib/content.ts` currently owns the app-facing TypeScript types and local fixture data used by pages.

The design goal is therefore to bridge the existing Sanity document model to the existing app-facing content model.

## Approved Direction

Use a two-layer content architecture:

- Existing Sanity schemas and GROQ queries define the CMS-facing data model.
- A project-local adapter layer converts query results into the existing page-facing shapes used by the app.

This keeps homepage, materials, SKU, projects, media, and downloads pages easy to edit in Sanity without coupling page components directly to raw Sanity responses.

## Directory Decision

Do not add `src/lib/sanity/*`. That would split Sanity code across two roots.

Use the existing `src/sanity` tree:

- `src/sanity/lib/client.ts`: keep as the shared Sanity client.
- `src/sanity/lib/queries.ts`: add GROQ query strings and raw query result types.
- `src/sanity/lib/adapters.ts`: add raw Sanity document to app type mapping.
- `src/sanity/lib/loaders.ts`: add page-facing loader functions that choose Sanity or local fallback content.
- `src/lib/content.ts`: keep existing app-facing types and fallback fixtures for this phase. Adapter defaults should read existing fixture records by slug to preserve fields that are not yet modeled in Sanity.

## Scope

Included in this phase:

- Load site, material categories, materials, SKUs, projects, news, and catalogs from Sanity when configured.
- Keep current route structure and current page component contracts.
- Add typed GROQ result shapes and adapter functions.
- Resolve Sanity references in GROQ so adapters receive slug strings and image/file URLs directly.
- Use local fixture content only when Sanity is not configured or a development fetch fails.
- Filter standalone catalog downloads by the active locale using the existing `catalog.language` field.

Not included in this phase:

- A section builder or fully modular homepage composer.
- New CMS-driven search UX.
- New Sanity schemas for forms, subscriptions, sample requests, or inquiry workflows.
- Large visual changes to existing pages.

## Architecture

The content flow should become:

1. A page asks for app content through a loader function in `src/sanity/lib/loaders.ts`.
2. The loader checks whether Sanity is configured.
3. If configured, the loader runs one or more GROQ queries from `src/sanity/lib/queries.ts`.
4. GROQ dereferences related documents and returns route-critical strings and asset URLs.
5. Adapter functions in `src/sanity/lib/adapters.ts` map raw results into the existing app-facing types from `src/lib/content.ts`.
6. Existing page components render the app-facing types with minimal structural change.

The page components should continue receiving shapes optimized for the UI, not raw Sanity records.

## Asset URL Strategy

For this phase, GROQ should return raw Sanity CDN URLs with `asset->url`. This is intentional.

The current components use Next `Image` with `fill` and `sizes`, so raw Sanity image URLs are acceptable for the first CMS integration pass. Do not introduce `@sanity/image-url` transformations yet unless a component needs a fixed-width thumbnail or a visible quality/performance problem appears during browser verification.

File downloads should also use raw Sanity file URLs from `file.asset->url` or `pdf.asset->url`.

## Fallback Strategy

Use one clear fallback rule:

- If `NEXT_PUBLIC_SANITY_PROJECT_ID` is missing or equals `replace-me`, loaders return the local fixture data from `src/lib/content.ts`.
- If Sanity is configured but a fetch fails during local development, loaders should warn and return local fixture data to keep preview work unblocked.
- If Sanity is configured in production and a fetch fails, throw the error so deployment surfaces the content problem.
- If Sanity is configured and returns an empty but valid result, do not silently replace it with fixtures. List pages render empty states where they exist, and dynamic pages call `notFound()` when their requested document does not exist.

This keeps local development convenient without hiding real production CMS problems.

## Reference Strategy

Resolve references in GROQ, not with follow-up per-document fetches. This avoids N+1 query behavior and keeps adapters simple.

Examples:

```groq
*[_type == "material"] | order(name.en asc) {
  name,
  "slug": slug.current,
  "categorySlug": category->slug.current,
  "categoryName": category->name,
  "heroImageUrl": heroImage.asset->url,
  heroSubtitle,
  introTitle,
  introBody,
  "introImageUrl": introImage.asset->url,
  applications[] {
    name,
    colorCount,
    "imageUrl": image.asset->url
  },
  seo {
    title,
    description,
    "imageUrl": image.asset->url
  }
}
```

```groq
*[_type == "sku"] | order(code asc) {
  code,
  "slug": slug.current,
  "materialSlug": material->slug.current,
  colorName,
  hex,
  "heroImageUrl": heroImage.asset->url,
  summary,
  specs,
  certifications,
  downloads[] {
    title,
    description,
    type,
    "href": file.asset->url
  },
  seo {
    title,
    description,
    "imageUrl": image.asset->url
  }
}
```

Standalone catalogs should include language and map their PDF file to the app `href`:

```groq
*[_type == "catalog" && language == $locale] | order(title.en asc) {
  title,
  description,
  "href": pdf.asset->url
}
```

Project references should use the same pattern:

```groq
"materialSlug": relatedMaterial->slug.current
```

## Field Gap Analysis

The app-facing types in `src/lib/content.ts` do not perfectly match the existing Sanity schemas. The adapter must handle these differences explicitly.

| App field | Sanity source | Adapter rule |
| --- | --- | --- |
| `Material.categorySlug` | `material.category` reference | Query `category->slug.current` as `categorySlug`. |
| `Material.eyebrow` | no material field | Derive from `category->name` when present; otherwise use `{ en: "Premium Collection", ja: "プレミアムコレクション" }` as fallback. |
| `Material.heroTitle` | no dedicated field | Use `material.name`. |
| `Material.quote` | no material field | Read the matching local fixture material by slug from `src/lib/content.ts` and reuse its `quote`; if no fixture exists, use `{ en: "", ja: "" }`. |
| `MaterialCategory.accent` | no category field | Read the matching local fixture category by slug from `src/lib/content.ts` and reuse its `accent`; if no fixture exists, use `#1A1A1A`. |
| `ProjectCase.image` | `projectCase.coverImage` | Query `coverImage.asset->url` as `image`. |
| `ProjectCase.materialSlug` | `projectCase.relatedMaterial` reference | Query `relatedMaterial->slug.current` as `materialSlug`. |
| `Sku.image` | `sku.heroImage` | Query `heroImage.asset->url` as `image`. |
| `Sku.swatchImage` | no SKU field | Leave undefined unless a future schema field is added. |
| `Application.slug` | no application field | Generate from `application.name.en` with a stable slug helper. |
| `NewsItem.date` | `news.publishedAt` | Convert ISO datetime to `YYYY-MM-DD`; use an empty string if missing. |
| `NewsItem.image` | `news.coverImage` | Query `coverImage.asset->url` as `image`. |
| `Download.href` | `sku.downloads[].file` or `catalog.pdf` | Query `file.asset->url` or `pdf.asset->url` as `href`. |
| `Download.type` for standalone catalogs | no catalog field | Hard-code standalone catalog documents to `type: "catalog"`. |
| `Catalog.language` | `catalog.language` | Download loaders accept `locale` and query `language == $locale`; documents without a matching language do not appear on that locale download page. |
| `News.body` | `news.body` Portable Text | Not mapped into `NewsItem` list data. Future news detail pages should query and render `body` separately with a detail-specific type. |

## Naming Differences

The adapter is responsible for making naming differences boring for page components:

- Sanity `heroImage` maps to app `image` for SKU.
- Sanity `coverImage` maps to app `image` for projects and news.
- Sanity `coverImage` remains app `coverImage` for material categories.
- Sanity `pdf` maps to app `href` for catalogs.
- Sanity `catalog.language` filters downloads before mapping and does not map onto `Download`.
- Sanity `publishedAt` maps to app `date` for news.
- Sanity `news.body` is intentionally excluded from `NewsItem` until a news detail route exists.

## Adapter Example

Raw Sanity material result:

```ts
const rawMaterial = {
  name: { en: "Alcantara", ja: "アルカンターラ" },
  slug: "alcantara",
  categorySlug: "alcantara",
  categoryName: { en: "Alcantara", ja: "アルカンターラ" },
  heroImageUrl: "https://cdn.sanity.io/images/project/dataset/hero.jpg",
  heroSubtitle: { en: "The sensory revolution", ja: "触感の革新" },
  introTitle: { en: "The Art of Italian Innovation", ja: "イタリアンイノベーションの美学" },
  introBody: { en: "Born at the intersection...", ja: "先端技術と職人性..." },
  introImageUrl: "https://cdn.sanity.io/images/project/dataset/intro.jpg",
  applications: [
    {
      name: { en: "Automotive", ja: "自動車" },
      colorCount: 71,
      imageUrl: "https://cdn.sanity.io/images/project/dataset/app.jpg"
    }
  ],
  seo: {
    title: { en: "Alcantara Materials | CAMARI JAPAN", ja: "Alcantara 素材 | CAMARI JAPAN" },
    description: { en: "Explore Alcantara...", ja: "Alcantara の用途..." },
    imageUrl: "https://cdn.sanity.io/images/project/dataset/og.jpg"
  }
};
```

Adapter output:

```ts
const material = {
  slug: "alcantara",
  categorySlug: "alcantara",
  name: rawMaterial.name,
  eyebrow: rawMaterial.categoryName,
  heroTitle: rawMaterial.name,
  heroSubtitle: rawMaterial.heroSubtitle,
  heroImage: rawMaterial.heroImageUrl,
  introTitle: rawMaterial.introTitle,
  introBody: rawMaterial.introBody,
  introImage: rawMaterial.introImageUrl,
  quote: {
    en: "Alcantara transforms the experience of touch into an architectural statement.",
    ja: "Alcantara は触れる体験を、空間の意思へと変える。"
  },
  applications: [
    {
      slug: "automotive",
      name: rawMaterial.applications[0].name,
      colorCount: 71,
      image: rawMaterial.applications[0].imageUrl
    }
  ],
  seo: {
    title: rawMaterial.seo.title,
    description: rawMaterial.seo.description,
    image: rawMaterial.seo.imageUrl
  }
};
```

Adapter defaults should use slug-based fixture lookups for fields that Sanity does not model in this phase. Specifically, `Material.quote` comes from the matching fixture material and `MaterialCategory.accent` comes from the matching fixture category; unmatched records receive the explicit defaults listed in the field gap table.

## Testing

Use targeted tests around the adapter layer first. The most valuable checks are:

- mapping localized Sanity fields into app-localized strings
- mapping reference slugs without additional fetches
- mapping Sanity image/file URLs into app `image`, `coverImage`, and `href` fields
- filling derived fields such as `heroTitle`, `eyebrow`, `categorySlug`, `materialSlug`, and application slugs
- preserving missing optional fields such as `swatchImage` as `undefined`
- using local fixture data only under the explicit fallback conditions

After adapter tests pass, verify the app with `npm run typecheck` and `npm run build`.
