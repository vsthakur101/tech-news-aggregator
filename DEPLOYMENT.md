# Deployment Guide - Vercel

This guide will help you deploy the Tech & Cybersecurity News Aggregator to Vercel.

## Prerequisites

- GitHub/GitLab/Bitbucket account
- Vercel account (sign up at https://vercel.com)
- Git repository for this project

## Quick Deploy (Recommended)

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project directory**
   ```bash
   vercel
   ```

   Follow the prompts:
   - Set up and deploy? `Y`
   - Which scope? Choose your account
   - Link to existing project? `N`
   - Project name? `tech-news-aggregator` (or your choice)
   - Directory? `./`
   - Override settings? `N`

4. **Deploy to production**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Push code to Git repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Tech & Cybersecurity News Aggregator"
   git branch -M main
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Project"
   - Select your Git repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables** (Optional)
   - Add `NEWSAPI_KEY` if you have one
   - Click "Deploy"

## Environment Variables

Add these in Vercel Dashboard → Project → Settings → Environment Variables:

| Variable | Value | Required |
|----------|-------|----------|
| `NEWSAPI_KEY` | Your NewsAPI key from https://newsapi.org | No (optional) |
| `NEXT_PUBLIC_APP_URL` | Your Vercel deployment URL | No (auto-set) |

## Post-Deployment

### 1. Update Environment Variable
After first deployment, update `NEXT_PUBLIC_APP_URL`:
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Update `NEXT_PUBLIC_APP_URL` to your actual Vercel URL (e.g., `https://tech-news-aggregator.vercel.app`)
- Redeploy

### 2. Custom Domain (Optional)
- Go to Vercel Dashboard → Your Project → Settings → Domains
- Add your custom domain
- Follow DNS configuration instructions

### 3. Verify Deployment
- Check all 17 news sources are fetching correctly
- Test dark mode toggle
- Test category and source filtering
- Test search functionality

## Build Configuration

The project is configured with:
- **Framework**: Next.js 16 (Auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Dev Command**: `npm run dev`

## Performance Optimization

Vercel automatically provides:
- ✅ Edge caching for API routes
- ✅ Image optimization
- ✅ Automatic code splitting
- ✅ CDN distribution
- ✅ Serverless functions

## Troubleshooting

### Build Fails
- Check build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### RSS Feeds Not Working
- Vercel Blog RSS is unavailable (404) - this is expected
- GitHub Security now uses REST API (should work)
- NVD API has rate limits (1 hour cache configured)

### Environment Variables Not Working
- Ensure variables are set in Vercel Dashboard
- Redeploy after adding variables
- Check variable names match exactly

### Slow Performance
- Check caching is working (5-10 min revalidation)
- Monitor Vercel Analytics
- Consider upgrading Vercel plan if needed

## Continuous Deployment

Vercel automatically redeploys when you push to your main branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

## Monitoring

- **Analytics**: Vercel Dashboard → Your Project → Analytics
- **Logs**: Vercel Dashboard → Your Project → Deployments → View Logs
- **Performance**: Check Web Vitals in Vercel Analytics

## Cost

- **Free Tier**: 100GB bandwidth/month, unlimited deployments
- **Pro Tier**: $20/month for advanced features
- **NewsAPI**: Free tier has 100 requests/day limit (configured with 10min cache)

## Security

Configured security headers in `vercel.json`:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- GitHub Issues: Create issue in your repository

## Quick Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List deployments
vercel list

# Remove deployment
vercel remove [deployment-url]
```

---

**Ready to deploy!** Choose Option 1 (CLI) for fastest deployment or Option 2 (Dashboard) for GUI-based setup.
