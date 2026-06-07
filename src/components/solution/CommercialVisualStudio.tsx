"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Dice5, WandSparkles } from "lucide-react";
import rulesData from "@/data/solution-rules.json";
import { Toast, type ToastState } from "@/components/studio/Toast";
import { copyToClipboard } from "@/lib/clipboard";
import {
  buildSolutionDetail,
  createBriefFromExample,
  createFavoriteRecord,
  createHistoryRecord,
  defaultBrief,
  formatSolutionPackage,
  generateSolutionDirections
} from "@/lib/solution";
import {
  clearRecords,
  readLocalStorage,
  removeRecordById,
  writeLocalStorage
} from "@/lib/storage";
import {
  createBriefFromRandomSubject,
  getSubjectRecommendation
} from "@/lib/subject-recommendation";
import type {
  FavoriteRecord,
  HistoryRecord,
  PlatformOutputKey,
  ProjectBrief,
  SolutionDetail,
  SolutionDirection,
  SolutionRules
} from "@/types/solution";
import { ExampleShowcase } from "./ExampleShowcase";
import { FavoritePanel } from "./FavoritePanel";
import { HistoryPanel } from "./HistoryPanel";
import { PricingPreview } from "./PricingPreview";
import { ProjectInputPanel } from "./ProjectInputPanel";
import { SolutionCard } from "./SolutionCard";
import { SolutionDetailPanel } from "./SolutionDetailPanel";
import { WorkflowSection } from "./WorkflowSection";

const HISTORY_KEY = "commercial-visual-studio:history";
const FAVORITES_KEY = "commercial-visual-studio:favorites";
const RECENT_OBJECTS_KEY = "commercial-visual-studio:recent-objects";

export function CommercialVisualStudio() {
  const rules = useMemo(() => rulesData as SolutionRules, []);
  const solutionsRef = useRef<HTMLDivElement | null>(null);
  const randomSubjectHistoryRef = useRef<string[]>([]);

  const [brief, setBrief] = useState<ProjectBrief>(defaultBrief);
  const [solutions, setSolutions] = useState<SolutionDirection[]>([]);
  const [activeDetail, setActiveDetail] = useState<SolutionDetail | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [favorites, setFavorites] = useState<FavoriteRecord[]>([]);
  const [recentObjects, setRecentObjects] = useState<string[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [projectTypeManuallySelected, setProjectTypeManuallySelected] =
    useState(false);
  const [goalsManuallySelected, setGoalsManuallySelected] = useState(false);
  const [recommendationHints, setRecommendationHints] = useState({
    available: false
  });

  const subjectRecommendation = useMemo(
    () => getSubjectRecommendation(brief.objectName),
    [brief.objectName]
  );
  const projectTypeConflict = useMemo(() => {
    if (
      !subjectRecommendation?.projectType ||
      subjectRecommendation.projectType === brief.projectType
    ) {
      return null;
    }

    const recommendedName = rules.projectTypes.find(
      (item) => item.id === subjectRecommendation.projectType
    )?.name;
    const currentName = rules.projectTypes.find(
      (item) => item.id === brief.projectType
    )?.name;

    if (!recommendedName || !currentName) {
      return null;
    }

    return {
      recommendedName,
      currentName
    };
  }, [brief.projectType, rules.projectTypes, subjectRecommendation]);

  useEffect(() => {
    setHistory(readLocalStorage<HistoryRecord[]>(HISTORY_KEY, []));
    setFavorites(readLocalStorage<FavoriteRecord[]>(FAVORITES_KEY, []));
    setRecentObjects(readLocalStorage<string[]>(RECENT_OBJECTS_KEY, []));
  }, []);

  const showToast = useCallback((message: string, tone: "success" | "error") => {
    const id = Date.now();
    setToast({ id, message, tone });

    window.setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 1800);
  }, []);

  const rememberRecentObject = useCallback((objectName: string) => {
    const cleaned = objectName.trim();

    if (!cleaned) {
      return;
    }

    setRecentObjects((current) => {
      const next = [cleaned, ...current.filter((item) => item !== cleaned)].slice(
        0,
        6
      );
      writeLocalStorage(RECENT_OBJECTS_KEY, next);
      return next;
    });
  }, []);

  const handleBriefChange = useCallback(
    (nextBrief: ProjectBrief) => {
      const objectChanged = nextBrief.objectName !== brief.objectName;

      if (objectChanged) {
        const recommendation = getSubjectRecommendation(nextBrief.objectName);
        const recommendationAvailable = Boolean(recommendation);
        const shouldRecommendProjectType = Boolean(
          recommendation?.projectType && !projectTypeManuallySelected
        );
        const shouldRecommendGoals = Boolean(
          recommendation?.commercialGoals.length && !goalsManuallySelected
        );

        setRecommendationHints({
          available: recommendationAvailable
        });
        setBrief({
          ...nextBrief,
          projectType: shouldRecommendProjectType
            ? recommendation?.projectType ?? nextBrief.projectType
            : nextBrief.projectType,
          commercialGoals: shouldRecommendGoals
            ? recommendation?.commercialGoals ?? nextBrief.commercialGoals
            : nextBrief.commercialGoals
        });
        return;
      }

      if (nextBrief.projectType !== brief.projectType) {
        setProjectTypeManuallySelected(true);
      }

      if (!areStringArraysEqual(nextBrief.commercialGoals, brief.commercialGoals)) {
        setGoalsManuallySelected(true);
      }

      setBrief(nextBrief);
    },
    [brief, goalsManuallySelected, projectTypeManuallySelected]
  );

  const restoreRecommendation = useCallback(() => {
    const recommendation = getSubjectRecommendation(brief.objectName);

    if (!recommendation) {
      setRecommendationHints({ available: false });
      showToast("当前设计对象暂无可恢复的推荐", "error");
      return;
    }

    setProjectTypeManuallySelected(false);
    setGoalsManuallySelected(false);
    setRecommendationHints({ available: true });
    setBrief({
      ...brief,
      projectType: recommendation.projectType,
      commercialGoals: recommendation.commercialGoals
    });
    showToast("已恢复当前设计对象的推荐", "success");
  }, [brief, showToast]);

  const switchToRecommendedProjectType = useCallback(() => {
    if (!subjectRecommendation?.projectType) {
      return;
    }

    setProjectTypeManuallySelected(false);
    setRecommendationHints({ available: true });
    setBrief({
      ...brief,
      projectType: subjectRecommendation.projectType
    });
  }, [brief, subjectRecommendation]);

  const addHistoryRecord = useCallback(
    (nextBrief: ProjectBrief, count: number) => {
      const record = createHistoryRecord(rules, nextBrief, count);

      setHistory((current) => {
        const next = [record, ...current].slice(0, 12);
        writeLocalStorage(HISTORY_KEY, next);
        return next;
      });
    },
    [rules]
  );

  const addFavorite = useCallback(
    (detail: SolutionDetail) => {
      const exists = favorites.some(
        (item) =>
          item.detail.templateId === detail.templateId &&
          item.objectName === detail.objectName
      );

      if (exists) {
        showToast("该方案已在收藏中", "success");
        return;
      }

      const record = createFavoriteRecord(detail);
      const next = [record, ...favorites].slice(0, 24);
      setFavorites(next);
      writeLocalStorage(FAVORITES_KEY, next);
      showToast("已收藏方案组合", "success");
    },
    [favorites, showToast]
  );

  const deleteHistoryRecord = useCallback(
    (id: string) => {
      setHistory((current) => {
        const next = removeRecordById(current, id);
        writeLocalStorage(HISTORY_KEY, next);
        return next;
      });
      showToast("已删除历史记录", "success");
    },
    [showToast]
  );

  const clearHistoryRecords = useCallback(() => {
    if (!window.confirm("确定清空全部历史记录吗？")) {
      return;
    }

    const next = clearRecords<HistoryRecord>();
    setHistory(next);
    writeLocalStorage(HISTORY_KEY, next);
    showToast("已清空历史记录", "success");
  }, [showToast]);

  const deleteFavoriteRecord = useCallback(
    (id: string) => {
      setFavorites((current) => {
        const next = removeRecordById(current, id);
        writeLocalStorage(FAVORITES_KEY, next);
        return next;
      });
      showToast("已删除收藏", "success");
    },
    [showToast]
  );

  const clearFavoriteRecords = useCallback(() => {
    if (!window.confirm("确定清空全部收藏吗？")) {
      return;
    }

    const next = clearRecords<FavoriteRecord>();
    setFavorites(next);
    writeLocalStorage(FAVORITES_KEY, next);
    showToast("已清空收藏", "success");
  }, [showToast]);

  const selectSolution = useCallback(
    (solution: SolutionDirection, nextBrief = brief) => {
      const detail = buildSolutionDetail(rules, nextBrief, solution.template);
      setActiveDetail(detail);

      window.setTimeout(() => {
        document
          .getElementById("solution-detail")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);

      return detail;
    },
    [brief, rules]
  );

  const runGenerate = useCallback(
    (nextBrief = brief, shouldScroll = true) => {
      if (!nextBrief.objectName.trim()) {
        showToast("请先输入设计对象", "error");
        return;
      }

      const nextSolutions = generateSolutionDirections(rules, nextBrief);
      const firstDetail = nextSolutions[0]
        ? buildSolutionDetail(rules, nextBrief, nextSolutions[0].template)
        : null;

      setBrief(nextBrief);
      setSolutions(nextSolutions);
      setActiveDetail(firstDetail);
      addHistoryRecord(nextBrief, nextSolutions.length);
      rememberRecentObject(nextBrief.objectName);
      showToast(`已生成 ${nextSolutions.length} 个商业视觉方向`, "success");

      if (shouldScroll) {
        window.setTimeout(() => {
          solutionsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }, 80);
      }
    },
    [addHistoryRecord, brief, rememberRecentObject, rules, showToast]
  );

  const loadExample = useCallback(
    (index: number, autoGenerate = false) => {
      const nextBrief = createBriefFromExample(rules, index);
      setProjectTypeManuallySelected(false);
      setGoalsManuallySelected(false);
      setRecommendationHints({
        available: Boolean(getSubjectRecommendation(nextBrief.objectName))
      });
      setBrief(nextBrief);

      if (autoGenerate) {
        runGenerate(nextBrief);
      } else {
        showToast("已载入案例，可直接生成", "success");
      }
    },
    [rules, runGenerate, showToast]
  );

  const randomBrief = useCallback(() => {
    const excludedSubjects = [
      brief.objectName,
      ...randomSubjectHistoryRef.current
    ].filter(Boolean);
    const nextBrief = createBriefFromRandomSubject(
      excludedSubjects
    );
    randomSubjectHistoryRef.current = [
      nextBrief.objectName,
      ...randomSubjectHistoryRef.current.filter(
        (item) => item !== nextBrief.objectName
      )
    ].slice(0, 10);

    return nextBrief;
  }, [brief.objectName]);

  const handleRandomInspiration = useCallback(() => {
    const nextBrief = randomBrief();
    setProjectTypeManuallySelected(false);
    setGoalsManuallySelected(false);
    setRecommendationHints({ available: true });
    setBrief(nextBrief);
    showToast(formatRandomBriefToast(rules, nextBrief), "success");
  }, [randomBrief, rules, showToast]);

  const handleRandomGenerate = useCallback(() => {
    const nextBrief = randomBrief();
    setProjectTypeManuallySelected(false);
    setGoalsManuallySelected(false);
    setRecommendationHints({ available: true });
    runGenerate(nextBrief);
    showToast(formatRandomBriefToast(rules, nextBrief), "success");
  }, [randomBrief, rules, runGenerate, showToast]);

  const handleCopy = useCallback(
    async (value: string, key: string) => {
      const copied = await copyToClipboard(value);

      if (copied) {
        setCopiedKey(key);
        showToast("已复制到剪贴板", "success");
        window.setTimeout(() => {
          setCopiedKey((current) => (current === key ? null : current));
        }, 1500);
      } else {
        showToast("复制失败，请手动复制", "error");
      }
    },
    [showToast]
  );

  const copyOutput = useCallback(
    (key: PlatformOutputKey, value: string) => {
      if (!activeDetail) {
        return;
      }

      void handleCopy(value, `${activeDetail.id}:${key}`);
    },
    [activeDetail, handleCopy]
  );

  const copyPackage = useCallback(
    (detail: SolutionDetail) => {
      void handleCopy(formatSolutionPackage(detail), `${detail.id}:package`);
    },
    [handleCopy]
  );

  const favoriteSolution = useCallback(
    (solution: SolutionDirection) => {
      const detail = selectSolution(solution);
      addFavorite(detail);
    },
    [addFavorite, selectSolution]
  );

  const loadHistory = useCallback(
    (record: HistoryRecord) => {
      runGenerate(record.brief);
    },
    [runGenerate]
  );

  const openFavorite = useCallback(
    (record: FavoriteRecord) => {
      setBrief({
        objectName: record.detail.objectName,
        englishProductName: record.detail.objectNameEn,
        projectType: brief.projectType,
        commercialGoals: brief.commercialGoals,
        keywords: brief.keywords
      });
      setActiveDetail(record.detail);
      showToast("已打开收藏方案", "success");
    },
    [brief, showToast]
  );

  return (
    <main className="min-h-screen bg-[#F6F7F4] text-neutral-950">
      <section className="mx-auto grid min-h-screen w-full max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[0.94fr_1.06fr] lg:px-8 lg:py-8">
        <div className="flex flex-col justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
              Local JSON rules · No AI API
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
              AI Commercial Visual Studio
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-700 sm:text-xl">
              输入一个产品，生成可交付的商业视觉方案。
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-500 sm:text-base">
              自动输出视觉概念、构图策略、CMF 表达、灯光建议和 Midjourney / Flux / GPT Image 专用 Prompt。
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
                <div className="text-2xl font-semibold text-neutral-950">
                  {rules.solutionTemplates.length}
                </div>
                <div className="mt-1 text-xs text-neutral-500">商业方案模板</div>
              </div>
              <div className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
                <div className="text-2xl font-semibold text-neutral-950">3-6</div>
                <div className="mt-1 text-xs text-neutral-500">方案一次生成</div>
              </div>
              <div className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
                <div className="text-2xl font-semibold text-neutral-950">5+</div>
                <div className="mt-1 text-xs text-neutral-500">平台输出版本</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-soft-panel">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-neutral-950">
                  方案预览
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  从商业目标出发，而不是让用户手动堆参数。
                </p>
              </div>
              <div className="rounded-full bg-neutral-950 px-3 py-1 text-xs font-medium text-white">
                Prompt Studio
              </div>
            </div>
            <div className="grid gap-2">
              {[
                "高端家具展厅渲染",
                "CMF 材质微距研究",
                "电商高转化主图"
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-3"
                >
                  <div>
                    <div className="text-sm font-semibold text-neutral-950">
                      {item}
                    </div>
                    <div className="mt-1 text-xs text-neutral-500">
                      视觉概念 · 构图 · CMF · Prompt
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-neutral-300">
                    0{index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 self-start lg:sticky lg:top-6">
          <ProjectInputPanel
            brief={brief}
            rules={rules}
            recentObjects={recentObjects}
            recommendationVisible={recommendationHints.available}
            projectTypeConflict={projectTypeConflict}
            onBriefChange={handleBriefChange}
            onGenerate={() => runGenerate()}
            onLoadExample={(index) => loadExample(index)}
            onRestoreRecommendation={restoreRecommendation}
            onSwitchToRecommendedProjectType={switchToRecommendedProjectType}
            onUseRecentObject={(value) =>
              handleBriefChange({
                ...brief,
                objectName: value,
                englishProductName: ""
              })
            }
          />

          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleRandomInspiration}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
            >
              <Dice5 className="h-4 w-4" aria-hidden="true" />
              随机灵感
            </button>
            <button
              type="button"
              onClick={handleRandomGenerate}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-teal-700 px-4 text-sm font-medium text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2"
            >
              <WandSparkles className="h-4 w-4" aria-hidden="true" />
              一键随机生成
            </button>
          </div>
        </div>
      </section>

      <section
        ref={solutionsRef}
        id="solutions"
        className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-12 sm:px-6 lg:grid-cols-[0.84fr_1.16fr] lg:px-8"
      >
        <div>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-teal-700">
                Generated directions
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950">
                商业视觉方向
              </h2>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-500 shadow-sm">
              {solutions.length || 0} 个方案
            </span>
          </div>

          {solutions.length === 0 ? (
            <div className="rounded-lg border border-dashed border-neutral-300 bg-white/70 p-6 text-sm leading-6 text-neutral-500">
              首屏输入设计对象后，系统会基于本地 JSON 规则生成多套差异化视觉方向。
            </div>
          ) : (
            <div className="grid gap-3">
              {solutions.map((solution) => (
                <SolutionCard
                  key={solution.id}
                  solution={solution}
                  active={activeDetail?.templateId === solution.template.id}
                  onSelect={() => selectSolution(solution)}
                  onFavorite={() => favoriteSolution(solution)}
                />
              ))}
            </div>
          )}
        </div>

        <div id="solution-detail" className="scroll-mt-6">
          <SolutionDetailPanel
            detail={activeDetail}
            copiedKey={copiedKey}
            onCopyOutput={copyOutput}
            onCopyPackage={copyPackage}
            onFavorite={addFavorite}
          />
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <HistoryPanel
          records={history}
          onLoad={loadHistory}
          onDelete={deleteHistoryRecord}
          onClear={clearHistoryRecords}
        />
        <FavoritePanel
          records={favorites}
          onOpen={openFavorite}
          onDelete={deleteFavoriteRecord}
          onClear={clearFavoriteRecords}
        />
      </section>

      <ExampleShowcase
        rules={rules}
        onLoadExample={(index) => loadExample(index, true)}
      />
      <WorkflowSection />
      <PricingPreview rules={rules} />

      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-neutral-950 p-6 text-white shadow-soft-panel sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-teal-200">
                Ready to generate
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                开始生成你的商业视觉方案
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                document
                  .querySelector("input")
                  ?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-neutral-950 transition hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-950"
            >
              回到输入区
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <Toast toast={toast} />
    </main>
  );
}

function areStringArraysEqual(first: string[], second: string[]) {
  return (
    first.length === second.length &&
    first.every((item, index) => item === second[index])
  );
}

function formatRandomBriefToast(rules: SolutionRules, brief: ProjectBrief) {
  const projectType =
    rules.projectTypes.find((item) => item.id === brief.projectType)?.name ??
    "产品设计";
  const goalNames = brief.commercialGoals
    .map((goalId) => rules.commercialGoals.find((item) => item.id === goalId)?.name)
    .filter(Boolean)
    .join(" / ");

  return `已为你生成：${brief.objectName} · ${projectType} · ${goalNames}`;
}
