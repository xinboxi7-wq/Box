import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crystal Prompt Library - 水晶商业视觉 Prompt 库",
  description:
    "收录紫水晶、黄水晶、黑曜石等商业视觉案例，包含 AI Prompt、构图分析、灯光分析与风格拆解。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
