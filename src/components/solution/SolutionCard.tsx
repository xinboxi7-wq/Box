"use client";

import { ArrowRight, Star } from "lucide-react";
import type { SolutionDirection } from "@/types/solution";

type SolutionCardProps = {
  solution: SolutionDirection;
  active: boolean;
  onSelect: () => void;
  onFavorite: () => void;
};

export function SolutionCard({
  solution,
  active,
  onSelect,
  onFavorite
}: SolutionCardProps) {
  const suitableScenes = solution.suitableScenes?.length
    ? solution.suitableScenes
    : solution.bestFor.split(" / ").slice(0, 2);
  const visualFocus = solution.visualFocus?.length
    ? solution.visualFocus
    : ["商业质感", "材质表达", "主体清晰"];
  const platformLabels = solution.platformLabels?.length
    ? solution.platformLabels
    : solution.recommendedPlatforms;

  return (
    <article
      className={`rounded-lg border p-4 transition ${
        active
          ? "border-neutral-950 bg-neutral-950 text-white shadow-soft-panel"
          : "border-neutral-200 bg-white text-neutral-950 shadow-sm hover:border-neutral-400"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            {solution.recommendedPlatforms.map((platform, index) => (
              <span
                key={`recommended-platform-${platform}-${index}`}
                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  active
                    ? "bg-white/15 text-white/75"
                    : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {platform}
              </span>
            ))}
          </div>
          <h3 className="text-lg font-semibold leading-tight">
            {solution.title}
          </h3>
        </div>

        <button
          type="button"
          title="收藏方案"
          aria-label="收藏方案"
          onClick={onFavorite}
          className={`grid h-9 w-9 flex-none place-items-center rounded-full border transition focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 ${
            active
              ? "border-white/15 bg-white/10 text-white hover:bg-white/20 focus:ring-white focus:ring-offset-neutral-950"
              : "border-neutral-200 bg-neutral-50 text-neutral-500 hover:text-neutral-950"
          }`}
        >
          <Star className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <p
        className={`mt-3 text-sm leading-6 ${
          active ? "text-white/72" : "text-neutral-600"
        }`}
      >
        {solution.summary}
      </p>

      <div
        className={`mt-4 rounded-lg p-3 text-sm leading-6 ${
          active ? "bg-white/10 text-white/72" : "bg-neutral-50 text-neutral-600"
        }`}
      >
        {solution.commercialValue}
      </div>

      <div className="mt-4 grid gap-2 text-xs">
        <MetaRow
          label="适合场景"
          items={suitableScenes}
          active={active}
        />
        <MetaRow
          label="视觉重点"
          items={visualFocus}
          active={active}
        />
        <MetaRow
          label="推荐比例"
          items={[solution.recommendedAspectRatio || "16:9"]}
          active={active}
        />
        <MetaRow
          label="推荐平台"
          items={platformLabels}
          active={active}
        />
      </div>

      <button
        type="button"
        onClick={onSelect}
        className={`mt-4 inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 ${
          active
            ? "bg-white text-neutral-950 hover:bg-neutral-200 focus:ring-white focus:ring-offset-neutral-950"
            : "bg-neutral-950 text-white hover:bg-neutral-800"
        }`}
      >
        查看详情
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </article>
  );
}

type MetaRowProps = {
  label: string;
  items: string[];
  active: boolean;
};

function MetaRow({ label, items, active }: MetaRowProps) {
  return (
    <div className="grid grid-cols-[4.5rem_1fr] gap-2">
      <span className={active ? "text-white/38" : "text-neutral-400"}>
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, index) => (
          <span
            key={`${label}-${item}-${index}`}
            className={`rounded-full px-2 py-0.5 font-medium ${
              active ? "bg-white/10 text-white/74" : "bg-neutral-100 text-neutral-600"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
