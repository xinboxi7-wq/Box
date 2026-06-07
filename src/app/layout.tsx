import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Commercial Visual Studio",
  description:
    "面向产品设计师、CMF 设计师和 AI 绘图用户的本地规则商业视觉 Prompt Studio。"
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
