"use client";

import { Check, Copy, Layers3 } from "lucide-react";
import type { FlatPrompt } from "@/types/prompt";

type PromptCardProps = {
  prompt: FlatPrompt;
  copiedKey: string | null;
  onCopy: (value: string, key: string) => void;
};

export function PromptCard({ prompt, copiedKey, onCopy }: PromptCardProps) {
  const chineseKey = `${prompt.id}-zh`;
  const englishKey = `${prompt.id}-en`;
  const allKey = `${prompt.id}-all`;

  return (
    <article className="group flex h-full flex-col rounded-lg border border-black/10 bg-white p-4 shadow-soft-panel transition duration-300 hover:-translate-y-1 hover:border-black/20 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium text-neutral-700"
              style={{
                borderColor: `${prompt.categoryAccent}55`,
                backgroundColor: `${prompt.categoryAccent}12`
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: prompt.categoryAccent }}
              />
              {prompt.categoryName}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-500">
              <Layers3 className="h-3.5 w-3.5" aria-hidden="true" />
              新手可用
            </span>
          </div>
          <h3 className="text-lg font-semibold leading-tight text-neutral-950">
            {prompt.title}
          </h3>
        </div>

        <button
          type="button"
          title="复制中英文提示词"
          aria-label={`复制 ${prompt.title} 的中英文提示词`}
          onClick={() =>
            onCopy(
              `中文提示词：${prompt.chinese}\n\nEnglish prompt: ${prompt.english}`,
              allKey
            )
          }
          className="grid h-10 w-10 flex-none place-items-center rounded-full border border-black/10 bg-neutral-950 text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
        >
          {copiedKey === allKey ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Copy className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>

      <p className="mt-3 text-sm leading-6 text-neutral-600">{prompt.scene}</p>

      <div className="mt-5 grid gap-3">
        <PromptBlock
          label="中文"
          value={prompt.chinese}
          copied={copiedKey === chineseKey}
          onCopy={() => onCopy(prompt.chinese, chineseKey)}
        />
        <PromptBlock
          label="English"
          value={prompt.english}
          copied={copiedKey === englishKey}
          onCopy={() => onCopy(prompt.english, englishKey)}
        />
      </div>
    </article>
  );
}

type PromptBlockProps = {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
};

function PromptBlock({ label, value, copied, onCopy }: PromptBlockProps) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
          {label}
        </span>
        <button
          type="button"
          title={`复制${label}提示词`}
          aria-label={`复制${label}提示词`}
          onClick={onCopy}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
      </div>
      <p className="line-clamp-5 text-sm leading-6 text-neutral-700">{value}</p>
    </div>
  );
}
