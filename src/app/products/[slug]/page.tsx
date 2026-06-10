import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CrystalProductPage } from "@/components/crystal/CrystalProductPage";
import {
  crystalProducts,
  getCrystalCasesByProduct,
  getCrystalProductBySlug
} from "@/lib/crystal-cases";

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
    description: product.description
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getCrystalProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <CrystalProductPage
      product={product}
      cases={getCrystalCasesByProduct(product.id)}
    />
  );
}
