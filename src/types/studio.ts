export type StudioModuleId =
  | "subjects"
  | "styles"
  | "materials"
  | "scenes"
  | "cameras"
  | "lighting"
  | "purposes";

export type StudioOption = {
  id: string;
  zh: string;
  en: string;
};

export type SubjectOption = StudioOption & {
  categoryId: string;
};

export type SubjectCategory = {
  id: string;
  zh: string;
  en: string;
  items: SubjectOption[];
};

export type StudioRules = {
  subjects: SubjectCategory[];
  styles: StudioOption[];
  materials: StudioOption[];
  scenes: StudioOption[];
  cameras: StudioOption[];
  lighting: StudioOption[];
  purposes: StudioOption[];
};

export type SelectionState = Record<StudioModuleId, string[]>;

export type SelectedTag = {
  moduleId: StudioModuleId;
  moduleLabel: string;
  option: SubjectOption | StudioOption;
  categoryLabel?: string;
};

export type GeneratedStudioPrompt = {
  chinese: string;
  english: string;
  midjourney: string;
  flux: string;
  gptImage: string;
};

export type StudioRecord = {
  id: string;
  createdAt: string;
  title: string;
  selection: SelectionState;
  outputs: GeneratedStudioPrompt;
};
