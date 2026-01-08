"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { RefreshCw, Quote, ExternalLink, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Fallback quotes for when API fails
const FALLBACK_QUOTES = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
  },
  {
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House",
  },
  {
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
  },
  {
    text: "The best error message is the one that never shows up.",
    author: "Thomas Fuchs",
  },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  {
    text: "Programs must be written for people to read, and only incidentally for machines to execute.",
    author: "Harold Abelson",
  },
  {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
  },
];

export function DailyQuote() {
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string>("");

  const fetchFromAPI = async (
    url: string,
    apiName: string
  ): Promise<{ text: string; author: string } | null> => {
    try {
      console.log(`Trying ${apiName} API...`);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json, text/plain, */*",
          "User-Agent": "Mozilla/5.0 (compatible; NewsAggregator/1.0)",
        },
      });

      if (!response.ok) {
        console.warn(
          `${apiName} HTTP error: ${response.status} ${response.statusText}`
        );
        return null;
      }

      if (!response.ok) {
        throw new Error(`${apiName}: HTTP ${response.status}`);
      }

      if (apiName === "Advice Slip") {
        const result = await response.json();
        if (result && result.slip && result.slip.advice) {
          return {
            text: result.slip.advice,
            author: "Advice Generator"
          };
        }
      } else if (apiName === "Quotable") {
        const result = await response.json();
        if (result && result.content) {
          return {
            text: result.content,
            author: result.author || "Unknown",
          };
        }
      } else if (apiName === "What Is Me") {
        const result = await response.json();
        if (result && result.text) {
          return {
            text: result.text,
            author: "What Is Me"
          };
        }
      }

      return null;
    } catch (err) {
      console.warn(`${apiName} failed:`, err);
      return null;
    }
  };

  const fetchQuote = async (useCache: boolean = true) => {
    try {
      // Check cache first
      const today = new Date().toDateString();
      const cachedQuote = localStorage.getItem("daily-quote");
      const cachedDate = localStorage.getItem("quote-date");

      if (useCache && cachedDate === today && cachedQuote) {
        const parsed = JSON.parse(cachedQuote);
        setQuote(parsed);
        setLastRefresh(today);
        setIsLoading(false);
        return;
      }

      // Try all APIs concurrently for faster response
      const apiConfigs = [
        { url: "https://api.adviceslip.com/advice", name: "Advice Slip" }, // Very reliable
        { url: "https://api.quotable.io/random", name: "Quotable" },
        { url: "https://api.whatthatis.me/recent", name: "What Is Me" }, // Backup simple API
      ];

      const results = await Promise.allSettled(
        apiConfigs.map(config => fetchFromAPI(config.url, config.name))
      );

      // Find first successful result
      let result = null;
      for (let i = 0; i < results.length; i++) {
        const apiResult = results[i];
        if (apiResult.status === 'fulfilled' && apiResult.value) {
          result = apiResult.value;
          console.log(`Successfully fetched quote from ${apiConfigs[i].name}`);
          break;
        } else if (apiResult.status === 'rejected') {
          console.warn(`${apiConfigs[i].name} rejected:`, apiResult.reason);
        }
      }

      if (result) {
        setQuote(result);
        setError(null);

        // Cache quote for today
        localStorage.setItem("daily-quote", JSON.stringify(result));
        localStorage.setItem("quote-date", today);
        setLastRefresh(today);
      } else {
        throw new Error("All APIs failed");
      }
    } catch (err) {
      console.error("Error fetching quote:", err);
      setError("All APIs unavailable. Using fallback quotes.");

      // Use fallback quote
      const randomFallback =
        FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
      setQuote(randomFallback);

      const today = new Date().toDateString();
      setLastRefresh(today);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchQuote(true);
  }, []);

  const getNewQuote = async () => {
    setIsRefreshing(true);
    // Force refresh by bypassing cache
    await fetchQuote(false);
  };

  const getCategoryFromQuote = (quoteText: string): string => {
    const text = quoteText.toLowerCase();

    if (
      text.includes("code") ||
      text.includes("programm") ||
      text.includes("software") ||
      text.includes("develop")
    ) {
      return "Programming";
    } else if (
      text.includes("innovat") ||
      text.includes("lead") ||
      text.includes("leader")
    ) {
      return "Leadership";
    } else if (
      text.includes("learn") ||
      text.includes("mistak") ||
      text.includes("experi")
    ) {
      return "Learning";
    } else if (text.includes("design") || text.includes("simplic")) {
      return "Design";
    } else if (text.includes("believ") || text.includes("confid")) {
      return "Confidence";
    } else if (
      text.includes("success") ||
      text.includes("achiev") ||
      text.includes("goal")
    ) {
      return "Success";
    } else if (
      text.includes("work") ||
      text.includes("passion") ||
      text.includes("love")
    ) {
      return "Passion";
    } else if (
      text.includes("hard") ||
      text.includes("difficult") ||
      text.includes("imposs")
    ) {
      return "Challenge";
    } else {
      return "Inspiration";
    }
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      Programming:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Leadership:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Learning:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      Design: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      Confidence:
        "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
      Success:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      Passion: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      Challenge:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      Inspiration:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    };

    return colors[category] || colors["Inspiration"];
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Quote className="h-5 w-5" />
            Daily Quote
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 animate-pulse">
            <div className="h-16 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-8 bg-muted rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!quote) {
    return null;
  }

  const category = getCategoryFromQuote(quote.text);
  const categoryColor = getCategoryColor(category);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Quote className="h-5 w-5" />
            Daily Quote
          </div>
          <div className="flex items-center gap-1">
            {error && (
              <div className="relative group">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <div className="absolute right-0 top-6 w-48 p-2 bg-background border rounded-md shadow-md text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {error}
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={getNewQuote}
              disabled={isRefreshing}
              className="h-8 w-8 p-0"
              title="Get new quote"
            >
              <RefreshCw
                className={cn("h-4 w-4", isRefreshing && "animate-spin")}
              />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quote content */}
        <div className="space-y-3">
          <div className="relative">
            <Quote className="absolute -top-2 -left-2 h-8 w-8 text-muted-foreground/20" />
            <p className="pl-6 italic text-sm leading-relaxed">
              "{quote.text}"
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              — {quote.author}
            </p>
            <span
              className={cn(
                "text-xs px-2 py-1 rounded-full font-medium",
                categoryColor
              )}
            >
              {category}
            </span>
          </div>
        </div>

        {/* Daily indicator */}
        {lastRefresh && (
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            {new Date(lastRefresh).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        )}

        {/* Quick action */}
        <div className="pt-2 space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={getNewQuote}
            disabled={isRefreshing}
            className="w-full"
          >
            {isRefreshing ? "Loading..." : "Get Inspired 💫"}
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>Powered by</span>
            <a
              href="https://api.adviceslip.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              Advice Slip
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
