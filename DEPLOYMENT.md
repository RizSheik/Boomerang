# Deployment Checklist for Boomerang

## Pre-Deployment Checklist

### 1. Code Cleanup ✅
- [x] Removed unused dependencies (styled-components, or package)
- [x] Moved Firebase configuration to environment variables
- [x] Verified all sensitive data is in environment variables
- [x] Cleaned up unused imports and code

### 2. Environment Variables Setup

#### Create `.env.local` file with:
```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-03-20
SANITY_API_TOKEN=your_sanity_api_token_here
SANITY_API_READ_TOKEN=your_sanity_read_token_here

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id_here
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id_here

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Git Operations

```bash
# Add all changes
git add .

# Commit with descriptive message
git commit -m "Refactor code and move sensitive data to environment variables"

# Push to GitHub
git push origin main
```

### 4. Vercel Deployment Setup

#### 4.1 Connect Repository
- [ ] Go to [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Click "New Project"
- [ ] Import your GitHub repository
- [ ] Configure project settings

#### 4.2 Environment Variables in Vercel
Add these environment variables in Vercel Project Settings > Environment Variables:

**Production Environment:**
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `SANITY_API_TOKEN`
- `SANITY_API_READ_TOKEN`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
- `NEXT_PUBLIC_BASE_URL` (set to your production domain)

**Preview Environment:**
- Copy all variables from Production
- Set `NEXT_PUBLIC_BASE_URL` to your preview domain

#### 4.3 Build Settings
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### 5. Stripe Webhook Configuration

#### 5.1 In Stripe Dashboard
- [ ] Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
- [ ] Click "Add endpoint"
- [ ] Set endpoint URL: `https://your-domain.com/api/webhook`
- [ ] Select events: `checkout.session.completed`
- [ ] Copy webhook signing secret

#### 5.2 Update Environment Variables
- [ ] Add webhook secret to Vercel environment variables
- [ ] Verify `STRIPE_WEBHOOK_SECRET` is set correctly

### 6. Sanity Configuration

#### 6.1 CORS Settings
- [ ] Go to [Sanity Project Settings](https://www.sanity.io/manage)
- [ ] Add your production domain to CORS origins
- [ ] Add Vercel preview domains if needed

#### 6.2 API Tokens
- [ ] Verify `SANITY_API_TOKEN` has write permissions
- [ ] Verify `SANITY_API_READ_TOKEN` has read permissions

### 7. Firebase Configuration

#### 7.1 Authentication
- [ ] Go to [Firebase Console](https://console.firebase.google.com/)
- [ ] Add your production domain to authorized domains
- [ ] Verify OAuth redirect URLs are correct

#### 7.2 Security Rules
- [ ] Review and update Firebase security rules for production

### 8. Post-Deployment Verification

#### 8.1 Basic Functionality
- [ ] Homepage loads correctly
- [ ] Product pages work
- [ ] Authentication works
- [ ] Cart functionality works
- [ ] Checkout process works
- [ ] Webhooks are receiving events

#### 8.2 Performance
- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Verify image optimization

#### 8.3 Security
- [ ] Environment variables are not exposed in client
- [ ] API routes are protected
- [ ] No sensitive data in console logs

### 9. Monitoring Setup

#### 9.1 Error Tracking
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Configure webhook failure alerts

#### 9.2 Analytics
- [ ] Set up Google Analytics
- [ ] Configure conversion tracking

### 10. Backup and Recovery

#### 10.1 Database
- [ ] Set up Sanity dataset backups
- [ ] Document recovery procedures

#### 10.2 Code
- [ ] Ensure all changes are committed to Git
- [ ] Tag release versions

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables are set correctly
   - Verify all dependencies are installed
   - Check TypeScript compilation

2. **Webhook Failures**
   - Verify webhook secret is correct
   - Check webhook endpoint URL
   - Monitor Stripe dashboard for errors

3. **Authentication Issues**
   - Verify Firebase configuration
   - Check authorized domains
   - Verify OAuth redirect URLs

4. **CMS Issues**
   - Check Sanity API tokens
   - Verify CORS settings
   - Check dataset permissions

## Support

If you encounter issues during deployment:
1. Check Vercel build logs
2. Review environment variable configuration
3. Verify all external service configurations
4. Check browser console for client-side errors
