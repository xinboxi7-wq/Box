export type CrystalProduct = {
  id: string;
  slug: string;
  name: string;
  englishName: string;
  mineral: string;
  description: string;
  image: string;
  tags: string[];
};

export type CrystalStyle = {
  id: string;
  name: string;
  description: string;
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
  compositionAnalysis: string;
  lightingAnalysis: string;
  commercialUse: string;
};

export type CrystalCaseLibraryData = {
  products: CrystalProduct[];
  styles: CrystalStyle[];
  cases: CrystalCase[];
};
