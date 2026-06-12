import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "水晶手串 AI 商业视觉案例库",
  description:
    "面向水晶商家、小红书卖家和电商运营，收录可复用的商品图、种草图、品牌广告图和礼赠场景 Prompt。"
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
