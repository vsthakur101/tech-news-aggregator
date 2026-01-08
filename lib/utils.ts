import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { NewsCategory } from "@/types/news";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function categorizeArticle(tags: string[], title: string, description: string): NewsCategory {
  const content = `${tags.join(' ')} ${title} ${description}`.toLowerCase();

  if (
    /\b(cve|vulnerability|breach|security|hack|exploit|ransomware|malware|phishing|firewall|encryption|zero-day)\b/i.test(content)
  ) {
    return 'Security';
  }

  if (
    /\b(react|next\.?js|vue|angular|javascript|typescript|css|html|frontend|backend|fullstack|web development|svelte|tailwind)\b/i.test(content)
  ) {
    return 'Web Dev';
  }

  if (
    /\b(ai|artificial intelligence|machine learning|neural|tensorflow|pytorch|gpt|llm|deep learning|ml|data science)\b/i.test(content)
  ) {
    return 'AI/ML';
  }

  if (
    /\b(docker|kubernetes|k8s|ci\/cd|devops|aws|azure|gcp|cloud|deployment|terraform|ansible|jenkins)\b/i.test(content)
  ) {
    return 'DevOps';
  }

  if (
    /\b(ios|android|react native|flutter|swift|kotlin|mobile|app development)\b/i.test(content)
  ) {
    return 'Mobile';
  }

  if (
    /\b(github|open source|repository|contributions|oss|pull request|fork)\b/i.test(content)
  ) {
    return 'Open Source';
  }

  return 'Web Dev';
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes); // Minimum 1 minute
}
