import randomSubjectsData from "@/data/random-subjects.json";
import type { ProjectBrief } from "@/types/solution";

export type RandomSubject = {
  zh: string;
  en: string;
  category: string;
  recommendedProjectType: string;
  recommendedGoals: string[];
  keywords: string[];
  allowedTemplateCategories?: string[];
  blockedTemplateCategories?: string[];
};

export type SubjectRecommendation = {
  projectType: string;
  commercialGoals: string[];
};

const randomSubjects = randomSubjectsData as RandomSubject[];

const projectTypeNameToId: Record<string, string> = {
  产品设计: "product-design",
  家具设计: "furniture-design",
  珠宝饰品: "jewelry-design",
  "CMF 设计": "cmf-design",
  电商主图: "ecommerce-main",
  品牌广告: "brand-ad",
  作品集展示: "portfolio",
  官网主视觉: "website-hero"
};

const goalNameToId: Record<string, string> = {
  高级感: "premium-feel",
  材质表达: "material-expression",
  结构展示: "structure-display",
  转化卖点: "conversion-selling",
  品牌大片: "brand-campaign",
  作品集质感: "portfolio-quality",
  生活方式场景: "lifestyle-scene",
  社交媒体传播: "social-spread"
};

const keywordRecommendationRules: Array<{
  keywords: string[];
  projectType: string;
  commercialGoals: string[];
}> = [
  {
    keywords: [
      "手串",
      "手链",
      "戒指",
      "项链",
      "耳环",
      "吊坠",
      "玉",
      "玛瑙",
      "珍珠",
      "翡翠",
      "水晶"
    ],
    projectType: "jewelry-design",
    commercialGoals: ["premium-feel", "material-expression"]
  },
  {
    keywords: ["椅", "沙发", "桌", "柜", "床", "书架", "茶几", "边几", "凳"],
    projectType: "furniture-design",
    commercialGoals: ["premium-feel", "material-expression"]
  },
  {
    keywords: [
      "耳机",
      "键盘",
      "鼠标",
      "显示器",
      "手机",
      "手表",
      "音箱",
      "投影仪",
      "充电宝"
    ],
    projectType: "product-design",
    commercialGoals: ["premium-feel", "structure-display"]
  },
  {
    keywords: ["香水", "口红", "精华", "面霜", "粉底", "护肤", "洗发水"],
    projectType: "brand-ad",
    commercialGoals: ["premium-feel", "brand-campaign"]
  },
  {
    keywords: ["礼盒", "包装", "纸袋", "包装盒", "包装瓶"],
    projectType: "brand-ad",
    commercialGoals: ["brand-campaign", "conversion-selling"]
  },
  {
    keywords: ["花瓶", "水杯", "保温杯", "香薰", "收纳", "摆件"],
    projectType: "product-design",
    commercialGoals: ["lifestyle-scene", "premium-feel"]
  },
  {
    keywords: ["落地灯", "台灯", "吊灯", "壁灯", "灯"],
    projectType: "furniture-design",
    commercialGoals: ["material-expression", "lifestyle-scene"]
  }
];

export function pickRandomSubject(excludedSubjects: string[] = []) {
  const excludedSet = new Set(excludedSubjects);
  const availableSubjects = randomSubjects.filter(
    (subject) => !excludedSet.has(subject.zh)
  );
  const pool = availableSubjects.length > 0 ? availableSubjects : randomSubjects;

  return pool[Math.floor(Math.random() * pool.length)];
}

export function createBriefFromRandomSubject(
  excludedSubjects: string[] = []
): ProjectBrief {
  const subject = pickRandomSubject(excludedSubjects);

  return {
    objectName: subject.zh,
    englishProductName: subject.en,
    projectType: projectTypeNameToId[subject.recommendedProjectType] ?? "product-design",
    commercialGoals: subject.recommendedGoals
      .map((goalName) => goalNameToId[goalName])
      .filter(Boolean)
      .slice(0, 2),
    keywords: subject.keywords.join("、")
  };
}

export function getSubjectRecommendation(objectName: string): SubjectRecommendation | null {
  const normalized = objectName.trim();

  if (!normalized) {
    return null;
  }

  const subject = randomSubjects.find(
    (item) =>
      normalized === item.zh ||
      normalized.includes(item.zh) ||
      (normalized.length >= 2 && item.zh.includes(normalized))
  );

  if (subject) {
    return {
      projectType: projectTypeNameToId[subject.recommendedProjectType] ?? "product-design",
      commercialGoals: subject.recommendedGoals
        .map((goalName) => goalNameToId[goalName])
        .filter(Boolean)
        .slice(0, 2)
    };
  }

  const rule = keywordRecommendationRules.find((item) =>
    item.keywords.some((keyword) => normalized.includes(keyword))
  );

  if (!rule) {
    return null;
  }

  return {
    projectType: rule.projectType,
    commercialGoals: rule.commercialGoals.slice(0, 2)
  };
}

export function getRandomSubjectCount() {
  return randomSubjects.length;
}
