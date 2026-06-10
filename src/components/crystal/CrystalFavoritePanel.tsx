"use client";

import Link from "next/link";
import { Star, Trash2 } from "lucide-react";
import type { CrystalCase } from "@/types/crystal";

type CrystalFavoritePanelProps = {
  favoriteCases: CrystalCase[];
  onToggleFavorite: (caseId: string) => void;
  onClearFavorites: () => void;
};

export function CrystalFavoritePanel({
  favoriteCases,
  onToggleFavorite,
  onClearFavorites
}: CrystalFavoritePanelProps) {
  return (
    <section
      id="favorites"
      className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-950">
          <Star className="h-4 w-4 text-amber-600" aria-hidden="true" />
          收藏案例
        </div>
        {favoriteCases.length > 0 ? (
          <button
            type="button"
            onClick={onClearFavorites}
            className="rounded-full px-2 py-1 text-xs font-medium text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
          >
            清空
          </button>
        ) : (
          <span className="text-xs text-neutral-400">0</span>
        )}
      </div>

      {favoriteCases.length === 0 ? (
        <p className="text-sm leading-6 text-neutral-500">
          还没有收藏案例。收藏会保存水晶手串案例、Prompt 和视觉分析，方便之后替换真实图片时复用。
        </p>
      ) : (
        <div className="grid gap-2">
          {favoriteCases.map((caseItem) => (
            <div
              key={caseItem.id}
              className="flex items-start gap-2 rounded-lg border border-neutral-100 bg-neutral-50 p-3"
            >
              <Link
                href={`/case/${caseItem.slug}`}
                className="min-w-0 flex-1 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
              >
                <div className="truncate text-sm font-semibold text-neutral-950">
                  {caseItem.title}
                </div>
                <div className="mt-1 text-xs leading-5 text-neutral-500">
                  {caseItem.styleName} · {caseItem.commercialUse}
                </div>
              </Link>
              <button
                type="button"
                onClick={() => onToggleFavorite(caseItem.id)}
                aria-label={`取消收藏：${caseItem.title}`}
                className="rounded-full p-1.5 text-neutral-400 transition hover:bg-white hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
