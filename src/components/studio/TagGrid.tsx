import { Check, Search } from "lucide-react";
import {
  moduleConfigs,
  searchOptions
} from "@/lib/studio";
import type {
  SelectedTag,
  SelectionState,
  StudioModuleId,
  StudioOption,
  StudioRules,
  SubjectOption
} from "@/types/studio";

type TagGridProps = {
  activeModule: StudioModuleId;
  activeSubjectCategory: string;
  query: string;
  rules: StudioRules;
  selection: SelectionState;
  onSubjectCategoryChange: (categoryId: string) => void;
  onToggle: (moduleId: StudioModuleId, optionId: string) => void;
};

export function TagGrid({
  activeModule,
  activeSubjectCategory,
  query,
  rules,
  selection,
  onSubjectCategoryChange,
  onToggle
}: TagGridProps) {
  const searching = query.trim().length > 0;
  const searchResults = searching ? searchOptions(rules, query) : [];
  const activeConfig = moduleConfigs.find((item) => item.id === activeModule);

  const visibleTags: SelectedTag[] = searching
    ? searchResults
    : getVisibleTags(rules, activeModule, activeSubjectCategory);

  return (
    <section className="flex h-[72vh] min-h-[620px] flex-col rounded-lg border border-neutral-200 bg-white shadow-sm lg:h-[calc(100vh-112px)]">
      <div className="border-b border-neutral-200 px-4 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
              {searching ? "Global Search" : activeConfig?.enLabel}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-neutral-950">
              {searching ? "搜索全部标签" : activeConfig?.label}
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-500">
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            {visibleTags.length} 个结果
          </div>
        </div>

        {!searching && activeModule === "subjects" ? (
          <div className="mt-4 flex overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="inline-flex min-w-max gap-1 rounded-lg bg-neutral-100 p-1">
              <SubjectCategoryButton
                active={activeSubjectCategory === "all"}
                label="全部"
                count={rules.subjects.reduce(
                  (sum, category) => sum + category.items.length,
                  0
                )}
                onClick={() => onSubjectCategoryChange("all")}
              />
              {rules.subjects.map((category) => (
                <SubjectCategoryButton
                  key={category.id}
                  active={activeSubjectCategory === category.id}
                  label={category.zh}
                  count={category.items.length}
                  onClick={() => onSubjectCategoryChange(category.id)}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        {visibleTags.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {visibleTags.map((tag) => (
              <TagButton
                key={`${tag.moduleId}-${tag.option.id}`}
                tag={tag}
                selected={selection[tag.moduleId].includes(tag.option.id)}
                onToggle={() => onToggle(tag.moduleId, tag.option.id)}
              />
            ))}
          </div>
        ) : (
          <div className="grid h-full min-h-80 place-items-center rounded-lg border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center">
            <div>
              <p className="text-base font-semibold text-neutral-950">
                没有匹配标签
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                换一个关键词，或切换到其他模块继续组合。
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

type TagButtonProps = {
  tag: SelectedTag;
  selected: boolean;
  onToggle: () => void;
};

function TagButton({ tag, selected, onToggle }: TagButtonProps) {
  const config = moduleConfigs.find((item) => item.id === tag.moduleId);

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={`group min-h-20 rounded-lg border p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 ${
        selected
          ? "border-neutral-950 bg-neutral-950 text-white shadow-sm"
          : "border-neutral-200 bg-neutral-50 text-neutral-800 hover:border-neutral-400 hover:bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="min-w-0">
          <span className="block text-sm font-semibold leading-5">
            {tag.option.zh}
          </span>
          <span
            className={`mt-1 block text-xs leading-4 ${
              selected ? "text-white/60" : "text-neutral-500"
            }`}
          >
            {tag.option.en}
          </span>
        </span>
        <span
          className={`grid h-5 w-5 flex-none place-items-center rounded-full border ${
            selected
              ? "border-white/20 bg-white text-neutral-950"
              : "border-neutral-300 bg-white text-transparent group-hover:text-neutral-400"
          }`}
        >
          <Check className="h-3 w-3" aria-hidden="true" />
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: config?.accent }}
        />
        <span className={selected ? "text-xs text-white/45" : "text-xs text-neutral-400"}>
          {tag.categoryLabel ?? config?.shortLabel}
        </span>
      </div>
    </button>
  );
}

type SubjectCategoryButtonProps = {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
};

function SubjectCategoryButton({
  active,
  label,
  count,
  onClick
}: SubjectCategoryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition ${
        active
          ? "bg-white text-neutral-950 shadow-sm"
          : "text-neutral-500 hover:bg-white/70 hover:text-neutral-950"
      }`}
    >
      {label}
      <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[11px] text-neutral-500">
        {count}
      </span>
    </button>
  );
}

function getVisibleTags(
  rules: StudioRules,
  activeModule: StudioModuleId,
  activeSubjectCategory: string
): SelectedTag[] {
  const config = moduleConfigs.find((item) => item.id === activeModule);

  if (activeModule === "subjects") {
    return rules.subjects
      .filter(
        (category) =>
          activeSubjectCategory === "all" || category.id === activeSubjectCategory
      )
      .flatMap((category) =>
        category.items.map((option) => ({
          moduleId: "subjects" as const,
          moduleLabel: "主体",
          option,
          categoryLabel: category.zh
        }))
      );
  }

  return (rules[activeModule] as Array<StudioOption | SubjectOption>).map(
    (option) => ({
      moduleId: activeModule,
      moduleLabel: config?.shortLabel ?? "",
      option
    })
  );
}
