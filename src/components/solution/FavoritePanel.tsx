"use client";

import { Star, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/solution";
import type { FavoriteRecord } from "@/types/solution";

type FavoritePanelProps = {
  records: FavoriteRecord[];
  onOpen: (record: FavoriteRecord) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
};

export function FavoritePanel({
  records,
  onOpen,
  onDelete,
  onClear
}: FavoritePanelProps) {
  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-950">
          <Star className="h-4 w-4 text-amber-600" aria-hidden="true" />
          收藏组合
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">{records.length}/24</span>
          {records.length > 0 ? (
            <button
              type="button"
              onClick={onClear}
              className="rounded-full px-2 py-1 text-xs font-medium text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
            >
              清空
            </button>
          ) : null}
        </div>
      </div>

      {records.length === 0 ? (
        <p className="text-sm leading-6 text-neutral-500">
          还没有收藏方案。
          <br />
          收藏会保存完整方案包和平台 Prompt，适合后续复用。
        </p>
      ) : (
        <div className="grid gap-2">
          {records.map((record) => (
            <div
              key={record.id}
              className="flex items-start gap-2 rounded-lg border border-neutral-100 bg-neutral-50 p-3 transition hover:border-neutral-300 hover:bg-white"
            >
              <button
                type="button"
                onClick={() => onOpen(record)}
                className="min-w-0 flex-1 text-left focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2"
              >
                <div className="text-sm font-semibold text-neutral-950">
                  {record.title}
                </div>
                <div className="mt-1 text-xs leading-5 text-neutral-500">
                  {record.projectTypeName} · {formatDate(record.createdAt)}
                </div>
              </button>
              <button
                type="button"
                onClick={() => onDelete(record.id)}
                aria-label={`删除收藏：${record.title}`}
                className="rounded-full p-1.5 text-neutral-400 transition hover:bg-white hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
