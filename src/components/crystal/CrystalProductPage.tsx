"use client";

import Link from "next/link";
import { ArrowLeft, Gem } from "lucide-react";
import { CrystalCaseCard } from "@/components/crystal/CrystalCaseCard";
import { getCrystalProductById } from "@/lib/crystal-cases";
import type { CrystalCase, CrystalProduct } from "@/types/crystal";
import { useCrystalFavorites } from "./useCrystalFavorites";

type CrystalProductPageProps = {
  product: CrystalProduct;
  cases: CrystalCase[];
};

export function CrystalProductPage({
  product,
  cases
}: CrystalProductPageProps) {
  const { favoriteSet, toggleFavorite } = useCrystalFavorites();

  return (
    <main className="min-h-screen bg-[#F6F7F4] text-neutral-950">
      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/#cases"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          返回案例库
        </Link>

        <div className="mt-6 grid gap-6 rounded-lg border border-neutral-200 bg-white p-5 shadow-soft-panel lg:grid-cols-[0.9fr_1.1fr] lg:p-6">
          <div className="overflow-hidden rounded-lg bg-neutral-100">
            <img
              src={product.image}
              alt={product.name}
              className="aspect-[4/3] h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-800">
              <Gem className="h-3.5 w-3.5" aria-hidden="true" />
              水晶手串分类
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-3 text-sm font-medium text-neutral-500">
              {product.englishName} · {product.mineral}
            </p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-neutral-600">
              {product.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-teal-700">
              Product cases
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
              {product.name}的 3 个视觉案例
            </h2>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-500 shadow-sm">
            {cases.length} 个案例
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cases.map((caseItem) => {
            const caseProduct = getCrystalProductById(caseItem.productId);

            if (!caseProduct) {
              return null;
            }

            return (
              <CrystalCaseCard
                key={caseItem.id}
                caseItem={caseItem}
                product={caseProduct}
                favorite={favoriteSet.has(caseItem.id)}
                onToggleFavorite={toggleFavorite}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}
