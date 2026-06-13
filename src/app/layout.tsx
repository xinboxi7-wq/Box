import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const siteUrl = "https://box-cyan-one.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "水晶手串 AI 商业视觉案例库",
  description:
    "面向水晶商家、小红书卖家和电商运营，收录可复用的商品图、种草图、品牌广告图和礼赠场景 Prompt。",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "水晶手串 AI 商业视觉案例库",
    description:
      "可复用的水晶手串商品图、种草图、品牌广告图、礼赠场景案例与模型 Prompt。",
    url: siteUrl,
    siteName: "水晶手串 AI 商业视觉案例库",
    locale: "zh_CN",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
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
