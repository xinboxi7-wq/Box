"use client";

import { Check, Copy, Star } from "lucide-react";
import type { GeneratedStudioPrompt } from "@/types/studio";

type OutputPanelProps = {
  outputs: GeneratedStudioPrompt | null;
  copiedKey: string | null;
  onCopy: (value: string, key: string) => void;
  onFavorite: () => void;
  canFavorite: boolean;
};

const outputConfigs: Array<{
  key: keyof GeneratedStudioPrompt;
  label: string;
  hint: string;
}> = [
  { key: "chinese", label: "中文提示词", hint: "适合快速沟通和二次改写" },
  { key: "english", label: "English Prompt", hint: "通用英文基础版" },
  { key: "midjourney", label: "Midjourney", hint: "含 MJ 友好的英文表达与参数" },
  { key: "flux", label: "Flux", hint: "强调写实、材质和结构一致性" },
  { key: "gptImage", label: "GPT Image", hint: "指令式表达，适合编辑和精修" }
];

export function OutputPanel({
  outputs,
  copiedKey,
  onCopy,
  onFavorite,
  canFavorite
}: OutputPanelProps) {
  const allText = outputs
    ? `中文提示词：${outputs.chinese}\n\nEnglish Prompt:\n${outputs.english}\n\nMidjourney:\n${outputs.midjourney}\n\nFlux:\n${outputs.flux}\n\nGPT Image:\n${outputs.gptImage}`
    : "";

  return (
    <section className="rounded-lg border border-neutral-800 bg-[#101211] p-4 text-white shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8DD5C9]">
            Outputs
          </p>
          <h2 className="mt-1 text-xl font-semibold">平台提示词</h2>
        </div>
        <button
          type="button"
          disabled={!outputs}
          onClick={() => outputs && onCopy(allText, "all")}
          className="inline-flex h-9 items-center gap-2 rounded-full bg-white px-3 text-xs font-medium text-neutral-950 transition hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/40"
        >
          {copiedKey === "all" ? (
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          复制全部
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        {outputConfigs.map((config) => (
          <OutputBlock
            key={config.key}
            label={config.label}
            hint={config.hint}
            value={outputs?.[config.key] ?? "等待生成"}
            disabled={!outputs}
            copied={copiedKey === config.key}
            onCopy={() =>
              outputs && onCopy(outputs[config.key], config.key)
            }
          />
        ))}
      </div>

      <button
        type="button"
        disabled={!canFavorite}
        onClick={onFavorite}
        className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.08] text-sm font-medium text-white transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:text-white/35"
      >
        <Star className="h-4 w-4" aria-hidden="true" />
        收藏当前组合
      </button>
    </section>
  );
}

type OutputBlockProps = {
  label: string;
  hint: string;
  value: string;
  disabled: boolean;
  copied: boolean;
  onCopy: () => void;
};

function OutputBlock({
  label,
  hint,
  value,
  disabled,
  copied,
  onCopy
}: OutputBlockProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white">{label}</h3>
          <p className="mt-0.5 text-xs text-white/40">{hint}</p>
        </div>
        <button
          type="button"
          title={`复制${label}`}
          aria-label={`复制${label}`}
          disabled={disabled}
          onClick={onCopy}
          className="grid h-8 w-8 flex-none place-items-center rounded-full border border-white/10 bg-white/[0.08] text-white/70 transition hover:bg-white/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:opacity-35"
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
          disabled ? "text-white/35" : "text-white/80"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
