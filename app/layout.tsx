import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tech News Aggregator - 11 Sources",
  description: "Stay updated with tech news from Dev.to, Hacker News, GitHub, Vercel, React, Meta, Google, Cloudflare, Reddit, Medium & more!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t py-6">
              <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                <p className="mb-1">
                  Aggregating from <strong>11 sources</strong>: Dev.to, Hacker News, NewsAPI, GitHub, Vercel, React, Meta, Google, Cloudflare, Reddit, Medium
                </p>
                <p className="text-xs">
                  Built with Next.js 16, TypeScript, and Tailwind CSS
                </p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
