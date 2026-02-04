# Netlify Deployment Setup for Feraj Energy Limited

## Status Update (February 4, 2026)
- Roles now supported: admin, co_admin, employee, customer (installer replaced by employee).
- Staff access: admin/co_admin/employee can access /admin; user management limited to admin/co_admin.
- Co-admins cannot change admin/co_admin roles; they can manage employee/customer roles.
- Per-user permissions added: can_manage_products, can_manage_tickets, can_promote_to_co_admin (admin-only).
- Audit & monitoring: /admin/audit shows activity feed + ticket queue; profile sensitive edits, role/permission changes, and product CRUD are logged.
- Product images: URL or device upload, max 4 images, 2MB per image, primary image = first.
- Environment files (.env, .env.local, etc.) must never be committed; use host env vars.
- Linting: Prettier applied; ESLint passes with warnings only (mostly any/fast-refresh).

## 🎯 Quick Setup Guide

Your repository: **https://github.com/onyangojerry/Feraj-Energy-Limited.git**

### Step 1: Push Latest Changes (if needed)
```bash
cd /path/to/your/local/Feraj
git add .
git commit -m "Add Netlify deployment configuration"
git push origin main
```

### Step 2: Connect to Netlify

1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up/Login** (use your GitHub account for easier connection)
3. **Click "New site from Git"**
4. **Choose GitHub** and authorize Netlify to access your repositories
5. **Select your repository**: `onyangojerry/Feraj-Energy-Limited`

### Step 3: Configure Build Settings

Netlify should auto-detect these settings from your `netlify.toml`, but verify:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: `20` (set in Environment variables)

### Step 4: Environment Variables (Optional)

If you need environment variables:
1. Go to **Site settings → Environment variables**
2. Add variables from `.env.example` (do not commit any `.env` files):
   ```
   NODE_VERSION = 20
   VITE_COMPANY_NAME = Feraj Solar Limited
   VITE_API_URL = https://api.ferajsolar.com/v1
   ```

### Step 5: Deploy!

Click **"Deploy site"** and wait for the build to complete (usually 2-3 minutes).

## 🔧 Build Configuration Explained

Your `netlify.toml` file provides:

```toml
[build]
  command = "npm run build"    # Vite build command
  publish = "dist"             # Output directory
  functions = "netlify/functions"

# SPA routing for React Router
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    # ... more security headers
```

## 🌐 After Deployment

### Your Site URLs:
- **Production**: `https://your-site-name.netlify.app`
- **Custom domain** (optional): Configure in Site settings → Domain management

### Automatic Features:
- ✅ **Branch deploys**: Every push creates a preview
- ✅ **HTTPS**: Automatically enabled
- ✅ **CDN**: Global content delivery
- ✅ **Form handling**: Ready for contact forms
- ✅ **Analytics**: Available in Netlify dashboard

## 🛠 Troubleshooting

### Build Fails?
1. Check **Deploy logs** in Netlify dashboard
2. Ensure `npm run build` works locally
3. Verify Node version (should be 20+)

### Site Not Loading?
1. Check **Functions** tab for errors
2. Verify **redirects** are working for React Router
3. Check browser console for JavaScript errors

### Need Updates?
Just push to GitHub - Netlify auto-deploys!

```bash
git add .
git commit -m "Update application"
git push origin main
```

## 📱 Preview Deployments

Every pull request and branch gets its own preview URL:
- **Branch**: `https://branch-name--your-site.netlify.app`
- **PR**: `https://deploy-preview-123--your-site.netlify.app`

Perfect for testing before merging!

## 🎉 You're All Set!

Your Feraj Solar Limited application will be live on Netlify with:
- Fast global CDN delivery
- Automatic HTTPS
- Continuous deployment from GitHub
- Preview deployments for testing

**Happy deploying!** 🌱⚡
