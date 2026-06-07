"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Check, Copy, Layers3, Star } from "lucide-react";
import { formatSolutionPackage, outputLabels } from "@/lib/solution";
import type { PlatformOutputKey, SolutionDetail } from "@/types/solution";

const promptTabs = [
  { id: "chinese", label: "中文" },
  { id: "english", label: "English" },
  { id: "midjourney", label: "Midjourney" },
  { id: "flux", label: "Flux" },
  { id: "gptImage", label: "GPT Image" },
  { id: "negative", label: "Negative" },
  { id: "package", label: "完整方案包" }
] as const;

type PromptTabKey = (typeof promptTabs)[number]["id"];

type SolutionDetailPanelProps = {
  detail: SolutionDetail | null;
  copiedKey: string | null;
  onCopyOutput: (key: PlatformOutputKey, value: string) => void;
  onCopyPackage: (detail: SolutionDetail) => void;
  onFavorite: (detail: SolutionDetail) => void;
};

export function SolutionDetailPanel({
  detail,
  copiedKey,
  onCopyOutput,
  onCopyPackage,
  onFavorite
}: SolutionDetailPanelProps) {
  const [activeTab, setActiveTab] = useStablePromptTab(detail?.id);

  if (!detail) {
    return (
      <section className="rounded-lg border border-neutral-200 bg-neutral-950 p-5 text-white shadow-soft-panel">
        <div className="flex items-center gap-2 text-sm font-semibold text-white/85">
          <Layers3 className="h-4 w-4 text-teal-200" aria-hidden="true" />
          方案详情
        </div>
        <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.06] p-6 text-sm leading-6 text-white/65">
          输入设计对象并生成方案后，这里会展示完整商业视觉方案包和平台专用 Prompt。
        </div>
      </section>
    );
  }

  const usageAdvice = detail.usageAdvice ?? {
    recommendedPlatforms: ["Midjourney", "Flux", "GPT Image"],
    aspectRatios: [
      "4:5 适合小红书和竖版广告",
      "1:1 适合电商主图",
      "16:9 适合官网 Hero"
    ],
    suitableScenarios: ["品牌广告", "产品发布", "作品集展示"],
    unsuitableScenarios: ["复杂功能说明图", "技术爆炸图", "强信息密度海报"]
  };
  const iterationAdvice = detail.iterationAdvice ?? {
    tooMessy: "add clean background, minimal props, generous negative space",
    unrealisticMaterial:
      "add realistic material response, detailed surface texture, controlled reflections",
    weakSubject:
      "add centered product composition, clear silhouette, strong subject separation",
    cheapLook:
      "add premium editorial lighting, refined styling, restrained luxury atmosphere"
  };
  const activePrompt = getPromptTabContent(detail, activeTab);
  const activeCopied =
    activeTab === "package"
      ? copiedKey === `${detail.id}:package`
      : copiedKey === `${detail.id}:${activeTab}`;

  return (
    <section className="rounded-lg border border-neutral-900 bg-neutral-950 p-4 text-white shadow-soft-panel sm:p-5">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-teal-300/15 px-2.5 py-1 text-xs font-medium text-teal-100">
              {detail.projectTypeName}
            </span>
            {detail.goalNames.map((goal) => (
              <span
                key={goal}
                className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/70"
              >
                {goal}
              </span>
            ))}
          </div>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {detail.title}
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onFavorite(detail)}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 text-sm font-medium text-white/80 transition hover:bg-white/[0.12] hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-950"
          >
            <Star className="h-4 w-4" aria-hidden="true" />
            收藏方案
          </button>
          <button
            type="button"
            onClick={() => onCopyPackage(detail)}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-medium text-neutral-950 transition hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-950"
          >
            <Copy className="h-4 w-4" aria-hidden="true" />
            复制完整方案包
          </button>
        </div>
      </div>

      <GroupedSection title="视觉方案">
        <div className="grid gap-3 sm:grid-cols-2">
          <DetailItem label="商业定位" value={detail.commercialPositioning} />
          <DetailItem label="视觉概念" value={detail.concept} />
        </div>
      </GroupedSection>

      <GroupedSection title="视觉执行">
        <div className="grid gap-3 sm:grid-cols-2">
          <DetailItem label="构图策略" value={detail.composition} />
          <DetailItem label="场景环境" value={detail.scene} />
          <DetailItem label="CMF 表达" value={detail.cmf} />
          <DetailItem label="灯光建议" value={detail.lighting} />
          <DetailItem label="镜头建议" value={detail.camera} />
        </div>
      </GroupedSection>

      <GroupedSection title="使用建议">
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
            <div className="grid gap-3 text-sm leading-6 text-white/78">
              <AdviceBlock
                label="推荐平台"
                items={usageAdvice.recommendedPlatforms}
              />
              <AdviceBlock
                label="推荐画面比例"
                items={usageAdvice.aspectRatios}
              />
              <AdviceBlock
                label="适合商业场景"
                items={usageAdvice.suitableScenarios}
              />
              <AdviceBlock
                label="不适合"
                items={usageAdvice.unsuitableScenarios}
              />
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
            <div className="mb-3 text-sm font-semibold text-white/90">
              出图迭代建议
            </div>
            <div className="grid gap-3 text-sm leading-6 text-white/78">
              <IterationRow label="如果画面太乱" value={iterationAdvice.tooMessy} />
              <IterationRow
                label="如果材质不真实"
                value={iterationAdvice.unrealisticMaterial}
              />
              <IterationRow label="如果主体不突出" value={iterationAdvice.weakSubject} />
              <IterationRow label="如果画面廉价" value={iterationAdvice.cheapLook} />
            </div>
          </div>
        </div>
      </GroupedSection>

      <GroupedSection title="Prompt 输出">
        <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
          <div
            role="tablist"
            aria-label="Prompt 输出"
            className="flex gap-1 overflow-x-auto rounded-lg bg-black/15 p-1"
          >
            {promptTabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.id)}
                  className={`h-9 flex-none rounded-md px-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-white ${
                    active
                      ? "bg-white text-neutral-950 shadow-sm"
                      : "text-white/62 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mt-3 rounded-lg border border-white/10 bg-neutral-950/60 p-3">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white">
                  {activePrompt.label}
                </div>
                <div className="mt-1 text-xs text-white/38">
                  当前只展示一个输出版本，切换 Tab 查看其他 Prompt。
                </div>
              </div>
              <button
                type="button"
                title={`复制${activePrompt.label}`}
                aria-label={`复制${activePrompt.label}`}
                onClick={() => {
                  if (activeTab === "package") {
                    onCopyPackage(detail);
                  } else {
                    onCopyOutput(activeTab, detail.outputs[activeTab]);
                  }
                }}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-3 text-sm font-medium text-white/76 transition hover:bg-white/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-950"
              >
                {activeCopied ? (
                  <Check className="h-3.5 w-3.5 text-teal-200" aria-hidden="true" />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                复制
              </button>
            </div>
            <p className="max-h-[26rem] overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-white/80">
              {activePrompt.value}
            </p>
          </div>
        </div>
      </GroupedSection>
    </section>
  );
}

function useStablePromptTab(detailId: string | undefined) {
  const [activeTab, setActiveTab] = useState<PromptTabKey>("chinese");

  useEffect(() => {
    setActiveTab("chinese");
  }, [detailId]);

  return [activeTab, setActiveTab] as const;
}

function getPromptTabContent(detail: SolutionDetail, tab: PromptTabKey) {
  if (tab === "package") {
    return {
      label: "完整方案包",
      value: formatSolutionPackage(detail)
    };
  }

  return {
    label: outputLabels[tab],
    value: detail.outputs[tab]
  };
}

type GroupedSectionProps = {
  title: string;
  children: ReactNode;
};

function GroupedSection({ title, children }: GroupedSectionProps) {
  return (
    <section className="mt-5">
      <div className="mb-3 text-sm font-semibold text-white">{title}</div>
      {children}
    </section>
  );
}

type DetailItemProps = {
  label: string;
  value: string;
};

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="rounded-lg bg-white/[0.06] p-3">
      <div className="text-xs font-semibold uppercase tracking-[0.12em] text-white/38">
        {label}
      </div>
      <p className="mt-2 text-sm leading-6 text-white/78">{value}</p>
    </div>
  );
}

type AdviceBlockProps = {
  label: string;
  items: string[];
};

function AdviceBlock({ label, items }: AdviceBlockProps) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.12em] text-white/38">
        {label}
      </div>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/72"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

type IterationRowProps = {
  label: string;
  value: string;
};

function IterationRow({ label, value }: IterationRowProps) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-[0.12em] text-white/38">
        {label}
      </div>
      <p className="mt-1 rounded-lg bg-black/15 px-3 py-2 font-mono text-xs leading-5 text-teal-100">
        {value}
      </p>
    </div>
  );
}
