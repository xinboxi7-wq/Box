"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { CrystalCase, CrystalProduct } from "@/types/crystal";

type CrystalCaseCardVariant = "default" | "featured" | "compact";

type CrystalCaseCardProps = {
  caseItem: CrystalCase;
  product: CrystalProduct;
  favorite: boolean;
  onToggleFavorite: (caseId: string) => void;
  variant?: CrystalCaseCardVariant;
};

export function CrystalCaseCard({
  caseItem,
  product,
  favorite,
  onToggleFavorite,
  variant = "default"
}: CrystalCaseCardProps) {
  const caseImage = caseItem.coverImage || caseItem.image;

  if (variant === "compact") {
    return (
      <article className="group grid gap-3 rounded-lg border border-neutral-200 bg-white p-2.5 shadow-sm transition hover:border-neutral-300 hover:shadow-soft-panel sm:flex">
        <Link
          href={`/case/${caseItem.slug}`}
          className="relative aspect-[4/3] w-full flex-none overflow-hidden rounded-md bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 sm:h-24 sm:w-32"
        >
          <Image
            src={caseImage}
            alt={caseItem.title}
            fill
            sizes="(max-width: 640px) 100vw, 8rem"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        </Link>
        <div className="min-w-0 flex-1 px-1 pb-1 sm:py-1 sm:pr-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-xs font-medium text-teal-700">
                {product.name} · {caseItem.styleName}
              </div>
              <Link
                href={`/case/${caseItem.slug}`}
                className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-neutral-950 hover:text-teal-800 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
              >
                {caseItem.title}
              </Link>
            </div>
            <button
              type="button"
              onClick={() => onToggleFavorite(caseItem.id)}
              aria-label={favorite ? "取消收藏案例" : "收藏案例"}
              className="grid h-8 w-8 flex-none place-items-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
            >
              <Star
                className="h-4 w-4"
                fill={favorite ? "currentColor" : "none"}
                aria-hidden="true"
              />
            </button>
          </div>
          <p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-500">
            {caseItem.summary}
          </p>
        </div>
      </article>
    );
  }

  const featured = variant === "featured";

  return (
    <article className="group overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-soft-panel">
      <div
        className={`relative overflow-hidden bg-neutral-100 ${
          featured ? "aspect-[4/3] sm:aspect-[5/4]" : "aspect-[4/3]"
        }`}
      >
        <Link
          href={`/case/${caseItem.slug}`}
          className="block h-full w-full focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
        >
          <Image
            src={caseImage}
            alt={caseItem.title}
            fill
            priority={featured}
            sizes={featured ? "(max-width: 640px) 100vw, 33vw" : "(max-width: 1024px) 100vw, 50vw"}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </Link>
        <button
          type="button"
          onClick={() => onToggleFavorite(caseItem.id)}
          aria-label={favorite ? "取消收藏案例" : "收藏案例"}
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full border border-white/70 bg-white/86 text-neutral-700 shadow-sm backdrop-blur transition hover:bg-white hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
        >
          <Star
            className="h-4 w-4"
            fill={favorite ? "currentColor" : "none"}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className={featured ? "p-3 sm:p-4" : "p-4"}>
        <div className="mb-2 flex flex-wrap gap-1.5 sm:mb-3">
          <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-800">
            {product.name}
          </span>
          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600">
            {caseItem.styleName}
          </span>
        </div>

        <Link
          href={`/case/${caseItem.slug}`}
          className={
            featured
              ? "block text-lg font-semibold leading-tight text-neutral-950 transition hover:text-teal-800 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 sm:text-xl"
              : "block text-lg font-semibold leading-tight text-neutral-950 transition hover:text-teal-800 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
          }
        >
          {caseItem.title}
        </Link>
        <p className={`${featured ? "line-clamp-2" : "line-clamp-3"} mt-2 text-sm leading-6 text-neutral-600`}>
          {caseItem.summary}
        </p>

        {!featured ? (
          <>
            <div className="mt-3 rounded-md bg-neutral-50 px-3 py-2 text-xs leading-5 text-neutral-600">
              <span className="font-medium text-neutral-800">适合：</span>
              {caseItem.commercialUse}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {caseItem.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={`${caseItem.id}-${tag}-${index}`}
                  className="rounded-full bg-neutral-50 px-2 py-1 text-xs text-neutral-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          </>
        ) : null}

        <Link
          href={`/case/${caseItem.slug}`}
          className="mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-neutral-950 px-4 text-sm font-medium text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 sm:mt-4"
        >
          查看案例
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
