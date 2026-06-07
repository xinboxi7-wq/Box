"use client";

import { ArrowUpRight } from "lucide-react";
import type { SolutionRules } from "@/types/solution";

type ExampleShowcaseProps = {
  rules: SolutionRules;
  onLoadExample: (index: number) => void;
};

export function ExampleShowcase({
  rules,
  onLoadExample
}: ExampleShowcaseProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-teal-700">Example cases</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
            典型商业视觉任务
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-neutral-500">
          这些案例会直接填入首屏输入区，用本地规则生成可复制的方案包。
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {rules.examples.map((example, index) => (
          <button
            key={example.subject}
            type="button"
            onClick={() => onLoadExample(index)}
            className="group rounded-lg border border-neutral-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow-soft-panel focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-neutral-500">
                  {example.subject}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-neutral-950">
                  {example.title}
                </h3>
              </div>
              <ArrowUpRight
                className="h-4 w-4 flex-none text-neutral-400 transition group-hover:text-neutral-950"
                aria-hidden="true"
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-neutral-600">
              {example.note}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
