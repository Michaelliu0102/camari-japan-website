# CAMARI JAPAN Website v1 PRD

## 1. Product Goal

CAMARI JAPAN v1 is a high-end B2B website for international interior, automotive, aviation, and product-space clients. The site should communicate premium material sensibility, Japanese restraint, Italian texture, and OEM/ODM capability while making materials, SKU colors, cases, and downloads easy to browse.

The Stitch files `home.html`, `material.html`, `alcantara.html`, and `sku.html` are the design source. They should be highly preserved visually, but rebuilt as production-ready Next.js components and CMS-driven pages.

## 2. v1 Scope

Included:

- Brand homepage
- Materials overview
- Material detail page
- SKU detail page with swatch-driven image/color state
- OEM/ODM service page
- Project/case list and detail
- About page
- Media/news page
- Contact page without submission form
- Downloads page for PDF catalogs and technical sheets
- English and Japanese routes
- SEO metadata, sitemap, robots, canonical, and alternate language URLs
- Sanity CMS schemas for materials, SKU, projects, news, and catalogs

Excluded from v1:

- Sample request form
- Inquiry form
- Inquiry backend model
- Sales email notification
- CRM integration
- The existing lens translation demo as a production homepage interaction

## 3. Page Map

- `/[locale]`: homepage
- `/[locale]/materials`: material category overview
- `/[locale]/materials/[materialSlug]`: material detail
- `/[locale]/materials/[materialSlug]/[skuSlug]`: SKU detail
- `/[locale]/oem-odm`: OEM/ODM service
- `/[locale]/projects`: project/case list
- `/[locale]/projects/[projectSlug]`: project detail
- `/[locale]/about`: company introduction
- `/[locale]/media`: news and editorial updates
- `/[locale]/contact`: contact information
- `/[locale]/downloads`: PDF catalog downloads

`locale` is limited to `en` and `ja`.

## 4. Component Map

- `GlobalNav`: glass navigation, logo outline, language switch, desktop and mobile links.
- `Footer`: asymmetrical white footer with slogan, global cities, company/legal/contact links.
- `HeroVideo`: homepage full-viewport video/image hero.
- `ExploreCarousel`: homepage material/product carousel from Stitch.
- `PageHero`: image-led page hero for material, detail, OEM/ODM, and content pages.
- `MaterialBentoGrid`: material overview bento layout.
- `MaterialIntro`: text/image feature section for material value.
- `ApplicationGrid`: material application series grid.
- `SkuSwatches`: client-side SKU color selector.
- `SpecificationTable`: SKU specification display.
- `DownloadPanel`: catalog and technical sheet links.
- `CTASection`: contact/download-oriented call to action.

## 5. CMS Content Models

Sanity schema types:

- `MaterialCategory`: localized name, slug, cover image, description, sort order, SEO.
- `Material`: localized name, slug, hero image, intro copy, feature image, applications, related SKU, SEO.
- `SKU`: code, slug, localized color name, hex color, swatch image, hero image, material reference, specs, certifications, downloads.
- `ProjectCase`: localized title, slug, industry, cover image, gallery, related material, body, SEO.
- `News`: localized title, slug, category, cover image, body, publish date, SEO.
- `Catalog`: localized title, language, PDF file, cover image, description.

No `Inquiry` or `SampleRequest` schema should be created in v1.

## 6. UX and Content Rules

- The site should feel quiet, premium, tactile, and editorial.
- Materials and images carry the visual identity; UI chrome stays restrained.
- Use warm stone, off-white, charcoal, and restrained gold accent.
- Preserve CAMARI logo outline, wide letter spacing, and large serif page titles.
- SKU detail swatches must update the displayed color name, SKU code, and image without a page reload.
- SKU CTA links to `/[locale]/contact` with copy such as `CONTACT SALES` or `INQUIRE ABOUT THIS MATERIAL`.
- Contact page provides direct contact information only. No form in v1.

## 7. Acceptance Criteria

- `/en` and `/ja` routes render for every v1 page.
- Homepage, material overview, Alcantara detail, and SKU detail clearly map back to the four Stitch prototypes.
- SKU swatches are keyboard-accessible buttons and update visible state.
- Downloads are CMS/data-driven and render PDF links.
- Sitemap includes locale, material, SKU, project, media, and download URLs.
- Metadata includes localized title/description and language alternates.
- Desktop, iPad, and mobile layouts avoid text overlap, image collapse, and fixed-nav content blocking.
