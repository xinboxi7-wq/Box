import { Clock, RotateCcw, Star } from "lucide-react";
import type { ReactNode } from "react";
import type { StudioModuleId, StudioRecord } from "@/types/studio";

type RecentTag = {
  moduleId: StudioModuleId;
  optionId: string;
  label: string;
  moduleLabel: string;
};

type ActivityPanelProps = {
  recentTags: RecentTag[];
  favorites: StudioRecord[];
  history: StudioRecord[];
  onRestore: (record: StudioRecord) => void;
  onToggleRecent: (tag: RecentTag) => void;
};

export function ActivityPanel({
  recentTags,
  favorites,
  history,
  onRestore,
  onToggleRecent
}: ActivityPanelProps) {
  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="grid gap-5">
        <div>
          <PanelTitle icon={<Clock className="h-4 w-4" />} title="最近使用" />
          {recentTags.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {recentTags.map((tag) => (
                <button
                  key={`${tag.moduleId}-${tag.optionId}`}
                  type="button"
                  onClick={() => onToggleRecent(tag)}
                  className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs text-neutral-600 transition hover:border-neutral-400 hover:bg-white hover:text-neutral-950"
                >
                  <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] text-neutral-400">
                    {tag.moduleLabel}
                  </span>
                  <span className="truncate">{tag.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <EmptyLine text="还没有最近标签" />
          )}
        </div>

        <RecordList
          icon={<Star className="h-4 w-4" />}
          title="收藏组合"
          records={favorites}
          emptyText="还没有收藏"
          onRestore={onRestore}
        />

        <RecordList
          icon={<RotateCcw className="h-4 w-4" />}
          title="历史记录"
          records={history}
          emptyText="生成后会自动记录"
          onRestore={onRestore}
        />
      </div>
    </section>
  );
}

type RecordListProps = {
  icon: ReactNode;
  title: string;
  records: StudioRecord[];
  emptyText: string;
  onRestore: (record: StudioRecord) => void;
};

function RecordList({
  icon,
  title,
  records,
  emptyText,
  onRestore
}: RecordListProps) {
  return (
    <div>
      <PanelTitle icon={icon} title={title} />
      {records.length > 0 ? (
        <div className="mt-3 grid gap-2">
          {records.slice(0, 5).map((record) => (
            <button
              key={record.id}
              type="button"
              onClick={() => onRestore(record)}
              className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-left transition hover:border-neutral-400 hover:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
            >
              <div className="truncate text-sm font-semibold text-neutral-950">
                {record.title}
              </div>
              <div className="mt-1 text-xs text-neutral-400">
                {formatDate(record.createdAt)}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <EmptyLine text={emptyText} />
      )}
    </div>
  );
}

function PanelTitle({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-neutral-950">
      <span className="text-neutral-400">{icon}</span>
      {title}
    </div>
  );
}

function EmptyLine({ text }: { text: string }) {
  return (
    <div className="mt-3 rounded-lg border border-dashed border-neutral-200 bg-neutral-50 px-3 py-4 text-center text-sm text-neutral-400">
      {text}
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
