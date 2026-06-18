"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Bookmark,
  Gem,
  Menu,
  Search,
  Sparkles,
  Star,
  X
} from "lucide-react";
import { track } from "@/lib/analytics";
import {
  crystalStyleFilters,
  crystalTaskFilters,
  getCrystalCasesBySlugs,
  getCrystalCasesByStyle,
  getCrystalCasesByTask,
  getCrystalProductById,
  getFavoriteCrystalCases,
  latestCaseSlugs,
  popularCaseSlugs,
  searchCrystalCases,
  supportedModelLabels
} from "@/lib/crystal-cases";
import type { CrystalCase, CrystalProduct } from "@/types/crystal";
import { CrystalCaseCard } from "./CrystalCaseCard";
import { CrystalFavoritePanel } from "./CrystalFavoritePanel";
import { useCrystalFavorites } from "./useCrystalFavorites";

type CrystalCaseLibraryProps = {
  products: CrystalProduct[];
  cases: CrystalCase[];
};

type CaseView = "all" | "latest" | "popular";

const materialFilterProductIds = ["amethyst", "citrine", "obsidian"] as const;
const allMaterialFilterId = "all";
const allTaskFilterId = "all";
const allStyleFilterId = "all";
const caseViewOptions: Array<{ id: CaseView; label: string; description: string }> = [
  { id: "all", label: "全部案例", description: "展示完整案例库" },
  { id: "latest", label: "最新精选", description: "近期运营精选" },
  { id: "popular", label: "推荐浏览", description: "适合新用户快速理解" }
];

export function CrystalCaseLibrary({
  products,
  cases
}: CrystalCaseLibraryProps) {
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMaterialFilter, setActiveMaterialFilter] =
    useState<string>(allMaterialFilterId);
  const [activeTaskFilter, setActiveTaskFilter] = useState<string>(allTaskFilterId);
  const [activeStyleFilter, setActiveStyleFilter] = useState<string>(allStyleFilterId);
  const [activeCaseView, setActiveCaseView] = useState<CaseView>("all");
  const { favoriteIds, favoriteSet, toggleFavorite, clearFavorites } =
    useCrystalFavorites();

  const latestCases = useMemo(
    () => getCrystalCasesBySlugs(latestCaseSlugs),
    []
  );
  const popularCases = useMemo(
    () => getCrystalCasesBySlugs(popularCaseSlugs),
    []
  );
  const styleCount = useMemo(
    () => new Set(cases.map((caseItem) => caseItem.styleId)).size,
    [cases]
  );
  const productCaseCounts = useMemo(() => {
    const counts = new Map<string, number>();

    cases.forEach((caseItem) => {
      counts.set(caseItem.productId, (counts.get(caseItem.productId) ?? 0) + 1);
    });

    return counts;
  }, [cases]);
  const materialFilters = useMemo(() => {
    const productsById = new Map(products.map((product) => [product.id, product]));

    return materialFilterProductIds
      .map((productId) => productsById.get(productId))
      .filter(Boolean) as CrystalProduct[];
  }, [products]);
  const caseViewCases = useMemo(() => {
    if (activeCaseView === "latest") {
      return latestCases;
    }

    if (activeCaseView === "popular") {
      return popularCases;
    }

    return cases;
  }, [activeCaseView, cases, latestCases, popularCases]);
  const visibleCases = useMemo(() => {
    let filteredCases = searchCrystalCases(query, caseViewCases);

    if (activeMaterialFilter !== allMaterialFilterId) {
      filteredCases = filteredCases.filter(
        (caseItem) => caseItem.productId === activeMaterialFilter
      );
    }

    filteredCases = getCrystalCasesByTask(activeTaskFilter, filteredCases);
    filteredCases =
      activeStyleFilter === allStyleFilterId
        ? filteredCases
        : getCrystalCasesByStyle(activeStyleFilter, filteredCases);

    return filteredCases;
  }, [activeMaterialFilter, activeStyleFilter, activeTaskFilter, caseViewCases, query]);
  const activeMaterialName = useMemo(() => {
    if (activeMaterialFilter === allMaterialFilterId) {
      return "全部";
    }

    return (
      materialFilters.find((product) => product.id === activeMaterialFilter)
        ?.name ?? "全部"
    );
  }, [activeMaterialFilter, materialFilters]);
  const activeCaseViewLabel =
    caseViewOptions.find((option) => option.id === activeCaseView)?.label ??
    "全部案例";
  const activeTaskLabel =
    activeTaskFilter === allTaskFilterId
      ? "全部目标"
      : crystalTaskFilters.find((filter) => filter.id === activeTaskFilter)?.label ??
        "全部目标";
  const activeStyleLabel =
    activeStyleFilter === allStyleFilterId
      ? "全部风格"
      : crystalStyleFilters.find((filter) => filter.id === activeStyleFilter)
          ?.label ?? "全部风格";
  const favoriteCases = useMemo(
    () => getFavoriteCrystalCases(favoriteIds),
    [favoriteIds]
  );
  const heroCase = latestCases[0] ?? cases[0];
  const heroProduct = heroCase ? getCrystalProductById(heroCase.productId) : null;

  const handleClearFavorites = () => {
    if (window.confirm("确定清空全部收藏案例吗？")) {
      clearFavorites();
    }
  };
  const handleQuerySubmit = (submittedQuery: string) => {
    track("search_submit", {
      query: submittedQuery.trim(),
      result_count: visibleCases.length
    });
  };
  const handleMaterialFilterChange = (productId: string) => {
    setActiveMaterialFilter(productId);
    track("filter_apply", {
      filter_type: "material",
      value: productId,
      view: activeCaseView
    });
  };
  const handleTaskFilterChange = (taskId: string, scrollToCases = false) => {
    setActiveTaskFilter(taskId);
    setActiveCaseView("all");
    if (scrollToCases) {
      setActiveStyleFilter(allStyleFilterId);
    }
    track("filter_apply", {
      filter_type: "task",
      value: taskId,
      material: activeMaterialFilter,
      style: activeStyleFilter
    });

    if (scrollToCases) {
      window.setTimeout(() => {
        document
          .getElementById("cases")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    }
  };
  const handleStyleFilterChange = (styleId: string) => {
    setActiveStyleFilter(styleId);
    track("filter_apply", {
      filter_type: "style",
      value: styleId,
      task: activeTaskFilter,
      material: activeMaterialFilter
    });
  };
  const handleCaseViewChange = (view: CaseView) => {
    setActiveCaseView(view);
    track("filter_apply", {
      filter_type: "case_view",
      value: view,
      material: activeMaterialFilter
    });
  };
  const handleToggleFavorite = (caseId: string, source: string) => {
    const caseItem = cases.find((item) => item.id === caseId);
    const willFavorite = !favoriteSet.has(caseId);

    toggleFavorite(caseId);
    track("favorite_toggle", {
      case_id: caseId,
      case_slug: caseItem?.slug,
      action: willFavorite ? "add" : "remove",
      source
    });
  };

  return (
    <main className="min-h-screen text-neutral-950">
      <a href="#cases" className="skip-link">
        跳到全部商业案例
      </a>
      <header className="sticky top-0 z-40 border-b border-black/5 bg-[#f8fbfa]/88 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold tracking-tight text-neutral-950"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-neutral-950 text-white">
              <Gem className="h-4 w-4" aria-hidden="true" />
            </span>
            水晶手串案例库
          </Link>

          <nav
            aria-label="浏览路径"
            className="hidden items-center gap-1 rounded-full border border-black/10 bg-white/78 p-1 text-sm font-medium text-neutral-600 shadow-sm md:flex"
          >
            <NavPill href="#tasks">按任务找</NavPill>
            <NavPill href="#cases">浏览案例</NavPill>
            <NavPill href="#products">按材质选</NavPill>
            <NavPill href="#favorites">我的收藏 {favoriteIds.length}</NavPill>
          </nav>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((current) => !current)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label={mobileMenuOpen ? "关闭导航菜单" : "打开导航菜单"}
            className="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white/80 text-neutral-800 shadow-sm md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>

        <nav
          id="mobile-nav"
          className={`mx-4 mb-3 grid gap-1 rounded-2xl border border-black/10 bg-white p-2 shadow-xl md:hidden ${
            mobileMenuOpen ? "grid" : "hidden"
          }`}
        >
          <MobileNavLink href="#tasks" onClick={() => setMobileMenuOpen(false)}>
            按任务找案例
          </MobileNavLink>
          <MobileNavLink href="#cases" onClick={() => setMobileMenuOpen(false)}>
            浏览全部案例
          </MobileNavLink>
          <MobileNavLink href="#products" onClick={() => setMobileMenuOpen(false)}>
            按材质选择
          </MobileNavLink>
          <MobileNavLink href="#favorites" onClick={() => setMobileMenuOpen(false)}>
            收藏案例 {favoriteIds.length}
          </MobileNavLink>
        </nav>
      </header>

      <section className="mx-auto grid w-full max-w-[1240px] gap-6 px-4 pb-10 pt-6 sm:px-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:px-8 lg:pt-10">
        <div className="flex flex-col justify-between px-0 py-1 lg:min-h-[35rem]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/86 px-3 py-1.5 text-xs font-medium text-neutral-600 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-700" />
              水晶手串 AI 商业视觉案例库
            </div>
            <h1 className="mt-6 max-w-2xl text-[2.65rem] font-semibold leading-[0.98] tracking-[-0.05em] text-neutral-950 sm:text-6xl lg:text-7xl">
              水晶手串 AI 商业视觉案例库
            </h1>
            <p
              lang="en"
              className="mt-4 max-w-xl text-sm font-medium leading-6 text-neutral-500 sm:text-base"
            >
              Crystal visual cases and reusable prompts for commercial sellers.
            </p>
            <p className="mt-5 max-w-xl text-base leading-7 text-neutral-700">
              面向水晶商家、小红书卖家和电商运营，整理可直接复用的商品图、种草图、品牌广告图与礼赠场景 Prompt。
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
              <HeroMetric value={String(cases.length)} label="商用案例" />
              <HeroMetric value={String(products.length)} label="水晶材质" />
              <HeroMetric value={String(styleCount)} label="拍摄风格" />
              <HeroMetric value="3" label="模型 Prompt" />
            </div>
          </div>

          <div id="tasks" className="mt-8 grid gap-3">
            <SearchBox
              query={query}
              onQueryChange={setQuery}
              onQuerySubmit={handleQuerySubmit}
            />
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
                先选你要完成的商业任务
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {crystalTaskFilters.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => handleTaskFilterChange(task.id, true)}
                    aria-pressed={activeTaskFilter === task.id}
                    className={`rounded-2xl border px-3 py-3 text-left transition ${
                      activeTaskFilter === task.id
                        ? "border-teal-900 bg-teal-950 text-white shadow-sm"
                        : "border-black/10 bg-white/86 text-neutral-700 hover:border-teal-900/25 hover:text-neutral-950"
                    }`}
                  >
                    <span className="block text-sm font-semibold">{task.label}</span>
                    <span
                      className={`mt-1 line-clamp-2 block text-xs leading-5 ${
                        activeTaskFilter === task.id
                          ? "text-white/66"
                          : "text-neutral-500"
                      }`}
                    >
                      {task.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {heroCase && heroProduct ? (
          <HeroCase
            caseItem={heroCase}
            product={heroProduct}
            favorite={favoriteSet.has(heroCase.id)}
            onToggleFavorite={(caseId) => handleToggleFavorite(caseId, "hero")}
          />
        ) : null}
      </section>

      <section
        id="products"
        className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6 lg:px-8"
      >
        <SectionHeading eyebrow="按材质浏览" title="先选择水晶材质" />
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {products.map((product) => (
            <ProductCategoryCard
              key={product.id}
              product={product}
              caseCount={productCaseCounts.get(product.id) ?? 0}
            />
          ))}
        </div>
      </section>

      <section
        id="why"
        className="mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="rounded-[1.625rem] border border-white/10 bg-[#061412] p-5 text-white shadow-[0_24px_80px_rgba(6,20,18,0.22)] sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-200">
                为什么使用这个案例库
              </p>
              <h2 className="mt-3 max-w-lg text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
                不是关键词堆砌，而是可复用的商业视觉案例。
              </h2>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <ValueCard
                icon={<Sparkles className="h-4 w-4" aria-hidden="true" />}
                title="图片优先"
                description="每个案例以真实出图场景组织，先看画面，再复制 Prompt。"
              />
              <ValueCard
                icon={<BadgeCheck className="h-4 w-4" aria-hidden="true" />}
                title="结构完整"
                description="保留构图、灯光、商业用途和模型专用 Prompt。"
              />
              <ValueCard
                icon={<Bookmark className="h-4 w-4" aria-hidden="true" />}
                title="适合复用"
                description="收藏案例后可快速回看，适合持续优化店铺视觉。"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="cases"
        className="mx-auto w-full max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8"
      >
        <div className="mb-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <SectionHeading
            eyebrow="案例库"
            title={query ? "搜索结果" : "全部商业案例"}
            description={`${activeTaskLabel} · ${activeStyleLabel} · ${activeMaterialName} · ${activeCaseViewLabel}，共 ${visibleCases.length} 个案例。`}
          />
          <div className="flex flex-wrap gap-1.5 lg:justify-end">
            <ModelBadges />
          </div>
        </div>

        <div className="mb-4 grid gap-3 rounded-[1.5rem] border border-black/10 bg-white/78 p-3 shadow-sm">
          <FilterRow label="业务目标">
            <FilterPill
              active={activeTaskFilter === allTaskFilterId}
              onClick={() => handleTaskFilterChange(allTaskFilterId)}
            >
              全部目标
            </FilterPill>
            {crystalTaskFilters.map((task) => (
              <FilterPill
                key={task.id}
                active={activeTaskFilter === task.id}
                onClick={() => handleTaskFilterChange(task.id)}
                title={task.description}
              >
                {task.label}
              </FilterPill>
            ))}
          </FilterRow>

          <FilterRow label="拍摄风格">
            <FilterPill
              active={activeStyleFilter === allStyleFilterId}
              onClick={() => handleStyleFilterChange(allStyleFilterId)}
            >
              全部风格
            </FilterPill>
            {crystalStyleFilters.map((style) => (
              <FilterPill
                key={style.id}
                active={activeStyleFilter === style.id}
                onClick={() => handleStyleFilterChange(style.id)}
                title={style.description}
              >
                {style.label}
              </FilterPill>
            ))}
          </FilterRow>

          <FilterRow label="运营视图">
            {caseViewOptions.map((option) => (
              <FilterPill
                key={option.id}
                active={activeCaseView === option.id}
                onClick={() => handleCaseViewChange(option.id)}
                title={option.description}
                tone={activeCaseView === option.id ? "teal" : "neutral"}
              >
                {option.label}
              </FilterPill>
            ))}
          </FilterRow>
        </div>

        <div className="sticky top-16 z-20 mb-5 -mx-4 overflow-x-auto border-y border-black/5 bg-[#f8fbfa]/92 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
          <div className="flex min-w-max gap-2 sm:min-w-0 sm:flex-wrap">
            <MaterialFilterButton
              active={activeMaterialFilter === allMaterialFilterId}
              count={cases.length}
              onClick={() => handleMaterialFilterChange(allMaterialFilterId)}
            >
              全部
            </MaterialFilterButton>
            {materialFilters.map((product) => (
              <MaterialFilterButton
                key={product.id}
                active={activeMaterialFilter === product.id}
                count={productCaseCounts.get(product.id) ?? 0}
                onClick={() => handleMaterialFilterChange(product.id)}
              >
                {product.name}
              </MaterialFilterButton>
            ))}
            <button
              type="button"
              disabled
              className="inline-flex h-10 cursor-not-allowed items-center rounded-full border border-black/10 bg-black/[0.04] px-4 text-sm font-medium text-neutral-400"
            >
              更多材质敬请期待...
            </button>
          </div>
          <p className="mt-2 text-xs leading-5 text-neutral-500">
            排序说明：最新精选与推荐浏览为运营编辑排序，暂不展示虚构浏览量或收藏量。
          </p>
        </div>

        {visibleCases.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-black/15 bg-white/70 p-8 text-sm leading-6 text-neutral-500">
            没有找到匹配案例。可以搜索「紫水晶」「黄水晶」「黑曜石」「白底」「小红书」「奢侈品广告」。
          </div>
        ) : (
          <div
            key={`${activeMaterialFilter}-${query}`}
            className="grid gap-5 animate-[case-list-fade-in_260ms_ease-out] motion-reduce:animate-none md:grid-cols-2 xl:grid-cols-3"
          >
            {visibleCases.map((caseItem) => {
              const product = getCrystalProductById(caseItem.productId);

              if (!product) {
                return null;
              }

              return (
                <CrystalCaseCard
                  key={caseItem.id}
                  caseItem={caseItem}
                  product={product}
                  favorite={favoriteSet.has(caseItem.id)}
                  onToggleFavorite={(caseId) =>
                    handleToggleFavorite(caseId, "case_grid")
                  }
                />
              );
            })}
          </div>
        )}
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-4 pb-12 sm:px-6 lg:px-8">
        <StaticConversionPanel />
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-4 pb-12 sm:px-6 lg:px-8">
        <CrystalFavoritePanel
          favoriteCases={favoriteCases}
          onToggleFavorite={(caseId) => handleToggleFavorite(caseId, "favorites")}
          onClearFavorites={handleClearFavorites}
        />
      </section>

      <footer className="border-t border-black/5 bg-white/54">
        <div className="mx-auto grid w-full max-w-[1240px] gap-4 px-4 py-8 text-sm text-neutral-500 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
          <div>
            <div className="font-semibold text-neutral-950">
              水晶手串 AI 商业视觉案例库
            </div>
            <p className="mt-2 max-w-2xl leading-6">
              为水晶商家、小红书卖家和电商运营整理可复用的商业视觉案例、Prompt 与构图灯光分析。
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <FooterLink href="#why">使用说明</FooterLink>
            <FooterLink href="mailto:xinboxi7-wq@users.noreply.github.com?subject=%E6%B0%B4%E6%99%B6%E6%89%8B%E4%B8%B2%E6%A1%88%E4%BE%8B%E5%BA%93%E5%95%86%E4%B8%9A%E5%90%88%E4%BD%9C">
              商业合作
            </FooterLink>
            <FooterLink href="mailto:xinboxi7-wq@users.noreply.github.com?subject=%E9%A2%86%E5%8F%96%20Prompt%20Pack">
              领取 Prompt Pack
            </FooterLink>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FilterRow({
  label,
  children
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2 lg:grid-cols-[5rem_minmax(0,1fr)] lg:items-center">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
        {label}
      </div>
      <div className="flex min-w-0 gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
        {children}
      </div>
    </div>
  );
}

function FilterPill({
  active,
  children,
  title,
  tone = "neutral",
  onClick
}: {
  active: boolean;
  children: ReactNode;
  title?: string;
  tone?: "neutral" | "teal";
  onClick: () => void;
}) {
  const activeClass =
    tone === "teal"
      ? "border-teal-950 bg-teal-950 text-white"
      : "border-teal-950 bg-teal-950 text-white";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={title}
      className={`inline-flex h-10 shrink-0 items-center rounded-full border px-4 text-sm font-semibold transition ${
        active
          ? activeClass
          : "border-black/10 bg-white/80 text-neutral-600 hover:border-teal-900/25 hover:text-neutral-950"
      }`}
    >
      {children}
    </button>
  );
}

function StaticConversionPanel() {
  return (
    <section className="overflow-hidden rounded-[1.625rem] border border-white/10 bg-[#061412] text-white shadow-[0_24px_80px_rgba(6,20,18,0.22)]">
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-200">
            Prompt Pack / 商业合作
          </p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
            想把案例库变成你的店铺视觉素材包？
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/66">
            现在先开放静态咨询入口：可以领取后续 Prompt Pack 更新，也可以提出水晶材质、节日礼赠、平台主图等定制需求。
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <CtaLink
            href="mailto:xinboxi7-wq@users.noreply.github.com?subject=%E9%A2%86%E5%8F%96%20%E6%B0%B4%E6%99%B6%E6%89%8B%E4%B8%B2%20Prompt%20Pack"
            eventLabel="prompt_pack"
          >
            领取 Prompt Pack
          </CtaLink>
          <CtaLink
            href="mailto:xinboxi7-wq@users.noreply.github.com?subject=%E6%B0%B4%E6%99%B6%E6%89%8B%E4%B8%B2%E8%A7%86%E8%A7%89%E6%A1%88%E4%BE%8B%E5%AE%9A%E5%88%B6%E5%92%A8%E8%AF%A2"
            eventLabel="commercial_consult"
            subtle
          >
            商业合作咨询
          </CtaLink>
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 sm:col-span-2">
            <div className="text-sm font-semibold">FAQ</div>
            <p className="mt-2 text-sm leading-6 text-white/62">
              当前不接入 AI 接口、不收集表单数据，所有案例和 Prompt 都来自本地内容库。后续真实图片可以直接替换资源路径。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaLink({
  href,
  children,
  eventLabel,
  subtle = false
}: {
  href: string;
  children: ReactNode;
  eventLabel: string;
  subtle?: boolean;
}) {
  return (
    <a
      href={href}
      onClick={() => track("cta_click", { target: eventLabel })}
      className={`inline-flex h-12 items-center justify-center rounded-full px-5 text-sm font-semibold transition ${
        subtle
          ? "border border-white/16 bg-white/[0.08] text-white hover:bg-white/[0.14]"
          : "bg-white text-neutral-950 hover:bg-neutral-100"
      }`}
    >
      {children}
    </a>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      onClick={() => track("cta_click", { target: String(children) })}
      className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-950"
    >
      {children}
    </a>
  );
}

function NavPill({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full px-4 py-2 text-neutral-600 transition hover:bg-neutral-950 hover:text-white"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick
}: {
  href: string;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex h-11 items-center justify-between rounded-xl px-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950"
    >
      {children}
      <span className="text-neutral-300">#</span>
    </Link>
  );
}

function SearchBox({
  query,
  onQueryChange,
  onQuerySubmit
}: {
  query: string;
  onQueryChange: (value: string) => void;
  onQuerySubmit: (value: string) => void;
}) {
  return (
    <label className="flex h-12 items-center gap-3 rounded-full border border-black/10 bg-white px-4 shadow-sm">
      <Search className="h-4 w-4 text-neutral-400" aria-hidden="true" />
      <span className="sr-only">搜索案例</span>
      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onQuerySubmit(query);
          }
        }}
        onBlur={() => {
          if (query.trim()) {
            onQuerySubmit(query);
          }
        }}
        placeholder="搜索紫水晶、白底、小红书、礼赠场景..."
        className="min-w-0 flex-1 bg-transparent text-sm text-neutral-950 outline-none placeholder:text-neutral-400"
      />
      {query ? (
        <button
          type="button"
          onClick={() => {
            onQueryChange("");
            onQuerySubmit("");
          }}
          className="grid h-8 w-8 place-items-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-950"
          aria-label="清空搜索"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}
    </label>
  );
}

function HeroCase({
  caseItem,
  product,
  favorite,
  onToggleFavorite
}: {
  caseItem: CrystalCase;
  product: CrystalProduct;
  favorite: boolean;
  onToggleFavorite: (caseId: string) => void;
}) {
  const caseImage = caseItem.coverImage || caseItem.image;

  return (
    <article className="group relative min-h-[23rem] overflow-hidden rounded-[1.625rem] border border-white/20 bg-neutral-950 shadow-[0_30px_80px_rgba(8,18,18,0.28)] sm:min-h-[30rem] lg:min-h-[35rem]">
      <Image
        src={caseImage}
        alt={caseItem.title}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 56vw"
        className="object-cover object-[center_58%] transition duration-700 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.10)_0%,transparent_34%),linear-gradient(0deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.34)_42%,transparent_78%)]" />
      <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-neutral-950 backdrop-blur">
            {product.name}
          </span>
          <span className="rounded-full bg-white/18 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            {caseItem.styleName}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onToggleFavorite(caseItem.id)}
          aria-pressed={favorite}
          aria-label={favorite ? `已收藏 ${caseItem.title}，点击取消收藏` : `收藏 ${caseItem.title}`}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-neutral-900 shadow-sm backdrop-blur transition hover:bg-white hover:text-amber-600"
        >
          <Star
            className="h-4 w-4"
            fill={favorite ? "currentColor" : "none"}
            aria-hidden="true"
          />
        </button>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
        <p className="text-xs font-semibold tracking-[0.18em] text-white/64">
          精选商业案例
        </p>
        <h2 className="mt-3 max-w-2xl text-[1.95rem] font-semibold leading-[1.03] tracking-[-0.03em] sm:text-5xl">
          {caseItem.title}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-white/72">
          {caseItem.summary}
        </p>
        <Link
          href={`/case/${caseItem.slug}`}
          aria-label={`查看 ${caseItem.title} 的完整 Prompt 和视觉分析`}
          className="mt-5 inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full bg-white px-4 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-100"
        >
          查看完整 Prompt
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function MaterialFilterButton({
  active,
  children,
  count,
  onClick
}: {
  active: boolean;
  children: ReactNode;
  count?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-10 items-center rounded-full border px-4 text-sm font-medium transition ${
        active
          ? "border-teal-950 bg-teal-950 text-white shadow-sm"
          : "border-black/10 bg-white/80 text-neutral-600 hover:border-teal-900/25 hover:text-neutral-950"
      }`}
    >
      {children}
      {typeof count === "number" ? (
        <span
          className={`ml-2 rounded-full px-1.5 py-0.5 text-[0.68rem] ${
            active ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500"
          }`}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}

function HeroMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/86 px-4 py-3 shadow-[0_8px_24px_rgba(11,30,28,0.06)]">
      <div className="text-2xl font-semibold leading-none tracking-[-0.03em] text-neutral-950">
        {value}
      </div>
      <div className="mt-1 text-xs font-medium text-neutral-500">{label}</div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  compact = false
}: {
  eyebrow: string;
  title: string;
  description?: string;
  compact?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.18em] text-teal-700">
        {eyebrow}
      </p>
      <h2
        className={`mt-1 font-semibold tracking-[-0.03em] text-neutral-950 ${
          compact ? "text-xl" : "text-2xl sm:text-3xl"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-neutral-500">{description}</p>
      ) : null}
    </div>
  );
}

function ValueCard({
  icon,
  title,
  description
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-neutral-950">
          {icon}
        </span>
        {title}
      </div>
      <p className="mt-3 text-sm leading-6 text-white/62">{description}</p>
    </div>
  );
}

function ProductCategoryCard({
  product,
  caseCount
}: {
  product: CrystalProduct;
  caseCount: number;
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group overflow-hidden rounded-[1.5rem] border border-black/10 bg-white/82 shadow-[0_10px_34px_rgba(11,30,28,0.07)] transition hover:-translate-y-1 hover:shadow-[0_18px_52px_rgba(11,30,28,0.11)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-base font-semibold text-neutral-950">
              <Gem className="h-4 w-4 text-teal-700" aria-hidden="true" />
              {product.name}
            </div>
            <div className="mt-1 text-xs font-medium text-neutral-500">
              {product.englishName}
            </div>
          </div>
          <div className="rounded-full bg-teal-950 px-3 py-1 text-xs font-semibold text-white">
            {caseCount}
          </div>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-600">
          {product.description}
        </p>
        <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-teal-800">
          查看材质专题
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}

function ModelBadges() {
  return (
    <>
      {supportedModelLabels.map((model) => (
        <span
          key={model}
          className="rounded-full border border-black/10 bg-white/80 px-3 py-1.5 text-xs font-medium text-neutral-600"
        >
          {model}
        </span>
      ))}
    </>
  );
}
