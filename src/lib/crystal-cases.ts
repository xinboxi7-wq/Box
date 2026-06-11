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
  "obsidian-luxury",
  "citrine-lifestyle",
  "amethyst-ecommerce"
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
      prompt: caseItem.prompt,
      promptEn: caseItem.promptEn,
      negativePrompt: caseItem.negativePrompt
    };
  }

  const product = getCrystalProductById(caseItem.productId);
  const braceletSize = getDefaultCrystalBraceletSize();

  return {
    prompt: buildChineseCrystalPrompt(caseItem, product, braceletSize),
    promptEn: buildEnglishCrystalPrompt(caseItem, product, braceletSize),
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
    caseItem.prompt.includes("约") &&
    caseItem.prompt.includes("mm圆珠") &&
    caseItem.prompt.includes("完整闭环手串") &&
    caseItem.promptEn.includes("approximately") &&
    caseItem.promptEn.includes("mm round beads") &&
    caseItem.promptEn.includes("complete circular bracelet") &&
    caseItem.negativePrompt.includes(braceletRules.negativeAppendix)
  );
}

function buildChineseCrystalPrompt(
  caseItem: CrystalCase,
  product: CrystalProduct | null,
  braceletSize: CrystalBraceletSize | null
) {
  return joinPromptSections([
    sanitizePositivePromptText(caseItem.prompt),
    product ? buildProductSpecZh(product) : "",
    braceletSize ? buildBraceletSizeSpecZh(braceletSize) : "",
    buildUniversalQualitySpecZh()
  ]);
}

function buildEnglishCrystalPrompt(
  caseItem: CrystalCase,
  product: CrystalProduct | null,
  braceletSize: CrystalBraceletSize | null
) {
  return joinPromptSections([
    sanitizePositivePromptText(caseItem.promptEn),
    product ? buildProductSpecEn(product) : "",
    braceletSize ? buildBraceletSizeSpecEn(braceletSize) : "",
    buildUniversalQualitySpecEn()
  ]);
}

function buildProductSpecZh(product: CrystalProduct) {
  return product.materialSpecZh;
}

function buildProductSpecEn(product: CrystalProduct) {
  return `The material should read as ${product.materialSpecEn}.`;
}

function buildBraceletSizeSpecZh(braceletSize: CrystalBraceletSize) {
  const beadCount = getApproximateBeadCount(braceletSize);

  return `手串由约${beadCount}颗珠径一致的${braceletSize.internalMm}mm圆珠组成，所有珠子保持统一珠径、稳定间距和一致尺度，形成完整闭环手串与对称结构，透视自然，不出现鱼眼、广角变形或前后珠子大小夸张。`;
}

function buildBraceletSizeSpecEn(braceletSize: CrystalBraceletSize) {
  const beadCount = getApproximateBeadCount(braceletSize);

  return `Construct the bracelet from approximately ${formatNumberWord(beadCount)} uniform ${braceletSize.internalMm}mm round beads, forming a complete circular bracelet with uniform bead diameter, stable spacing, symmetrical structure, realistic jewelry proportions, accurate perspective, and consistent bead scale around the entire circle.`;
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
    .replace(/spacer structure/gi, "bead structure");
}

function getApproximateBeadCount(braceletSize: CrystalBraceletSize) {
  const [min, max] = braceletSize.internalVisualBeadRange
    .split("-")
    .map((value) => Number.parseInt(value, 10));

  if (Number.isFinite(min) && Number.isFinite(max)) {
    return Math.round((min + max) / 2);
  }

  return 20;
}

function formatNumberWord(value: number) {
  const words: Record<number, string> = {
    18: "eighteen",
    20: "twenty",
    24: "twenty-four"
  };

  return words[value] ?? String(value);
}

function normalizeSearchText(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}
