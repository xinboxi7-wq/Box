import type { CrystalCase, CrystalProduct } from "@/types/crystal";

export function replaceCrystalMaterialTerms(
  value: string,
  replacement: string,
  product: CrystalProduct,
  caseItem: CrystalCase
) {
  const nextMaterial = replacement.trim();

  if (!nextMaterial) {
    return value;
  }

  return getCrystalMaterialTerms(product, caseItem).reduce(
    (currentValue, term) => replaceTerm(currentValue, term, nextMaterial),
    value
  );
}

export function getCrystalMaterialTerms(
  product: CrystalProduct,
  caseItem: CrystalCase
) {
  const englishMaterial = product.englishName
    .replace(/\s*bracelet\s*$/i, "")
    .trim();
  const chineseTerms = [
    product.name,
    product.mineral.replace(/手串$/, ""),
    caseItem.productName.replace(/手串$/, "")
  ];
  const englishTerms = [englishMaterial, product.id];

  return Array.from(
    new Set(
      [...chineseTerms, ...englishTerms]
        .map((term) => term.trim())
        .filter(Boolean)
        .sort((first, second) => second.length - first.length)
    )
  );
}

function replaceTerm(value: string, term: string, replacement: string) {
  if (containsCjk(term)) {
    return value.split(term).join(replacement);
  }

  return value.replace(
    new RegExp(`\\b${escapeRegExp(term)}\\b`, "gi"),
    replacement
  );
}

function containsCjk(value: string) {
  return /[\u3400-\u9fff]/.test(value);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
