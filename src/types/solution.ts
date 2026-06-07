export type PlatformOutputKey =
  | "chinese"
  | "english"
  | "midjourney"
  | "flux"
  | "gptImage"
  | "negative";

export type ProjectType = {
  id: string;
  name: string;
  description: string;
  recommendedDirections: string[];
};

export type CommercialGoal = {
  id: string;
  name: string;
  description: string;
  visualKeywords: string[];
  promptKeywords: string[];
};

export type VisualDirection = {
  id: string;
  title: string;
  description: string;
  bestFor: string[];
  composition: string;
  scene: string;
  cmf: string;
  lighting: string;
  camera: string;
  promptStyle: string;
};

export type PlatformRule = {
  intro: string;
  style: string;
  suffix: string;
};

export type SubjectDictionaryEntry = {
  zh: string;
  en: string;
  category: string;
  materialHintsZh: string[];
  materialHintsEn: string[];
  visualHintsZh: string[];
  visualHintsEn: string[];
  recommendedDirections: string[];
};

export type SolutionTemplate = {
  id: string;
  title: string;
  projectType: string;
  goal: string[];
  visualDirection: string;
  templateCategory?: string;
  suitableCategories?: string[];
  blockedCategories?: string[];
  suitableSubjects: string[];
  summary: string;
  commercialValue: string;
  concept: string;
  composition: string;
  scene: string;
  cmf: string;
  lighting: string;
  camera: string;
  negativePrompt: string;
  premiumLevel: "free" | "pro";
  recommendedPlatforms: string[];
};

export type ExampleCase = {
  subject: string;
  projectTypeId: string;
  goalIds: string[];
  keywords: string;
  title: string;
  note: string;
};

export type SolutionRules = {
  projectTypes: ProjectType[];
  commercialGoals: CommercialGoal[];
  visualDirections: VisualDirection[];
  platformRules: {
    midjourney: PlatformRule;
    flux: PlatformRule;
    gptImage: PlatformRule;
  };
  solutionTemplates: SolutionTemplate[];
  examples: ExampleCase[];
  pricing: {
    free: string[];
    pro: string[];
  };
};

export type ProjectBrief = {
  objectName: string;
  englishProductName?: string;
  projectType: string;
  commercialGoals: string[];
  keywords: string;
};

export type SolutionDirection = {
  id: string;
  title: string;
  summary: string;
  bestFor: string;
  suitableScenes: string[];
  visualFocus: string[];
  recommendedAspectRatio: string;
  platformLabels: string[];
  commercialValue: string;
  score: number;
  recommendedPlatforms: string[];
  template: SolutionTemplate;
};

export type UsageAdvice = {
  recommendedPlatforms: string[];
  aspectRatios: string[];
  suitableScenarios: string[];
  unsuitableScenarios: string[];
};

export type IterationAdvice = {
  tooMessy: string;
  unrealisticMaterial: string;
  weakSubject: string;
  cheapLook: string;
};

export type SolutionDetail = {
  id: string;
  createdAt: string;
  title: string;
  objectName: string;
  objectNameEn: string;
  projectTypeName: string;
  goalNames: string[];
  commercialPositioning: string;
  concept: string;
  composition: string;
  scene: string;
  cmf: string;
  lighting: string;
  camera: string;
  usageAdvice: UsageAdvice;
  iterationAdvice: IterationAdvice;
  outputs: Record<PlatformOutputKey, string>;
  templateId: string;
};

export type HistoryRecord = {
  id: string;
  createdAt: string;
  objectName: string;
  projectTypeName: string;
  goalNames: string[];
  solutionCount: number;
  brief: ProjectBrief;
};

export type FavoriteRecord = {
  id: string;
  createdAt: string;
  title: string;
  objectName: string;
  projectTypeName: string;
  outputs: Record<PlatformOutputKey, string>;
  detail: SolutionDetail;
};
