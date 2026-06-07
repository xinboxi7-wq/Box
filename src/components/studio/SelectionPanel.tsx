import { Shuffle, Sparkles, Trash2, Wand2, X } from "lucide-react";
import {
  currentCombinationCount,
  formatLargeNumber,
  fullCombinationCount,
  getSelectedTags
} from "@/lib/studio";
import type { SelectionState, StudioModuleId, StudioRules } from "@/types/studio";

type SelectionPanelProps = {
  rules: StudioRules;
  selection: SelectionState;
  onGenerate: () => void;
  onRandomInspiration: () => void;
  onRandomGenerate: () => void;
  onRemove: (moduleId: StudioModuleId, optionId: string) => void;
  onClear: () => void;
};

export function SelectionPanel({
  rules,
  selection,
  onGenerate,
  onRandomInspiration,
  onRandomGenerate,
  onRemove,
  onClear
}: SelectionPanelProps) {
  const selectedTags = getSelectedTags(rules, selection);
  const hasSubject = selection.subjects.length > 0;
  const selectedCount = selectedTags.length;
  const currentCount = currentCombinationCount(selection);
  const fullCount = fullCombinationCount(rules);

  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
            Composition
          </p>
          <h2 className="mt-1 text-lg font-semibold text-neutral-950">组合控制台</h2>
        </div>
        <button
          type="button"
          title="清空组合"
          aria-label="清空组合"
          onClick={onClear}
          className="grid h-9 w-9 place-items-center rounded-full border border-neutral-200 text-neutral-500 transition hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Metric label="已选" value={`${selectedCount}`} />
        <Metric label="当前组合" value={formatLargeNumber(currentCount)} />
        <Metric label="全库规模" value={formatLargeNumber(fullCount)} />
      </div>

      <div className="mt-4 min-h-28 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
        {selectedTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <button
                key={`${tag.moduleId}-${tag.option.id}`}
                type="button"
                title="移除"
                aria-label={`移除 ${tag.option.zh}`}
                onClick={() => onRemove(tag.moduleId, tag.option.id)}
                className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950"
              >
                <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-500">
                  {tag.moduleLabel}
                </span>
                <span className="truncate">{tag.option.zh}</span>
                <X className="h-3.5 w-3.5 flex-none" aria-hidden="true" />
              </button>
            ))}
          </div>
        ) : (
          <div className="grid min-h-20 place-items-center text-sm text-neutral-400">
            从主体物开始选择
          </div>
        )}
      </div>

      {!hasSubject ? (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
          主体物为必选项。先选择至少一个主体物，再生成平台提示词。
        </div>
      ) : null}

      <div className="mt-4 grid gap-2">
        <button
          type="button"
          disabled={!hasSubject}
          onClick={onGenerate}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-neutral-950 px-4 text-sm font-medium text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          <Wand2 className="h-4 w-4" aria-hidden="true" />
          生成提示词
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onRandomInspiration}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            随机灵感
          </button>
          <button
            type="button"
            onClick={onRandomGenerate}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
          >
            <Shuffle className="h-4 w-4" aria-hidden="true" />
            一键随机
          </button>
        </div>
      </div>
    </section>
  );
}

type MetricProps = {
  label: string;
  value: string;
};

function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
      <div className="truncate text-sm font-semibold text-neutral-950">{value}</div>
      <div className="mt-0.5 text-xs text-neutral-400">{label}</div>
    </div>
  );
}
