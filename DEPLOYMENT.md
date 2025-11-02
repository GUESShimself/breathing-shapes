# Deploying to GitHub Pages

Your app is now configured for easy deployment to GitHub Pages!

## Quick Start

### Option 1: Automated Deployment (Recommended)

1. **Install dependencies** (if you haven't already):
   ```bash
   npm install
   ```

2. **Initialize Git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **Create a GitHub repository**:
   - Go to https://github.com/new
   - Create a new repository (e.g., `breathing-shapes`)
   - Don't initialize with README (you already have one)

4. **Connect your local repo to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/breathing-shapes.git
   git branch -M main
   git push -u origin main
   ```

5. **Deploy with one command**:
   ```bash
   npm run deploy
   ```

6. **Access your app**:
   - Go to your repository settings → Pages
   - Your site will be live at: `https://YOUR-USERNAME.github.io/breathing-shapes/`

### Option 2: GitHub Actions (Automatic deployment on push)

Create a file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Then:
1. Push this file to GitHub
2. Go to Settings → Pages
3. Set Source to "GitHub Actions"
4. Every push to `main` will auto-deploy!

## Configuration

### Using a Custom Domain

If you have a custom domain:

1. Update [vite.config.ts](vite.config.ts:9):
   ```typescript
   base: '/',
   ```

2. Add a `CNAME` file in the `public/` folder:
   ```
   yourdomain.com
   ```

3. Configure DNS with your domain provider

### Using a Project Site (username.github.io/repo-name/)

If your URL will be `username.github.io/breathing-shapes/`:

1. Update [vite.config.ts](vite.config.ts:9):
   ```typescript
   base: '/breathing-shapes/',
   ```
   (Replace `breathing-shapes` with your actual repo name)

## What's Been Configured

✅ **vite.config.ts** - Added `base` and `build.outDir` settings
✅ **package.json** - Added `deploy` script and `gh-pages` dependency
✅ **.gitignore** - Already excludes `dist` folder

## Commands

```bash
npm run dev      # Run development server
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run deploy   # Build and deploy to GitHub Pages
```

## Troubleshooting

### Blank page after deployment
- Check your `vite.config.ts` base path matches your repo name
- Make sure GitHub Pages is enabled in repo settings
- Check browser console for 404 errors

### Build fails
```bash
npm run build
```
Fix any TypeScript errors before deploying

### Deploy permission denied
- Make sure you've pushed to GitHub first
- Check that `gh-pages` package is installed: `npm install`

## Updating Your Site

After making changes:

```bash
git add .
git commit -m "Update features"
git push              # If using GitHub Actions
# OR
npm run deploy        # If using gh-pages package
```

## Live Site URL

After deployment, your app will be available at:
- **Project site**: `https://YOUR-USERNAME.github.io/REPO-NAME/`
- **Custom domain**: Whatever you configured

Share this link anywhere!
