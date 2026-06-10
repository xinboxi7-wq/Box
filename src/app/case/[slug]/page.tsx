import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CrystalCaseDetail } from "@/components/crystal/CrystalCaseDetail";
import {
  crystalCases,
  getCrystalCaseBySlug,
  getCrystalProductById
} from "@/lib/crystal-cases";

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
    description: caseItem.summary
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

  return <CrystalCaseDetail caseItem={caseItem} product={product} />;
}
