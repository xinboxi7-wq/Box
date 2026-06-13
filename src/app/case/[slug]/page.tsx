import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CrystalCaseDetail } from "@/components/crystal/CrystalCaseDetail";
import {
  crystalCases,
  getCrystalCaseBySlug,
  getCrystalProductById
} from "@/lib/crystal-cases";

const siteUrl = "https://box-cyan-one.vercel.app";

type CasePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return crystalCases.map((caseItem) => ({
    slug: caseItem.slug
  }));
}

export async function generateMetadata({
  params
}: CasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseItem = getCrystalCaseBySlug(slug);

  if (!caseItem) {
    return {
      title: "水晶手串案例"
    };
  }

  return {
    title: `${caseItem.title} - 水晶手串 AI 商业视觉案例库`,
    description: caseItem.summary,
    alternates: {
      canonical: `/case/${caseItem.slug}`
    },
    openGraph: {
      title: `${caseItem.title} - 水晶手串 AI 商业视觉案例库`,
      description: caseItem.summary,
      url: `${siteUrl}/case/${caseItem.slug}`,
      type: "article",
      images: [
        {
          url: caseItem.coverImage || caseItem.image,
          alt: caseItem.title
        }
      ]
    }
  };
}

export default async function CasePage({ params }: CasePageProps) {
  const { slug } = await params;
  const caseItem = getCrystalCaseBySlug(slug);

  if (!caseItem) {
    notFound();
  }

  const product = getCrystalProductById(caseItem.productId);

  if (!product) {
    notFound();
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "案例库",
        item: siteUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.name,
        item: `${siteUrl}/products/${product.slug}`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: caseItem.title,
        item: `${siteUrl}/case/${caseItem.slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CrystalCaseDetail caseItem={caseItem} product={product} />
    </>
  );
}
