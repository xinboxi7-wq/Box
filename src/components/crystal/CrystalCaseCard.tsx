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
      <article className="group grid gap-3 rounded-2xl border border-black/10 bg-white/86 p-2.5 shadow-[0_10px_30px_rgba(11,30,28,0.06)] transition hover:-translate-y-0.5 hover:border-teal-900/20 hover:shadow-[0_16px_42px_rgba(11,30,28,0.1)] sm:grid-cols-[8rem_minmax(0,1fr)]">
        <Link
          href={`/case/${caseItem.slug}`}
          aria-label={`查看 ${caseItem.title} 的完整案例`}
          className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100 sm:aspect-auto sm:h-28"
        >
          <Image
            src={caseImage}
            alt={caseItem.title}
            fill
            sizes="(max-width: 640px) 100vw, 8rem"
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        </Link>
        <div className="flex min-w-0 flex-col justify-between px-1 pb-1 sm:py-1 sm:pr-1">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-xs font-semibold text-teal-700">
                  {product.name} · {caseItem.styleName}
                </div>
                <Link
                  href={`/case/${caseItem.slug}`}
                  aria-label={`查看 ${caseItem.title} 的完整案例`}
                  className="mt-1 line-clamp-2 text-sm font-semibold leading-5 tracking-[-0.01em] text-neutral-950 transition hover:text-teal-800"
                >
                  {caseItem.title}
                </Link>
              </div>
              <FavoriteButton
                favorite={favorite}
                onClick={() => onToggleFavorite(caseItem.id)}
                size="sm"
              />
            </div>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-500">
              {caseItem.summary}
            </p>
          </div>
        </div>
      </article>
    );
  }

  const featured = variant === "featured";

  return (
    <article className="group overflow-hidden rounded-[1.5rem] border border-black/10 bg-white/86 shadow-[0_10px_34px_rgba(11,30,28,0.07)] transition hover:-translate-y-1 hover:border-teal-900/20 hover:shadow-[0_18px_52px_rgba(11,30,28,0.11)]">
      <div
        className={`relative overflow-hidden bg-neutral-100 ${
          featured ? "aspect-[4/3] md:aspect-[3/4]" : "aspect-[4/3]"
        }`}
      >
        <Link
          href={`/case/${caseItem.slug}`}
          aria-label={`查看 ${caseItem.title} 的完整案例`}
          className="block h-full w-full focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
        >
          <Image
            src={caseImage}
            alt={caseItem.title}
            fill
            priority={featured}
            sizes={
              featured
                ? "(max-width: 768px) 100vw, 33vw"
                : "(max-width: 1024px) 100vw, 33vw"
            }
            className="object-cover transition duration-700 group-hover:scale-[1.035]"
          />
        </Link>
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-white/92 px-2.5 py-1 text-xs font-semibold text-neutral-950 shadow-sm backdrop-blur">
            {product.name}
          </span>
          <span className="hidden rounded-full bg-black/36 px-2.5 py-1 text-xs font-medium text-white backdrop-blur sm:inline-flex">
            {caseItem.styleName}
          </span>
        </div>
        <div className="absolute right-3 top-3">
          <FavoriteButton
            favorite={favorite}
            onClick={() => onToggleFavorite(caseItem.id)}
          />
        </div>
      </div>

      <div className={featured ? "p-4" : "p-4 sm:p-5"}>
        <div className="mb-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-[#edf4f2] px-2.5 py-1 text-xs font-medium text-neutral-600">
            {caseItem.styleName}
          </span>
          {caseItem.tags.slice(0, featured ? 1 : 2).map((tag, index) => (
            <span
              key={`${caseItem.id}-${tag}-${index}`}
              className="rounded-full bg-[#edf4f2] px-2.5 py-1 text-xs font-medium text-neutral-500"
            >
              {tag}
            </span>
          ))}
        </div>

        <Link
          href={`/case/${caseItem.slug}`}
          aria-label={`查看 ${caseItem.title} 的完整案例`}
          className={`block font-semibold tracking-[-0.02em] text-neutral-950 transition hover:text-teal-800 ${
            featured ? "text-xl leading-tight" : "text-lg leading-tight"
          }`}
        >
          {caseItem.title}
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">
          {caseItem.summary}
        </p>

        {!featured ? (
          <div className="mt-4 rounded-2xl bg-[#edf4f2]/76 px-3 py-2 text-xs leading-5 text-neutral-600">
            <span className="font-semibold text-neutral-900">适合：</span>
            {caseItem.commercialUse}
          </div>
        ) : null}

        <Link
          href={`/case/${caseItem.slug}`}
          aria-label={`查看 ${caseItem.title} 的完整 Prompt 和视觉分析`}
          className="mt-4 inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full bg-teal-950 px-4 text-sm font-semibold text-white transition hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-teal-950 focus:ring-offset-2"
        >
          查看 Prompt 与分析
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function FavoriteButton({
  favorite,
  onClick,
  size = "md"
}: {
  favorite: boolean;
  onClick: () => void;
  size?: "sm" | "md";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={favorite}
      aria-label={favorite ? "已收藏，点击取消收藏" : "收藏这个案例"}
      className={`grid place-items-center rounded-full border border-white/70 bg-white/90 text-neutral-800 shadow-sm backdrop-blur transition hover:bg-white hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 ${
        size === "sm" ? "h-8 w-8" : "h-10 w-10"
      }`}
    >
      <Star
        className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"}
        fill={favorite ? "currentColor" : "none"}
        aria-hidden="true"
      />
    </button>
  );
}
