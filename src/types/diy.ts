export type RuleGroupId = "styles" | "materials" | "scenes" | "cameras" | "lighting";

export type PromptRuleOption = {
  id: string;
  zh: string;
  en: string;
};

export type PromptRules = Record<RuleGroupId, PromptRuleOption[]>;

export type GeneratedPrompt = {
  chinese: string;
  english: string;
};
