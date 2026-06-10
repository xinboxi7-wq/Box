"use client";

import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import type { CrystalCase, CrystalProduct } from "@/types/crystal";
import { useCrystalFavorites } from "./useCrystalFavorites";

type CrystalCaseDetailProps = {
  caseItem: CrystalCase;
  product: CrystalProduct;
};

export function CrystalCaseDetail({
  caseItem,
  product
}: CrystalCaseDetailProps) {
  const { favoriteSet, toggleFavorite } = useCrystalFavorites();
  const favorite = favoriteSet.has(caseItem.id);

  return (
    <main className="min-h-screen bg-[#F6F7F4] text-neutral-950">
      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/#cases"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            返回列表
          </Link>
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex h-10 items-center rounded-full border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
          >
            查看{product.name}
          </Link>
        </div>

        <article className="mt-6 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-soft-panel">
          <div className="grid gap-0 lg:grid-cols-[1.04fr_0.96fr]">
            <div className="bg-neutral-100">
              <img
                src={caseItem.image}
                alt={caseItem.title}
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-5 sm:p-6">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800">
                  {product.name}
                </span>
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                  {caseItem.styleName}
                </span>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
                {caseItem.title}
              </h1>
              <p className="mt-4 text-base leading-8 text-neutral-600">
                {caseItem.summary}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {caseItem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => toggleFavorite(caseItem.id)}
                className={`mt-6 inline-flex h-11 w-fit items-center gap-2 rounded-full px-4 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 ${
                  favorite
                    ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                    : "bg-neutral-950 text-white hover:bg-neutral-800"
                }`}
              >
                <Star
                  className="h-4 w-4"
                  fill={favorite ? "currentColor" : "none"}
                  aria-hidden="true"
                />
                {favorite ? "已收藏" : "收藏案例"}
              </button>
            </div>
          </div>
        </article>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 pb-14 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
        <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-neutral-950">Prompt</div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-neutral-600">
            {caseItem.prompt}
          </p>
        </div>

        <div className="grid gap-4">
          <AnalysisBlock
            title="构图分析"
            value={caseItem.compositionAnalysis}
          />
          <AnalysisBlock
            title="灯光分析"
            value={caseItem.lightingAnalysis}
          />
          <AnalysisBlock title="适用场景" value={caseItem.commercialUse} />
        </div>
      </section>
    </main>
  );
}

function AnalysisBlock({ title, value }: { title: string; value: string }) {
  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-semibold text-neutral-950">{title}</div>
      <p className="mt-3 text-sm leading-7 text-neutral-600">{value}</p>
    </section>
  );
}
