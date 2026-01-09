# Tech & Cybersecurity News Aggregator - 17 Sources Edition

A **feature-rich** Next.js application that aggregates tech and cybersecurity news from **17 diverse sources**, providing in-depth coverage from official tech company blogs, community platforms, security feeds, and vulnerability databases.

**✨ Now with Phase 1 features:** Search history, date filtering, keyboard shortcuts, reading streaks, multiple view modes, and more!

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

### 🎨 Advanced Filtering & Search
- **Source Filtering** - Toggle individual sources on/off with Select All/Clear All
- **Category Filtering** - Security, Web Dev, AI/ML, DevOps, Mobile, Open Source
- **Real-time Search** - Search titles, descriptions, and tags with debounce
- **Search History** - Recent searches dropdown (last 10 searches)
- **Date Range Filtering** - Filter by custom date ranges or quick filters (Today, Yesterday, Last 7/30 Days)
- **Unread Filter** - Toggle to show only unread articles
- **Smart Counter** - Shows filtered article count in real-time

### 🎯 Enhanced User Experience
- **Advanced Sorting** - Sort by date, source, or title
- **Multiple View Modes** - Grid (default), List (horizontal), or Compact (dense) views
- **Reading History** - Tracks read articles with visual indicators (dimmed opacity)
- **Reading Streak** - Gamification with consecutive day tracking and motivational milestones
- **Reading Time Estimates** - Shows estimated reading time for each article
- **Pagination** - 12 articles per page with smooth navigation
- **Cross-Tab Sync** - Reading history syncs across browser tabs in real-time

### ⌨️ Keyboard Shortcuts
Navigate the app efficiently with keyboard:
- **j/k** - Navigate next/previous article
- **o** - Open highlighted article
- **b** - Bookmark highlighted article
- **/** - Focus search bar
- **?** - Show keyboard shortcuts help
- **Esc** - Clear search/close modals

### ⚡ Core Features
- **Bookmarks** - Save articles to read later (localStorage)
- **Dark Mode** - Beautiful light/dark themes with custom theming
- **Server-Side Caching** - 5-10 minute revalidation for performance
- **Auto Deduplication** - Removes duplicate articles across sources
- **Responsive Design** - Perfect on mobile, tablet, and desktop
- **Offline Support** - Works offline with service worker caching

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
- **UI Components**: Radix UI primitives (@radix-ui/react-dialog, @radix-ui/react-label, @radix-ui/react-select)
- **RSS Parser**: rss-parser
- **Dark Mode**: next-themes
- **Icons**: lucide-react
- **State Management**: React hooks (useState, useCallback, useMemo)
- **Client Storage**: localStorage + IndexedDB (for future features)
- **Styling Utilities**: class-variance-authority (cva)

## 📁 Project Structure

```
tech-news-aggregator/
├── app/
│   ├── api/news/route.ts    # API endpoint for filtered news
│   ├── layout.tsx            # Root layout with theme provider
│   ├── page.tsx              # Home page with news feed
│   └── globals.css           # Global styles + Tailwind
├── components/
│   ├── ui/                   # shadcn/ui components (button, card, badge, etc.)
│   │   ├── dialog.tsx        # Dialog component for modals
│   │   ├── label.tsx         # Label component
│   │   └── select.tsx        # Select dropdown component
│   ├── AdvancedSearchPanel.tsx    # Date range filtering
│   ├── BookmarkButton.tsx         # Bookmark toggle
│   ├── CategoryFilter.tsx         # Category filter chips
│   ├── Header.tsx                 # App header
│   ├── KeyboardShortcutsHelp.tsx  # Keyboard shortcuts modal
│   ├── NewsCard.tsx               # Article card with view modes
│   ├── NewsFeed.tsx               # Main feed with filtering
│   ├── Pagination.tsx             # Pagination controls
│   ├── SearchBar.tsx              # Search with history dropdown
│   ├── SortControls.tsx           # Sorting and view mode controls
│   ├── SourceFilter.tsx           # Source toggle filter
│   └── ThemeToggle.tsx            # Dark mode toggle
├── hooks/
│   ├── useBookmarks.ts      # Bookmark management
│   ├── useKeyboardShortcuts.ts    # Keyboard navigation
│   ├── useReadingHistory.ts       # Reading history tracking
│   ├── useSearchHistory.ts        # Search history management
│   ├── useStreak.ts               # Reading streak tracking
│   └── useUserPreferences.ts      # User preferences (sort, view, etc.)
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
│   └── utils.ts             # Helper functions (categorization, etc.)
├── types/news.ts            # TypeScript interfaces
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

### Advanced Filtering System
Users can combine multiple filters:
- **Source Filtering**: Toggle individual sources on/off with Select All/Clear All
- **Category Filtering**: Filter by Security, Web Dev, AI/ML, DevOps, Mobile, Open Source
- **Text Search**: Real-time search with debounce and search history
- **Date Range**: Custom date ranges or quick filters (Today, Yesterday, Last 7/30 Days)
- **Read Status**: Show all or unread only
- **Sorting**: By date, source, or title
- Filters persist during session via localStorage
- Real-time article count updates

### User Experience Enhancements
- **Reading History**: Tracks clicked articles, dims read articles, syncs across tabs
- **Reading Streak**: Gamification with consecutive day tracking and motivational milestones
- **Keyboard Navigation**: Vim-style navigation (j/k) with visual highlighting
- **Search History**: Recent searches dropdown with individual/bulk removal
- **Pagination**: 12 articles per page with smooth scrolling
- **View Modes**: Switch between Grid (cards), List (horizontal), or Compact (dense) layouts
- **Reading Time**: Estimated reading time for each article

## ✨ Phase 1 Features (Completed)

All 16 Phase 1 features are now live:

### 🔍 Enhanced Search
- ✅ Search history with dropdown (last 10 searches)
- ✅ Date range filtering with quick filters
- ✅ Advanced search panel (collapsible)
- ✅ Real-time search with debounce
- ✅ Click outside to dismiss dropdowns

### 📊 Advanced Controls
- ✅ Sort by date, source, or title
- ✅ View modes: Grid, List, Compact
- ✅ Show unread only toggle
- ✅ Select All / Clear All sources
- ✅ Persistent preferences (localStorage)

### 📖 Reading Experience
- ✅ Reading history tracking
- ✅ Reading streak with milestones (1, 3, 7, 14, 30, 50, 100 days)
- ✅ Read articles dimmed (opacity 60%)
- ✅ Cross-tab sync for reading history
- ✅ Reading time estimates

### ⌨️ Keyboard Shortcuts
- ✅ j/k - Navigate articles with visual highlighting
- ✅ o - Open article in new tab
- ✅ b - Bookmark article
- ✅ / - Focus search bar
- ✅ ? - Show keyboard shortcuts help modal
- ✅ Esc - Clear search / Close modals

### 📄 Pagination
- ✅ 12 articles per page
- ✅ Smooth scroll to top on page change
- ✅ Auto-reset page when filters change
- ✅ "Showing X-Y of Z articles" counter

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

## 📘 Usage Guide

### How to Use Search Features
1. **Basic Search**: Type in the search bar - results update in real-time
2. **Search History**: Click the search bar to see recent searches, click any to reuse
3. **Date Filtering**: Click "Advanced Search" to filter by date ranges or use quick filters
4. **Clear Filters**: Use the "Clear" button in Advanced Search or "Clear All" in sources

### How to Navigate with Keyboard
1. Press **?** anytime to see all keyboard shortcuts
2. Use **j/k** to navigate through articles (blue ring shows current article)
3. Press **o** to open the highlighted article in a new tab
4. Press **b** to bookmark the highlighted article
5. Press **/** to quickly jump to the search bar

### How to Customize Your View
1. **Sorting**: Use the sort dropdown to sort by date, source, or title
2. **View Modes**: Toggle between Grid (cards), List (horizontal), or Compact (dense)
3. **Unread Only**: Click the "Unread Only" button to hide read articles
4. **Sources**: Use "Select All" or "Clear All" to quickly manage source filters

### How to Track Your Reading
1. Your reading streak appears in the stats (consecutive days you've read articles)
2. Read articles are dimmed (60% opacity) so you can easily spot new content
3. Click any article to mark it as read and update your streak
4. Your reading history syncs across all tabs automatically

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
- **React Hooks** - useState, useCallback, useMemo, useEffect, useRef
- **Custom Hooks** - Building reusable logic (useKeyboardShortcuts, useSearchHistory, useStreak)
- **RSS Parsing** with rss-parser
- **API Integration** with multiple sources
- **State Management** with React hooks + localStorage
- **Performance Optimization** - Memoization, debouncing, pagination
- **Caching Strategies** for API responses
- **Error Handling** with graceful fallbacks
- **Dark Mode** implementation with next-themes
- **Responsive Design** with Tailwind CSS v4
- **Radix UI** - Accessible component primitives
- **Keyboard Navigation** - Global keyboard event handling
- **Local Storage** - Persisting user data across sessions
- **Cross-Tab Communication** - Storage events for real-time sync
- **Modal Dialogs** - Building accessible modals
- **Gamification** - Streak tracking and user engagement
- **Advanced Filtering** - Combining multiple filter types
- **Component Composition** - Building complex UIs from primitives

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
- shadcn/ui components + Radix UI primitives
- rss-parser, next-themes, lucide-react, class-variance-authority

---

## 🎉 What's New in Phase 1

This release brings **16 major features** to enhance your news reading experience:

- 🔍 **Search History** - Never forget what you searched for
- 📅 **Date Filtering** - Find articles from specific time periods
- ⌨️ **Keyboard Shortcuts** - Navigate like a power user
- 🎯 **Reading Streaks** - Build a daily reading habit
- 📊 **Multiple Views** - Grid, List, or Compact layouts
- 📖 **Reading History** - Track what you've read across tabs
- 🎨 **Advanced Sorting** - Sort by date, source, or title
- 📄 **Smart Pagination** - 12 articles per page with smooth navigation

**Enjoy staying updated with the tech & security world! 🔒🚀**
