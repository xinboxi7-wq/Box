import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CrystalProductPage } from "@/components/crystal/CrystalProductPage";
import {
  crystalProducts,
  getCrystalCasesByProduct,
  getCrystalProductBySlug
} from "@/lib/crystal-cases";

const siteUrl = "https://box-cyan-one.vercel.app";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return crystalProducts.map((product) => ({
    slug: product.slug
  }));
}

export async function generateMetadata({
  params
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getCrystalProductBySlug(slug);

  if (!product) {
    return {
      title: "水晶手串产品"
    };
  }

  return {
    title: `${product.name}案例 - 水晶手串 AI 商业视觉案例库`,
    description: product.description,
    alternates: {
      canonical: `/products/${product.slug}`
    },
    openGraph: {
      title: `${product.name}案例 - 水晶手串 AI 商业视觉案例库`,
      description: product.description,
      url: `${siteUrl}/products/${product.slug}`,
      type: "website",
      images: [
        {
          url: product.image,
          alt: product.name
        }
      ]
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getCrystalProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${product.name}商业视觉案例`,
    description: product.description,
    url: `${siteUrl}/products/${product.slug}`,
    hasPart: getCrystalCasesByProduct(product.id).map((caseItem, index) => ({
      "@type": "CreativeWork",
      position: index + 1,
      name: caseItem.title,
      url: `${siteUrl}/case/${caseItem.slug}`
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
    <CrystalProductPage
      product={product}
      cases={getCrystalCasesByProduct(product.id)}
    />
    </>
  );
}
