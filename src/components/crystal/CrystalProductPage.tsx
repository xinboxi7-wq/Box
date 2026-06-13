"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Gem, Sparkles } from "lucide-react";
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
  const styleCount = new Set(cases.map((caseItem) => caseItem.styleId)).size;
  const heroCase = cases[0];
  const heroImage = heroCase?.coverImage || heroCase?.image || product.image;

  return (
    <main className="min-h-screen text-neutral-950">
      <section className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <Link
          href="/#cases"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 text-sm font-semibold text-neutral-700 shadow-sm transition hover:bg-white hover:text-neutral-950"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          返回案例库
        </Link>

        <div className="mt-5 overflow-hidden rounded-[2rem] border border-black/10 bg-[#fbfaf7] shadow-[0_22px_80px_rgba(23,23,23,0.1)]">
          <div className="grid lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
            <div className="relative min-h-[22rem] overflow-hidden bg-neutral-100 sm:min-h-[30rem]">
              <Image
                src={heroImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 52vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/34 via-transparent to-transparent" />
            </div>
            <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-10">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-teal-800 shadow-sm">
                <Gem className="h-3.5 w-3.5" aria-hidden="true" />
                水晶材质专题
              </div>
              <h1 className="mt-5 text-5xl font-semibold tracking-[-0.05em] text-neutral-950 sm:text-7xl">
                {product.name}
              </h1>
              <p className="mt-3 text-sm font-medium text-neutral-500">
                {product.englishName} · {product.mineral}
              </p>
              <p className="mt-6 max-w-xl text-base leading-8 text-neutral-600">
                {product.description}
              </p>

              <div className="mt-6 grid grid-cols-3 gap-2">
                <ProductMetric value={String(cases.length)} label="案例" />
                <ProductMetric value={String(styleCount)} label="风格" />
                <ProductMetric value="3" label="模型" />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Link
                href="#product-cases"
                className="mt-7 inline-flex h-11 w-fit items-center gap-2 rounded-full bg-neutral-950 px-4 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                查看该材质案例
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-3">
          <SpecBlock title="材质表达" value={product.materialSpecZh} />
          <SpecBlock title="颜色重点" value={product.colorSpecZh} />
          <SpecBlock title="纹理细节" value={product.textureSpecZh} />
        </div>
      </section>

      <section
        id="product-cases"
        className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              Product cases
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-neutral-950">
              {product.name}的商业视觉案例
            </h2>
          </div>
          <span className="w-fit rounded-full border border-black/10 bg-white/80 px-3 py-1.5 text-xs font-semibold text-neutral-500 shadow-sm">
            {cases.length} 个案例
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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

function ProductMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white px-3 py-3 shadow-sm">
      <div className="text-2xl font-semibold tracking-[-0.03em] text-neutral-950">
        {value}
      </div>
      <div className="mt-1 text-xs font-medium text-neutral-500">{label}</div>
    </div>
  );
}

function SpecBlock({ title, value }: { title: string; value: string }) {
  return (
    <section className="rounded-[1.5rem] border border-black/10 bg-white/76 p-5 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-neutral-950">
        <Sparkles className="h-4 w-4 text-teal-700" aria-hidden="true" />
        {title}
      </div>
      <p className="mt-3 text-sm leading-7 text-neutral-600">{value}</p>
    </section>
  );
}
