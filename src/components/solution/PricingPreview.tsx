"use client";

import { Check, Crown } from "lucide-react";
import type { SolutionRules } from "@/types/solution";

type PricingPreviewProps = {
  rules: SolutionRules;
};

export function PricingPreview({ rules }: PricingPreviewProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-soft-panel sm:p-6">
        <div className="flex flex-col gap-3 border-b border-neutral-100 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-teal-700">Pro boundary</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
              免费可用，Pro 用于完整商业交付
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-neutral-500">
            v1 不接入支付，仅展示产品边界。当前所有数据仍来自本地 JSON 规则。
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
            <div className="text-sm font-semibold text-neutral-950">Free</div>
            <div className="mt-4 grid gap-2">
              {rules.pricing.free.map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm text-neutral-600">
                  <Check className="mt-0.5 h-4 w-4 flex-none text-teal-700" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-neutral-950 bg-neutral-950 p-4 text-white">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Crown className="h-4 w-4 text-amber-300" aria-hidden="true" />
              Pro
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {rules.pricing.pro.map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm text-white/72">
                  <Check className="mt-0.5 h-4 w-4 flex-none text-teal-200" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
