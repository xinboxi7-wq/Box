# zhuzi-style-creator

Codex skill for turning AI, business, technology, career, industry, and trend topics into short-video concepts and scripts using a Zhuzi/TzFilm-style teardown pattern.

## What It Helps With

- Topic framing for AI/business/trend short videos
- Title formulas and opening hooks
- Content structure and evidence checklist
- Risk boundaries and comment-section follow-up prompts
- Reusable creator workflow for Douyin/TikTok-style analysis videos

## Install

Install directly from this repository path:

```powershell
$target = "$env:USERPROFILE\.codex\skills\zhuzi-style-creator"
New-Item -ItemType Directory -Force -Path $target | Out-Null
Invoke-WebRequest "https://raw.githubusercontent.com/xinboxi7-wq/Box/main/skills/zhuzi-style-creator/SKILL.md" -OutFile "$target\SKILL.md"
New-Item -ItemType Directory -Force -Path "$target\agents" | Out-Null
Invoke-WebRequest "https://raw.githubusercontent.com/xinboxi7-wq/Box/main/skills/zhuzi-style-creator/agents/openai.yaml" -OutFile "$target\agents\openai.yaml"
```

Or clone the whole Box repository and copy the skill folder:

```powershell
git clone https://github.com/xinboxi7-wq/Box.git
Copy-Item -Recurse .\Box\skills\zhuzi-style-creator "$env:USERPROFILE\.codex\skills\zhuzi-style-creator"
```

Then start a new Codex session and invoke:

```text
Use $zhuzi-style-creator to turn this topic into a short-video title, opening hook, structure, and reusable creation checklist.
```

## Download Links

- Skill folder: https://github.com/xinboxi7-wq/Box/tree/main/skills/zhuzi-style-creator
- Raw `SKILL.md`: https://raw.githubusercontent.com/xinboxi7-wq/Box/main/skills/zhuzi-style-creator/SKILL.md
- Repository ZIP: https://github.com/xinboxi7-wq/Box/archive/refs/heads/main.zip

## Files

- `SKILL.md` - the Codex skill instructions
- `agents/openai.yaml` - optional UI metadata for Codex skill discovery

## Notes

This repository path contains only the reusable skill. It intentionally excludes the source analysis data, API tokens, generated summaries, and private working files from the original distillation project.
