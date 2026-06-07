"use client";

import { Check, Copy } from "lucide-react";

type PromptOutputBlockProps = {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
};

export function PromptOutputBlock({
  label,
  value,
  copied,
  onCopy
}: PromptOutputBlockProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.06] p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold text-white">{label}</h4>
        <button
          type="button"
          title={`复制${label}`}
          aria-label={`复制${label}`}
          onClick={onCopy}
          className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.08] text-white/70 transition hover:bg-white/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-950"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-teal-200" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
        </button>
      </div>
      <p className="max-h-52 overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-white/80">
        {value}
      </p>
    </div>
  );
}
