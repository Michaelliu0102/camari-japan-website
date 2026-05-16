# Product Catalog Import

This project can batch-fill `productTypes` and `skus` from an Excel workbook.

## 1. Generate the template

```bash
python3 scripts/build_product_catalog.py --write-template data/import/product-catalog-template.xlsx
```

The workbook contains these sheets:

- `product_types`
- `product_type_specs`
- `product_type_certifications`
- `product_type_maintenance`
- `skus`
- `sku_specs`
- `sku_downloads`
- `sku_case_gallery`

## 2. Fill the workbook

Use one row per entity:

- One row per product type in `product_types`
- One row per spec field in `product_type_specs`
- One row per SKU in `skus`
- One row per SKU spec value in `sku_specs`
- One row per download in `sku_downloads`
- One row per case image in `sku_case_gallery`

Important:

- `product_type_slug` must be unique within a material.
- `sku_slug` must be unique across the workbook.
- `sku.product_type_slug` must match an existing row in `product_types`.
- `aliases` in `product_type_specs` use `|` as the separator, for example `thickness|gauge`.

### Image and file paths

For local development, prefer site-relative paths instead of absolute local filesystem paths:

- Put product images under `public/uploads/...`
- Put downloadable PDFs under `public/catalogs/...`
- In Excel, fill values like `/uploads/alcantara/panel/c-alc-4991-main.jpg`
- In Excel, fill downloads like `/catalogs/alcantara-panel-shadow-black-tds.pdf`

Do not use Mac local paths such as `/Users/michael/Desktop/foo.jpg` in the workbook. The browser cannot read those paths.

Remote URLs are also supported, but they should be stable public URLs. For Next.js image rendering, remote hosts may also need to be allow-listed in [next.config.mjs](/Users/michael/Documents/Website/next.config.mjs:1).

Recommended local folder layout:

- `public/uploads/alcantara/panel/`
- `public/uploads/alcantara/cover/`
- `public/uploads/alcantara/swatches/`
- `public/uploads/alcantara/cases/`

## 2.1 Business sample workbook

You can regenerate the local-path sample workbook with:

```bash
python3 scripts/write_alcantara_business_sample.py
```

This writes:

`data/import/alcantara-business-sample.xlsx`

## 3. Build the generated catalog

```bash
python3 scripts/build_product_catalog.py data/import/product-catalog.xlsx
```

This writes:

`src/data/product-catalog.generated.json`

The site automatically merges this generated data with the fixture catalog in [content.ts](/Users/michael/Documents/Website/src/lib/content.ts:1).

## 4. Verify

```bash
python3 -m unittest tests/test_build_product_catalog.py
npm run typecheck
```
