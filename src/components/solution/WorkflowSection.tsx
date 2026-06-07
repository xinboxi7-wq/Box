"use client";

import { BadgeCheck, ClipboardCopy, Layers3, WandSparkles } from "lucide-react";

const steps = [
  {
    title: "输入设计对象",
    description: "用一句话描述对象，例如胡桃木休闲椅、绿松石手串或便携显示器。",
    icon: WandSparkles
  },
  {
    title: "选择商业目标",
    description: "锁定高级感、材质表达、转化卖点、品牌大片等真实出图方向。",
    icon: BadgeCheck
  },
  {
    title: "生成多套方案",
    description: "本地规则匹配 3-6 个差异化商业视觉方向，而不是随机堆标签。",
    icon: Layers3
  },
  {
    title: "复制平台 Prompt",
    description: "分别输出中文、英文、Midjourney、Flux、GPT Image 和 Negative Prompt。",
    icon: ClipboardCopy
  }
];

const audiences = [
  "产品设计师",
  "家具设计师",
  "CMF 设计师",
  "珠宝设计师",
  "电商设计师",
  "品牌设计师",
  "AI 绘图用户",
  "Midjourney / Flux 用户"
];

export function WorkflowSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold text-teal-700">Workflow</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
            从产品对象到商业视觉方案
          </h2>
          <p className="mt-4 text-sm leading-6 text-neutral-500">
            Prompt Studio 的重点不是让新手记住镜头、灯光和风格词，而是把商业用途转译成可执行的视觉提案。
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {audiences.map((item) => (
              <span
                key={item}
                className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-neutral-950 text-white">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-semibold text-neutral-300">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-neutral-950">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
