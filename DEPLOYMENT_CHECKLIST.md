# Vercel Deployment Checklist ✅

Quick checklist to ensure your Tech & Cybersecurity News Aggregator is ready for deployment.

## Pre-Deployment Checklist

### 1. Environment Variables (Optional)
- [ ] Add `NEWSAPI_KEY` if you have one from [newsapi.org](https://newsapi.org/)
- [ ] Keep `.env.local` in .gitignore (already configured)

### 2. Build Test
```bash
# Test production build locally
npm run build
npm start
```
- [ ] Build completes without errors
- [ ] All 16-17 sources are fetching articles
- [ ] No TypeScript errors
- [ ] Application runs on http://localhost:3000

### 3. Git Repository
```bash
# Initialize git if not already done
git init
git add .
git commit -m "feat: Tech & Cybersecurity News Aggregator with 17 sources"
git branch -M main
```
- [ ] Code committed to git
- [ ] `.env.local` is not committed (check with `git status`)
- [ ] Push to GitHub/GitLab/Bitbucket

## Deployment Options

### Option A: Vercel CLI (Fastest)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to your Vercel account
vercel login

# Deploy to preview
npm run deploy:preview

# Deploy to production
npm run deploy
```

### Option B: Vercel Dashboard (GUI)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your repository
4. Vercel auto-detects Next.js settings
5. Add environment variables (optional):
   - `NEWSAPI_KEY` (if you have one)
6. Click "Deploy"

## Post-Deployment Checklist

### 1. Verify Deployment
- [ ] Visit your deployment URL (e.g., `https://your-app.vercel.app`)
- [ ] Check all pages load correctly
- [ ] Test dark mode toggle
- [ ] Test category filtering
- [ ] Test source filtering
- [ ] Test search functionality
- [ ] Test bookmarks (localStorage)

### 2. Check Sources
Open browser console and verify:
- [ ] 16-17 sources returning articles
- [ ] No CORS errors
- [ ] No API authentication errors
- [ ] Check console logs for source counts

### 3. Performance
- [ ] Initial page load < 3 seconds
- [ ] Images load properly
- [ ] Filtering is responsive
- [ ] No console errors

## Optional: Custom Domain

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Configure DNS records:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. Wait for DNS propagation (5-30 minutes)

## Environment Variables (if needed)

Add in Vercel Dashboard → Project → Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEWSAPI_KEY` | Your API key | Production, Preview, Development |

## Troubleshooting

### Build Fails
```bash
# Clear Next.js cache and rebuild
rm -rf .next
npm run build
```

### Missing Environment Variables
- Add them in Vercel Dashboard
- Redeploy after adding variables

### Sources Not Working
- Check rate limits (especially NVD/CVE: 1 hour cache)
- Verify RSS feeds are accessible
- GitHub Security requires proper headers (already configured)

### Slow Performance
- Check Vercel Analytics for bottlenecks
- Verify caching is working (check response headers)
- Consider upgrading Vercel plan if needed

## Monitoring After Deployment

### Vercel Dashboard
- **Analytics**: Monitor page views and performance
- **Logs**: Check for runtime errors
- **Deployments**: View deployment history

### Check These Metrics
- Web Vitals (LCP, FID, CLS)
- Error rate
- Source fetch success rate
- Cache hit rate

## Continuous Deployment

Once deployed, Vercel automatically redeploys on push:

```bash
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin main

# Vercel automatically deploys!
```

## URLs to Bookmark

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Deployment Logs**: Your Project → Deployments → View Logs
- **Analytics**: Your Project → Analytics
- **Settings**: Your Project → Settings

## Quick Commands Reference

```bash
# Development
npm run dev          # Start dev server

# Building
npm run build        # Build for production
npm start            # Run production build

# Deployment
npm run deploy:preview   # Deploy to preview (vercel)
npm run deploy           # Deploy to production (vercel --prod)

# Vercel CLI
vercel               # Deploy preview
vercel --prod        # Deploy production
vercel logs          # View logs
vercel list          # List deployments
```

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Support**: https://vercel.com/support
- **Deployment Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## ✅ Final Checklist Before Going Live

- [ ] All tests passing
- [ ] Build succeeds locally
- [ ] Environment variables configured
- [ ] Code pushed to Git
- [ ] Deployed to Vercel
- [ ] Custom domain configured (optional)
- [ ] Sources verified working
- [ ] Performance tested
- [ ] Analytics configured
- [ ] Bookmarked Vercel dashboard

**Ready to deploy! 🚀**

Run: `npm run deploy`
