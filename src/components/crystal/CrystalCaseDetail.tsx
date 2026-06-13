"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  Check,
  Copy,
  GalleryHorizontal,
  Lightbulb,
  Sparkles,
  Star
} from "lucide-react";
import { Toast, type ToastState } from "@/components/studio/Toast";
import { copyToClipboard } from "@/lib/clipboard";
import { replaceCrystalMaterialTerms } from "@/lib/crystal-prompt-customization";
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
  const [customMaterial, setCustomMaterial] = useState("");
  const [toast, setToast] = useState<ToastState>(null);
  const promptSet = useMemo(() => buildCrystalPromptSet(caseItem), [caseItem]);
  const coverImage = caseItem.coverImage || caseItem.image;
  const galleryImages =
    caseItem.galleryImages.length > 0 ? caseItem.galleryImages : [coverImage];
  const normalizedCustomMaterial = customMaterial.trim();
  const customizePrompt = useCallback(
    (value: string) =>
      replaceCrystalMaterialTerms(
        value,
        normalizedCustomMaterial,
        product,
        caseItem
      ),
    [caseItem, normalizedCustomMaterial, product]
  );

  const promptBlocks = useMemo<PromptBlockItem[]>(
    () => [
      {
        id: "gpt-image",
        label: "GPT Image Prompt",
        helper: "适合直接用于 GPT Image，材质词会按上方输入实时替换。",
        value: customizePrompt(promptSet.prompt)
      },
      {
        id: "midjourney",
        label: "Midjourney Prompt",
        helper: "适合 Midjourney，保留英文商业摄影描述与结构约束。",
        value: customizePrompt(`${promptSet.promptEn} --style raw --ar 4:5`)
      },
      {
        id: "flux",
        label: "Flux Prompt",
        helper: "适合 Flux 的自然语言描述，强调真实材质、透视和商业摄影表达。",
        value: customizePrompt(promptSet.promptEn)
      }
    ],
    [customizePrompt, promptSet.prompt, promptSet.promptEn]
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
    <main className="min-h-screen text-neutral-950">
      <section className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/#cases"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 text-sm font-semibold text-neutral-700 shadow-sm transition hover:bg-white hover:text-neutral-950"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            返回案例库
          </Link>
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex h-10 items-center rounded-full border border-black/10 bg-white/80 px-4 text-sm font-semibold text-neutral-700 shadow-sm transition hover:bg-white hover:text-neutral-950"
          >
            查看{product.name}
          </Link>
        </div>

        <article className="mt-5 overflow-hidden rounded-[2rem] border border-black/10 bg-[#fbfaf7] shadow-[0_24px_90px_rgba(23,23,23,0.12)]">
          <div className="grid lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
            <div className="relative min-h-[24rem] overflow-hidden bg-neutral-100 sm:min-h-[34rem]">
              <Image
                src={coverImage}
                alt={caseItem.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 56vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
            </div>
            <div className="flex flex-col justify-center p-5 sm:p-8 lg:p-10">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800">
                  {product.name}
                </span>
                <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600">
                  {caseItem.styleName}
                </span>
              </div>

              <h1 className="mt-6 text-4xl font-semibold leading-[0.98] tracking-[-0.05em] text-neutral-950 sm:text-6xl">
                {caseItem.title}
              </h1>
              <p className="mt-5 text-base leading-8 text-neutral-600">
                {caseItem.summary}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {caseItem.tags.map((tag, index) => (
                  <span
                    key={`${caseItem.id}-tag-${tag}-${index}`}
                    className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-neutral-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-7">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  支持模型
                </div>
                <div className="flex flex-wrap gap-2">
                  {supportedModelLabels.map((model) => (
                    <span
                      key={model}
                      className="rounded-full bg-neutral-950 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      {model}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => toggleFavorite(caseItem.id)}
                  className={`inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition sm:w-fit ${
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
                <Link
                  href="#prompts"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 hover:text-neutral-950 sm:w-fit"
                >
                  <Copy className="h-4 w-4" aria-hidden="true" />
                  复制 Prompt
                </Link>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 pb-14 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)] lg:px-8">
        <div
          id="prompts"
          className="rounded-[2rem] border border-black/10 bg-[#fbfaf7] p-4 shadow-sm sm:p-6"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
                Prompt studio
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-neutral-950">
                Prompt 展示与复制
              </h2>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                根据案例描述、构图分析和灯光分析生成，可直接复制到对应模型。
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {supportedModelLabels.map((model) => (
                <span
                  key={model}
                  className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-xs font-medium text-neutral-600"
                >
                  {model}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <div className="rounded-[1.5rem] border border-teal-200 bg-teal-50/70 p-4">
              <label
                htmlFor="custom-material"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-teal-800"
              >
                动态替换材质
              </label>
              <input
                id="custom-material"
                value={customMaterial}
                onChange={(event) => setCustomMaterial(event.target.value)}
                placeholder="输入其他材质（如：粉水晶）自定义提示词"
                className="h-12 w-full rounded-full border border-teal-200 bg-white px-4 text-sm font-medium text-neutral-950 shadow-inner outline-none transition placeholder:text-neutral-400 focus:border-teal-700 focus:ring-4 focus:ring-teal-100"
              />
              <p className="mt-2 text-xs leading-5 text-teal-900/70">
                输入后会实时替换下方 GPT Image、Midjourney 和 Flux 中的水晶材质词，复制时也会复制替换后的版本。
              </p>
            </div>
            {promptBlocks.map((block) => (
              <PromptBlock
                key={block.id}
                block={block}
                copied={copiedId === block.id}
                onCopy={handleCopyPrompt}
                highlightTerm={normalizedCustomMaterial}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <GalleryBlock
            title="案例图片"
            images={galleryImages}
            alt={caseItem.title}
          />
          <AnalysisBlock
            icon={<GalleryHorizontal className="h-4 w-4" aria-hidden="true" />}
            title="构图分析"
            value={caseItem.compositionAnalysis}
          />
          <AnalysisBlock
            icon={<Lightbulb className="h-4 w-4" aria-hidden="true" />}
            title="灯光分析"
            value={caseItem.lightingAnalysis}
          />
          <AnalysisBlock
            icon={<Sparkles className="h-4 w-4" aria-hidden="true" />}
            title="适用场景"
            value={caseItem.commercialUse}
          />
        </div>
      </section>
      <Toast toast={toast} />
    </main>
  );
}

function PromptBlock({
  block,
  copied,
  onCopy,
  highlightTerm
}: {
  block: PromptBlockItem;
  copied: boolean;
  onCopy: (promptId: string, value: string) => void;
  highlightTerm: string;
}) {
  return (
    <section className="rounded-[1.5rem] border border-black/10 bg-white p-4">
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
          className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-3 text-xs font-semibold text-white transition hover:bg-neutral-800 sm:w-auto"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {copied ? "已复制" : "复制"}
        </button>
      </div>
      <p className="mt-4 max-h-[24rem] overflow-auto whitespace-pre-wrap rounded-2xl bg-neutral-100/70 p-4 text-sm leading-7 text-neutral-700">
        <HighlightedPromptText value={block.value} term={highlightTerm} />
      </p>
    </section>
  );
}

function HighlightedPromptText({
  value,
  term
}: {
  value: string;
  term: string;
}) {
  const normalizedTerm = term.trim();

  if (!normalizedTerm) {
    return value;
  }

  const parts = value.split(
    new RegExp(`(${escapeRegExp(normalizedTerm)})`, containsCjk(normalizedTerm) ? "g" : "gi")
  );

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === normalizedTerm.toLowerCase() ? (
          <mark
            key={`${part}-${index}`}
            className="rounded bg-amber-100 px-1 py-0.5 font-semibold text-amber-900"
          >
            {part}
          </mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        )
      )}
    </>
  );
}

function containsCjk(value: string) {
  return /[\u3400-\u9fff]/.test(value);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function GalleryBlock({
  title,
  images,
  alt
}: {
  title: string;
  images: string[];
  alt: string;
}) {
  return (
    <section className="rounded-[2rem] border border-black/10 bg-[#fbfaf7] p-4 shadow-sm">
      <div className="text-sm font-semibold text-neutral-950">{title}</div>
      <div className="mt-3 grid gap-2">
        {images.map((image, index) => (
          <Image
            key={`${image}-${index}`}
            src={image}
            alt={`${alt} ${index + 1}`}
            width={900}
            height={675}
            className="aspect-[4/3] w-full rounded-2xl bg-neutral-100 object-cover"
          />
        ))}
      </div>
      <p className="mt-3 text-xs leading-5 text-neutral-500">
        当前图片资源可直接替换，页面结构会保持不变。
      </p>
    </section>
  );
}

function AnalysisBlock({
  icon,
  title,
  value
}: {
  icon: ReactNode;
  title: string;
  value: string;
}) {
  return (
    <section className="rounded-[1.5rem] border border-black/10 bg-white/78 p-5 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-neutral-950">
        <span className="text-teal-700">{icon}</span>
        {title}
      </div>
      <p className="mt-3 text-sm leading-7 text-neutral-600">{value}</p>
    </section>
  );
}
