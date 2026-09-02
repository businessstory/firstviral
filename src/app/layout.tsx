import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatButton from "@/components/ChatButton";

export const metadata: Metadata = {
  title: "퍼스트 바이럴",
  description: "인스타그램/쓰레드 1:1 맞춤 컨설팅, 퍼스트 바이럴",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link rel="stylesheet" as="style" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css" />
      </head>
      <body className="min-h-full flex flex-col font-pretendard">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatButton />
      </body>
    </html>
  );
}
