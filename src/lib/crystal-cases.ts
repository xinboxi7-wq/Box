import crystalCaseData from "@/data/crystal-cases.json";
import type {
  CrystalBraceletSize,
  CrystalBraceletRules,
  CrystalCase,
  CrystalCaseLibraryData,
  CrystalProduct,
  CrystalStyle
} from "@/types/crystal";

const library = crystalCaseData as CrystalCaseLibraryData;

export const braceletRules: CrystalBraceletRules = library.braceletRules;
export const defaultBraceletSize: string = library.defaultBraceletSize;
export const braceletSizes: CrystalBraceletSize[] = library.braceletSizes;
export const crystalProducts: CrystalProduct[] = library.products;
export const crystalStyles: CrystalStyle[] = library.styles;
export const crystalCases: CrystalCase[] = library.cases.map(applyBraceletRules);
export const latestCaseSlugs = [
  "obsidian-gift",
  "citrine-gift",
  "amethyst-gift"
] as const;
export const popularCaseSlugs = [
  "amethyst-luxury",
  "citrine-luxury",
  "obsidian-lifestyle"
] as const;
export const supportedModelLabels = ["GPT Image", "Midjourney", "Flux"] as const;

export function getCrystalProductBySlug(slug: string) {
  return crystalProducts.find((product) => product.slug === slug) ?? null;
}

export function getCrystalProductById(id: string) {
  return crystalProducts.find((product) => product.id === id) ?? null;
}

export function getCrystalStyleById(id: string) {
  return crystalStyles.find((style) => style.id === id) ?? null;
}

export function getCrystalCaseBySlug(slug: string) {
  return crystalCases.find((caseItem) => caseItem.slug === slug) ?? null;
}

export function getCrystalCasesBySlugs(slugs: readonly string[]) {
  return slugs
    .map((slug) => getCrystalCaseBySlug(slug))
    .filter(Boolean) as CrystalCase[];
}

export function getCrystalCasesByProduct(productId: string) {
  return crystalCases.filter((caseItem) => caseItem.productId === productId);
}

export function getFavoriteCrystalCases(favoriteIds: string[]) {
  const favoriteSet = new Set(favoriteIds);
  return crystalCases.filter((caseItem) => favoriteSet.has(caseItem.id));
}

export function searchCrystalCases(
  query: string,
  cases: CrystalCase[] = crystalCases
) {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return cases;
  }

  return cases.filter((caseItem) => {
    const product = getCrystalProductById(caseItem.productId);
    const searchText = normalizeSearchText(
      [
        caseItem.title,
        caseItem.productName,
        caseItem.styleName,
        caseItem.summary,
        caseItem.prompt,
        caseItem.promptEn,
        caseItem.negativePrompt,
        caseItem.compositionAnalysis,
        caseItem.lightingAnalysis,
        caseItem.tags.join(" "),
        getCrystalStyleById(caseItem.styleId)?.promptStyleZh,
        getCrystalStyleById(caseItem.styleId)?.promptStyleEn,
        product?.name,
        product?.englishName,
        product?.mineral,
        product?.materialSpecZh,
        product?.materialSpecEn,
        product?.colorSpecZh,
        product?.colorSpecEn,
        product?.textureSpecZh,
        product?.textureSpecEn,
        product?.tags.join(" ")
      ]
        .filter(Boolean)
        .join(" ")
    );

    return searchText.includes(normalizedQuery);
  });
}

export function applyBraceletRules(caseItem: CrystalCase): CrystalCase {
  const promptSet = buildCrystalPromptSet(caseItem);

  return {
    ...caseItem,
    ...promptSet
  };
}

export function buildCrystalPromptSet(caseItem: CrystalCase) {
  if (hasAppliedBraceletRules(caseItem)) {
    return {
      prompt: sanitizePositivePromptText(caseItem.prompt),
      promptEn: sanitizePositivePromptText(caseItem.promptEn),
      negativePrompt: caseItem.negativePrompt
    };
  }

  const product = getCrystalProductById(caseItem.productId);

  return {
    prompt: buildChineseCrystalPrompt(caseItem, product),
    promptEn: buildEnglishCrystalPrompt(caseItem, product),
    negativePrompt: appendPromptRule(
      caseItem.negativePrompt,
      braceletRules.negativeAppendix
    )
  };
}

export function getCrystalBraceletSize(id: string) {
  return braceletSizes.find((size) => size.id === id) ?? null;
}

export function getDefaultCrystalBraceletSize() {
  return getCrystalBraceletSize(defaultBraceletSize) ?? getCrystalBraceletSize("medium");
}

function appendPromptRule(value: string, rule: string) {
  if (value.includes(rule)) {
    return value;
  }

  return `${value}\n\n${rule}`;
}

function hasAppliedBraceletRules(caseItem: CrystalCase) {
  return (
    caseItem.prompt.includes("完整闭环手串") &&
    caseItem.prompt.includes("统一珠径") &&
    caseItem.prompt.includes("对称结构") &&
    caseItem.prompt.includes("真实珠宝摄影比例") &&
    caseItem.prompt.includes("真实天然水晶质感") &&
    caseItem.prompt.includes("合理透视关系") &&
    caseItem.prompt.includes("商业摄影表达") &&
    caseItem.promptEn.includes("complete closed-loop bracelet") &&
    caseItem.promptEn.includes("uniform bead diameter") &&
    caseItem.promptEn.includes("symmetrical structure") &&
    caseItem.promptEn.includes("realistic jewelry photography proportions") &&
    caseItem.promptEn.includes("authentic natural crystal material quality") &&
    caseItem.promptEn.includes("reasonable perspective relationship") &&
    caseItem.promptEn.includes("commercial photography expression") &&
    caseItem.negativePrompt.includes(braceletRules.negativeAppendix)
  );
}

function buildChineseCrystalPrompt(
  caseItem: CrystalCase,
  product: CrystalProduct | null
) {
  return joinPromptSections([
    sanitizePositivePromptText(caseItem.prompt),
    product ? buildProductSpecZh(product) : "",
    braceletRules.promptAppendixZh,
    buildUniversalQualitySpecZh()
  ]);
}

function buildEnglishCrystalPrompt(
  caseItem: CrystalCase,
  product: CrystalProduct | null
) {
  return joinPromptSections([
    sanitizePositivePromptText(caseItem.promptEn),
    product ? buildProductSpecEn(product) : "",
    braceletRules.promptAppendixEn,
    buildUniversalQualitySpecEn()
  ]);
}

function buildProductSpecZh(product: CrystalProduct) {
  return product.materialSpecZh;
}

function buildProductSpecEn(product: CrystalProduct) {
  return `The material should read as ${product.materialSpecEn}.`;
}

function buildUniversalQualitySpecZh() {
  return "最终画面只展示单条手串，主体必须清晰锐利，珠体边缘干净，背景和道具只服务产品，不出现文字、水印、多余 logo 或人物手腕佩戴效果，保持专业高端商业珠宝摄影质感。";
}

function buildUniversalQualitySpecEn() {
  return "Show only one bracelet with a sharp subject, clean bead edges, a controlled background, and props that support the product without competing for attention. Avoid text, watermarks, extra logos, wrists, hands, or model-wearing effects, and maintain a refined high-end commercial jewelry photography finish.";
}

function joinPromptSections(sections: string[]) {
  return sections
    .map((section) => section.trim())
    .filter(Boolean)
    .join("\n\n");
}

function sanitizePositivePromptText(value: string) {
  return value
    .replaceAll("金属隔珠位置", "珠体边缘位置")
    .replaceAll("隔珠", "珠体细节")
    .replace(/metal spacers/gi, "bead-edge highlights")
    .replace(/metal spacer/gi, "bead-edge")
    .replace(/spacer details/gi, "bead details")
    .replace(/spacer structure/gi, "bead structure")
    .replace(/\ban citrine bracelet\b/gi, "a citrine bracelet");
}

function normalizeSearchText(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}
