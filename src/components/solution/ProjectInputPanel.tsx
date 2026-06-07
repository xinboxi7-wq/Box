"use client";

import { ArrowRight, History, Sparkles } from "lucide-react";
import { toggleGoal } from "@/lib/solution";
import type { ProjectBrief, SolutionRules } from "@/types/solution";

type ProjectInputPanelProps = {
  brief: ProjectBrief;
  rules: SolutionRules;
  recentObjects: string[];
  recommendationVisible: boolean;
  projectTypeConflict: {
    recommendedName: string;
    currentName: string;
  } | null;
  onBriefChange: (brief: ProjectBrief) => void;
  onGenerate: () => void;
  onLoadExample: (index: number) => void;
  onRestoreRecommendation: () => void;
  onSwitchToRecommendedProjectType: () => void;
  onUseRecentObject: (value: string) => void;
};

export function ProjectInputPanel({
  brief,
  rules,
  recentObjects,
  recommendationVisible,
  projectTypeConflict,
  onBriefChange,
  onGenerate,
  onLoadExample,
  onRestoreRecommendation,
  onSwitchToRecommendedProjectType,
  onUseRecentObject
}: ProjectInputPanelProps) {
  const canGenerate = brief.objectName.trim().length > 0;

  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-soft-panel sm:p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-neutral-950">
        <Sparkles className="h-4 w-4 text-teal-700" aria-hidden="true" />
        输入设计对象，生成商业视觉方案
      </div>

      <div className="mt-4 grid gap-4">
        <label className="block">
          <span className="text-sm font-medium text-neutral-700">设计对象</span>
          <input
            value={brief.objectName}
            onChange={(event) =>
              onBriefChange({ ...brief, objectName: event.target.value })
            }
            onKeyDown={(event) => {
              if (event.key === "Enter" && canGenerate) {
                onGenerate();
              }
            }}
            placeholder="例如：胡桃木休闲椅、绿松石手串、便携显示器、香水包装、咖啡机"
            className="mt-2 h-14 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 text-base text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:bg-white focus:ring-4 focus:ring-neutral-950/10"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-neutral-700">
            英文产品名（可选）
          </span>
          <input
            value={brief.englishProductName ?? ""}
            onChange={(event) =>
              onBriefChange({
                ...brief,
                englishProductName: event.target.value
              })
            }
            onKeyDown={(event) => {
              if (event.key === "Enter" && canGenerate) {
                onGenerate();
              }
            }}
            placeholder="例如：walnut lounge chair、black rutilated quartz bracelet、portable monitor"
            className="mt-2 h-11 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:bg-white focus:ring-4 focus:ring-neutral-950/10"
          />
          <span className="mt-1 block text-xs leading-5 text-neutral-400">
            留空时优先使用本地词典英文名，未命中词典时使用 generic commercial product。
          </span>
        </label>

        <div>
          {recommendationVisible ? (
            <div className="mb-3 flex flex-col gap-2 rounded-lg bg-teal-50 px-3 py-2 text-xs leading-5 text-teal-800 sm:flex-row sm:items-center sm:justify-between">
              <span>
                已根据「{brief.objectName}」推荐：项目类型 / 商业目标，可手动修改。
              </span>
              <button
                type="button"
                onClick={onRestoreRecommendation}
                className="self-start rounded-full border border-teal-200 bg-white px-2.5 py-1 font-medium text-teal-800 transition hover:border-teal-400 hover:text-teal-950 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2 sm:self-auto"
              >
                恢复推荐
              </button>
            </div>
          ) : null}
          {projectTypeConflict ? (
            <div className="mb-3 flex flex-col gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900 sm:flex-row sm:items-center sm:justify-between">
              <span>
                当前对象更像「{projectTypeConflict.recommendedName}」，选择「{projectTypeConflict.currentName}」可能导致方案不准确。
              </span>
              <button
                type="button"
                onClick={onSwitchToRecommendedProjectType}
                className="self-start rounded-full border border-amber-300 bg-white px-2.5 py-1 font-medium text-amber-900 transition hover:border-amber-500 hover:text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 sm:self-auto"
              >
                切换到推荐类型
              </button>
            </div>
          ) : null}
          <div className="mb-2 text-sm font-medium text-neutral-700">
            项目类型
          </div>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {rules.projectTypes.map((type) => {
              const active = brief.projectType === type.id;

              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => onBriefChange({ ...brief, projectType: type.id })}
                  className={`rounded-lg border p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 ${
                    active
                      ? "border-neutral-950 bg-neutral-950 text-white"
                      : "border-neutral-200 bg-neutral-50 text-neutral-800 hover:border-neutral-400 hover:bg-white"
                  }`}
                >
                  <div className="text-sm font-semibold">{type.name}</div>
                  <div
                    className={`mt-1 text-xs leading-5 ${
                      active ? "text-white/65" : "text-neutral-500"
                    }`}
                  >
                    {type.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-neutral-700">
              商业目标
            </span>
            <span className="text-xs text-neutral-400">最多选择 2 个</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {rules.commercialGoals.map((goal) => {
              const active = brief.commercialGoals.includes(goal.id);

              return (
                <button
                  key={goal.id}
                  type="button"
                  title={goal.description}
                  onClick={() =>
                    onBriefChange({
                      ...brief,
                      commercialGoals: toggleGoal(brief.commercialGoals, goal.id)
                    })
                  }
                  className={`rounded-full border px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 ${
                    active
                      ? "border-neutral-950 bg-neutral-950 text-white"
                      : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400 hover:text-neutral-950"
                  }`}
                >
                  {goal.name}
                </button>
              );
            })}
          </div>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-neutral-700">
            可选关键词
          </span>
          <input
            value={brief.keywords}
            onChange={(event) =>
              onBriefChange({ ...brief, keywords: event.target.value })
            }
            placeholder="材质、颜色、品牌调性或限制条件，例如：胡桃木、黑色皮革、柔和自然光、不要复杂背景"
            className="mt-2 h-11 w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:bg-white focus:ring-4 focus:ring-neutral-950/10"
          />
        </label>

        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <button
            type="button"
            disabled={!canGenerate}
            onClick={onGenerate}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-neutral-950 px-6 text-sm font-medium text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            生成视觉方案
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="flex flex-wrap gap-2">
            {rules.examples.map((example, index) => (
              <button
                key={example.subject}
                type="button"
                onClick={() => onLoadExample(index)}
                className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 transition hover:border-neutral-400 hover:text-neutral-950"
              >
                {example.subject}
              </button>
            ))}
          </div>
        </div>

        {recentObjects.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-3">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-400">
              <History className="h-3.5 w-3.5" aria-hidden="true" />
              最近使用
            </span>
            {recentObjects.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onUseRecentObject(item)}
                className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600 transition hover:bg-neutral-200 hover:text-neutral-950"
              >
                {item}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
