"use client";

import Image from "next/image";
import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  Gem,
  Layers3,
  Menu,
  Search,
  Star,
  X
} from "lucide-react";
import {
  getCrystalCasesBySlugs,
  getCrystalProductById,
  getFavoriteCrystalCases,
  latestCaseSlugs,
  popularCaseSlugs,
  supportedModelLabels,
  searchCrystalCases
} from "@/lib/crystal-cases";
import type { CrystalCase, CrystalProduct } from "@/types/crystal";
import { CrystalCaseCard } from "./CrystalCaseCard";
import { CrystalFavoritePanel } from "./CrystalFavoritePanel";
import { useCrystalFavorites } from "./useCrystalFavorites";

type CrystalCaseLibraryProps = {
  products: CrystalProduct[];
  cases: CrystalCase[];
};

const materialFilterProductIds = ["amethyst", "citrine", "obsidian"] as const;
const allMaterialFilterId = "all";

export function CrystalCaseLibrary({
  products,
  cases
}: CrystalCaseLibraryProps) {
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMaterialFilter, setActiveMaterialFilter] =
    useState<string>(allMaterialFilterId);
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
  const visibleCases = useMemo(() => {
    const searchedCases = searchCrystalCases(query, cases);

    if (activeMaterialFilter === allMaterialFilterId) {
      return searchedCases;
    }

    return searchedCases.filter(
      (caseItem) => caseItem.productId === activeMaterialFilter
    );
  }, [activeMaterialFilter, cases, query]);
  const activeMaterialName = useMemo(() => {
    if (activeMaterialFilter === allMaterialFilterId) {
      return "全部";
    }

    return (
      materialFilters.find((product) => product.id === activeMaterialFilter)
        ?.name ?? "全部"
    );
  }, [activeMaterialFilter, materialFilters]);
  const favoriteCases = useMemo(
    () => getFavoriteCrystalCases(favoriteIds),
    [favoriteIds]
  );

  const handleClearFavorites = () => {
    if (window.confirm("确定清空全部收藏案例吗？")) {
      clearFavorites();
    }
  };

  return (
    <main className="min-h-screen bg-[#F6F7F4] text-neutral-950">
      <section className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <header className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,0.56fr)] lg:items-end">
          <div>
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
                Crystal Bracelet Case Library
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen((current) => !current)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav"
                aria-label={mobileMenuOpen ? "关闭导航菜单" : "打开导航菜单"}
                className="grid h-10 w-10 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 sm:hidden"
              >
                {mobileMenuOpen ? (
                  <X className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Menu className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
            <h1 className="mt-3 text-[1.85rem] font-semibold leading-[1.04] tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
              <span className="block">Crystal Bracelet Visual Library</span>
              <span className="mt-1 block text-2xl leading-tight sm:text-3xl lg:text-4xl">
                水晶手串 AI 商业视觉案例库
              </span>
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600 sm:text-base sm:leading-7">
              面向水晶商家、小红书卖家和电商运营，整理可直接复用的商品图、种草图、品牌广告图与礼赠场景 Prompt。
            </p>
            <div className="mt-4 grid max-w-2xl grid-cols-2 gap-2 sm:grid-cols-4">
              <HeroMetric value={String(cases.length)} label="商用案例" />
              <HeroMetric value={String(products.length)} label="水晶材质" />
              <HeroMetric value={String(styleCount)} label="拍摄风格" />
              <HeroMetric value="3" label="模型 Prompt" />
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-neutral-600">
              <span className="rounded-full bg-white px-3 py-1.5 shadow-sm">
                可复制 Prompt
              </span>
              <span className="rounded-full bg-white px-3 py-1.5 shadow-sm">
                可替换材质
              </span>
              <span className="rounded-full bg-white px-3 py-1.5 shadow-sm">
                含构图与灯光分析
              </span>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-lg border border-neutral-200 bg-white p-2 shadow-sm">
              <label className="flex min-h-11 items-center gap-2 px-3">
                <Search className="h-4 w-4 text-neutral-400" aria-hidden="true" />
                <span className="sr-only">搜索案例</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="搜索紫水晶、白底、小红书、奢侈品广告..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-neutral-950 outline-none placeholder:text-neutral-400"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="grid h-8 w-8 place-items-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-950"
                    aria-label="清空搜索"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : null}
              </label>
            </div>
            <div className="hidden gap-2 sm:flex sm:flex-wrap">
              <Link
                href="#cases"
                className="inline-flex h-10 items-center justify-center rounded-full bg-neutral-950 px-4 text-sm font-medium text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
              >
                全部案例
              </Link>
              <Link
                href="#products"
                className="inline-flex h-10 items-center justify-center rounded-full border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
              >
                产品分类
              </Link>
              <Link
                href="#why"
                className="inline-flex h-10 items-center justify-center rounded-full border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
              >
                使用价值
              </Link>
              <Link
                href="#favorites"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
              >
                <Star className="h-4 w-4" aria-hidden="true" />
                收藏 {favoriteIds.length}
              </Link>
            </div>
            <nav
              id="mobile-nav"
              className={`gap-2 rounded-xl border border-neutral-200 bg-white p-2 shadow-sm transition sm:hidden ${
                mobileMenuOpen ? "grid" : "hidden"
              }`}
            >
              <MobileNavLink href="#cases" onClick={() => setMobileMenuOpen(false)}>
                全部案例
              </MobileNavLink>
              <MobileNavLink href="#products" onClick={() => setMobileMenuOpen(false)}>
                产品分类
              </MobileNavLink>
              <MobileNavLink href="#why" onClick={() => setMobileMenuOpen(false)}>
                使用价值
              </MobileNavLink>
              <MobileNavLink href="#favorites" onClick={() => setMobileMenuOpen(false)}>
                收藏案例 {favoriteIds.length}
              </MobileNavLink>
            </nav>
          </div>
        </header>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.52fr)_minmax(22rem,0.8fr)]">
          <section>
            <SectionHeading eyebrow="Latest cases" title="最新案例" />
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {latestCases.map((caseItem) => {
                const product = getCrystalProductById(caseItem.productId);

                if (!product) {
                  return null;
                }

                return (
                  <div
                    key={caseItem.id}
                    className="min-w-0"
                  >
                    <CrystalCaseCard
                      caseItem={caseItem}
                      product={product}
                      favorite={favoriteSet.has(caseItem.id)}
                      onToggleFavorite={toggleFavorite}
                      variant="featured"
                    />
                  </div>
                );
              })}
            </div>
          </section>

          <div className="grid gap-4">
            <section>
              <SectionHeading eyebrow="Popular" title="热门案例" />
              <div className="mt-3 grid gap-2">
                {popularCases.map((caseItem) => {
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
                      variant="compact"
                    />
                  );
                })}
              </div>
            </section>

            <section id="products">
              <SectionHeading eyebrow="Products" title="产品分类" />
              <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
                {products.map((product) => (
                  <ProductCategoryCard
                    key={product.id}
                    product={product}
                    caseCount={productCaseCounts.get(product.id) ?? 0}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>

      <section
        id="why"
        className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
      >
        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">
                Why this library
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-950">
                为什么使用本案例库
              </h2>
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

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <ValueCard
              icon={<ClipboardCheck className="h-4 w-4" aria-hidden="true" />}
              title="Prompt 可直接复用"
              description="每个案例都整理为完整中文 Prompt，适合快速迁移到 GPT Image、Midjourney 和 Flux。"
            />
            <ValueCard
              icon={<Layers3 className="h-4 w-4" aria-hidden="true" />}
              title="不只给关键词"
              description="同步拆解构图、灯光和商业用途，帮助你理解为什么这样写能更稳定出图。"
            />
            <ValueCard
              icon={<BadgeCheck className="h-4 w-4" aria-hidden="true" />}
              title="围绕商业转化"
              description="按奢侈品广告、小红书种草、电商白底和礼赠场景四类真实使用场景组织案例。"
            />
          </div>
        </div>
      </section>

      <section
        id="cases"
        className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="All crystal cases"
            title={query ? "搜索结果" : "全部案例"}
          />
          <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-500 shadow-sm">
            {visibleCases.length} 个案例
          </span>
        </div>

        <div className="mb-5 overflow-x-auto pb-1">
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
              className="inline-flex h-9 cursor-not-allowed items-center rounded-full border border-neutral-200 bg-neutral-100 px-4 text-sm font-medium text-neutral-400"
            >
              更多材质敬请期待...
            </button>
          </div>
          <p className="mt-2 text-xs leading-5 text-neutral-500">
            当前筛选：{activeMaterialName}，可与搜索关键词组合使用。
          </p>
        </div>

        {visibleCases.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-300 bg-white/70 p-6 text-sm leading-6 text-neutral-500">
            没有找到匹配案例。可以搜索「紫水晶」「黄水晶」「黑曜石」「白底」「小红书」「奢侈品广告」。
          </div>
        ) : (
          <div
            key={`${activeMaterialFilter}-${query}`}
            className="grid gap-5 animate-[case-list-fade-in_260ms_ease-out] motion-reduce:animate-none lg:grid-cols-2"
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
      className={`inline-flex h-9 items-center rounded-full border px-4 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 ${
        active
          ? "border-neutral-950 bg-neutral-950 text-white shadow-sm"
          : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-950"
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
    <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2 shadow-sm">
      <div className="text-lg font-semibold leading-none text-neutral-950">
        {value}
      </div>
      <div className="mt-1 text-xs font-medium text-neutral-500">{label}</div>
    </div>
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
      className="flex h-11 items-center justify-between rounded-lg px-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 hover:text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
    >
      {children}
      <span className="text-neutral-300">#</span>
    </Link>
  );
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-950">
        {title}
      </h2>
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
    <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-neutral-950">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-teal-700 shadow-sm">
          {icon}
        </span>
        {title}
      </div>
      <p className="mt-3 text-sm leading-6 text-neutral-600">{description}</p>
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
      className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-2 shadow-sm transition hover:border-neutral-300 hover:shadow-soft-panel focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
    >
      <Image
        src={product.image}
        alt={product.name}
        width={160}
        height={128}
        className="h-16 w-20 flex-none rounded-md object-cover sm:h-20 sm:w-24"
      />
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-neutral-950">
          <Gem className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
          {product.name}
        </div>
        <div className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-500">
          {product.tags.join(" / ")}
        </div>
        <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-teal-700">
          {caseCount} 个案例
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}
