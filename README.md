# 中文提示词库

一个面向产品设计师、家具设计师、CMF 设计师和 AI 绘图用户的专业级 Prompt Studio，使用 Next.js、Tailwind CSS、TypeScript 和本地 JSON 规则构建，不调用 AI 接口。

## 已实现功能

- 主体物库：405 个，主体物为必选项
- 风格库：114 种
- 材质库：114 种
- 场景库：112 种
- 镜头库：36 种
- 灯光库：36 种
- 用途库：36 种
- 多选组合生成中文、英文、Midjourney、Flux、GPT Image 五种结果
- 搜索全部标签、最近使用、历史记录、收藏组合
- 随机灵感、一键随机生成、组合数量统计

## 项目结构

```text
.
├── public/
│   └── designer-workspace.png
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── PromptCard.tsx
│   │   └── PromptExplorer.tsx
│   ├── data/
│   │   ├── studio-rules.json
│   │   ├── prompt-rules.json
│   │   └── prompts.json
│   └── types/
│       └── prompt.ts
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## 本地运行

```bash
npm install
npm run dev
```

也可以使用 pnpm：

```bash
pnpm install
pnpm dev
```

打开 http://localhost:3000 查看网站。

## 常用命令

```bash
npm run build
npm run start
npm run type-check
```
