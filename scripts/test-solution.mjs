#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const rules = require(path.join(projectRoot, "src", "data", "solution-rules.json"));
const randomSubjects = require(path.join(
  projectRoot,
  "src",
  "data",
  "random-subjects.json"
));

const {
  buildSolutionDetail,
  formatSolutionPackage,
  generateSolutionDirections
} = loadTsModule(path.join(projectRoot, "src", "lib", "solution.ts"));

const {
  createBriefFromRandomSubject,
  getSubjectRecommendation
} = loadTsModule(path.join(projectRoot, "src", "lib", "subject-recommendation.ts"));

const { clearRecords, removeRecordById } = loadTsModule(
  path.join(projectRoot, "src", "lib", "storage.ts")
);

const {
  braceletRules,
  braceletSizes,
  buildCrystalPromptSet,
  crystalCases,
  crystalProducts,
  crystalStyles,
  defaultBraceletSize,
  getCrystalCaseBySlug,
  getCrystalCasesBySlugs,
  latestCaseSlugs,
  popularCaseSlugs,
  supportedModelLabels,
  searchCrystalCases
} = loadTsModule(path.join(projectRoot, "src", "lib", "crystal-cases.ts"));

const { replaceCrystalMaterialTerms } = loadTsModule(
  path.join(projectRoot, "src", "lib", "crystal-prompt-customization.ts")
);

const names = {
  blackRutilatedBracelet: "\u9ed1\u53d1\u6676\u624b\u4e32",
  walnutLoungeChair: "\u80e1\u6843\u6728\u4f11\u95f2\u6905",
  unknownProduct: "\u672a\u77e5\u4ea7\u54c1\u6d4b\u8bd5",
  portableMonitor: "\u4fbf\u643a\u663e\u793a\u5668",
  perfumeBottle: "\u9999\u6c34\u74f6",
  mooncakeGiftBox: "\u6708\u997c\u793c\u76d2",
  turquoiseBracelet: "\u7eff\u677e\u77f3\u624b\u4e32"
};

const titles = {
  appleHero: "Apple \u98ce\u5b98\u7f51\u4e3b\u89c6\u89c9",
  beautyFragrance: "\u7f8e\u5986\u9999\u6c34\u5546\u4e1a\u5927\u7247",
  furnitureGallery: "\u9ad8\u7aef\u5bb6\u5177\u5c55\u5385\u6e32\u67d3",
  jewelryStill: "\u73e0\u5b9d\u9759\u7269\u5e7f\u544a\u5927\u7247"
};

const promptCases = [
  {
    name: "black rutilated bracelet / custom English name",
    brief: {
      objectName: names.blackRutilatedBracelet,
      englishProductName: "custom crystal bracelet",
      projectType: "jewelry-design",
      commercialGoals: ["premium-feel", "material-expression"],
      keywords: ""
    },
    expectedEnglishName: "custom crystal bracelet",
    expectedChineseName: names.blackRutilatedBracelet
  },
  {
    name: "walnut lounge chair / dictionary English name",
    brief: {
      objectName: names.walnutLoungeChair,
      englishProductName: "",
      projectType: "furniture-design",
      commercialGoals: ["premium-feel", "material-expression"],
      keywords: ""
    },
    expectedEnglishName: "walnut lounge chair",
    expectedChineseName: names.walnutLoungeChair
  },
  {
    name: "unknown Chinese product / generic English fallback",
    brief: {
      objectName: names.unknownProduct,
      englishProductName: "",
      projectType: "product-design",
      commercialGoals: ["premium-feel"],
      keywords: ""
    },
    expectedEnglishName: "generic commercial product",
    expectedChineseName: names.unknownProduct
  }
];

run();

function run() {
  const results = [];

  for (const testCase of promptCases) {
    const directions = generateSolutionDirections(rules, testCase.brief);
    assertSolutionCount(directions, testCase.name);
    assertSolutionFields(testCase.brief, directions, testCase.name);

    const detail = buildSolutionDetail(
      rules,
      testCase.brief,
      directions[0].template
    );

    assertEnglishPlatformOutputs(
      detail,
      testCase.expectedEnglishName,
      testCase.name
    );
    assertChineseOutputs(detail, testCase.expectedChineseName, testCase.name);
    assertSolutionPackage(detail, testCase.name);
    results.push(`${testCase.name}: ${directions.length} directions`);
  }

  assertRandomSubjects();
  assertSubjectRecommendations();
  assertManualSelectionGuard();
  assertTemplateMatching();
  assertStorageDeletionHelpers();
  assertCrystalCaseLibrary();
  assertBraceletRules();
  assertCrystalMaterialCustomization();
  assertCrystalHomeSections();
  assertSupportedModels();

  console.log("solution tests passed");
  for (const result of results) {
    console.log(`- ${result}`);
  }
  console.log("- random subjects: 20 draws passed recent-10 de-dup checks");
  console.log("- recommendations: jewelry, furniture, electronics, beauty passed");
  console.log("- manual selection guard: preserved manual project type and goals");
  console.log("- template matching: packaging, beauty, furniture, jewelry, electronics passed");
  console.log("- storage helpers: delete single and clear all passed");
  console.log("- crystal case library: 3 products, 12 target cases, routes and search passed");
  console.log("- bracelet rules: structure stability and commercial photography logic passed");
  console.log("- crystal prompt customization: material replacement passed");
  console.log("- crystal home sections: latest and popular slugs passed");
  console.log("- supported models: GPT Image, Midjourney, Flux passed");
}

function assertRandomSubjects() {
  assert(
    randomSubjects.length >= 80,
    `random subject library should contain at least 80 items, got ${randomSubjects.length}`
  );

  const originalDemoSubjects = new Set([
    names.perfumeBottle,
    names.walnutLoungeChair,
    "\u7eff\u677e\u77f3\u624b\u4e32",
    names.portableMonitor
  ]);
  let recentSubjects = [];
  let outsideDemoCount = 0;
  let previousSubject = "";

  for (let index = 0; index < 20; index += 1) {
    const brief = createBriefFromRandomSubject(recentSubjects);

    assertText(brief.objectName, `random ${index + 1}: missing Chinese object`);
    assertText(
      brief.englishProductName,
      `random ${index + 1}: missing English product name`
    );
    assertText(brief.projectType, `random ${index + 1}: missing project type`);
    assertText(brief.keywords, `random ${index + 1}: missing keywords`);
    assert(
      brief.commercialGoals.length > 0 && brief.commercialGoals.length <= 2,
      `random ${index + 1}: goals should contain 1-2 items`
    );
    assert(
      brief.objectName !== previousSubject,
      `random ${index + 1}: consecutive duplicate subject ${brief.objectName}`
    );
    assert(
      !recentSubjects.includes(brief.objectName),
      `random ${index + 1}: repeated within recent 10 subjects ${brief.objectName}`
    );

    if (!originalDemoSubjects.has(brief.objectName)) {
      outsideDemoCount += 1;
    }

    previousSubject = brief.objectName;
    recentSubjects = [
      brief.objectName,
      ...recentSubjects.filter((item) => item !== brief.objectName)
    ].slice(0, 10);
  }

  assert(
    outsideDemoCount > 0,
    "random 20 draws should not be limited to the original 4 demo subjects"
  );
}

function assertSubjectRecommendations() {
  assertRecommendation(names.blackRutilatedBracelet, "jewelry-design", [
    "premium-feel",
    "material-expression"
  ]);
  assertRecommendation(names.walnutLoungeChair, "furniture-design", [
    "premium-feel",
    "material-expression"
  ]);
  assertRecommendation(names.portableMonitor, ["product-design", "website-hero"], [
    "premium-feel",
    "structure-display"
  ]);
  assertRecommendation(names.perfumeBottle, ["brand-ad", "product-design"], [
    "premium-feel",
    "brand-campaign"
  ]);
}

function assertManualSelectionGuard() {
  const currentBrief = {
    objectName: "\u7eff\u677e\u77f3\u624b\u4e32",
    englishProductName: "",
    projectType: "furniture-design",
    commercialGoals: ["portfolio-quality"],
    keywords: ""
  };
  const recommendation = getSubjectRecommendation(currentBrief.objectName);
  assertObject(recommendation, "manual guard: expected a recommendation");

  const nextBrief = applyRecommendationLikeUi(currentBrief, recommendation, {
    projectTypeManuallySelected: true,
    goalsManuallySelected: true
  });

  assert(
    nextBrief.projectType === "furniture-design",
    "manual guard: project type should not be overwritten after manual selection"
  );
  assert(
    nextBrief.commercialGoals.length === 1 &&
      nextBrief.commercialGoals[0] === "portfolio-quality",
    "manual guard: goals should not be overwritten after manual selection"
  );

  const restoredBrief = applyRecommendationLikeUi(currentBrief, recommendation, {
    projectTypeManuallySelected: false,
    goalsManuallySelected: false
  });

  assert(
    restoredBrief.projectType === "jewelry-design",
    "restore recommendation: project type should switch back to recommended value"
  );
  assert(
    arraysEqual(restoredBrief.commercialGoals, [
      "premium-feel",
      "material-expression"
    ]),
    "restore recommendation: goals should switch back to recommended values"
  );
}

function assertTemplateMatching() {
  const mooncakeTitles = getDirectionTitles({
    objectName: names.mooncakeGiftBox,
    englishProductName: "",
    projectType: "brand-ad",
    commercialGoals: ["brand-campaign", "conversion-selling"],
    keywords: ""
  });
  assertNoTitleIncludes(
    mooncakeTitles,
    [
      titles.beautyFragrance,
      titles.jewelryStill,
      titles.furnitureGallery,
      titles.appleHero
    ],
    "mooncake gift box"
  );
  assertAnyTitleIncludes(
    mooncakeTitles,
    [
      "\u5305\u88c5",
      "\u793c\u76d2",
      "\u8282\u65e5\u793c\u8d60",
      "\u7535\u5546",
      "\u54c1\u724c\u5e7f\u544a"
    ],
    "mooncake gift box"
  );

  const perfumeTitles = getDirectionTitles({
    objectName: names.perfumeBottle,
    englishProductName: "",
    projectType: "brand-ad",
    commercialGoals: ["premium-feel", "brand-campaign"],
    keywords: ""
  });
  assertAnyTitleIncludes(perfumeTitles, [titles.beautyFragrance], "perfume bottle");

  assertNoTitleIncludes(
    getDirectionTitles({
      objectName: names.walnutLoungeChair,
      englishProductName: "",
      projectType: "furniture-design",
      commercialGoals: ["premium-feel", "material-expression"],
      keywords: ""
    }),
    ["\u73e0\u5b9d", "\u7f8e\u5986", "\u793c\u76d2", "\u5305\u88c5"],
    "walnut lounge chair"
  );

  assertNoTitleIncludes(
    getDirectionTitles({
      objectName: names.turquoiseBracelet,
      englishProductName: "",
      projectType: "jewelry-design",
      commercialGoals: ["premium-feel", "material-expression"],
      keywords: ""
    }),
    ["\u5bb6\u5177", "\u7f8e\u5986", "\u793c\u76d2", "\u5305\u88c5"],
    "turquoise bracelet"
  );

  assertNoTitleIncludes(
    getDirectionTitles({
      objectName: names.portableMonitor,
      englishProductName: "",
      projectType: "website-hero",
      commercialGoals: ["premium-feel", "structure-display"],
      keywords: ""
    }),
    ["\u73e0\u5b9d", "\u7f8e\u5986", "\u793c\u76d2", "\u5305\u88c5"],
    "portable monitor"
  );
}

function assertStorageDeletionHelpers() {
  const records = [{ id: "history-a" }, { id: "history-b" }];
  const afterDelete = removeRecordById(records, "history-a");

  assert(
    afterDelete.length === 1 && afterDelete[0].id === "history-b",
    "storage: should delete a single history record by id"
  );
  assert(
    removeRecordById(records, "missing").length === records.length,
    "storage: deleting a missing id should preserve records"
  );
  assert(
    clearRecords().length === 0,
    "storage: should clear all history records"
  );

  const favorites = [{ id: "favorite-a" }, { id: "favorite-b" }];
  const nextFavorites = removeRecordById(favorites, "favorite-b");

  assert(
    nextFavorites.length === 1 && nextFavorites[0].id === "favorite-a",
    "storage: should delete a single favorite record by id"
  );
  assert(
    clearRecords().length === 0,
    "storage: should clear all favorite records"
  );
}

function assertCrystalCaseLibrary() {
  const targetProductIds = ["amethyst", "citrine", "obsidian"];
  const targetStyleIds = ["luxury", "lifestyle", "ecommerce", "gift"];
  const targetSlugs = targetProductIds.flatMap((productId) =>
    targetStyleIds.map((styleId) => `${productId}-${styleId}`)
  );

  assert(
    crystalProducts.length === 3,
    `crystal library: expected 3 products, got ${crystalProducts.length}`
  );
  assert(
    crystalCases.length >= targetSlugs.length,
    `crystal library: expected at least ${targetSlugs.length} target cases, got ${crystalCases.length}`
  );

  const expectedStyles = new Set([
    "\u5962\u4f88\u54c1\u5e7f\u544a\u98ce",
    "\u5c0f\u7ea2\u4e66\u79cd\u8349\u98ce",
    "\u7535\u5546\u767d\u5e95\u98ce",
    "\u793c\u8d60\u573a\u666f\u98ce"
  ]);
  const slugs = new Set();

  for (const product of crystalProducts) {
    const productCases = crystalCases.filter(
      (caseItem) => caseItem.productId === product.id
    );

    assert(
      productCases.length >= 4,
      `crystal library: ${product.name} should have at least 4 target cases`
    );

    for (const styleName of expectedStyles) {
      assert(
        productCases.some((caseItem) => caseItem.styleName === styleName),
        `crystal library: ${product.name} missing style ${styleName}`
      );
    }
  }

  for (const slug of targetSlugs) {
    assertObject(
      getCrystalCaseBySlug(slug),
      `crystal library: missing first-stage target case ${slug}`
    );
  }

  for (const caseItem of crystalCases) {
    assertText(caseItem.slug, `${caseItem.id}: missing slug`);
    assert(!slugs.has(caseItem.slug), `${caseItem.slug}: duplicate case slug`);
    slugs.add(caseItem.slug);
    assertObject(
      getCrystalCaseBySlug(caseItem.slug),
      `${caseItem.slug}: detail route data should be reachable by slug`
      );
    assertText(caseItem.image, `${caseItem.slug}: missing image`);
    assertText(caseItem.coverImage, `${caseItem.slug}: missing coverImage`);
    assert(
      Array.isArray(caseItem.galleryImages) && caseItem.galleryImages.length > 0,
      `${caseItem.slug}: missing galleryImages`
    );
    assertText(caseItem.prompt, `${caseItem.slug}: missing Chinese prompt`);
    assertText(caseItem.promptEn, `${caseItem.slug}: missing English prompt`);
    assertText(caseItem.negativePrompt, `${caseItem.slug}: missing negative prompt`);
    assert(
      !containsChinese(caseItem.promptEn),
      `${caseItem.slug}: English prompt should not contain CJK`
    );
    assert(
      !containsChinese(caseItem.negativePrompt),
      `${caseItem.slug}: negative prompt should not contain CJK`
    );
    assert(
      caseItem.negativePrompt.includes("watermark"),
      `${caseItem.slug}: negative prompt should mention watermark`
    );
    assertText(caseItem.compositionAnalysis, `${caseItem.slug}: missing composition analysis`);
    assertText(caseItem.lightingAnalysis, `${caseItem.slug}: missing lighting analysis`);
    assert(
      Array.isArray(caseItem.tags) && caseItem.tags.length > 0,
      `${caseItem.slug}: missing tags`
    );
  }

  assertSearchHits("\u7d2b\u6c34\u6676", "amethyst");
  assertSearchHits("\u9ec4\u6c34\u6676", "citrine");
  assertSearchHits("\u9ed1\u66dc\u77f3", "obsidian");
  assertSearchHits("\u5c0f\u7ea2\u4e66", "lifestyle");
  assertSearchHits("\u767d\u5e95", "ecommerce");
  assertSearchHits("\u5962\u4f88\u54c1", "luxury");
  assertSearchHits("\u793c\u8d60", "gift");
}

function assertCrystalHomeSections() {
  assertHomeCaseSlugs(latestCaseSlugs, "latest cases");
  assertHomeCaseSlugs(popularCaseSlugs, "popular cases");

  assert(
    getCrystalCasesBySlugs(latestCaseSlugs).length === 3,
    "crystal home: latest helper should return 3 valid cases"
  );
  assert(
    getCrystalCasesBySlugs(popularCaseSlugs).length === 3,
    "crystal home: popular helper should return 3 valid cases"
  );
}

function assertBraceletRules() {
  assertObject(braceletRules, "bracelet rules: missing global config");
  assertText(braceletRules.promptAppendixZh, "bracelet rules: missing Chinese prompt appendix");
  assertText(braceletRules.promptAppendixEn, "bracelet rules: missing English prompt appendix");
  assertText(braceletRules.negativeAppendix, "bracelet rules: missing negative appendix");
  assert(
    braceletRules.productStructure.zh.includes("完整闭环手串"),
    "bracelet rules: Chinese product structure should require a complete closed-loop bracelet"
  );
  assert(
    braceletRules.productStructure.en.includes("complete closed-loop bracelet"),
    "bracelet rules: English product structure should require a complete closed-loop bracelet"
  );
  assert(
    braceletRules.styleConsistency.lockedElementsZh.includes("真实珠宝摄影逻辑"),
    "bracelet rules: style consistency should lock realistic jewelry photography logic"
  );
  assert(defaultBraceletSize === "medium", "bracelet rules: default size should be medium");
  assert(
    braceletSizes.length === 3,
    `bracelet rules: expected 3 bracelet sizes, got ${braceletSizes.length}`
  );
  assertBraceletSize("small", 8, "22-26", "small crystal round beads");
  assertBraceletSize("medium", 10, "18-22", "medium crystal round beads");
  assertBraceletSize("large", 12, "16-20", "large crystal round beads");
  assertCrystalStyles();

  for (const caseItem of crystalCases) {
    const prompts = buildCrystalPromptSet(caseItem);
    const product = crystalProducts.find(
      (productItem) => productItem.id === caseItem.productId
    );
    const style = crystalStyles.find(
      (styleItem) => styleItem.id === caseItem.styleId
    );

    assertObject(product, `${caseItem.slug}: missing product`);
    assertObject(style, `${caseItem.slug}: missing style`);
    assert(
      !("beadSizeClass" in product) && !("beadSizeMm" in product),
      `${caseItem.slug}: product should not contain bracelet size fields`
    );

    assert(
      prompts.prompt.includes("完整闭环手串"),
      `${caseItem.slug}: Chinese prompt should include complete closed bracelet structure`
    );
    assert(
      prompts.prompt.includes("统一珠径"),
      `${caseItem.slug}: Chinese prompt should include uniform bead diameter`
    );
    assert(
      prompts.prompt.includes("对称结构"),
      `${caseItem.slug}: Chinese prompt should include symmetrical structure`
    );
    assert(
      prompts.prompt.includes("真实珠宝摄影比例"),
      `${caseItem.slug}: Chinese prompt should include realistic jewelry photography proportions`
    );
    assert(
      prompts.prompt.includes("真实天然水晶质感"),
      `${caseItem.slug}: Chinese prompt should include authentic natural crystal material`
    );
    assert(
      prompts.prompt.includes("合理透视关系"),
      `${caseItem.slug}: Chinese prompt should include reasonable perspective relationship`
    );
    assert(
      prompts.prompt.includes("商业摄影表达"),
      `${caseItem.slug}: Chinese prompt should include commercial photography expression`
    );
    assert(
      prompts.prompt.includes(caseItem.productName),
      `${caseItem.slug}: Chinese prompt should include the case product name`
    );
    assert(
      prompts.prompt.includes("\u53ea\u5c55\u793a\u5355\u6761\u624b\u4e32"),
      `${caseItem.slug}: Chinese prompt should include single-bracelet quality control`
    );
    assert(
      prompts.promptEn.includes("complete closed-loop bracelet"),
      `${caseItem.slug}: English prompt should include complete closed-loop bracelet`
    );
    assert(
      prompts.promptEn.includes("uniform bead diameter"),
      `${caseItem.slug}: English prompt should include uniform bead diameter`
    );
    assert(
      prompts.promptEn.includes("symmetrical structure"),
      `${caseItem.slug}: English prompt should include symmetrical structure`
    );
    assert(
      prompts.promptEn.includes("realistic jewelry photography proportions"),
      `${caseItem.slug}: English prompt should include realistic jewelry photography proportions`
    );
    assert(
      prompts.promptEn.includes("authentic natural crystal material quality"),
      `${caseItem.slug}: English prompt should include authentic natural crystal material quality`
    );
    assert(
      prompts.promptEn.includes("reasonable perspective relationship"),
      `${caseItem.slug}: English prompt should include reasonable perspective relationship`
    );
    assert(
      prompts.promptEn.includes("commercial photography expression"),
      `${caseItem.slug}: English prompt should include commercial photography expression`
    );
    assert(
      prompts.promptEn.toLowerCase().includes("show only one bracelet"),
      `${caseItem.slug}: English prompt should include single-bracelet quality control`
    );
    assertNoPromptHeadingTerms(prompts.prompt, `${caseItem.slug}: Chinese prompt`);
    assertNoPromptHeadingTerms(prompts.promptEn, `${caseItem.slug}: English prompt`);
    assertNoExactBeadCountTerms(prompts.prompt, `${caseItem.slug}: Chinese prompt`);
    assertNoExactBeadCountTerms(prompts.promptEn, `${caseItem.slug}: English prompt`);
    assertNoInternalSizeTerms(prompts.prompt, `${caseItem.slug}: Chinese prompt`);
    assertNoInternalSizeTerms(prompts.promptEn, `${caseItem.slug}: English prompt`);
    assertChinesePromptLength(prompts.prompt, caseItem.slug);
    assertEnglishPromptLength(prompts.promptEn, caseItem.slug);
    assertNoExactBeadCountTerms(
      prompts.negativePrompt,
      `${caseItem.slug}: negative prompt`
    );
    assertNegativeTerms(prompts.negativePrompt, caseItem.slug);
    assert(
      !containsChinese(prompts.promptEn),
      `${caseItem.slug}: English prompt with bracelet rules should not contain CJK`
    );
    assert(
      !containsChinese(prompts.negativePrompt),
      `${caseItem.slug}: negative prompt with bracelet rules should not contain CJK`
    );
  }
}

function assertCrystalMaterialCustomization() {
  const customChineseMaterial = "粉水晶";
  const customEnglishMaterial = "rose quartz";

  for (const product of crystalProducts) {
    const caseItem = getCrystalCaseBySlug(`${product.id}-luxury`);

    assertObject(
      caseItem,
      `material customization: missing ${product.id}-luxury case`
    );

    const promptSet = buildCrystalPromptSet(caseItem);
    const chinesePrompt = replaceCrystalMaterialTerms(
      promptSet.prompt,
      customChineseMaterial,
      product,
      caseItem
    );
    const englishPrompt = replaceCrystalMaterialTerms(
      promptSet.promptEn,
      customEnglishMaterial,
      product,
      caseItem
    );
    const midjourneyPrompt = replaceCrystalMaterialTerms(
      `${promptSet.promptEn} --style raw --ar 4:5`,
      customEnglishMaterial,
      product,
      caseItem
    );
    const defaultPrompt = replaceCrystalMaterialTerms(
      promptSet.promptEn,
      "",
      product,
      caseItem
    );

    assert(
      chinesePrompt.includes(customChineseMaterial),
      `${product.id}: Chinese prompt should include custom material`
    );
    assert(
      !chinesePrompt.includes(product.name),
      `${product.id}: Chinese prompt should replace default Chinese material`
    );
    assert(
      englishPrompt.includes(customEnglishMaterial),
      `${product.id}: English prompt should include custom material`
    );
    assert(
      !new RegExp(`\\b${product.id}\\b`, "i").test(englishPrompt),
      `${product.id}: English prompt should replace default English material`
    );
    assert(
      midjourneyPrompt.includes("--style raw --ar 4:5"),
      `${product.id}: Midjourney prompt should preserve platform suffix`
    );
    assert(
      midjourneyPrompt.includes(customEnglishMaterial),
      `${product.id}: Midjourney prompt should include custom material`
    );
    assert(
      defaultPrompt === promptSet.promptEn,
      `${product.id}: empty customization should preserve default prompt`
    );
  }
}

function assertBraceletSize(id, internalMm, internalVisualBeadRange, promptLabelEn) {
  const braceletSize = braceletSizes.find((size) => size.id === id);

  assertObject(braceletSize, `bracelet rules: missing ${id} bracelet size`);
  assert(
    braceletSize.internalMm === internalMm,
    `bracelet rules: ${id} should keep internal mm ${internalMm}`
  );
  assert(
    braceletSize.internalVisualBeadRange === internalVisualBeadRange,
    `bracelet rules: ${id} should keep internal visual bead range ${internalVisualBeadRange}`
  );
  assert(
    braceletSize.promptLabelEn === promptLabelEn,
    `bracelet rules: ${id} should expose clean prompt label ${promptLabelEn}`
  );
}

function assertCrystalStyles() {
  assert(
    crystalStyles.length >= 4,
    `crystal styles: expected at least 4 styles, got ${crystalStyles.length}`
  );

  for (const style of crystalStyles) {
    assertText(style.promptStyleZh, `${style.id}: missing Chinese style prompt`);
    assertText(style.promptStyleEn, `${style.id}: missing English style prompt`);
    assert(
      !containsChinese(style.promptStyleEn),
      `${style.id}: English style prompt should not contain CJK`
    );
  }
}

function assertNoExactBeadCountTerms(value, label) {
  const forbiddenTerms = [
    "exactly 20",
    "fewer than 20",
    "more than 20",
    "\u7cbe\u786e20\u9897"
  ];

  for (const term of forbiddenTerms) {
    assert(!value.includes(term), `${label} should not include ${term}`);
  }
}

function assertNoInternalSizeTerms(value, label) {
  const forbiddenTerms = [
    "visual bead range",
    "18-22 beads",
    "22-26 beads",
    "16-20 beads",
    "not an exact bead-count instruction"
  ];

  for (const term of forbiddenTerms) {
    assert(!value.includes(term), `${label} should not include ${term}`);
  }
}

function assertNoPromptHeadingTerms(value, label) {
  const forbiddenTerms = [
    "\u4ea7\u54c1\u6750\u8d28\uff1a",
    "\u4ea7\u54c1\u989c\u8272\uff1a",
    "\u4ea7\u54c1\u7eb9\u7406\uff1a",
    "\u624b\u4e32\u5c3a\u5bf8\u8868\u8fbe\uff1a",
    "\u98ce\u683c\u6267\u884c\uff1a",
    "\u6784\u56fe\u8981\u6c42\uff1a",
    "\u706f\u5149\u8981\u6c42\uff1a",
    "\u5546\u4e1a\u51fa\u56fe\u8d28\u91cf\uff1a",
    "Product material:",
    "Product color:",
    "Product texture:",
    "Bracelet size expression:",
    "Style direction:",
    "Commercial image quality:",
    "Global Bracelet Rules:"
  ];

  for (const term of forbiddenTerms) {
    assert(!value.includes(term), `${label} should not include heading ${term}`);
  }
}

function assertChinesePromptLength(value, label) {
  assert(
    value.length >= 250 && value.length <= 450,
    `${label}: Chinese prompt should be 250-450 characters, got ${value.length}`
  );
}

function assertEnglishPromptLength(value, label) {
  const words = value.trim().split(/\s+/).filter(Boolean);

  assert(
    words.length >= 120 && words.length <= 220,
    `${label}: English prompt should be 120-220 words, got ${words.length}`
  );
}

function assertNegativeTerms(value, label) {
  const requiredTerms = [
    "inconsistent bead size",
    "different bead diameters",
    "uneven bead spacing",
    "extra beads",
    "loose beads",
    "missing beads",
    "broken bracelet",
    "duplicate bracelet",
    "distorted bracelet",
    "non-circular bracelet",
    "oval deformation",
    "deformed geometry",
    "wide angle distortion",
    "fisheye lens",
    "incorrect perspective",
    "oversized bead",
    "undersized bead",
    "random spacer beads",
    "multiple accent beads",
    "faceted beads",
    "necklace",
    "chain",
    "wrist",
    "hand",
    "model wearing bracelet",
    "plastic material",
    "fake crystal",
    "glass bead look",
    "low quality jewelry render"
  ];

  for (const term of requiredTerms) {
    assert(value.includes(term), `${label}: negative prompt should include ${term}`);
  }
}

function assertSupportedModels() {
  for (const modelName of ["GPT Image", "Midjourney", "Flux"]) {
    assert(
      supportedModelLabels.includes(modelName),
      `supported models: expected ${modelName}`
    );
  }
  assert(
    supportedModelLabels.length === 3,
    `supported models: expected 3 labels, got ${supportedModelLabels.length}`
  );
}

function assertHomeCaseSlugs(slugs, label) {
  assert(slugs.length === 3, `crystal home: ${label} should contain 3 slugs`);

  for (const slug of slugs) {
    assertObject(
      getCrystalCaseBySlug(slug),
      `crystal home: ${label} references missing slug ${slug}`
    );
  }
}

function assertSearchHits(query, expectedPart) {
  const results = searchCrystalCases(query);

  assert(results.length > 0, `crystal search: expected results for ${query}`);
  assert(
    results.some((caseItem) => caseItem.slug.includes(expectedPart)),
    `crystal search: expected ${query} to hit ${expectedPart}`
  );
}

function applyRecommendationLikeUi(brief, recommendation, flags) {
  return {
    ...brief,
    projectType:
      recommendation?.projectType && !flags.projectTypeManuallySelected
        ? recommendation.projectType
        : brief.projectType,
    commercialGoals:
      recommendation?.commercialGoals?.length && !flags.goalsManuallySelected
        ? recommendation.commercialGoals
        : brief.commercialGoals
  };
}

function assertRecommendation(objectName, expectedProjectType, expectedGoals) {
  const recommendation = getSubjectRecommendation(objectName);
  assertObject(recommendation, `${objectName}: expected recommendation`);

  const projectTypes = Array.isArray(expectedProjectType)
    ? expectedProjectType
    : [expectedProjectType];
  assert(
    projectTypes.includes(recommendation.projectType),
    `${objectName}: expected project type ${projectTypes.join(" or ")}, got ${recommendation.projectType}`
  );
  for (const goal of expectedGoals) {
    assert(
      recommendation.commercialGoals.includes(goal),
      `${objectName}: expected goal ${goal}`
    );
  }
}

function assertSolutionCount(directions, label) {
  assert(
    directions.length >= 3,
    `${label}: should generate at least 3 directions, got ${directions.length}`
  );
  assert(
    directions.length <= 6,
    `${label}: should generate at most 6 directions, got ${directions.length}`
  );
}

function getDirectionTitles(brief) {
  const directions = generateSolutionDirections(rules, brief);

  assertSolutionCount(directions, brief.objectName);
  return directions.map((direction) => direction.title);
}

function assertNoTitleIncludes(directionTitles, forbiddenParts, label) {
  for (const title of directionTitles) {
    for (const forbidden of forbiddenParts) {
      assert(
        !title.includes(forbidden),
        `${label}: should not include mismatched direction ${title}`
      );
    }
  }
}

function assertAnyTitleIncludes(directionTitles, allowedParts, label) {
  assert(
    directionTitles.some((title) =>
      allowedParts.some((allowed) => title.includes(allowed))
    ),
    `${label}: expected one direction to include ${allowedParts.join(" or ")}, got ${directionTitles.join(", ")}`
  );
}

function assertSolutionFields(brief, directions, label) {
  directions.forEach((direction, index) => {
    const detail = buildSolutionDetail(rules, brief, direction.template);
    const prefix = `${label} / direction ${index + 1}`;

    assertText(direction.title, `${prefix}: missing title`);
    assertText(direction.summary, `${prefix}: missing summary`);
    assertText(detail.concept, `${prefix}: missing detail.concept`);
    assertText(detail.outputs.chinese, `${prefix}: missing detail.promptCN`);
    assertText(detail.outputs.english, `${prefix}: missing detail.promptEN`);
    assertText(detail.outputs.midjourney, `${prefix}: missing detail.promptMJ`);
    assertText(detail.outputs.flux, `${prefix}: missing detail.promptFlux`);
    assertText(detail.outputs.gptImage, `${prefix}: missing detail.promptGPTImage`);
    assertText(detail.outputs.negative, `${prefix}: missing detail.negativePrompt`);
    assertObject(detail.usageAdvice, `${prefix}: missing usageAdvice`);
    assertObject(detail.iterationAdvice, `${prefix}: missing iterationAdvice`);
  });
}

function assertEnglishPlatformOutputs(detail, expectedName, label) {
  const outputs = [
    ["English Prompt", detail.outputs.english],
    ["Midjourney Prompt", detail.outputs.midjourney],
    ["Flux Prompt", detail.outputs.flux]
  ];

  for (const [name, output] of outputs) {
    assert(
      output.includes(expectedName),
      `${label}: ${name} should include ${expectedName}`
    );
    assert(!containsChinese(output), `${label}: ${name} should not contain CJK`);
  }
}

function assertChineseOutputs(detail, expectedName, label) {
  assert(
    detail.outputs.chinese.includes(expectedName),
    `${label}: Chinese Prompt should include the Chinese object name`
  );
  assert(
    detail.outputs.gptImage.includes(expectedName),
    `${label}: GPT Image Prompt should include the Chinese object name`
  );
}

function assertSolutionPackage(detail, label) {
  const packageText = formatSolutionPackage(detail);

  assertText(packageText, `${label}: solution package should not be empty`);
  assert(
    packageText.includes(detail.title),
    `${label}: solution package should include the title`
  );
  assert(
    packageText.includes("Prompt"),
    `${label}: solution package should include prompt sections`
  );
  assert(
    packageText.includes("English Prompt"),
    `${label}: solution package should include English Prompt`
  );
}

function loadTsModule(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      resolveJsonModule: true,
      target: ts.ScriptTarget.ES2020
    },
    fileName: filePath
  }).outputText;

  const testModule = { exports: {} };
  const localRequire = (request) => {
    if (request.startsWith("@/")) {
      return require(path.join(projectRoot, "src", request.slice(2)));
    }

    if (request.startsWith(".")) {
      return require(path.resolve(path.dirname(filePath), request));
    }

    return require(request);
  };

  new Function(
    "require",
    "exports",
    "module",
    "__filename",
    "__dirname",
    compiled
  )(localRequire, testModule.exports, testModule, filePath, path.dirname(filePath));

  return testModule.exports;
}

function assertText(value, message) {
  assert(typeof value === "string" && value.trim().length > 0, message);
}

function assertObject(value, message) {
  assert(value && typeof value === "object", message);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function arraysEqual(first, second) {
  return (
    first.length === second.length &&
    first.every((item, index) => item === second[index])
  );
}

function containsChinese(value) {
  return /[\u3400-\u9fff]/.test(value);
}
