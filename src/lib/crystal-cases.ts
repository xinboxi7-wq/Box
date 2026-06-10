import crystalCaseData from "@/data/crystal-cases.json";
import type {
  CrystalCase,
  CrystalCaseLibraryData,
  CrystalProduct,
  CrystalStyle
} from "@/types/crystal";

const library = crystalCaseData as CrystalCaseLibraryData;

export const crystalProducts: CrystalProduct[] = library.products;
export const crystalStyles: CrystalStyle[] = library.styles;
export const crystalCases: CrystalCase[] = library.cases;
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

export function getCrystalProductBySlug(slug: string) {
  return crystalProducts.find((product) => product.slug === slug) ?? null;
}

export function getCrystalProductById(id: string) {
  return crystalProducts.find((product) => product.id === id) ?? null;
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
        caseItem.compositionAnalysis,
        caseItem.lightingAnalysis,
        caseItem.tags.join(" "),
        product?.name,
        product?.englishName,
        product?.mineral,
        product?.tags.join(" ")
      ]
        .filter(Boolean)
        .join(" ")
    );

    return searchText.includes(normalizedQuery);
  });
}

function normalizeSearchText(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}
