import type {
  GeneratedStudioPrompt,
  SelectedTag,
  SelectionState,
  StudioModuleId,
  StudioOption,
  StudioRecord,
  StudioRules,
  SubjectOption
} from "@/types/studio";

export const moduleConfigs: Array<{
  id: StudioModuleId;
  label: string;
  shortLabel: string;
  enLabel: string;
  accent: string;
  required?: boolean;
}> = [
  {
    id: "subjects",
    label: "主体物",
    shortLabel: "主体",
    enLabel: "Subjects",
    accent: "#111111",
    required: true
  },
  {
    id: "styles",
    label: "风格库",
    shortLabel: "风格",
    enLabel: "Styles",
    accent: "#3E8B82"
  },
  {
    id: "materials",
    label: "材质库",
    shortLabel: "材质",
    enLabel: "Materials",
    accent: "#B75F4B"
  },
  {
    id: "scenes",
    label: "场景库",
    shortLabel: "场景",
    enLabel: "Scenes",
    accent: "#7E8F4F"
  },
  {
    id: "cameras",
    label: "镜头库",
    shortLabel: "镜头",
    enLabel: "Camera",
    accent: "#4B7DB7"
  },
  {
    id: "lighting",
    label: "灯光库",
    shortLabel: "灯光",
    enLabel: "Lighting",
    accent: "#D49B43"
  },
  {
    id: "purposes",
    label: "用途库",
    shortLabel: "用途",
    enLabel: "Purpose",
    accent: "#6E6A9F"
  }
];

export const emptySelection: SelectionState = {
  subjects: [],
  styles: [],
  materials: [],
  scenes: [],
  cameras: [],
  lighting: [],
  purposes: []
};

export function getModuleCount(rules: StudioRules, moduleId: StudioModuleId) {
  if (moduleId === "subjects") {
    return rules.subjects.reduce((sum, category) => sum + category.items.length, 0);
  }

  return rules[moduleId].length;
}

export function getSelectedTags(
  rules: StudioRules,
  selection: SelectionState
): SelectedTag[] {
  const tags: SelectedTag[] = [];

  for (const config of moduleConfigs) {
    if (config.id === "subjects") {
      for (const category of rules.subjects) {
        for (const option of category.items) {
          if (selection.subjects.includes(option.id)) {
            tags.push({
              moduleId: "subjects",
              moduleLabel: config.shortLabel,
              option,
              categoryLabel: category.zh
            });
          }
        }
      }
      continue;
    }

    for (const option of rules[config.id]) {
      if (selection[config.id].includes(option.id)) {
        tags.push({
          moduleId: config.id,
          moduleLabel: config.shortLabel,
          option
        });
      }
    }
  }

  return tags;
}

export function findOptionById(
  rules: StudioRules,
  moduleId: StudioModuleId,
  optionId: string
) {
  if (moduleId === "subjects") {
    for (const category of rules.subjects) {
      const option = category.items.find((item) => item.id === optionId);
      if (option) {
        return option;
      }
    }
    return undefined;
  }

  return rules[moduleId].find((option) => option.id === optionId);
}

export function buildStudioPrompt(
  rules: StudioRules,
  selection: SelectionState
): GeneratedStudioPrompt | null {
  const tags = getSelectedTags(rules, selection);
  const byModule = (moduleId: StudioModuleId) =>
    tags.filter((tag) => tag.moduleId === moduleId).map((tag) => tag.option);

  const subjects = byModule("subjects");
  if (subjects.length === 0) {
    return null;
  }

  const styles = byModule("styles");
  const materials = byModule("materials");
  const scenes = byModule("scenes");
  const cameras = byModule("cameras");
  const lighting = byModule("lighting");
  const purposes = byModule("purposes");

  const zh = {
    subjects: joinZh(subjects),
    styles: joinZh(styles),
    materials: joinZh(materials),
    scenes: joinZh(scenes),
    cameras: joinZh(cameras),
    lighting: joinZh(lighting),
    purposes: joinZh(purposes)
  };

  const en = {
    subjects: joinEn(subjects),
    styles: joinEn(styles),
    materials: joinEn(materials),
    scenes: joinEn(scenes),
    cameras: joinEn(cameras),
    lighting: joinEn(lighting),
    purposes: joinEn(purposes)
  };

  const chinese = [
    `主体物：${zh.subjects}。`,
    zh.styles ? `风格方向：${zh.styles}。` : "",
    zh.materials ? `材质与CMF：${zh.materials}。` : "",
    zh.scenes ? `场景环境：${zh.scenes}。` : "",
    zh.cameras ? `镜头与构图：${zh.cameras}。` : "",
    zh.lighting ? `灯光：${zh.lighting}。` : "",
    zh.purposes ? `用途：${zh.purposes}。` : "",
    "请生成专业级商业视觉，主体清晰，比例可信，材质响应真实，结构边缘干净，画面具有设计工具级精致感。避免低清晰度、错误文字、水印、多余logo、畸变结构、廉价质感、杂乱背景和不自然反射。"
  ]
    .filter(Boolean)
    .join("");

  const english = [
    `Subject: ${en.subjects}.`,
    en.styles ? `Style direction: ${en.styles}.` : "",
    en.materials ? `Materials and CMF: ${en.materials}.` : "",
    en.scenes ? `Scene: ${en.scenes}.` : "",
    en.cameras ? `Camera and composition: ${en.cameras}.` : "",
    en.lighting ? `Lighting: ${en.lighting}.` : "",
    en.purposes ? `Purpose: ${en.purposes}.` : "",
    "Create a professional commercial design visual with a clear subject, believable proportions, realistic material response, clean structural edges, and refined design-tool quality. Avoid low resolution, incorrect text, watermark, extra logos, distorted structure, cheap materials, cluttered background, and unnatural reflections."
  ]
    .filter(Boolean)
    .join(" ");

  const coreEnglish = [
    en.subjects,
    en.styles,
    en.materials,
    en.scenes,
    en.cameras,
    en.lighting,
    en.purposes
  ]
    .filter(Boolean)
    .join(", ");

  const midjourney = [
    coreEnglish,
    "professional product visualization, refined CMF details, clean composition, commercial design quality, realistic materials, no text, no watermark",
    "--ar 1:1 --style raw"
  ].join(", ");

  const flux = [
    `A high-fidelity image of ${en.subjects}.`,
    en.styles ? `Design style: ${en.styles}.` : "",
    en.materials ? `Use physically plausible materials: ${en.materials}.` : "",
    en.scenes ? `Place it in ${en.scenes}.` : "",
    en.cameras ? `Frame with ${en.cameras}.` : "",
    en.lighting ? `Lighting: ${en.lighting}.` : "",
    en.purposes ? `Optimized for ${en.purposes}.` : "",
    "Sharp details, coherent geometry, realistic CMF, premium commercial rendering, clean background control, no text, no watermark."
  ]
    .filter(Boolean)
    .join(" ");

  const gptImage = [
    `Create a polished professional image of ${en.subjects}.`,
    en.styles ? `Use ${en.styles} as the style direction.` : "",
    en.materials ? `Show these materials clearly: ${en.materials}.` : "",
    en.scenes ? `Set the image in ${en.scenes}.` : "",
    en.cameras ? `Use ${en.cameras}.` : "",
    en.lighting ? `Use ${en.lighting}.` : "",
    en.purposes ? `Make it suitable for ${en.purposes}.` : "",
    "Keep the image elegant, commercially usable, realistic in material behavior, and free of readable text, watermark, brand logos, distorted shapes, and visual clutter."
  ]
    .filter(Boolean)
    .join(" ");

  return {
    chinese,
    english,
    midjourney,
    flux,
    gptImage
  };
}

export function createStudioRecord(
  rules: StudioRules,
  selection: SelectionState,
  outputs: GeneratedStudioPrompt
): StudioRecord {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    title: createSelectionTitle(rules, selection),
    selection: cloneSelection(selection),
    outputs
  };
}

export function createSelectionTitle(
  rules: StudioRules,
  selection: SelectionState
) {
  const subjects = getSelectedTags(rules, selection)
    .filter((tag) => tag.moduleId === "subjects")
    .map((tag) => tag.option.zh);

  if (subjects.length === 0) {
    return "未命名组合";
  }

  return subjects.slice(0, 3).join("、");
}

export function cloneSelection(selection: SelectionState): SelectionState {
  return {
    subjects: [...selection.subjects],
    styles: [...selection.styles],
    materials: [...selection.materials],
    scenes: [...selection.scenes],
    cameras: [...selection.cameras],
    lighting: [...selection.lighting],
    purposes: [...selection.purposes]
  };
}

export function randomSelection(rules: StudioRules): SelectionState {
  return {
    subjects: pickMany(flattenSubjects(rules), 1).map((option) => option.id),
    styles: pickMany(rules.styles, randomBetween(1, 3)).map((option) => option.id),
    materials: pickMany(rules.materials, randomBetween(1, 3)).map(
      (option) => option.id
    ),
    scenes: pickMany(rules.scenes, 1).map((option) => option.id),
    cameras: pickMany(rules.cameras, 1).map((option) => option.id),
    lighting: pickMany(rules.lighting, 1).map((option) => option.id),
    purposes: pickMany(rules.purposes, 1).map((option) => option.id)
  };
}

export function currentCombinationCount(selection: SelectionState) {
  if (selection.subjects.length === 0) {
    return 0;
  }

  return moduleConfigs.reduce((total, config) => {
    const count = selection[config.id].length;
    return total * Math.max(1, count);
  }, 1);
}

export function fullCombinationCount(rules: StudioRules) {
  return (
    getModuleCount(rules, "subjects") *
    Math.max(1, rules.styles.length) *
    Math.max(1, rules.materials.length) *
    Math.max(1, rules.scenes.length) *
    Math.max(1, rules.cameras.length) *
    Math.max(1, rules.lighting.length) *
    Math.max(1, rules.purposes.length)
  );
}

export function formatLargeNumber(value: number) {
  if (value === 0) {
    return "0";
  }

  if (value >= 1_000_000_000) {
    return value.toExponential(2);
  }

  return new Intl.NumberFormat("zh-CN").format(value);
}

export function flattenSubjects(rules: StudioRules): SubjectOption[] {
  return rules.subjects.flatMap((category) => category.items);
}

export function searchOptions(
  rules: StudioRules,
  query: string
): SelectedTag[] {
  const keyword = query.trim().toLowerCase();
  if (!keyword) {
    return [];
  }

  const result: SelectedTag[] = [];
  for (const config of moduleConfigs) {
    if (config.id === "subjects") {
      for (const category of rules.subjects) {
        for (const option of category.items) {
          if (matchesOption(option, keyword) || category.zh.includes(keyword)) {
            result.push({
              moduleId: "subjects",
              moduleLabel: config.shortLabel,
              option,
              categoryLabel: category.zh
            });
          }
        }
      }
      continue;
    }

    for (const option of rules[config.id]) {
      if (matchesOption(option, keyword)) {
        result.push({
          moduleId: config.id,
          moduleLabel: config.shortLabel,
          option
        });
      }
    }
  }

  return result.slice(0, 160);
}

function joinZh(options: StudioOption[]) {
  return options.map((option) => option.zh).join("、");
}

function joinEn(options: StudioOption[]) {
  return options.map((option) => option.en).join(", ");
}

function matchesOption(option: StudioOption, keyword: string) {
  return (
    option.zh.toLowerCase().includes(keyword) ||
    option.en.toLowerCase().includes(keyword)
  );
}

function pickMany<T>(items: T[], count: number) {
  const source = [...items];
  const result: T[] = [];

  while (source.length > 0 && result.length < count) {
    const index = Math.floor(Math.random() * source.length);
    result.push(source.splice(index, 1)[0]);
  }

  return result;
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
