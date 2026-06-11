export type CrystalProduct = {
  id: string;
  slug: string;
  name: string;
  englishName: string;
  mineral: string;
  description: string;
  image: string;
  materialSpecZh: string;
  materialSpecEn: string;
  colorSpecZh: string;
  colorSpecEn: string;
  textureSpecZh: string;
  textureSpecEn: string;
  tags: string[];
};

export type CrystalStyle = {
  id: string;
  name: string;
  description: string;
  promptStyleZh: string;
  promptStyleEn: string;
};

export type LocalizedRuleList = {
  zh: string[];
  en: string[];
};

export type CrystalBraceletRules = {
  id: string;
  name: string;
  description: string;
  productStructure: LocalizedRuleList;
  geometry: LocalizedRuleList;
  material: LocalizedRuleList;
  styleConsistency: {
    allowedChangesZh: string[];
    allowedChangesEn: string[];
    lockedElementsZh: string[];
    lockedElementsEn: string[];
  };
  promptAppendixZh: string;
  promptAppendixEn: string;
  negativeAppendix: string;
};

export type CrystalBraceletSize = {
  id: string;
  promptLabelZh: string;
  promptLabelEn: string;
  internalMm: number;
  internalVisualBeadRange: string;
};

export type CrystalCase = {
  id: string;
  slug: string;
  productId: string;
  styleId: string;
  title: string;
  productName: string;
  styleName: string;
  image: string;
  summary: string;
  tags: string[];
  prompt: string;
  promptEn: string;
  negativePrompt: string;
  compositionAnalysis: string;
  lightingAnalysis: string;
  commercialUse: string;
};

export type CrystalCaseLibraryData = {
  braceletRules: CrystalBraceletRules;
  defaultBraceletSize: string;
  braceletSizes: CrystalBraceletSize[];
  products: CrystalProduct[];
  styles: CrystalStyle[];
  cases: CrystalCase[];
};
