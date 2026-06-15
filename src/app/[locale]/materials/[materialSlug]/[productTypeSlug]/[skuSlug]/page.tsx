import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DownloadPanel } from "@/components/DownloadPanel";
import { JsonLd } from "@/components/JsonLd";
import { SkuSwatches } from "@/components/SkuSwatches";
import { SpecificationTable } from "@/components/SpecificationTable";
import { createPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/lib/locales";
import { buildBreadcrumbJsonLd, buildProductJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site-config";
import { loadMaterial, loadMaterials, loadProductType, loadProductTypesForMaterial, loadSku, loadSkusForProductType } from "@/sanity/lib/loaders";

type PageProps = {
  params: Promise<{ locale: Locale; materialSlug: string; productTypeSlug: string; skuSlug: string }>;
};

type FaqItem = {
  question: string;
  answer: string;
};

const productTypeFaqs: Partial<Record<string, Record<Locale, FaqItem[]>>> = {
  "alcantara-panel": {
    en: [
      {
        question: "What is Alcantara Pannel made of?",
        answer:
          "Alcantara Pannel is composed of 68% polyester and 32% polyurethane."
      },
      {
        question: "What is Alcantara Pannel intended for?",
        answer:
          "Alcantara Pannel is specified for door pannels, dashboards, headliners and consoles."
      },
      {
        question: "Can Alcantara Pannel be used for seats?",
        answer:
          "For seating surfaces, specify Alcantara Cover. Pannel is selected for trim and upholstery applications rather than seat-cover construction."
      },
      {
        question: "Can Alcantara Pannel be used for steering wheel?",
        answer:
          "While Alcantara Pannel is suitable for steering wheels, our 1.2mm Multilayer application offers an upgraded option. The additional thickness enhances the hand-feel, delivering a more robust and luxurious tactile experience. It is only available in black."
      },
      {
        question: "Is Alcantara Pannel Fire Retardant?",
        answer:
          "Product 5012 is the standard version with fire retardant treatment, while 5856 (Pannel FR) is the fire-retardant equivalent available in the same color range. Likewise, 5205 represents the non-FR Cover, and 5268 is the Cover FR version."
      }
    ],
    ja: [
      {
        question: "Alcantara Pannel の素材構成は何ですか？",
        answer:
          "Alcantara Pannel は、ポリエステル 68%、ポリウレタン 32% で構成されています。"
      },
      {
        question: "Alcantara Pannel はどの用途に適していますか？",
        answer:
          "Alcantara Pannel は、ドアパネル、ダッシュボード、ヘッドライナー、コンソールに適しています。"
      },
      {
        question: "シートにも使用できますか？",
        answer:
          "シート表皮には Alcantara Cover を推奨します。Pannel は主にトリム、内装パネル、張り込み用途向けの仕様です。"
      },
      {
        question: "ステアリングホイールにも使用できますか？",
        answer:
          "Alcantara Pannel はステアリングホイールにも使用できますが、1.2mm の Multilayer 仕様はアップグレードされた選択肢です。厚みが増すことで手触りが高まり、よりしっかりとした上質な触感が得られます。カラーはブラックのみです。"
      },
      {
        question: "Alcantara Pannel は難燃仕様ですか？",
        answer:
          "5012 は難燃処理を施した標準仕様で、5856（Pannel FR）は同じカラー範囲で展開される難燃相当品です。同様に、5205 は非 FR の Cover、5268 は Cover FR 仕様です。"
      }
    ]
  },
  "alcantara-cover": {
    en: [
      {
        question: "What is Alcantara Cover made of?",
        answer:
          "Alcantara Cover is composed of 68% polyester and 32% polyurethane, laminated with polyester textile backing."
      },
      {
        question: "What is Alcantara Cover intended for?",
        answer:
          "Alcantara Cover is intended for automotive seats and seat-cover upholstery where a soft Alcantara surface needs durable wear performance."
      },
      {
        question: "What is the standard width and thickness?",
        answer:
          "The standard width is ≥142 cm, with a thickness of ≥0.95 mm."
      },
      {
        question: "Is Alcantara Cover Fire Retardant?",
        answer:
          "Product 5205 is the standard non-FR Cover, while 5268 is the Cover FR version with <100 mm/min fire-resistance performance. Confirm the applicable specification sheet before production."
      }
    ],
    ja: [
      {
        question: "Alcantara Cover の素材構成は何ですか？",
        answer:
          "Alcantara Cover は、ポリエステル 68%、ポリウレタン 32% で構成され、ポリエステル織物の裏地でラミネートされています。"
      },
      {
        question: "Alcantara Cover はどの用途に適していますか？",
        answer:
          "Alcantara Cover は、柔らかな Alcantara 表面と耐摩耗性が求められる自動車シートおよびシート表皮向けの素材です。"
      },
      {
        question: "標準幅と厚みはどのくらいですか？",
        answer:
          "標準幅は 142 cm 以上、厚みは 0.95 mm 以上です。"
      },
      {
        question: "Alcantara Cover は難燃仕様ですか？",
        answer:
          "5205 は標準の非 FR Cover で、5268 は <100 mm/min の難燃性能を持つ Cover FR 仕様です。生産前に該当仕様書をご確認ください。"
      }
    ]
  },
  "alcantara-master": {
    en: [
      {
        question: "What is Alcantara Master made of?",
        answer:
          "Alcantara Master is composed of 68% polyester and 32% polyurethane."
      },
      {
        question: "What is Alcantara Master intended for?",
        answer:
          "Alcantara Master is intended for interior, wall, and furniture upholstery, with color solutions for residential, commercial, aviation, marine, and refined mobility interiors."
      },
      {
        question: "What is the standard width and thickness?",
        answer:
          "The standard width is ≥142 cm, with a thickness of 0.83 ± 0.1 mm."
      },
      {
        question: "Is Alcantara Master Fire Retardant?",
        answer:
          "The standard Master article is not fire retardant. For FR requirements, use the FR version 5763 and confirm the applicable B-s2,d0 specification sheet before production."
      }
    ],
    ja: [
      {
        question: "Alcantara Master の素材構成は何ですか？",
        answer:
          "Alcantara Master は、ポリエステル 68%、ポリウレタン 32% で構成されています。"
      },
      {
        question: "Alcantara Master はどの用途に適していますか？",
        answer:
          "Alcantara Master は、インテリア、壁面、家具張り地向けの素材です。住宅、商業空間、航空、船舶、上質なモビリティ内装に向けたカラーソリューションとして使用できます。"
      },
      {
        question: "標準幅と厚みはどのくらいですか？",
        answer:
          "標準幅は 142 cm 以上、厚みは 0.83 ± 0.1 mm です。"
      },
      {
        question: "Alcantara Master は難燃仕様ですか？",
        answer:
          "標準の Master は難燃仕様ではありません。FR 条件が必要な場合は FR バージョン 5763 を使用し、生産前に B-s2,d0 の該当仕様書をご確認ください。"
      }
    ]
  },
  "alcantara-multilayer": {
    en: [
      {
        question: "What is Alcantara Multilayer made of?",
        answer:
          "Alcantara Multilayer is composed of 71% polyester and 29% polyurethane."
      },
      {
        question: "What is Alcantara Multilayer intended for?",
        answer:
          "Alcantara Multilayer is intended for sofa upholstery where a soft Alcantara surface needs a structured backing for furniture applications."
      },
      {
        question: "What is the standard width and thickness?",
        answer:
          "The standard width is ≥142 cm, with a thickness of 1.2 ± 0.2 mm."
      },
      {
        question: "Is Alcantara Multilayer Fire Retardant?",
        answer:
          "Alcantara Multilayer complies with California Technical Bulletin 117:2013 Section 1."
      }
    ],
    ja: [
      {
        question: "Alcantara Multilayer の素材構成は何ですか？",
        answer:
          "Alcantara Multilayer は、ポリエステル 71%、ポリウレタン 29% で構成されています。"
      },
      {
        question: "Alcantara Multilayer はどの用途に適していますか？",
        answer:
          "Alcantara Multilayer は、家具用途で安定した裏地と柔らかな Alcantara 表面が求められるソファ張り地向けの素材です。"
      },
      {
        question: "標準幅と厚みはどのくらいですか？",
        answer:
          "標準幅は 142 cm 以上、厚みは 1.2 ± 0.2 mm です。"
      },
      {
        question: "Alcantara Multilayer は難燃仕様ですか？",
        answer:
          "Alcantara Multilayer は California Technical Bulletin 117:2013 Section 1 に適合しています。"
      }
    ]
  },
  "alcantara-avant": {
    en: [
      {
        question: "What is Alcantara Avant made of?",
        answer:
          "Alcantara Avant is composed of 68% polyester and 32% polyurethane, laminated with polyester textile backing."
      },
      {
        question: "What is Alcantara Avant intended for?",
        answer:
          "Alcantara Avant is intended for aviation, contract, and marine upholstery where flame-retardant performance and UV stability are required."
      },
      {
        question: "What is the standard width and thickness?",
        answer:
          "The standard width is ≥142 cm, with a thickness of ≥0.95 mm."
      },
      {
        question: "Is Alcantara Avant Fire Retardant?",
        answer:
          "Alcantara Avant complies with BS 5852 Crib 5, IMO RES A652, and FAR/JAR 25.853 flame-resistance requirements."
      }
    ],
    ja: [
      {
        question: "Alcantara Avant の素材構成は何ですか？",
        answer:
          "Alcantara Avant は、ポリエステル 68%、ポリウレタン 32% で構成され、ポリエステル織物の裏地でラミネートされています。"
      },
      {
        question: "Alcantara Avant はどの用途に適していますか？",
        answer:
          "Alcantara Avant は、難燃性能と紫外線安定性が求められる航空、契約、船舶向けの張り地に適しています。"
      },
      {
        question: "標準幅と厚みはどのくらいですか？",
        answer:
          "標準幅は 142 cm 以上、厚みは 0.95 mm 以上です。"
      },
      {
        question: "Alcantara Avant は難燃仕様ですか？",
        answer:
          "Alcantara Avant は BS 5852 Crib 5、IMO RES A652、FAR/JAR 25.853 の難燃要件に適合しています。"
      }
    ]
  },
  "alcantara-board-fr": {
    en: [
      {
        question: "What is Alcantara Board FR made of?",
        answer:
          "Alcantara Board FR is composed of 70% polyester and 30% polyurethane, with FR content for marine wall-covering applications."
      },
      {
        question: "What is Alcantara Board FR intended for?",
        answer:
          "Alcantara Board FR is intended for marine wall covering where a lightweight Alcantara surface needs IMO flame-retardant performance."
      },
      {
        question: "What is the standard width and thickness?",
        answer:
          "The standard width is ≥142 cm, with a thickness of 0.4 ± 0.05 mm."
      },
      {
        question: "Is Alcantara Board FR Fire Retardant?",
        answer:
          "Alcantara Board FR complies with IMO RES A653, with calorific value ≤44.9 MJ/m² and smoke density ≤200."
      }
    ],
    ja: [
      {
        question: "Alcantara Board FR の素材構成は何ですか？",
        answer:
          "Alcantara Board FR は、ポリエステル 70%、ポリウレタン 30% で構成され、船舶壁面用途向けの難燃成分を含みます。"
      },
      {
        question: "Alcantara Board FR はどの用途に適していますか？",
        answer:
          "Alcantara Board FR は、軽量な Alcantara 表面と IMO 難燃性能が求められる船舶壁面仕上げに適しています。"
      },
      {
        question: "標準幅と厚みはどのくらいですか？",
        answer:
          "標準幅は 142 cm 以上、厚みは 0.4 ± 0.05 mm です。"
      },
      {
        question: "Alcantara Board FR は難燃仕様ですか？",
        answer:
          "Alcantara Board FR は IMO RES A653 に適合し、発熱量 ≤44.9 MJ/m²、煙濃度 ≤200 の仕様です。"
      }
    ]
  }
};

function ProductTypeFaq({ items }: { items: FaqItem[] }) {
  return (
    <section className="scroll-mt-[calc(var(--nav-height)+2rem)] border-t border-charcoal/10 bg-stone py-20 md:py-28" data-nav-invert id="faq">
      <div className="section-shell">
        <h2 className="font-serif text-2xl uppercase tracking-[0.06em] text-charcoal">FAQ</h2>
        <div className="mx-auto mt-14 max-w-[46rem]">
          <div className="border-t border-charcoal/10">
            {items.map((item) => (
              <details className="group border-b border-charcoal/10 py-5" key={item.question}>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-8 text-left marker:hidden">
                  <span>
                    <span className="label-caps block text-[10px] text-charcoal">{item.question}</span>
                  </span>
                  <span aria-hidden="true" className="shrink-0 font-sans text-xl leading-none text-muted transition-transform duration-300 ease-expo group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-2 pr-10 text-[0.8rem] leading-relaxed text-muted">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export async function generateStaticParams() {
  const materials = await loadMaterials();
  const productTypeGroups = await Promise.all(materials.map((material) => loadProductTypesForMaterial(material.slug)));
  const skuGroups = await Promise.all(
    materials.map(async (material, materialIndex) =>
      Promise.all(
        (productTypeGroups[materialIndex] ?? []).map(async (productType) => ({
          productType,
          skus: await loadSkusForProductType(material.slug, productType.slug)
        }))
      )
    )
  );

  return materials.flatMap((material, materialIndex) =>
    (skuGroups[materialIndex] ?? []).flatMap(({ productType, skus }) =>
      skus.flatMap((sku) => [
        { locale: "en", materialSlug: material.slug, productTypeSlug: productType.slug, skuSlug: sku.slug },
        { locale: "ja", materialSlug: material.slug, productTypeSlug: productType.slug, skuSlug: sku.slug }
      ])
    )
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, materialSlug, productTypeSlug, skuSlug } = await params;
  const sku = await loadSku(materialSlug, productTypeSlug, skuSlug);

  if (!sku) {
    return {};
  }

  return createPageMetadata({
    locale,
    path: `/materials/${materialSlug}/${productTypeSlug}/${sku.slug}`,
    title: sku.seo.title[locale],
    description: sku.seo.description[locale],
    image: sku.seo.image
  });
}

export default async function ProductTypeSkuDetailPage({ params }: PageProps) {
  const { locale, materialSlug, productTypeSlug, skuSlug } = await params;
  const [material, productType, sku] = await Promise.all([
    loadMaterial(materialSlug),
    loadProductType(materialSlug, productTypeSlug),
    loadSku(materialSlug, productTypeSlug, skuSlug)
  ]);

  if (!material || !productType || !sku) {
    notFound();
  }

  const skus = await loadSkusForProductType(material.slug, productType.slug);
  const breadcrumbSchema = buildBreadcrumbJsonLd(siteConfig, [
    { name: locale === "en" ? "Home" : "ホーム", path: "/" },
    { name: locale === "en" ? "Materials" : "素材", path: "/materials" },
    { name: material.name[locale], path: `/materials/${material.slug}` },
    { name: productType.name[locale], path: `/materials/${material.slug}/${productType.slug}/${sku.slug}` },
    { name: sku.code, path: `/materials/${material.slug}/${productType.slug}/${sku.slug}` }
  ]);
  const productSchema = buildProductJsonLd(siteConfig, {
    name: sku.colorName?.[locale] ? `${productType.name[locale]} ${sku.colorName[locale]}` : `${productType.name[locale]} ${sku.code}`,
    description: sku.summary[locale],
    path: `/materials/${material.slug}/${productType.slug}/${sku.slug}`,
    image: sku.image,
    sku: sku.code,
    category: productType.name[locale]
  });
  const faqItems = productTypeFaqs[productType.slug]?.[locale];

  return (
    <main>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={productSchema} />
      <SkuSwatches
        initialSku={sku}
        locale={locale}
        materialName={material.name[locale]}
        materialSlug={material.slug}
        productTypeName={productType.name[locale]}
        productTypeSlug={productType.slug}
        productTypeCode={productType.productCode}
        productTypeSummary={productType.summary[locale]}
        skus={skus}
      />
      <SpecificationTable locale={locale} productType={productType} sku={sku} />
      <section className="scroll-mt-[calc(var(--nav-height)+2rem)] border-t border-charcoal/10 bg-paper py-20 md:py-28" data-nav-invert id="downloads">
        <div className="section-shell">
          <h2 className="font-serif text-2xl uppercase tracking-[0.06em]">Downloads</h2>
          <div className="mx-auto mt-14 max-w-[46rem]">
            <DownloadPanel locale={locale} downloads={productType.downloads} />
          </div>
        </div>
      </section>
      {faqItems ? <ProductTypeFaq items={faqItems} /> : null}
    </main>
  );
}
