"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Gem, Search, Star, X } from "lucide-react";
import {
  getCrystalCasesBySlugs,
  getCrystalProductById,
  getFavoriteCrystalCases,
  latestCaseSlugs,
  popularCaseSlugs,
  searchCrystalCases
} from "@/lib/crystal-cases";
import type { CrystalCase, CrystalProduct } from "@/types/crystal";
import { CrystalCaseCard } from "./CrystalCaseCard";
import { CrystalFavoritePanel } from "./CrystalFavoritePanel";
import { useCrystalFavorites } from "./useCrystalFavorites";

type CrystalCaseLibraryProps = {
  products: CrystalProduct[];
  cases: CrystalCase[];
};

export function CrystalCaseLibrary({
  products,
  cases
}: CrystalCaseLibraryProps) {
  const [query, setQuery] = useState("");
  const { favoriteIds, favoriteSet, toggleFavorite, clearFavorites } =
    useCrystalFavorites();

  const latestCases = useMemo(
    () => getCrystalCasesBySlugs(latestCaseSlugs),
    []
  );
  const popularCases = useMemo(
    () => getCrystalCasesBySlugs(popularCaseSlugs),
    []
  );
  const visibleCases = useMemo(() => searchCrystalCases(query, cases), [cases, query]);
  const favoriteCases = useMemo(
    () => getFavoriteCrystalCases(favoriteIds),
    [favoriteIds]
  );

  const handleClearFavorites = () => {
    if (window.confirm("确定清空全部收藏案例吗？")) {
      clearFavorites();
    }
  };

  return (
    <main className="min-h-screen bg-[#F6F7F4] text-neutral-950">
      <section className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <header className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,0.56fr)] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
              Crystal Bracelet Case Library
            </div>
            <h1 className="mt-3 text-[2rem] font-semibold leading-[1.04] tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
              <span className="block">Crystal Prompt Library</span>
              <span className="mt-1 block text-2xl leading-tight sm:text-3xl lg:text-4xl">
                水晶商业视觉 Prompt 库
              </span>
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600 sm:text-base sm:leading-7">
              收录紫水晶、黄水晶、黑曜石等商业视觉案例，包含 AI Prompt、构图分析、灯光分析与风格拆解。
            </p>
          </div>

          <div className="grid gap-3">
            <div className="rounded-lg border border-neutral-200 bg-white p-2 shadow-sm">
              <label className="flex min-h-11 items-center gap-2 px-3">
                <Search className="h-4 w-4 text-neutral-400" aria-hidden="true" />
                <span className="sr-only">搜索案例</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜索紫水晶、白底、小红书、奢侈品广告..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-neutral-950 outline-none placeholder:text-neutral-400"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="grid h-8 w-8 place-items-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-950"
                    aria-label="清空搜索"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : null}
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              <Link
                href="#cases"
                className="inline-flex h-10 items-center justify-center rounded-full bg-neutral-950 px-4 text-sm font-medium text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
              >
                全部案例
              </Link>
              <Link
                href="#favorites"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
              >
                <Star className="h-4 w-4" aria-hidden="true" />
                收藏 {favoriteIds.length}
              </Link>
            </div>
          </div>
        </header>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.52fr)_minmax(22rem,0.8fr)]">
          <section>
            <SectionHeading eyebrow="Latest cases" title="最新案例" />
            <div className="-mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0">
              {latestCases.map((caseItem) => {
                const product = getCrystalProductById(caseItem.productId);

                if (!product) {
                  return null;
                }

                return (
                  <div
                    key={caseItem.id}
                    className="w-[82vw] max-w-[23rem] flex-none sm:w-auto sm:max-w-none"
                  >
                    <CrystalCaseCard
                      caseItem={caseItem}
                      product={product}
                      favorite={favoriteSet.has(caseItem.id)}
                      onToggleFavorite={toggleFavorite}
                      variant="featured"
                    />
                  </div>
                );
              })}
            </div>
          </section>

          <div className="grid gap-4">
            <section>
              <SectionHeading eyebrow="Popular" title="热门案例" />
              <div className="mt-3 grid gap-2">
                {popularCases.map((caseItem) => {
                  const product = getCrystalProductById(caseItem.productId);

                  if (!product) {
                    return null;
                  }

                  return (
                    <CrystalCaseCard
                      key={caseItem.id}
                      caseItem={caseItem}
                      product={product}
                      favorite={favoriteSet.has(caseItem.id)}
                      onToggleFavorite={toggleFavorite}
                      variant="compact"
                    />
                  );
                })}
              </div>
            </section>

            <section>
              <SectionHeading eyebrow="Products" title="产品分类" />
              <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
                {products.map((product) => (
                  <ProductCategoryCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>

      <section
        id="cases"
        className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="All crystal cases"
            title={query ? "搜索结果" : "全部案例"}
          />
          <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-500 shadow-sm">
            {visibleCases.length} 个案例
          </span>
        </div>

        {visibleCases.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-300 bg-white/70 p-6 text-sm leading-6 text-neutral-500">
            没有找到匹配案例。可以搜索「紫水晶」「黄水晶」「黑曜石」「白底」「小红书」「奢侈品广告」。
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {visibleCases.map((caseItem) => {
              const product = getCrystalProductById(caseItem.productId);

              if (!product) {
                return null;
              }

              return (
                <CrystalCaseCard
                  key={caseItem.id}
                  caseItem={caseItem}
                  product={product}
                  favorite={favoriteSet.has(caseItem.id)}
                  onToggleFavorite={toggleFavorite}
                />
              );
            })}
          </div>
        )}
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <CrystalFavoritePanel
          favoriteCases={favoriteCases}
          onToggleFavorite={toggleFavorite}
          onClearFavorites={handleClearFavorites}
        />
      </section>
    </main>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-950">
        {title}
      </h2>
    </div>
  );
}

function ProductCategoryCard({ product }: { product: CrystalProduct }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-2 shadow-sm transition hover:border-neutral-300 hover:shadow-soft-panel focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
    >
      <img
        src={product.image}
        alt={product.name}
        className="h-16 w-20 flex-none rounded-md object-cover sm:h-20 sm:w-24"
      />
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-neutral-950">
          <Gem className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
          {product.name}
        </div>
        <div className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-500">
          {product.tags.join(" / ")}
        </div>
      </div>
    </Link>
  );
}
