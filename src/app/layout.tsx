import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "水晶手串 AI 商业视觉案例库",
  description:
    "紫水晶、黄水晶、黑曜石手串的商业视觉 Prompt、构图分析和灯光分析案例库。"
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
