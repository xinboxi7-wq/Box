"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy, Sparkles, Star } from "lucide-react";
import { Toast, type ToastState } from "@/components/studio/Toast";
import { copyToClipboard } from "@/lib/clipboard";
import { buildCrystalPromptSet, supportedModelLabels } from "@/lib/crystal-cases";
import type { CrystalCase, CrystalProduct } from "@/types/crystal";
import { useCrystalFavorites } from "./useCrystalFavorites";

type CrystalCaseDetailProps = {
  caseItem: CrystalCase;
  product: CrystalProduct;
};

type PromptBlockItem = {
  id: string;
  label: string;
  helper: string;
  value: string;
};

export function CrystalCaseDetail({
  caseItem,
  product
}: CrystalCaseDetailProps) {
  const { favoriteSet, toggleFavorite } = useCrystalFavorites();
  const favorite = favoriteSet.has(caseItem.id);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const promptSet = useMemo(() => buildCrystalPromptSet(caseItem), [caseItem]);

  const promptBlocks = useMemo<PromptBlockItem[]>(
    () => [
      {
        id: "prompt-zh",
        label: "中文 GPT Image Prompt",
        helper: "适合直接用于 GPT Image，也可作为中文画面说明。",
        value: promptSet.prompt
      },
      {
        id: "prompt-en",
        label: "English GPT Image Prompt",
        helper: "适合英文模型环境，保持构图、材质和灯光要求完整。",
        value: promptSet.promptEn
      },
      {
        id: "negative",
        label: "Negative Prompt",
        helper: "用于减少低质感、结构错误、文字水印和杂乱背景。",
        value: promptSet.negativePrompt
      }
    ],
    [promptSet.negativePrompt, promptSet.prompt, promptSet.promptEn]
  );

  const showToast = useCallback((message: string, tone: "success" | "error") => {
    const id = Date.now();
    setToast({ id, message, tone });
    window.setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 1800);
  }, []);

  const handleCopyPrompt = useCallback(
    async (promptId: string, value: string) => {
      const success = await copyToClipboard(value);

      if (!success) {
        showToast("复制失败，请手动复制", "error");
        return;
      }

      setCopiedId(promptId);
      showToast("已复制到剪贴板", "success");
      window.setTimeout(() => {
        setCopiedId((current) => (current === promptId ? null : current));
      }, 1600);
    },
    [showToast]
  );

  return (
    <main className="min-h-screen bg-[#F6F7F4] text-neutral-950">
      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/#cases"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            返回列表
          </Link>
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex h-10 items-center rounded-full border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
          >
            查看{product.name}
          </Link>
        </div>

        <article className="mt-6 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-soft-panel">
          <div className="grid gap-0 lg:grid-cols-[1.04fr_0.96fr]">
            <div className="bg-neutral-100">
              <img
                src={caseItem.image}
                alt={caseItem.title}
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center p-5 sm:p-6">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800">
                  {product.name}
                </span>
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                  {caseItem.styleName}
                </span>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
                {caseItem.title}
              </h1>
              <p className="mt-4 text-base leading-8 text-neutral-600">
                {caseItem.summary}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {caseItem.tags.map((tag, index) => (
                  <span
                    key={`${caseItem.id}-tag-${tag}-${index}`}
                    className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  支持模型
                </div>
                <div className="flex flex-wrap gap-2">
                  {supportedModelLabels.map((model) => (
                    <span
                      key={model}
                      className="rounded-full bg-neutral-950 px-3 py-1 text-xs font-medium text-white"
                    >
                      {model}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleFavorite(caseItem.id)}
                className={`mt-6 inline-flex h-11 w-fit items-center gap-2 rounded-full px-4 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 ${
                  favorite
                    ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                    : "bg-neutral-950 text-white hover:bg-neutral-800"
                }`}
              >
                <Star
                  className="h-4 w-4"
                  fill={favorite ? "currentColor" : "none"}
                  aria-hidden="true"
                />
                {favorite ? "已收藏" : "收藏案例"}
              </button>
            </div>
          </div>
        </article>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 pb-14 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-sm font-semibold text-neutral-950">
                Prompt 展示与复制
              </div>
              <p className="mt-1 text-xs leading-5 text-neutral-500">
                已根据案例描述、构图分析和灯光分析生成中英文 Prompt。
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {supportedModelLabels.map((model) => (
                <span
                  key={model}
                  className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600"
                >
                  {model}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {promptBlocks.map((block) => (
              <PromptBlock
                key={block.id}
                block={block}
                copied={copiedId === block.id}
                onCopy={handleCopyPrompt}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <AnalysisBlock
            title="构图分析"
            value={caseItem.compositionAnalysis}
          />
          <AnalysisBlock
            title="灯光分析"
            value={caseItem.lightingAnalysis}
          />
          <AnalysisBlock title="适用场景" value={caseItem.commercialUse} />
        </div>
      </section>
      <Toast toast={toast} />
    </main>
  );
}

function PromptBlock({
  block,
  copied,
  onCopy
}: {
  block: PromptBlockItem;
  copied: boolean;
  onCopy: (promptId: string, value: string) => void;
}) {
  return (
    <section className="rounded-lg border border-neutral-100 bg-neutral-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-neutral-950">
            {block.label}
          </div>
          <p className="mt-1 text-xs leading-5 text-neutral-500">
            {block.helper}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onCopy(block.id, block.value)}
          className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-3 text-xs font-medium text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 sm:w-auto"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {copied ? "已复制" : "复制"}
        </button>
      </div>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-neutral-700">
        {block.value}
      </p>
    </section>
  );
}

function AnalysisBlock({ title, value }: { title: string; value: string }) {
  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-semibold text-neutral-950">{title}</div>
      <p className="mt-3 text-sm leading-7 text-neutral-600">{value}</p>
    </section>
  );
}
