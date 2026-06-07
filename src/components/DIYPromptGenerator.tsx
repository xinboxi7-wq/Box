"use client";

import { Check, Copy, RotateCcw, Wand2, X } from "lucide-react";
import { useMemo, useState } from "react";
import rulesData from "@/data/prompt-rules.json";
import type {
  GeneratedPrompt,
  PromptRuleOption,
  PromptRules,
  RuleGroupId
} from "@/types/diy";

const rules = rulesData as PromptRules;

const groupConfigs: Array<{
  id: RuleGroupId;
  title: string;
  enTitle: string;
  accent: string;
}> = [
  { id: "styles", title: "风格库", enTitle: "Styles", accent: "#3E8B82" },
  { id: "materials", title: "材质库", enTitle: "Materials", accent: "#B75F4B" },
  { id: "scenes", title: "场景库", enTitle: "Scenes", accent: "#7E8F4F" },
  { id: "cameras", title: "镜头库", enTitle: "Camera", accent: "#4B7DB7" },
  { id: "lighting", title: "灯光库", enTitle: "Lighting", accent: "#D49B43" }
];

const emptySelection: Record<RuleGroupId, string[]> = {
  styles: [],
  materials: [],
  scenes: [],
  cameras: [],
  lighting: []
};

export function DIYPromptGenerator() {
  const [activeGroup, setActiveGroup] = useState<RuleGroupId>("styles");
  const [selected, setSelected] =
    useState<Record<RuleGroupId, string[]>>(emptySelection);
  const [generated, setGenerated] = useState<GeneratedPrompt | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const selectedCount = useMemo(
    () => Object.values(selected).reduce((total, items) => total + items.length, 0),
    [selected]
  );

  const selectedOptions = useMemo(() => {
    return groupConfigs.reduce(
      (result, group) => {
        result[group.id] = rules[group.id].filter((option) =>
          selected[group.id].includes(option.id)
        );
        return result;
      },
      {} as Record<RuleGroupId, PromptRuleOption[]>
    );
  }, [selected]);

  function toggleOption(groupId: RuleGroupId, optionId: string) {
    setGenerated(null);
    setSelected((current) => {
      const options = current[groupId];
      const nextOptions = options.includes(optionId)
        ? options.filter((id) => id !== optionId)
        : [...options, optionId];

      return {
        ...current,
        [groupId]: nextOptions
      };
    });
  }

  function removeOption(groupId: RuleGroupId, optionId: string) {
    setGenerated(null);
    setSelected((current) => ({
      ...current,
      [groupId]: current[groupId].filter((id) => id !== optionId)
    }));
  }

  function clearAll() {
    setSelected(emptySelection);
    setGenerated(null);
    setCopiedKey(null);
  }

  function generatePrompt() {
    if (selectedCount === 0) {
      setGenerated(null);
      return;
    }

    setGenerated(buildPrompt(selectedOptions));
  }

  async function copyText(value: string, key: string) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      setCopiedKey(null);
    }
  }

  const activeConfig = groupConfigs.find((group) => group.id === activeGroup);

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="rounded-lg border border-black/10 bg-white p-4 shadow-soft-panel sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                <Wand2 className="h-3.5 w-3.5" aria-hidden="true" />
                本地规则生成
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-neutral-950">
                提示词 DIY 生成器
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                title="清空已选"
                aria-label="清空已选"
                onClick={clearAll}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                disabled={selectedCount === 0}
                onClick={generatePrompt}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-neutral-950 px-4 text-sm font-medium text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-300"
              >
                <Wand2 className="h-4 w-4" aria-hidden="true" />
                生成提示词
              </button>
            </div>
          </div>

          <div className="mt-5 flex overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="inline-flex min-w-max rounded-lg border border-black/10 bg-neutral-50 p-1">
              {groupConfigs.map((group) => {
                const active = group.id === activeGroup;
                const count = selected[group.id].length;

                return (
                  <button
                    key={group.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setActiveGroup(group.id)}
                    className={`inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 ${
                      active
                        ? "bg-white text-neutral-950 shadow-sm"
                        : "text-neutral-500 hover:bg-white/70 hover:text-neutral-950"
                    }`}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: group.accent }}
                    />
                    <span>{group.title}</span>
                    <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[11px] text-neutral-500">
                      {count}/{rules[group.id].length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-neutral-950">
                  {activeConfig?.title}
                </h3>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                  {activeConfig?.enTitle}
                </p>
              </div>
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-500">
                {rules[activeGroup].length} 项
              </span>
            </div>

            <div className="max-h-[420px] overflow-y-auto pr-1">
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {rules[activeGroup].map((option) => {
                  const active = selected[activeGroup].includes(option.id);

                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleOption(activeGroup, option.id)}
                      className={`min-h-16 rounded-lg border p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 ${
                        active
                          ? "border-neutral-950 bg-neutral-950 text-white"
                          : "border-neutral-200 bg-neutral-50 text-neutral-800 hover:border-neutral-400 hover:bg-white"
                      }`}
                    >
                      <span className="block text-sm font-semibold leading-5">
                        {option.zh}
                      </span>
                      <span
                        className={`mt-1 block text-xs leading-4 ${
                          active ? "text-white/60" : "text-neutral-500"
                        }`}
                      >
                        {option.en}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-lg border border-black/10 bg-[#101211] p-4 text-white shadow-soft-panel sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[#8DD5C9]">
                Selected Rules
              </p>
              <h2 className="mt-2 text-2xl font-semibold">组合结果</h2>
            </div>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-white/70">
              {selectedCount} 项
            </span>
          </div>

          <div className="mt-5 min-h-28 rounded-lg border border-white/10 bg-white/[0.06] p-3">
            {selectedCount > 0 ? (
              <div className="flex flex-wrap gap-2">
                {groupConfigs.flatMap((group) =>
                  selectedOptions[group.id].map((option) => (
                    <button
                      key={`${group.id}-${option.id}`}
                      type="button"
                      title="移除"
                      aria-label={`移除 ${option.zh}`}
                      onClick={() => removeOption(group.id, option.id)}
                      className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/85 transition hover:bg-white/15"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: group.accent }}
                      />
                      <span className="truncate">{option.zh}</span>
                      <X className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
                    </button>
                  ))
                )}
              </div>
            ) : (
              <div className="grid h-full min-h-20 place-items-center text-sm text-white/45">
                未选择
              </div>
            )}
          </div>

          <div className="mt-4 grid gap-3">
            <GeneratedBlock
              label="中文提示词"
              value={generated?.chinese ?? "尚未生成"}
              muted={!generated}
              copied={copiedKey === "generated-zh"}
              onCopy={() =>
                generated && copyText(generated.chinese, "generated-zh")
              }
            />
            <GeneratedBlock
              label="English Prompt"
              value={generated?.english ?? "Not generated yet"}
              muted={!generated}
              copied={copiedKey === "generated-en"}
              onCopy={() =>
                generated && copyText(generated.english, "generated-en")
              }
            />
          </div>

          <button
            type="button"
            disabled={!generated}
            onClick={() =>
              generated &&
              copyText(
                `中文提示词：${generated.chinese}\n\nEnglish prompt: ${generated.english}`,
                "generated-all"
              )
            }
            className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-medium text-neutral-950 transition hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/45"
          >
            {copiedKey === "generated-all" ? (
              <Check className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4" aria-hidden="true" />
            )}
            复制全部
          </button>
        </aside>
      </div>
    </section>
  );
}

type GeneratedBlockProps = {
  label: string;
  value: string;
  muted: boolean;
  copied: boolean;
  onCopy: () => void;
};

function GeneratedBlock({
  label,
  value,
  muted,
  copied,
  onCopy
}: GeneratedBlockProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
          {label}
        </span>
        <button
          type="button"
          title={`复制${label}`}
          aria-label={`复制${label}`}
          disabled={muted}
          onClick={onCopy}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] text-white/70 transition hover:bg-white/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:opacity-35"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-[#8DD5C9]" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
      </div>
      <p
        className={`max-h-48 overflow-y-auto text-sm leading-6 ${
          muted ? "text-white/35" : "text-white/80"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function buildPrompt(
  selectedOptions: Record<RuleGroupId, PromptRuleOption[]>
): GeneratedPrompt {
  const zhParts = [
    "请生成一张高质量设计视觉。"
  ];

  const enParts = [
    "Create a high-quality design visual."
  ];

  appendPart(
    zhParts,
    enParts,
    selectedOptions.styles,
    "整体风格采用",
    "Use the following overall style direction:"
  );
  appendPart(
    zhParts,
    enParts,
    selectedOptions.materials,
    "主体材质包含",
    "Include the following key materials:"
  );
  appendPart(
    zhParts,
    enParts,
    selectedOptions.scenes,
    "画面场景设置为",
    "Set the scene in:"
  );
  appendPart(
    zhParts,
    enParts,
    selectedOptions.cameras,
    "镜头语言使用",
    "Use this camera language and framing:"
  );
  appendPart(
    zhParts,
    enParts,
    selectedOptions.lighting,
    "灯光氛围为",
    "Use this lighting mood:"
  );

  zhParts.push(
    "保持构图干净、主体清晰、细节真实、层次高级，适合设计师提案和商业展示。避免低清晰度、杂乱背景、错误文字、水印、多余 logo、变形结构和不自然材质。"
  );
  enParts.push(
    "Keep the composition clean, the subject clear, the details realistic, and the visual hierarchy refined, suitable for designer presentations and commercial use. Avoid low resolution, cluttered background, incorrect text, watermark, extra logos, distorted structure, and unnatural materials."
  );

  return {
    chinese: zhParts.join(""),
    english: enParts.join(" ")
  };
}

function appendPart(
  zhParts: string[],
  enParts: string[],
  options: PromptRuleOption[],
  zhPrefix: string,
  enPrefix: string
) {
  if (options.length === 0) {
    return;
  }

  zhParts.push(`${zhPrefix}${options.map((option) => option.zh).join("、")}。`);
  enParts.push(`${enPrefix} ${options.map((option) => option.en).join(", ")}.`);
}
