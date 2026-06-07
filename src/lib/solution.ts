import randomSubjectsData from "@/data/random-subjects.json";
import subjectDictionaryData from "@/data/subject-dictionary.json";
import type {
  CommercialGoal,
  FavoriteRecord,
  HistoryRecord,
  IterationAdvice,
  PlatformOutputKey,
  ProjectBrief,
  ProjectType,
  SolutionDetail,
  SolutionDirection,
  SolutionRules,
  SolutionTemplate,
  SubjectDictionaryEntry,
  UsageAdvice,
  VisualDirection
} from "@/types/solution";

const subjectDictionary = subjectDictionaryData as SubjectDictionaryEntry[];

type RandomSubjectRule = {
  zh: string;
  en: string;
  category: string;
  allowedTemplateCategories?: string[];
  blockedTemplateCategories?: string[];
};

const randomSubjectRules = randomSubjectsData as RandomSubjectRule[];
const safeSupplementTemplateCategories = new Set([
  "commercial-still",
  "ecommerce",
  "brand-advertising",
  "material-detail"
]);

export const defaultBrief: ProjectBrief = {
  objectName: "胡桃木休闲椅",
  englishProductName: "",
  projectType: "furniture-design",
  commercialGoals: ["premium-feel", "material-expression"],
  keywords: "胡桃木、黑色皮革、柔和自然光、不要复杂背景"
};

export const outputLabels: Record<PlatformOutputKey, string> = {
  chinese: "中文 Prompt",
  english: "English Prompt",
  midjourney: "Midjourney Prompt",
  flux: "Flux Prompt",
  gptImage: "GPT Image Prompt",
  negative: "Negative Prompt"
};

type SubjectContext = {
  objectNameZh: string;
  objectNameEn: string;
  category: string;
  allowedTemplateCategories: string[];
  blockedTemplateCategories: string[];
  materialHintsZh: string[];
  materialHintsEn: string[];
  visualHintsZh: string[];
  visualHintsEn: string[];
  recommendedDirections: string[];
  dictionaryEntry?: SubjectDictionaryEntry;
};

type EnglishDirectionCopy = {
  title: string;
  concept: string;
  composition: string;
  scene: string;
  cmf: string;
  lighting: string;
  camera: string;
  suitableScenes: string[];
  visualFocus: string[];
  recommendedAspectRatio: string;
  platformLabels: string[];
  unsuitableScenarios: string[];
};

const englishDirectionCopy: Record<string, EnglishDirectionCopy> = {
  "apple-hero": {
    title: "Apple-inspired website hero visual",
    concept:
      "The subject should feel like a premium product launch hero, with restrained styling, precise geometry, and strong first-screen clarity.",
    composition:
      "Use a centered or slightly floating hero composition with generous negative space and a clear product silhouette.",
    scene:
      "Place the product in a minimal workstation or clean website hero environment with a light neutral background.",
    cmf:
      "Emphasize aluminum, glass, matte surfaces, subtle bevels, controlled screen reflections, and believable contact shadows.",
    lighting:
      "Use soft studio lighting, low-contrast shadows, and a delicate rim highlight along the product edges.",
    camera:
      "Use a straight-on, slight top-down, or 45-degree product angle with a 50mm to 85mm commercial lens feel.",
    suitableScenes: ["官网 Hero", "新品发布", "科技品牌广告"],
    visualFocus: ["极简高级", "结构清晰", "精密材质"],
    recommendedAspectRatio: "16:9",
    platformLabels: ["MJ", "Flux", "GPT Image"],
    unsuitableScenarios: ["复杂功能说明图", "技术爆炸图", "强信息密度海报"]
  },
  "furniture-gallery": {
    title: "high-end furniture showroom render",
    concept:
      "The product should read as a premium furniture piece within a believable architectural showroom, not as an isolated object.",
    composition:
      "Use a mid-range spatial composition with the subject slightly below center, supported by calm architectural lines.",
    scene:
      "Set the product in a quiet modern gallery, low-saturation living space, or refined showroom interior.",
    cmf:
      "Highlight natural wood grain, leather, fabric, stone, or metal with authentic texture scale and restrained contrast.",
    lighting:
      "Use soft natural side light and ambient showroom light with clean floor shadows that explain the structure.",
    camera:
      "Use a 35mm to 50mm perspective from a slightly low or 45-degree viewpoint for believable room scale.",
    suitableScenes: ["家具官网", "作品集展示", "客户提案"],
    visualFocus: ["空间气质", "材质层次", "比例可信"],
    recommendedAspectRatio: "16:9",
    platformLabels: ["Flux", "GPT Image", "MJ"],
    unsuitableScenarios: ["白底电商强卖点图", "复杂功能说明图", "低价促销海报"]
  },
  "cmf-macro-study": {
    title: "CMF material macro study",
    concept:
      "The image should present the subject as part of a professional material research board, making material choices and surface logic visible.",
    composition:
      "Use a semi-top-down grid composition with the subject, color samples, and material swatches arranged in a clear visual system.",
    scene:
      "Use a design workbench, material sample table, neutral paper background, or clean research surface.",
    cmf:
      "Focus on texture, tactility, gloss level, edge finishing, material contrast, and physically plausible surface response.",
    lighting:
      "Use soft natural side light that preserves texture shadows without overexposure or excessive sharpness.",
    camera:
      "Use a 100mm macro or top-down detail perspective suitable for material samples and surface texture.",
    suitableScenes: ["CMF 研究", "作品集评审", "材质提案"],
    visualFocus: ["材质细节", "纹理尺度", "工艺逻辑"],
    recommendedAspectRatio: "4:3",
    platformLabels: ["Flux", "GPT Image", "MJ"],
    unsuitableScenarios: ["生活方式情绪广告", "强促销电商图", "人物场景大片"]
  },
  "jewelry-still-ad": {
    title: "premium jewelry still-life advertising",
    concept:
      "The image should feel like a carefully styled luxury still-life advertisement where light, material, and detail carry the value.",
    composition:
      "Place the subject near the visual center with a few premium props such as stone, velvet, or glass for depth.",
    scene:
      "Use a dark velvet surface, pale stone, mirrored tabletop, or refined studio still-life setting.",
    cmf:
      "Emphasize gemstone translucency, polished bead texture, metal highlights, and precise handcrafted detail.",
    lighting:
      "Use a large softbox with a narrow rim light and controlled highlights on crystal or metal edges.",
    camera:
      "Use a 100mm macro or 85mm still-life lens feel with shallow depth of field and sharp material detail.",
    suitableScenes: ["珠宝广告", "小红书封面", "礼品视觉"],
    visualFocus: ["高级感", "材质细节", "收藏属性"],
    recommendedAspectRatio: "4:5",
    platformLabels: ["MJ", "GPT Image", "Flux"],
    unsuitableScenarios: ["复杂功能说明图", "白底低价电商图", "技术拆解图"]
  },
  "oriental-bracelet": {
    title: "oriental quiet luxury bracelet still life",
    concept:
      "The image should express quiet cultural value through restrained styling, tactile materials, and calm Eastern-inspired atmosphere.",
    composition:
      "Let the bracelet rest in a natural loop or partial arc with generous negative space and subtle supporting props.",
    scene:
      "Use a tea-room tabletop, dark gray linen, pale rice paper, wood tray, or low-saturation stone surface.",
    cmf:
      "Emphasize crystal or jade texture, polished bead surfaces, warm wood, silver spacer beads, and handmade detail.",
    lighting:
      "Use soft side light from the front-left with gentle shadows and a warm, refined atmosphere.",
    camera:
      "Use an 85mm or 100mm macro close-up with clear detail and restrained sharpness.",
    suitableScenes: ["东方珠宝广告", "礼品视觉", "社媒封面"],
    visualFocus: ["东方轻奢", "温润材质", "文化气质"],
    recommendedAspectRatio: "4:5",
    platformLabels: ["GPT Image", "MJ", "Flux"],
    unsuitableScenarios: ["科技产品发布图", "强信息密度海报", "廉价促销图"]
  },
  "ecommerce-conversion": {
    title: "high-converting ecommerce main image",
    concept:
      "The image should communicate product value at first glance, with a large clear subject and only a few supportive scene cues.",
    composition:
      "Make the subject occupy roughly sixty to seventy-five percent of the frame with clean edges and direct readability.",
    scene:
      "Use a clean ecommerce background, light tabletop, or simple functional demonstration setting.",
    cmf:
      "Keep materials realistic, clear, and easy to judge in a small thumbnail without excessive artistic styling.",
    lighting:
      "Use high-key soft light and natural shadows to maintain crisp product recognition.",
    camera:
      "Use a front or 45-degree commercial product angle with a 50mm medium-close perspective.",
    suitableScenes: ["电商主图", "详情页头图", "转化广告"],
    visualFocus: ["主体突出", "卖点清晰", "小图可读"],
    recommendedAspectRatio: "1:1",
    platformLabels: ["Flux", "GPT Image", "MJ"],
    unsuitableScenarios: ["艺术装置海报", "复杂品牌大片", "作品集结构评审图"]
  },
  "industrial-portfolio": {
    title: "industrial design portfolio presentation",
    concept:
      "The visual should explain design logic, structure, proportion, and material decisions for a professional portfolio or review board.",
    composition:
      "Use a main hero view with detail windows or structured supporting views arranged with clear grid logic.",
    scene:
      "Use a white design board, studio desk, or clean technical presentation background.",
    cmf:
      "Differentiate structural parts, touch points, connectors, and decorative elements through coherent material logic.",
    lighting:
      "Use even studio lighting with stable shadows so the geometry remains easy to evaluate.",
    camera:
      "Use 45-degree, front, axonometric, or detail crop views depending on the product structure.",
    suitableScenes: ["作品集", "客户提案", "设计评审"],
    visualFocus: ["结构逻辑", "专业呈现", "比例关系"],
    recommendedAspectRatio: "16:9",
    platformLabels: ["GPT Image", "Flux", "MJ"],
    unsuitableScenarios: ["情绪化品牌大片", "社媒促销封面", "复杂人像场景"]
  },
  "beauty-fragrance-film": {
    title: "luxury beauty and fragrance campaign",
    concept:
      "The subject should exist inside a refined brand world with moisture, transparency, soft atmosphere, and elegant sensory cues.",
    composition:
      "Place the subject slightly below center with enough empty space for advertising layout and soft foreground depth.",
    scene:
      "Use a water surface, stone plinth, misty background, floral installation, or premium bathroom-like setting.",
    cmf:
      "Emphasize transparent glass, liquid refraction, metal caps, label texture, and delicate reflective highlights.",
    lighting:
      "Use translucent soft light, glass refraction, and subtle rim light without overexposing edges.",
    camera:
      "Use an 85mm to 100mm medium close-up or vertical campaign poster composition.",
    suitableScenes: ["美妆广告", "香氛海报", "社媒大片"],
    visualFocus: ["玻璃通透", "品牌情绪", "高级光感"],
    recommendedAspectRatio: "4:5",
    platformLabels: ["MJ", "GPT Image", "Flux"],
    unsuitableScenarios: ["技术结构说明图", "白底参数图", "工业设计评审板"]
  },
  "lifestyle-scene": {
    title: "lifestyle commercial photography",
    concept:
      "The image should show how the product belongs in a real but aspirational daily setting, connecting object, space, and user imagination.",
    composition:
      "Let the product and environment tell a shared story while keeping the subject clearly separated and recognizable.",
    scene:
      "Use a modern living room, cafe table, creative workstation, bedside area, or outdoor terrace.",
    cmf:
      "Let the product materials harmonize with the environment while preserving tactile quality and everyday warmth.",
    lighting:
      "Use natural window light, warm interior light, or early morning side light with a believable ambience.",
    camera:
      "Use a 35mm or 50mm medium shot with light depth of field and natural spatial relationships.",
    suitableScenes: ["生活方式广告", "官网场景图", "电商详情页"],
    visualFocus: ["真实使用", "生活品质", "场景价值"],
    recommendedAspectRatio: "4:5",
    platformLabels: ["Flux", "GPT Image", "MJ"],
    unsuitableScenarios: ["纯结构评审图", "技术爆炸图", "极简白底主图"]
  },
  "future-tech-render": {
    title: "futuristic product render",
    concept:
      "The subject should feel like a high-precision future device, emphasizing clean geometry, advanced materials, and controlled technology atmosphere.",
    composition:
      "Use a floating or glass-platform composition with clear structural lines and a pure spatial background.",
    scene:
      "Use a future lab, translucent glass platform, cool launch environment, or restrained technology space.",
    cmf:
      "Emphasize aluminum, glass, screen reflections, micro-textured plastic, and precise chamfered edges.",
    lighting:
      "Use cool linear light, rim lighting, and low-contrast ambient light without flashy neon clutter.",
    camera:
      "Use a 50mm straight or 45-degree angle that keeps the full structure visible.",
    suitableScenes: ["科技发布", "官网视觉", "概念产品展示"],
    visualFocus: ["未来感", "精密结构", "冷静科技"],
    recommendedAspectRatio: "16:9",
    platformLabels: ["MJ", "Flux", "GPT Image"],
    unsuitableScenarios: ["温暖家居生活图", "传统礼品包装图", "复杂信息海报"]
  },
  "minimal-still-life": {
    title: "minimal premium still-life photography",
    concept:
      "The image should prove design quality through restraint, material truth, balanced negative space, and quiet visual confidence.",
    composition:
      "Place the subject centered or slightly low with large negative space and a small number of geometric supporting props.",
    scene:
      "Use a neutral studio setup, pale stone, paper background, dark fabric, or seamless minimal space.",
    cmf:
      "Emphasize subtle surface detail, crisp edges, tactile quality, and quiet contrast between materials.",
    lighting:
      "Use a large soft light with slight side direction and clean shadows that do not overpower the subject.",
    camera:
      "Use an 85mm still-life lens feel with a stable medium-close composition.",
    suitableScenes: ["品牌官网", "高级静物", "包装提案"],
    visualFocus: ["克制留白", "真实材质", "低调高级"],
    recommendedAspectRatio: "1:1",
    platformLabels: ["GPT Image", "Flux", "MJ"],
    unsuitableScenarios: ["复杂功能说明图", "强促销活动海报", "多人物生活场景"]
  },
  "exhibition-key-visual": {
    title: "exhibition key visual",
    concept:
      "The product should become a memorable visual event for a launch, exhibition, or campaign rather than a simple object display.",
    composition:
      "Build a strong central visual focus with surrounding space reserved for layout, without generating readable text.",
    scene:
      "Use an abstract stage, material installation, architectural space, or launch-event background.",
    cmf:
      "Use material blocks, light, transparent media, reflections, and controlled spatial layers to create memorability.",
    lighting:
      "Use spotlights, volumetric light, stage ambience, or dramatic rim light while keeping a premium finish.",
    camera:
      "Use a vertical poster composition, widescreen key visual, or low-angle hero view.",
    suitableScenes: ["展会海报", "发布会 KV", "品牌传播"],
    visualFocus: ["仪式感", "视觉记忆", "海报级构图"],
    recommendedAspectRatio: "4:5",
    platformLabels: ["MJ", "GPT Image", "Flux"],
    unsuitableScenarios: ["电商白底首图", "技术爆炸图", "低调作品集页面"]
  }
};

export function getProjectType(
  rules: SolutionRules,
  id: string
): ProjectType {
  return rules.projectTypes.find((item) => item.id === id) ?? rules.projectTypes[0];
}

export function getGoals(
  rules: SolutionRules,
  ids: string[]
): CommercialGoal[] {
  const goals = ids
    .map((id) => rules.commercialGoals.find((goal) => goal.id === id))
    .filter(Boolean) as CommercialGoal[];

  return goals.length > 0 ? goals : [rules.commercialGoals[0]];
}

export function getDirection(
  rules: SolutionRules,
  id: string
): VisualDirection {
  return (
    rules.visualDirections.find((direction) => direction.id === id) ??
    rules.visualDirections[0]
  );
}

export function createBriefFromExample(
  rules: SolutionRules,
  index: number
): ProjectBrief {
  const example = rules.examples[index % rules.examples.length];

  return {
    objectName: example.subject,
    englishProductName: "",
    projectType: example.projectTypeId,
    commercialGoals: example.goalIds.slice(0, 2),
    keywords: example.keywords
  };
}

export function toggleGoal(current: string[], goalId: string) {
  if (current.includes(goalId)) {
    return current.filter((id) => id !== goalId);
  }

  return [...current, goalId].slice(-2);
}

export function generateSolutionDirections(
  rules: SolutionRules,
  brief: ProjectBrief
): SolutionDirection[] {
  const subject = resolveSubject(brief.objectName, brief.englishProductName);
  const objectText = normalize(`${subject.objectNameZh} ${brief.keywords}`);
  const projectType = getProjectType(rules, brief.projectType);
  const goals = getGoals(rules, brief.commercialGoals);
  const goalIds = goals.map((goal) => goal.id);

  const buildDirection = (template: SolutionTemplate, index: number) => {
    const direction = getDirection(rules, template.visualDirection);
    const directionCopy = getEnglishDirectionCopy(template.visualDirection);
    const templateCategory = template.templateCategory ?? "";
    const allowedCategoryScore =
      templateCategory &&
      subject.allowedTemplateCategories.includes(templateCategory)
        ? 720
        : 0;
    const suitableCategoryScore =
      subject.category && template.suitableCategories?.includes(subject.category)
        ? 420
        : 0;
    const projectScore = template.projectType === brief.projectType ? 120 : 0;
    const recommendedScore = projectType.recommendedDirections.includes(
      template.visualDirection
    )
      ? 48
      : 0;
    const subjectDirectionScore = subject.recommendedDirections.includes(
      template.visualDirection
    )
      ? 60
      : 0;
    const goalScore =
      goalIds.filter((goalId) => template.goal.includes(goalId)).length * 48;
    const subjectScore = template.suitableSubjects.some((keyword) =>
      objectText.includes(normalize(keyword))
    )
      ? 30
      : 0;
    const diversityScore = Math.max(0, 12 - index);

    return {
      id: template.id,
      title: template.title,
      summary: rewriteWithObject(template.summary, subject.objectNameZh),
      bestFor: direction.bestFor.join(" / "),
      suitableScenes: directionCopy.suitableScenes,
      visualFocus: [
        ...goals.map((goal) => goal.name),
        ...directionCopy.visualFocus
      ].slice(0, 3),
      recommendedAspectRatio: directionCopy.recommendedAspectRatio,
      platformLabels: directionCopy.platformLabels,
      commercialValue: rewriteWithObject(
        template.commercialValue,
        subject.objectNameZh
      ),
      score:
        allowedCategoryScore +
        suitableCategoryScore +
        projectScore +
        recommendedScore +
        subjectDirectionScore +
        goalScore +
        subjectScore +
        diversityScore,
      recommendedPlatforms: template.recommendedPlatforms,
      template
    };
  };

  let selected = rules.solutionTemplates
    .filter((template) => !isTemplateBlockedForSubject(template, subject))
    .map((template, index) => {
      return buildDirection(template, index);
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  if (selected.length < 3) {
    const selectedIds = new Set(selected.map((direction) => direction.id));
    const safeSupplements = rules.solutionTemplates
      .filter((template) => !selectedIds.has(template.id))
      .filter((template) => isSafeSupplementTemplate(template, subject))
      .map((template, index) => buildDirection(template, index + selected.length))
      .sort((a, b) => b.score - a.score);

    selected = [...selected, ...safeSupplements].slice(0, 6);
  }

  return selected;
}

export function buildSolutionDetail(
  rules: SolutionRules,
  brief: ProjectBrief,
  template: SolutionTemplate
): SolutionDetail {
  const subject = resolveSubject(brief.objectName, brief.englishProductName);
  const projectType = getProjectType(rules, brief.projectType);
  const goals = getGoals(rules, brief.commercialGoals);
  const direction = getDirection(rules, template.visualDirection);
  const directionCopy = getEnglishDirectionCopy(template.visualDirection);
  const keywords = brief.keywords.trim();
  const keywordSentence = keywords
    ? `同时把这些限制自然融入画面：${keywords}。`
    : "材质、颜色和背景应根据对象属性保持真实、克制，并服务商业表达。";

  const commercialPositioning = `${subject.objectNameZh}被定位为${projectType.name}项目中的商业视觉主角，画面重点服务${joinNames(goals)}，让观众第一眼理解对象价值、材质品质和适用场景。`;
  const concept = `${rewriteWithObject(template.concept, subject.objectNameZh)}${keywordSentence}`;
  const composition = rewriteWithObject(template.composition, subject.objectNameZh);
  const scene = rewriteWithObject(template.scene, subject.objectNameZh);
  const cmf = rewriteWithObject(template.cmf, subject.objectNameZh);
  const lighting = rewriteWithObject(template.lighting, subject.objectNameZh);
  const camera = rewriteWithObject(template.camera, subject.objectNameZh);
  const usageAdvice = buildUsageAdvice(template, directionCopy);
  const iterationAdvice = buildIterationAdvice(template.visualDirection);

  const promptContext: PromptContext = {
    subject,
    projectType,
    goals,
    template,
    direction,
    directionCopy,
    keywords,
    concept,
    composition,
    scene,
    cmf,
    lighting,
    camera
  };

  return {
    id: `${Date.now()}-${template.id}`,
    createdAt: new Date().toISOString(),
    title: `${subject.objectNameZh} - ${template.title}`,
    objectName: subject.objectNameZh,
    objectNameEn: subject.objectNameEn,
    projectTypeName: projectType.name,
    goalNames: goals.map((goal) => goal.name),
    commercialPositioning,
    concept,
    composition,
    scene,
    cmf,
    lighting,
    camera,
    usageAdvice,
    iterationAdvice,
    outputs: {
      chinese: buildChinesePrompt(promptContext),
      english: buildEnglishPrompt(promptContext),
      midjourney: buildMidjourneyPrompt(promptContext),
      flux: buildFluxPrompt(promptContext),
      gptImage: buildGptImagePrompt(promptContext),
      negative: buildNegativePrompt(template.visualDirection)
    },
    templateId: template.id
  };
}

export function createHistoryRecord(
  rules: SolutionRules,
  brief: ProjectBrief,
  solutionCount: number
): HistoryRecord {
  const projectType = getProjectType(rules, brief.projectType);
  const goals = getGoals(rules, brief.commercialGoals);

  return {
    id: `${Date.now()}-history`,
    createdAt: new Date().toISOString(),
    objectName: cleanObjectName(brief.objectName),
    projectTypeName: projectType.name,
    goalNames: goals.map((goal) => goal.name),
    solutionCount,
    brief: cloneBrief(brief)
  };
}

export function createFavoriteRecord(detail: SolutionDetail): FavoriteRecord {
  return {
    id: `${Date.now()}-favorite`,
    createdAt: new Date().toISOString(),
    title: detail.title,
    objectName: detail.objectName,
    projectTypeName: detail.projectTypeName,
    outputs: detail.outputs,
    detail
  };
}

export function formatSolutionPackage(detail: SolutionDetail) {
  return [
    detail.title,
    "",
    "商业定位",
    detail.commercialPositioning,
    "",
    "视觉概念",
    detail.concept,
    "",
    "构图策略",
    detail.composition,
    "",
    "场景环境",
    detail.scene,
    "",
    "CMF 策略",
    detail.cmf,
    "",
    "灯光策略",
    detail.lighting,
    "",
    "镜头建议",
    detail.camera,
    "",
    "使用建议",
    `推荐平台：${detail.usageAdvice.recommendedPlatforms.join("、")}`,
    `推荐画面比例：${detail.usageAdvice.aspectRatios.join("；")}`,
    `适合商业场景：${detail.usageAdvice.suitableScenarios.join("、")}`,
    `不适合：${detail.usageAdvice.unsuitableScenarios.join("、")}`,
    "",
    "出图迭代建议",
    `如果画面太乱：${detail.iterationAdvice.tooMessy}`,
    `如果材质不真实：${detail.iterationAdvice.unrealisticMaterial}`,
    `如果主体不突出：${detail.iterationAdvice.weakSubject}`,
    `如果画面廉价：${detail.iterationAdvice.cheapLook}`,
    "",
    "中文 Prompt",
    detail.outputs.chinese,
    "",
    "English Prompt",
    detail.outputs.english,
    "",
    "Midjourney Prompt",
    detail.outputs.midjourney,
    "",
    "Flux Prompt",
    detail.outputs.flux,
    "",
    "GPT Image Prompt",
    detail.outputs.gptImage,
    "",
    "Negative Prompt",
    detail.outputs.negative
  ].join("\n");
}

export function cloneBrief(brief: ProjectBrief): ProjectBrief {
  return {
    objectName: brief.objectName,
    englishProductName: brief.englishProductName ?? "",
    projectType: brief.projectType,
    commercialGoals: [...brief.commercialGoals],
    keywords: brief.keywords
  };
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

type PromptContext = {
  subject: SubjectContext;
  projectType?: ProjectType;
  goals?: CommercialGoal[];
  template: SolutionTemplate;
  direction: VisualDirection;
  directionCopy: EnglishDirectionCopy;
  keywords: string;
  concept: string;
  composition: string;
  scene: string;
  cmf: string;
  lighting: string;
  camera: string;
};

function buildChinesePrompt(context: PromptContext) {
  const goalText = context.goals ? joinNames(context.goals) : "商业视觉表达";
  const keywordText = context.keywords
    ? `画面需要自然融入这些设计限制：${context.keywords}。`
    : "";
  const hintText = context.subject.materialHintsZh.length
    ? `材质上重点关注${context.subject.materialHintsZh.join("、")}，视觉气质参考${context.subject.visualHintsZh.join("、")}。`
    : "";

  return ensureChineseText(
    `为${context.subject.objectNameZh}生成一张面向${goalText}的专业商业视觉图，整体采用${context.template.title}方向呈现。${context.concept}${keywordText}${hintText}${context.composition}，让主体在第一眼就具备清晰轮廓、可信比例和明确视觉重心。场景设置在${context.scene}，背景应专业、克制，并主动服务主体价值。材质表达围绕${context.cmf}展开，表面纹理、边缘高光、真实反射和接触阴影都要细腻可信。灯光采用${context.lighting}，镜头建议为${context.camera}，最终画面需要具有设计提案级完成度、商业发布质感和可直接用于人工智能出图的明确画面指令。`
  );
}

function buildEnglishPrompt(context: PromptContext) {
  const hintSentence = buildEnglishHintSentence(context);
  const keywordSentence = buildSafeEnglishKeywordSentence(context.keywords);

  return ensureEnglishText(
    `Create a polished commercial visual concept for ${context.subject.objectNameEn}, developed as a ${context.directionCopy.title}. The image should feel like a professional design proposal rather than a generic render or a plain packshot. ${context.directionCopy.concept} ${hintSentence} ${keywordSentence} ${context.directionCopy.composition} Place it in ${context.directionCopy.scene} Keep the environment controlled, premium, and free of visual noise. Emphasize ${context.directionCopy.cmf} Use ${context.directionCopy.lighting} and ${context.directionCopy.camera} The final image should be suitable for commercial presentation, brand communication, ecommerce, website hero use, or portfolio review, with high-end art direction and credible physical details.`
  );
}

function buildMidjourneyPrompt(context: PromptContext) {
  return ensureEnglishText(
    [
      context.subject.objectNameEn,
      context.directionCopy.title,
      context.direction.promptStyle,
      ...context.subject.visualHintsEn,
      ...context.subject.materialHintsEn,
      context.directionCopy.scene,
      context.directionCopy.composition,
      context.directionCopy.cmf,
      context.directionCopy.lighting,
      context.directionCopy.camera,
      "premium commercial visual",
      "realistic material response",
      "refined shadows",
      "clean edges",
      "high-end art direction",
      "ultra detailed",
      "--ar 16:9 --style raw"
    ]
      .filter(Boolean)
      .join(", ")
  );
}

function buildFluxPrompt(context: PromptContext) {
  const hintSentence = buildEnglishHintSentence(context);
  const keywordSentence = buildSafeEnglishKeywordSentence(context.keywords);

  return ensureEnglishText(
    `Create a realistic commercial product visual of ${context.subject.objectNameEn}. The direction is ${context.directionCopy.title}, with a clear difference from a simple product packshot. ${context.directionCopy.concept} ${hintSentence} ${keywordSentence} The composition should follow this intention: ${context.directionCopy.composition} The product is placed in ${context.directionCopy.scene} Material expression should focus on ${context.directionCopy.cmf} Use believable texture scale, coherent geometry, accurate reflections, clean edges, and natural contact shadows. Use ${context.directionCopy.lighting} and ${context.directionCopy.camera} The image should look refined, commercially usable, and consistent in structure and material behavior, without readable text, watermark, unwanted branding, or distorted forms.`
  );
}

function buildGptImagePrompt(context: PromptContext) {
  const keywordText = context.keywords
    ? `同时遵守这些补充要求：${context.keywords}。`
    : "材质、颜色和背景需要根据对象属性保持真实可信。";
  const hintText = context.subject.materialHintsZh.length
    ? `重点表现${context.subject.materialHintsZh.join("、")}，并体现${context.subject.visualHintsZh.join("、")}。`
    : "";

  return ensureChineseText(
    `生成一张${context.subject.objectNameZh}的专业商业视觉图，方向为${context.template.title}。画面不应是简单白底摆拍，而是一套完整的视觉方案，${context.template.concept}${keywordText}${hintText}${context.composition}，确保主体结构清楚、比例可信、边缘干净。场景使用${context.scene}，整体环境要服务对象价值，不要抢走视觉焦点。重点表现${context.cmf}，材质纹理、反射、光泽和阴影都要真实自然。灯光采用${context.lighting}，镜头使用${context.camera}。最终画面应适合商业发布、设计提案和人工智能出图使用，不要生成可读文字、水印或多余品牌标识。`
  );
}

function buildEnglishHintSentence(context: PromptContext) {
  const materialHints = context.subject.materialHintsEn.join(", ");
  const visualHints = context.subject.visualHintsEn.join(", ");

  if (!materialHints && !visualHints) {
    return "Use physically plausible materials, controlled lighting, and a premium commercial finish.";
  }

  return [
    materialHints ? `Material cues include ${materialHints}.` : "",
    visualHints ? `Visual cues include ${visualHints}.` : ""
  ]
    .filter(Boolean)
    .join(" ");
}

function buildSafeEnglishKeywordSentence(keywords: string) {
  if (!keywords.trim() || hasCjk(keywords)) {
    return "";
  }

  return `Additional art direction notes: ${ensureEnglishText(keywords)}.`;
}

function buildUsageAdvice(
  template: SolutionTemplate,
  directionCopy: EnglishDirectionCopy
): UsageAdvice {
  const platformSet = new Set([
    ...template.recommendedPlatforms,
    ...directionCopy.platformLabels
  ]);

  if (template.visualDirection === "jewelry-still-ad" || template.visualDirection === "oriental-bracelet") {
    platformSet.add("小红书封面");
  }

  if (template.visualDirection === "ecommerce-conversion") {
    platformSet.add("电商详情页");
  }

  return {
    recommendedPlatforms: Array.from(platformSet),
    aspectRatios: buildAspectRatioAdvice(directionCopy.recommendedAspectRatio),
    suitableScenarios: directionCopy.suitableScenes,
    unsuitableScenarios: directionCopy.unsuitableScenarios
  };
}

function buildAspectRatioAdvice(primaryRatio: string) {
  const common = [
    "4:5 适合小红书和竖版广告",
    "1:1 适合电商主图",
    "16:9 适合官网 Hero"
  ];

  return [
    `${primaryRatio} 是该方案的优先比例`,
    ...common.filter((item) => !item.startsWith(primaryRatio))
  ];
}

function buildIterationAdvice(visualDirection: string): IterationAdvice {
  const base = {
    tooMessy: "add clean background, minimal props, generous negative space",
    unrealisticMaterial:
      "add realistic material response, detailed surface texture, controlled reflections",
    weakSubject:
      "add centered product composition, clear silhouette, strong subject separation",
    cheapLook:
      "add premium editorial lighting, refined styling, restrained luxury atmosphere"
  };

  const overrides: Record<string, Partial<IterationAdvice>> = {
    "jewelry-still-ad": {
      tooMessy:
        "add minimal velvet or stone props, shallow depth of field, quiet luxury background",
      unrealisticMaterial:
        "add gemstone translucency, polished bead texture, controlled metal highlights",
      weakSubject:
        "add macro close-up composition, clear bracelet silhouette, strong subject separation",
      cheapLook:
        "add luxury jewelry lighting, refined highlights, premium still-life styling"
    },
    "oriental-bracelet": {
      tooMessy:
        "add restrained oriental styling, clean linen background, minimal tea-room props",
      unrealisticMaterial:
        "add natural stone inclusions, polished bead surface, soft controlled reflections",
      weakSubject:
        "add bracelet centered in a natural loop, clear silhouette, calm negative space",
      cheapLook:
        "add quiet luxury mood, warm side light, refined cultural atmosphere"
    },
    "furniture-gallery": {
      tooMessy:
        "add quiet showroom space, fewer decorative objects, clean architectural background",
      unrealisticMaterial:
        "add authentic wood grain, leather texture, natural contact shadows",
      weakSubject:
        "add hero furniture placement, clear outline, balanced showroom perspective",
      cheapLook:
        "add premium gallery lighting, refined interior styling, low-saturation palette"
    },
    "cmf-macro-study": {
      tooMessy:
        "add organized material grid, fewer swatches, clean research board layout",
      unrealisticMaterial:
        "add macro surface texture, tactile grain, accurate gloss level",
      weakSubject:
        "add main product anchor, clear material hierarchy, structured composition",
      cheapLook:
        "add professional CMF board styling, neutral studio light, precise material samples"
    },
    "ecommerce-conversion": {
      tooMessy:
        "add clean ecommerce background, fewer props, clear product-first composition",
      unrealisticMaterial:
        "add true-to-life product finish, natural shadow, accurate surface texture",
      weakSubject:
        "add large product scale, centered product hero, crisp edge separation",
      cheapLook:
        "add premium commercial lighting, refined tabletop styling, clean brand-like finish"
    },
    "apple-hero": {
      tooMessy:
        "add minimal workstation, generous negative space, clean website hero background",
      unrealisticMaterial:
        "add precise aluminum finish, controlled glass reflection, refined chamfer detail",
      weakSubject:
        "add floating hero composition, clear product silhouette, strong first-screen focus",
      cheapLook:
        "add Apple-inspired restraint, premium studio lighting, precise product styling"
    },
    "future-tech-render": {
      tooMessy:
        "add clean technology space, no neon clutter, minimal glass platform",
      unrealisticMaterial:
        "add physically plausible aluminum, glass, micro-textured plastic, accurate reflections",
      weakSubject:
        "add centered floating product, clear geometry, strong rim separation",
      cheapLook:
        "add restrained futuristic lighting, high-end launch visual, precision hardware finish"
    },
    "lifestyle-scene": {
      tooMessy:
        "add fewer lifestyle props, clear product zone, calm believable environment",
      unrealisticMaterial:
        "add natural tactile material response, believable contact shadows, coherent color temperature",
      weakSubject:
        "add stronger subject separation, foreground product clarity, guided environmental framing",
      cheapLook:
        "add premium lifestyle styling, editorial natural light, aspirational but restrained mood"
    },
    "beauty-fragrance-film": {
      tooMessy:
        "add fewer floral elements, soft mist background, clean campaign layout space",
      unrealisticMaterial:
        "add glass refraction, liquid transparency, controlled highlight edges",
      weakSubject:
        "add centered fragrance bottle, crisp bottle contour, strong reflective separation",
      cheapLook:
        "add luxury beauty campaign lighting, refined wet surface, elegant sensory atmosphere"
    }
  };

  return {
    ...base,
    ...overrides[visualDirection]
  };
}

function buildNegativePrompt(visualDirection: string) {
  const shared =
    "low resolution, wrong text, watermark, distorted structure, extra logo, cheap material quality, cluttered background, unnatural reflections";

  const additions: Record<string, string> = {
    "jewelry-still-ad":
      "plastic gemstones, fake metal shine, messy props, overexposed highlights",
    "oriental-bracelet":
      "fake stone texture, kitsch decoration, excessive cultural symbols",
    "furniture-gallery":
      "warped chair legs, impossible perspective, flat wood texture",
    "cmf-macro-study":
      "unrealistic texture scale, noisy material samples, dirty layout",
    "ecommerce-conversion":
      "crowded sales graphics, unreadable labels, distorted product shape",
    "apple-hero":
      "messy desk, excessive glow, random interface text, distorted screen",
    "future-tech-render":
      "neon clutter, sci-fi noise, broken hardware geometry",
    "beauty-fragrance-film":
      "fake glass, muddy liquid, harsh reflection, unreadable label",
    "lifestyle-scene":
      "messy room, distracting people, unclear subject, low-end styling"
  };

  return ensureEnglishText(
    [shared, additions[visualDirection]].filter(Boolean).join(", ")
  );
}

function isTemplateBlockedForSubject(
  template: SolutionTemplate,
  subject: SubjectContext
) {
  const templateCategory = template.templateCategory ?? "";

  return Boolean(
    (subject.category && template.blockedCategories?.includes(subject.category)) ||
      (templateCategory &&
        subject.blockedTemplateCategories.includes(templateCategory))
  );
}

function isSafeSupplementTemplate(
  template: SolutionTemplate,
  subject: SubjectContext
) {
  const templateCategory = template.templateCategory ?? "";

  return (
    safeSupplementTemplateCategories.has(templateCategory) &&
    !isTemplateBlockedForSubject(template, subject)
  );
}

function resolveSubject(
  objectName: string,
  englishProductName?: string
): SubjectContext {
  const objectNameZh = cleanObjectName(objectName);
  const userEnglishName = ensureEnglishText(englishProductName ?? "");
  const normalized = normalize(objectNameZh);
  const subjectRule = findSubjectRule(objectNameZh);
  const dictionaryEntry = subjectDictionary.find((entry) => {
    const entryName = normalize(entry.zh);
    return normalized === entryName || normalized.includes(entryName) || entryName.includes(normalized);
  });

  if (dictionaryEntry) {
    return {
      objectNameZh,
      objectNameEn:
        userEnglishName ||
        ensureEnglishText(dictionaryEntry.en) ||
        ensureEnglishText(subjectRule?.en ?? "") ||
        "generic commercial product",
      category: subjectRule?.category ?? dictionaryEntry.category,
      allowedTemplateCategories: subjectRule?.allowedTemplateCategories ?? [],
      blockedTemplateCategories: subjectRule?.blockedTemplateCategories ?? [],
      materialHintsZh: dictionaryEntry.materialHintsZh,
      materialHintsEn: dictionaryEntry.materialHintsEn.map(ensureEnglishText).filter(Boolean),
      visualHintsZh: dictionaryEntry.visualHintsZh,
      visualHintsEn: dictionaryEntry.visualHintsEn.map(ensureEnglishText).filter(Boolean),
      recommendedDirections: dictionaryEntry.recommendedDirections,
      dictionaryEntry
    };
  }

  const fallbackEn =
    userEnglishName ||
    ensureEnglishText(subjectRule?.en ?? "") ||
    (hasCjk(objectNameZh)
      ? "generic commercial product"
      : ensureEnglishText(objectNameZh) || "generic commercial product");

  return {
    objectNameZh,
    objectNameEn: fallbackEn,
    category: subjectRule?.category ?? "",
    allowedTemplateCategories: subjectRule?.allowedTemplateCategories ?? [],
    blockedTemplateCategories: subjectRule?.blockedTemplateCategories ?? [],
    materialHintsZh: [],
    materialHintsEn: [],
    visualHintsZh: [],
    visualHintsEn: [],
    recommendedDirections: []
  };
}

function findSubjectRule(objectName: string) {
  const normalized = normalize(objectName);

  return randomSubjectRules.find((entry) => {
    const entryName = normalize(entry.zh);
    return (
      normalized === entryName ||
      normalized.includes(entryName) ||
      entryName.includes(normalized)
    );
  });
}

function getEnglishDirectionCopy(visualDirection: string) {
  return englishDirectionCopy[visualDirection] ?? englishDirectionCopy["minimal-still-life"];
}

function rewriteWithObject(value: string, objectName: string) {
  return value.replace(/对象|产品/g, objectName);
}

function cleanObjectName(value: string) {
  return value.trim() || "设计对象";
}

function joinNames(goals: CommercialGoal[]) {
  return goals.map((goal) => goal.name).join("与");
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function hasCjk(value: string) {
  return /[\u3400-\u9fff]/.test(value);
}

function ensureEnglishText(value: string) {
  return value
    .replace(/[^\x00-\x7F]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:])/g, "$1")
    .trim();
}

function ensureChineseText(value: string) {
  return value
    .replace(/Apple/g, "极简科技")
    .replace(/Hero/g, "首屏")
    .replace(/AI/g, "人工智能")
    .replace(/CMF/g, "色彩材质工艺")
    .replace(/Midjourney/g, "绘图平台")
    .replace(/Flux/g, "绘图平台")
    .replace(/GPT Image/g, "绘图平台")
    .replace(/Macro/g, "微距")
    .replace(/mm/g, "")
    .replace(/[A-Za-z]/g, "")
    .replace(/\s+/g, "")
    .trim();
}
