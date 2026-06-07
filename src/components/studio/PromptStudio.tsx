"use client";

import { Search, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ActivityPanel } from "@/components/studio/ActivityPanel";
import { ModuleRail } from "@/components/studio/ModuleRail";
import { OutputPanel } from "@/components/studio/OutputPanel";
import { SelectionPanel } from "@/components/studio/SelectionPanel";
import { TagGrid } from "@/components/studio/TagGrid";
import { Toast, type ToastState } from "@/components/studio/Toast";
import { copyToClipboard } from "@/lib/clipboard";
import {
  buildStudioPrompt,
  cloneSelection,
  createStudioRecord,
  emptySelection,
  findOptionById,
  getModuleCount,
  moduleConfigs,
  randomSelection
} from "@/lib/studio";
import rulesData from "@/data/studio-rules.json";
import type {
  GeneratedStudioPrompt,
  SelectionState,
  StudioModuleId,
  StudioRecord,
  StudioRules
} from "@/types/studio";

const rules = rulesData as StudioRules;
const storageKeys = {
  favorites: "prompt-studio:favorites",
  history: "prompt-studio:history",
  recent: "prompt-studio:recent-tags"
};

type RecentTag = {
  moduleId: StudioModuleId;
  optionId: string;
  label: string;
  moduleLabel: string;
};

export function PromptStudio() {
  const [activeModule, setActiveModule] = useState<StudioModuleId>("subjects");
  const [activeSubjectCategory, setActiveSubjectCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState<SelectionState>(emptySelection);
  const [outputs, setOutputs] = useState<GeneratedStudioPrompt | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [favorites, setFavorites] = useState<StudioRecord[]>([]);
  const [history, setHistory] = useState<StudioRecord[]>([]);
  const [recentTags, setRecentTags] = useState<RecentTag[]>([]);

  useEffect(() => {
    setFavorites(readStorage<StudioRecord[]>(storageKeys.favorites, []));
    setHistory(readStorage<StudioRecord[]>(storageKeys.history, []));
    setRecentTags(readStorage<RecentTag[]>(storageKeys.recent, []));
  }, []);

  const totalRuleCount = useMemo(
    () =>
      moduleConfigs.reduce(
        (sum, module) => sum + getModuleCount(rules, module.id),
        0
      ),
    []
  );

  function persistFavorites(nextFavorites: StudioRecord[]) {
    setFavorites(nextFavorites);
    writeStorage(storageKeys.favorites, nextFavorites);
  }

  function persistHistory(nextHistory: StudioRecord[]) {
    setHistory(nextHistory);
    writeStorage(storageKeys.history, nextHistory);
  }

  function persistRecent(nextRecent: RecentTag[]) {
    setRecentTags(nextRecent);
    writeStorage(storageKeys.recent, nextRecent);
  }

  function toggleOption(moduleId: StudioModuleId, optionId: string) {
    setOutputs(null);
    setSelection((current) => {
      const currentIds = current[moduleId];
      const nextIds = currentIds.includes(optionId)
        ? currentIds.filter((id) => id !== optionId)
        : [...currentIds, optionId];

      return {
        ...current,
        [moduleId]: nextIds
      };
    });

    const option = findOptionById(rules, moduleId, optionId);
    const moduleLabel =
      moduleConfigs.find((module) => module.id === moduleId)?.shortLabel ?? "";

    if (option) {
      const nextRecent = [
        {
          moduleId,
          optionId,
          label: option.zh,
          moduleLabel
        },
        ...recentTags.filter(
          (tag) => !(tag.moduleId === moduleId && tag.optionId === optionId)
        )
      ].slice(0, 16);
      persistRecent(nextRecent);
    }
  }

  function removeOption(moduleId: StudioModuleId, optionId: string) {
    setOutputs(null);
    setSelection((current) => ({
      ...current,
      [moduleId]: current[moduleId].filter((id) => id !== optionId)
    }));
  }

  function clearSelection() {
    setSelection(emptySelection);
    setOutputs(null);
    setCopiedKey(null);
    setToast(null);
  }

  function generateFromSelection(nextSelection = selection) {
    const nextOutputs = buildStudioPrompt(rules, nextSelection);
    setOutputs(nextOutputs);

    if (nextOutputs) {
      const record = createStudioRecord(rules, nextSelection, nextOutputs);
      persistHistory([record, ...history].slice(0, 20));
    }
  }

  function handleRandomInspiration() {
    const nextSelection = randomSelection(rules);
    setSelection(nextSelection);
    setOutputs(null);
  }

  function handleRandomGenerate() {
    const nextSelection = randomSelection(rules);
    const nextOutputs = buildStudioPrompt(rules, nextSelection);
    setSelection(nextSelection);
    setOutputs(nextOutputs);

    if (nextOutputs) {
      const record = createStudioRecord(rules, nextSelection, nextOutputs);
      persistHistory([record, ...history].slice(0, 20));
    }
  }

  function favoriteCurrent() {
    if (!outputs) {
      return;
    }

    const record = createStudioRecord(rules, selection, outputs);
    persistFavorites([record, ...favorites].slice(0, 30));
  }

  function restoreRecord(record: StudioRecord) {
    setSelection(cloneSelection(record.selection));
    setOutputs(record.outputs);
    setQuery("");
  }

  function toggleRecent(tag: RecentTag) {
    toggleOption(tag.moduleId, tag.optionId);
    setActiveModule(tag.moduleId);
  }

  async function copyText(value: string, key: string) {
    const copied = await copyToClipboard(value);

    if (copied) {
      setCopiedKey(key);
      setToast({
        id: Date.now(),
        message: "已复制到剪贴板",
        tone: "success"
      });
      window.setTimeout(() => setCopiedKey(null), 1500);
      window.setTimeout(() => setToast(null), 1800);
    } else {
      setCopiedKey(null);
      setToast({
        id: Date.now(),
        message: "复制失败，请重试",
        tone: "error"
      });
      window.setTimeout(() => setToast(null), 2200);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f4f1] text-neutral-950">
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-[#f7f7f4]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-neutral-950 text-sm font-semibold text-white">
              PS
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-6 text-neutral-950">
                Prompt Studio
              </h1>
              <p className="text-xs text-neutral-500">
                本地 JSON 规则驱动，不调用 AI 接口
              </p>
            </div>
          </div>

          <label className="relative block w-full lg:max-w-xl">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索全部标签，例如：休闲椅、苹果风、胡桃木、85mm"
              className="h-11 w-full rounded-full border border-neutral-200 bg-white px-11 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:ring-4 focus:ring-neutral-950/10"
            />
          </label>

          <div className="grid grid-cols-3 gap-2 lg:w-[360px]">
            <HeaderMetric label="标签" value={totalRuleCount.toString()} />
            <HeaderMetric label="主体物" value={getModuleCount(rules, "subjects").toString()} />
            <HeaderMetric label="输出" value="5" />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)_420px] lg:px-8">
        <div className="grid gap-4 lg:sticky lg:top-[88px] lg:max-h-[calc(100vh-112px)] lg:self-start lg:overflow-y-auto lg:pr-1">
          <ModuleRail
            activeModule={activeModule}
            selection={selection}
            rules={rules}
            onChange={setActiveModule}
          />
          <div className="hidden lg:block">
            <ActivityPanel
              recentTags={recentTags}
              favorites={favorites}
              history={history}
              onRestore={restoreRecord}
              onToggleRecent={toggleRecent}
            />
          </div>
        </div>

        <TagGrid
          activeModule={activeModule}
          activeSubjectCategory={activeSubjectCategory}
          query={query}
          rules={rules}
          selection={selection}
          onSubjectCategoryChange={setActiveSubjectCategory}
          onToggle={toggleOption}
        />

        <div className="grid gap-4 lg:sticky lg:top-[88px] lg:max-h-[calc(100vh-112px)] lg:self-start lg:overflow-y-auto lg:pr-1">
          <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-950">
              <ShieldCheck className="h-4 w-4 text-emerald-700" aria-hidden="true" />
              平台适配
            </div>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              生成结果分为中文、英文、Midjourney、Flux 和 GPT Image 五个版本，均由本地规则拼接。
            </p>
          </section>
          <SelectionPanel
            rules={rules}
            selection={selection}
            onGenerate={() => generateFromSelection()}
            onRandomInspiration={handleRandomInspiration}
            onRandomGenerate={handleRandomGenerate}
            onRemove={removeOption}
            onClear={clearSelection}
          />
          <OutputPanel
            outputs={outputs}
            copiedKey={copiedKey}
            onCopy={copyText}
            onFavorite={favoriteCurrent}
            canFavorite={Boolean(outputs)}
          />
          <div className="lg:hidden">
            <ActivityPanel
              recentTags={recentTags}
              favorites={favorites}
              history={history}
              onRestore={restoreRecord}
              onToggleRecent={toggleRecent}
            />
          </div>
        </div>
      </div>
      <Toast toast={toast} />
    </main>
  );
}

type HeaderMetricProps = {
  label: string;
  value: string;
};

function HeaderMetric({ label, value }: HeaderMetricProps) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2">
      <div className="text-sm font-semibold text-neutral-950">{value}</div>
      <div className="mt-0.5 text-xs text-neutral-400">{label}</div>
    </div>
  );
}

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}
