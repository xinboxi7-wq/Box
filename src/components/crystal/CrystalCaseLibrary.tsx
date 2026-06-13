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
import {
  getCrystalCasesBySlugs,
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
    const searchedCases = searchCrystalCases(query, caseViewCases);

    if (activeMaterialFilter === allMaterialFilterId) {
      return searchedCases;
    }

    return searchedCases.filter(
      (caseItem) => caseItem.productId === activeMaterialFilter
    );
  }, [activeMaterialFilter, caseViewCases, query]);
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

  return (
    <main className="min-h-screen text-neutral-950">
      <a href="#cases" className="skip-link">
        跳到全部商业案例
      </a>
      <header className="sticky top-0 z-40 border-b border-black/5 bg-[#fbfaf7]/86 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
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
            className="hidden items-center gap-1 rounded-full border border-black/10 bg-white/70 p-1 text-sm font-medium text-neutral-600 shadow-sm md:flex"
          >
            <NavPill href="#cases">浏览案例</NavPill>
            <NavPill href="#products">按材质选</NavPill>
            <NavPill href="#why">为什么用</NavPill>
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
          <MobileNavLink href="#cases" onClick={() => setMobileMenuOpen(false)}>
            浏览全部案例
          </MobileNavLink>
          <MobileNavLink href="#products" onClick={() => setMobileMenuOpen(false)}>
            按材质选择
          </MobileNavLink>
          <MobileNavLink href="#why" onClick={() => setMobileMenuOpen(false)}>
            为什么使用
          </MobileNavLink>
          <MobileNavLink href="#favorites" onClick={() => setMobileMenuOpen(false)}>
            收藏案例 {favoriteIds.length}
          </MobileNavLink>
        </nav>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 pb-8 pt-6 sm:px-6 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:px-8 lg:pt-10">
        <div className="flex flex-col justify-between rounded-[2rem] border border-black/10 bg-[#fbfaf7]/86 p-5 shadow-[0_18px_70px_rgba(23,23,23,0.08)] sm:p-7 lg:min-h-[34rem]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-700" />
              水晶手串 AI 商业视觉案例库
            </div>
            <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-[0.96] tracking-[-0.04em] text-neutral-950 sm:text-6xl lg:text-7xl">
              水晶手串 AI 商业视觉案例库
            </h1>
            <p
              lang="en"
              className="mt-4 max-w-xl text-sm font-medium leading-6 text-neutral-500 sm:text-base"
            >
              Crystal visual cases and reusable prompts for commercial sellers.
            </p>
            <p className="mt-5 max-w-xl text-base leading-7 text-neutral-600">
              面向水晶商家、小红书卖家和电商运营，整理可直接复用的商品图、种草图、品牌广告图与礼赠场景 Prompt。
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
              <HeroMetric value={String(cases.length)} label="商用案例" />
              <HeroMetric value={String(products.length)} label="水晶材质" />
              <HeroMetric value={String(styleCount)} label="拍摄风格" />
              <HeroMetric value="3" label="模型 Prompt" />
            </div>
          </div>

          <div className="mt-8 grid gap-3">
            <SearchBox query={query} onQueryChange={setQuery} />
            <ol className="grid grid-cols-2 gap-2 text-xs font-semibold text-neutral-600 sm:grid-cols-4 lg:grid-cols-2">
              {["选水晶材质", "挑商业风格", "打开案例", "复制 Prompt"].map(
                (label, index) => (
                  <li
                    key={label}
                    className="rounded-full border border-black/10 bg-white px-3 py-1.5"
                  >
                    {index + 1}. {label}
                  </li>
                )
              )}
            </ol>
          </div>
        </div>

        {heroCase && heroProduct ? (
          <HeroCase
            caseItem={heroCase}
            product={heroProduct}
            favorite={favoriteSet.has(heroCase.id)}
            onToggleFavorite={toggleFavorite}
          />
        ) : null}
      </section>

      <section
        id="products"
        className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
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
        className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="rounded-[2rem] border border-black/10 bg-neutral-950 p-5 text-white shadow-[0_24px_90px_rgba(23,23,23,0.2)] sm:p-7">
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
        className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="mb-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <SectionHeading
            eyebrow="案例库"
            title={query ? "搜索结果" : "全部商业案例"}
            description={`${activeCaseViewLabel} · 当前材质：${activeMaterialName}，共 ${visibleCases.length} 个案例。`}
          />
          <div className="flex flex-wrap gap-1.5 lg:justify-end">
            <ModelBadges />
          </div>
        </div>

        <div className="mb-4 overflow-x-auto pb-1">
          <div className="flex min-w-max gap-2 sm:min-w-0 sm:flex-wrap">
            {caseViewOptions.map((option) => (
              <CaseViewButton
                key={option.id}
                active={activeCaseView === option.id}
                description={option.description}
                onClick={() => setActiveCaseView(option.id)}
              >
                {option.label}
              </CaseViewButton>
            ))}
          </div>
        </div>

        <div className="sticky top-16 z-20 mb-5 -mx-4 overflow-x-auto border-y border-black/5 bg-[#fbfaf7]/92 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
          <div className="flex min-w-max gap-2 sm:min-w-0 sm:flex-wrap">
            <MaterialFilterButton
              active={activeMaterialFilter === allMaterialFilterId}
              count={cases.length}
              onClick={() => setActiveMaterialFilter(allMaterialFilterId)}
            >
              全部
            </MaterialFilterButton>
            {materialFilters.map((product) => (
              <MaterialFilterButton
                key={product.id}
                active={activeMaterialFilter === product.id}
                count={productCaseCounts.get(product.id) ?? 0}
                onClick={() => setActiveMaterialFilter(product.id)}
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
                  onToggleFavorite={toggleFavorite}
                />
              );
            })}
          </div>
        )}
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <CrystalFavoritePanel
          favoriteCases={favoriteCases}
          onToggleFavorite={toggleFavorite}
          onClearFavorites={handleClearFavorites}
        />
      </section>
    </main>
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
  onQueryChange
}: {
  query: string;
  onQueryChange: (value: string) => void;
}) {
  return (
    <label className="flex h-12 items-center gap-3 rounded-full border border-black/10 bg-white px-4 shadow-sm">
      <Search className="h-4 w-4 text-neutral-400" aria-hidden="true" />
      <span className="sr-only">搜索案例</span>
      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="搜索紫水晶、白底、小红书、礼赠场景..."
        className="min-w-0 flex-1 bg-transparent text-sm text-neutral-950 outline-none placeholder:text-neutral-400"
      />
      {query ? (
        <button
          type="button"
          onClick={() => onQueryChange("")}
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
    <article className="group relative min-h-[30rem] overflow-hidden rounded-[2rem] border border-black/10 bg-neutral-950 shadow-[0_24px_90px_rgba(23,23,23,0.22)]">
      <Image
        src={caseImage}
        alt={caseItem.title}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 56vw"
        className="object-cover transition duration-700 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/76 via-black/18 to-transparent" />
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
        <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
          {caseItem.title}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-white/72">
          {caseItem.summary}
        </p>
        <Link
          href={`/case/${caseItem.slug}`}
          aria-label={`查看 ${caseItem.title} 的完整 Prompt 和视觉分析`}
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-100"
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
          ? "border-neutral-950 bg-neutral-950 text-white shadow-sm"
          : "border-black/10 bg-white/80 text-neutral-600 hover:border-neutral-300 hover:text-neutral-950"
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

function CaseViewButton({
  active,
  children,
  description,
  onClick
}: {
  active: boolean;
  children: ReactNode;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={description}
      className={`inline-flex h-10 items-center rounded-full border px-4 text-sm font-semibold transition ${
        active
          ? "border-teal-800 bg-teal-800 text-white shadow-sm"
          : "border-black/10 bg-white/80 text-neutral-600 hover:border-neutral-300 hover:text-neutral-950"
      }`}
    >
      {children}
    </button>
  );
}

function HeroMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/86 px-4 py-3 shadow-sm">
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
      className="group overflow-hidden rounded-[1.5rem] border border-black/10 bg-white/78 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_18px_60px_rgba(23,23,23,0.12)]"
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
          <div className="rounded-full bg-neutral-950 px-3 py-1 text-xs font-semibold text-white">
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
