import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tech & Cybersecurity News Aggregator - 17 Sources",
  description: "Comprehensive tech & cybersecurity news from 17 sources: Dev.to, Hacker News, GitHub, React, Meta, Google, Cloudflare, Reddit, Medium, Bleeping Computer, SecurityWeek, The Hacker News, CISA, GitHub Security, NVD/CVE & more!",
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
                <p className="mb-1 font-medium">
                  Aggregating from <strong>17 sources</strong>
                </p>
                <p className="mb-1 text-xs">
                  <strong>Tech:</strong> Dev.to, Hacker News, GitHub, React, Meta, Google, Cloudflare, Reddit, Medium, NewsAPI
                </p>
                <p className="mb-2 text-xs">
                  <strong>Security:</strong> Bleeping Computer, SecurityWeek, The Hacker News, CISA, GitHub Security, NVD/CVE
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
