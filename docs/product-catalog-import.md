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
