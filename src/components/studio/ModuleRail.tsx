import { Box, Camera, Gem, Lamp, Layers3, Palette, Sofa } from "lucide-react";
import { getModuleCount, moduleConfigs } from "@/lib/studio";
import type { SelectionState, StudioModuleId, StudioRules } from "@/types/studio";

type ModuleRailProps = {
  activeModule: StudioModuleId;
  selection: SelectionState;
  rules: StudioRules;
  onChange: (moduleId: StudioModuleId) => void;
};

const iconMap = {
  subjects: Sofa,
  styles: Palette,
  materials: Gem,
  scenes: Box,
  cameras: Camera,
  lighting: Lamp,
  purposes: Layers3
};

export function ModuleRail({
  activeModule,
  selection,
  rules,
  onChange
}: ModuleRailProps) {
  return (
    <aside className="rounded-lg border border-neutral-200 bg-white p-2 shadow-sm">
      <div className="mb-2 px-2 py-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-400">
          Libraries
        </p>
      </div>
      <div className="grid gap-1">
        {moduleConfigs.map((module) => {
          const Icon = iconMap[module.id];
          const active = activeModule === module.id;
          const selectedCount = selection[module.id].length;
          const total = getModuleCount(rules, module.id);

          return (
            <button
              key={module.id}
              type="button"
              onClick={() => onChange(module.id)}
              className={`flex min-h-14 items-center gap-3 rounded-lg px-3 text-left transition focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 ${
                active
                  ? "bg-neutral-950 text-white"
                  : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
              }`}
            >
              <span
                className={`grid h-9 w-9 place-items-center rounded-md ${
                  active ? "bg-white/10" : "bg-neutral-100"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  {module.label}
                  {module.required ? (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                        active ? "bg-white/15 text-white" : "bg-neutral-200 text-neutral-600"
                      }`}
                    >
                      必选
                    </span>
                  ) : null}
                </span>
                <span
                  className={`mt-0.5 block text-xs ${
                    active ? "text-white/55" : "text-neutral-400"
                  }`}
                >
                  {selectedCount}/{total}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
