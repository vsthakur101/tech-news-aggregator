# Tech & Cybersecurity News Aggregator - 17 Sources Edition

A comprehensive Next.js application that aggregates tech and cybersecurity news from **17 diverse sources**, providing in-depth coverage from official tech company blogs, community platforms, security feeds, and vulnerability databases.

## 🎯 Features

### 📰 17 News Sources

#### Tech Sources (11)
- ✅ **Dev.to** - Developer community articles (20+ articles)
- ✅ **Hacker News** - Curated tech news with discussions (20+ articles)
- ⚠️ **NewsAPI** - Tech headlines (requires free API key)
- ✅ **GitHub Trending** - Popular open-source projects (15+ articles)
- ⚠️ **Vercel Blog** - Next.js & deployment news (RSS unavailable)
- ✅ **React Blog** - Official React updates (15+ articles)
- ✅ **Meta Engineering** - Meta tech insights (9+ articles)
- ✅ **Google Developers** - Google tech updates (15+ articles)
- ✅ **Cloudflare Blog** - Edge computing news (15+ articles)
- ✅ **Reddit** - r/javascript, r/reactjs, r/programming (30+ articles)
- ✅ **Medium** - Tech publications (10+ articles)

#### Cybersecurity Sources (6) - NEW
- ✅ **Bleeping Computer** - Security news and analysis (13+ articles)
- ✅ **SecurityWeek** - Enterprise security insights (10+ articles)
- ✅ **The Hacker News** - Latest cybersecurity news (15+ articles)
- ✅ **CISA Alerts** - Government security advisories (15+ articles)
- ✅ **GitHub Security** - Security advisories and CVEs (15+ articles)
- ✅ **NVD/CVE Database** - Latest vulnerability disclosures (15+ articles)

**Currently Working: 16/17 sources** providing **227+ articles**

### 🎨 Advanced Filtering
- **Source Filtering** - Toggle individual sources on/off
- **Category Filtering** - Security, Web Dev, AI/ML, DevOps, Mobile, Open Source
- **Real-time Search** - Search titles, descriptions, and tags
- **Smart Counter** - Shows filtered article count

### ⚡ Core Features
- **Bookmarks** - Save articles to read later (localStorage)
- **Dark Mode** - Beautiful light/dark themes
- **Server-Side Caching** - 5-10 minute revalidation for performance
- **Auto Deduplication** - Removes duplicate articles across sources
- **Responsive Design** - Perfect on mobile, tablet, and desktop

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- (Optional) Free NewsAPI key from [newsapi.org](https://newsapi.org/)

### Installation

1. **Navigate to project:**
```bash
cd tech-news-aggregator
```

2. **Install dependencies:**
```bash
npm install
```

3. **(Optional) Add NewsAPI key:**

Edit `.env.local`:
```env
NEWSAPI_KEY=your_api_key_here
```

### Development

Start the dev server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production

Build for production:
```bash
npm run build
npm start
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

**Quick Deploy:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
npm run deploy
```

**Or use Vercel Dashboard:**
1. Push code to GitHub/GitLab
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects Next.js settings
4. Deploy!

**See detailed deployment guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)

**Environment Variables (Optional):**
- `NEWSAPI_KEY` - Your NewsAPI key from [newsapi.org](https://newsapi.org/)

## 📊 Source Statistics

### Tech Sources
| Source | Status | Articles | Cache | Notes |
|--------|--------|----------|-------|-------|
| Dev.to | ✅ Working | ~20 | 5 min | Top weekly articles |
| Hacker News | ✅ Working | ~20 | 5 min | Top stories with discussions |
| NewsAPI | ⚠️ API Key | 0-20 | 10 min | Requires free API key |
| GitHub | ✅ Working | ~15 | 10 min | Trending repositories |
| Vercel | ⚠️ Unavailable | 0 | - | RSS feed not accessible |
| React | ✅ Working | ~15 | 5 min | Official React blog |
| Meta | ✅ Working | ~9 | 5 min | Engineering blog |
| Google | ✅ Working | ~15 | 5 min | Developers blog |
| Cloudflare | ✅ Working | ~15 | 5 min | Technology blog |
| Reddit | ✅ Working | ~30 | 10 min | Multiple tech subreddits |
| Medium | ✅ Working | ~10 | 5 min | Tech publications |

### Cybersecurity Sources
| Source | Status | Articles | Cache | Notes |
|--------|--------|----------|-------|-------|
| Bleeping Computer | ✅ Working | ~13 | 5 min | Security news RSS feed |
| SecurityWeek | ✅ Working | ~10 | 5 min | Enterprise security RSS |
| The Hacker News | ✅ Working | ~15 | 5 min | Latest cyber threats |
| CISA Alerts | ✅ Working | ~15 | 10 min | Gov security advisories |
| GitHub Security | ✅ Working | ~15 | 10 min | Security advisories API |
| NVD/CVE | ✅ Working | ~15 | 1 hour | Vulnerability database |

**Total: ~227 unique articles** after deduplication from 17 sources

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **RSS Parser**: rss-parser
- **Dark Mode**: next-themes
- **Icons**: lucide-react
- **State**: React hooks + localStorage

## 📁 Project Structure

```
tech-news-aggregator/
├── app/
│   ├── api/news/route.ts    # API endpoint for filtered news
│   ├── layout.tsx            # Root layout with theme provider
│   ├── page.tsx              # Home page with news feed
│   └── globals.css           # Global styles + Tailwind
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── BookmarkButton.tsx    # Bookmark toggle
│   ├── CategoryFilter.tsx    # Category filter chips
│   ├── Header.tsx            # App header
│   ├── NewsCard.tsx          # Article card
│   ├── NewsFeed.tsx          # Main feed with filtering
│   ├── SearchBar.tsx         # Debounced search
│   ├── SourceFilter.tsx      # NEW: Source toggle filter
│   └── ThemeToggle.tsx       # Dark mode toggle
├── lib/
│   ├── api/
│   │   ├── devto.ts         # Dev.to API
│   │   ├── hackernews.ts    # Hacker News API
│   │   ├── newsapi.ts       # NewsAPI
│   │   ├── github.ts        # GitHub API
│   │   ├── reddit.ts        # Reddit API
│   │   ├── blogs.ts         # RSS feeds (React, Meta, Google, etc.)
│   │   ├── security.ts      # Cybersecurity RSS feeds
│   │   └── nvd.ts           # NVD/CVE API client
│   ├── aggregator.ts        # Combines all 17 sources
│   ├── rss-parser.ts        # RSS feed parser utility
│   └── utils.ts             # Helper functions
├── types/news.ts            # TypeScript interfaces
├── hooks/useBookmarks.ts    # Bookmark management
├── vercel.json              # Vercel deployment config
└── .env.local               # API keys (git-ignored)
```

## 🎯 How It Works

### Data Aggregation
1. **Parallel Fetching** - All 17 sources fetched simultaneously
2. **Error Handling** - Failed sources don't block others
3. **Normalization** - Different APIs normalized to common format
4. **Deduplication** - Similar titles automatically removed
5. **Sorting** - Articles sorted by publish date (newest first)
6. **Caching** - Server-side caching respects rate limits

### Category Mapping
Articles auto-categorized using keyword matching:
- **Security**: CVE, vulnerability, breach, hack, exploit
- **Web Dev**: React, Next.js, JavaScript, TypeScript, CSS
- **AI/ML**: AI, machine learning, GPT, neural networks
- **DevOps**: Docker, Kubernetes, CI/CD, AWS, cloud
- **Mobile**: iOS, Android, React Native, Flutter
- **Open Source**: GitHub, open source, contributions

### Source Filtering
NEW feature - users can:
- Toggle any source on/off
- See article count update in real-time
- Combine with category and search filters
- Filter persists during session

## 🔧 Fixing Non-Working Sources

### Vercel Blog (Currently Unavailable)

**Issue**: Vercel's RSS feed returns 404

**Alternatives**:
1. **Remove it**: Comment out in `lib/aggregator.ts`
2. **Use Vercel Changelog**: Try scraping their changelog page
3. **GitHub Releases**: Monitor vercel/next.js releases
4. **Twitter/X**: Use Twitter API for @vercel tweets

To disable Vercel temporarily:
```typescript
// lib/aggregator.ts - Comment out this line:
// fetchVercelBlog(),
```

### NewsAPI (Requires API Key)

Get a free key from [newsapi.org](https://newsapi.org/) (100 requests/day):
```bash
# Add to .env.local
NEWSAPI_KEY=your_key_here
```

## 🎨 Customization

### Add More Categories

Edit `types/news.ts`:
```typescript
export type NewsCategory =
  | 'All'
  | 'Security'
  | 'Your Category'; // Add here
```

Update categorization in `lib/utils.ts`:
```typescript
if (/your-keywords/i.test(content)) {
  return 'Your Category';
}
```

### Add New Sources

1. **Create API client** in `lib/api/newsource.ts`
2. **Add to types** in `types/news.ts`
3. **Add to aggregator** in `lib/aggregator.ts`
4. **Add to source list** in `types/news.ts` (NEWS_SOURCES)

### Change Cache Duration

Edit API clients:
```typescript
fetch(url, { next: { revalidate: 300 } }) // 300 = 5 minutes
```

## 🐛 Troubleshooting

### No articles showing
- Check browser console for errors
- Verify dev server is running
- Try clearing browser cache
- Check if APIs are accessible

### Build errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Source returning 0 articles
- Check console logs for API errors
- Verify RSS feed URL is accessible
- Check if API requires authentication
- Try increasing cache revalidation time

## 📈 Performance

- **Initial Load**: ~1-2 seconds (cached)
- **Full Fetch**: ~5-7 seconds (all 17 sources)
- **Build Time**: ~5-7 seconds
- **Bundle Size**: Optimized with Next.js 16
- **Server Cache**: 5-60 minutes per source
- **Article Count**: 227+ articles aggregated

## 🚦 Rate Limits

### Tech Sources
| Source | Limit | Caching |
|--------|-------|---------|
| Dev.to | None | 5 min |
| Hacker News | None | 5 min |
| NewsAPI | 100/day | 10 min |
| GitHub | 60/hour (unauth) | 10 min |
| React Blog | None (RSS) | 5 min |
| Meta Blog | None (RSS) | 5 min |
| Google Blog | None (RSS) | 5 min |
| Cloudflare | None (RSS) | 5 min |
| Reddit | ~60/min | 10 min |
| Medium | None (RSS) | 5 min |

### Cybersecurity Sources
| Source | Limit | Caching |
|--------|-------|---------|
| Bleeping Computer | None (RSS) | 5 min |
| SecurityWeek | None (RSS) | 5 min |
| The Hacker News | None (RSS) | 5 min |
| CISA Alerts | None (RSS) | 10 min |
| GitHub Security | 60/hour (unauth) | 10 min |
| NVD/CVE | ~5 req/30sec | 1 hour |

## 🎓 Learning Resources

This project demonstrates:
- **Next.js 16** App Router & Server Components
- **TypeScript** with strict type safety
- **RSS Parsing** with rss-parser
- **API Integration** with multiple sources
- **State Management** with React hooks
- **Caching Strategies** for performance
- **Error Handling** with graceful fallbacks
- **Dark Mode** implementation
- **Responsive Design** with Tailwind

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Feel free to:
- Add new news sources
- Improve categorization logic
- Enhance UI/UX
- Fix bugs
- Optimize performance

## 🙏 Credits

**Tech Sources:**
- Dev.to, Hacker News, GitHub, React, Meta, Google, Cloudflare, Reddit, Medium, NewsAPI

**Security Sources:**
- Bleeping Computer, SecurityWeek, The Hacker News, CISA, GitHub Security, NVD/NIST

**Built with:**
- Next.js 16, TypeScript, Tailwind CSS v4
- shadcn/ui components
- rss-parser, next-themes, lucide-react

---

**Enjoy staying updated with the tech & security world! 🔒🚀**
