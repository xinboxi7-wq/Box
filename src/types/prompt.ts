export type PromptItem = {
  id: string;
  title: string;
  scene: string;
  chinese: string;
  english: string;
};

export type PromptCategory = {
  id: string;
  name: string;
  description: string;
  accent: string;
  prompts: PromptItem[];
};

export type FlatPrompt = PromptItem & {
  categoryId: string;
  categoryName: string;
  categoryAccent: string;
};
