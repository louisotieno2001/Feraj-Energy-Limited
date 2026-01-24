# Improvement Roadmap
**Project**: Feraj Solar Limited Website  
**Date**: January 24, 2026  
**Version**: v1.3.0 → v2.0.0  
**Status**: Pre-Production Improvements

---

## Overview

This document provides detailed implementation guides for all improvement areas identified in the [Standards Compliance Report](./STANDARDS_COMPLIANCE_REPORT.md). Tasks are organized by priority (P0-P3) with clear implementation steps, time estimates, and success criteria.

**Total Estimated Time**: 
- P0: 2-3 days
- P1: 3-4 days
- P2: 2-3 days
- P3: 5-7 days (future)

---

## 🔴 P0 - Blocking Production (2-3 Days)

Must be completed before production deployment.

---

### P0.1: Set Up ESLint for Code Quality ⏱️ 3-4 hours

**Objective**: Enforce consistent code quality and catch common errors.

**Implementation Steps**:

1. **Install ESLint and plugins** (15 min):
```bash
npm install --save-dev eslint @eslint/js @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh
```

2. **Create `eslint.config.js`** (30 min):
```javascript
import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        fetch: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        history: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react': react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      // TypeScript
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      
      // React
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': 'warn',
      
      // General
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'prefer-const': 'warn',
      'no-var': 'error'
    },
    settings: {
      react: { version: 'detect' }
    }
  },
  {
    ignores: ['dist/', 'node_modules/', '*.config.js', '*.config.ts']
  }
]
```

3. **Add scripts to `package.json`** (5 min):
```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix"
  }
}
```

4. **Run linter and fix issues** (2-3 hours):
```bash
npm run lint:fix
```

5. **Configure VS Code** (10 min):
Create/update `.vscode/settings.json`:
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["typescript", "typescriptreact"]
}
```

**Success Criteria**:
- ✅ `npm run lint` passes with 0 errors
- ✅ Warnings reduced to < 10
- ✅ All team members have ESLint extension installed

**Time**: 3-4 hours  
**Impact**: High - Prevents bugs, improves code consistency

---

### P0.2: Configure Prettier for Formatting ⏱️ 1 hour

**Objective**: Enforce consistent code formatting across the team.

**Implementation Steps**:

1. **Install Prettier** (5 min):
```bash
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

2. **Create `.prettierrc`** (10 min):
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "bracketSpacing": true,
  "jsxSingleQuote": false,
  "jsxBracketSameLine": false
}
```

3. **Create `.prettierignore`** (5 min):
```
dist/
build/
coverage/
node_modules/
*.min.js
*.min.css
package-lock.json
```

4. **Update ESLint config** (10 min):
Add to `eslint.config.js`:
```javascript
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

// Add to plugins
plugins: {
  'prettier': prettier
}

// Add to rules
rules: {
  'prettier/prettier': 'warn'
}
```

5. **Add scripts to `package.json`** (5 min):
```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{ts,tsx,css,json}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css,json}\""
  }
}
```

6. **Format entire codebase** (20 min):
```bash
npm run format
```

7. **Configure VS Code** (5 min):
Update `.vscode/settings.json`:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

**Success Criteria**:
- ✅ `npm run format:check` passes
- ✅ All files formatted consistently
- ✅ Auto-format on save works in VS Code

**Time**: 1 hour  
**Impact**: High - Eliminates formatting debates, improves readability

---

### P0.3: Add Basic Unit Tests ⏱️ 6-8 hours

**Objective**: Achieve >50% test coverage for critical services.

**Implementation Steps**:

1. **Install Vitest and dependencies** (10 min):
```bash
npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

2. **Create `vitest.config.ts`** (15 min):
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData.ts',
        'src/main.tsx'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

3. **Create test setup file** (15 min):
`src/test/setup.ts`:
```typescript
import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn()
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn()
    }))
  }
}))
```

4. **Write service tests** (4-5 hours):

`src/services/__tests__/auth.service.test.ts`:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthService } from '../auth.service'
import { supabase } from '@/lib/supabase'

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('signUp', () => {
    it('should create new user account', async () => {
      const mockUser = { id: '123', email: 'test@example.com' }
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null
      })

      const result = await AuthService.signUp('test@example.com', 'password123')
      
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
      expect(result.user).toEqual(mockUser)
    })

    it('should throw error on signup failure', async () => {
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Email already exists', name: 'AuthError' }
      })

      await expect(
        AuthService.signUp('test@example.com', 'password123')
      ).rejects.toThrow('Email already exists')
    })
  })

  describe('signIn', () => {
    it('should authenticate user with valid credentials', async () => {
      const mockSession = { access_token: 'token123' }
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { session: mockSession, user: null },
        error: null
      })

      const result = await AuthService.signIn('test@example.com', 'password123')
      
      expect(result.session).toEqual(mockSession)
    })
  })
})
```

`src/services/__tests__/products.service.test.ts`:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getProducts, getProductById } from '../products.service'
import { supabase } from '@/lib/supabase'

describe('Products Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getProducts', () => {
    it('should fetch active products', async () => {
      const mockProducts = [
        { id: '1', name: 'Solar Panel', is_active: true },
        { id: '2', name: 'Inverter', is_active: true }
      ]

      const mockSelect = vi.fn().mockReturnThis()
      const mockEq = vi.fn().mockResolvedValue({ data: mockProducts, error: null })
      
      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
        eq: mockEq
      } as any)

      const products = await getProducts()
      
      expect(supabase.from).toHaveBeenCalledWith('products')
      expect(mockSelect).toHaveBeenCalled()
      expect(mockEq).toHaveBeenCalledWith('is_active', true)
      expect(products).toEqual(mockProducts)
    })

    it('should throw error when fetch fails', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ 
          data: null, 
          error: { message: 'Database error' } 
        })
      } as any)

      await expect(getProducts()).rejects.toThrow('Database error')
    })
  })
})
```

5. **Write component tests** (2-3 hours):

`src/app/components/__tests__/Button.test.tsx`:
```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../ui/button'

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should call onClick handler', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByText('Click me')).toBeDisabled()
  })
})
```

6. **Add test scripts to `package.json`** (5 min):
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run"
  }
}
```

7. **Run tests** (15 min):
```bash
npm run test:coverage
```

**Success Criteria**:
- ✅ All tests pass
- ✅ Coverage >50% for services
- ✅ Coverage >30% overall
- ✅ CI ready (tests run in < 30 seconds)

**Time**: 6-8 hours  
**Impact**: Critical - Enables confident code changes, prevents regressions

---

### P0.4: Set Up Error Monitoring (Sentry) ⏱️ 2 hours

**Objective**: Track and debug production errors in real-time.

**Implementation Steps**:

1. **Create Sentry account** (10 min):
   - Go to https://sentry.io
   - Sign up for free tier
   - Create new project (React)
   - Copy DSN

2. **Install Sentry** (5 min):
```bash
npm install --save @sentry/react
```

3. **Initialize Sentry** (30 min):
`src/lib/sentry.ts`:
```typescript
import * as Sentry from '@sentry/react'
import { useEffect } from 'react'
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType
} from 'react-router-dom'

export const initSentry = () => {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false
        }),
        Sentry.reactRouterV6BrowserTracingIntegration({
          useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes
        })
      ],
      tracesSampleRate: 1.0,
      tracePropagationTargets: ['localhost', /^https:\/\/ferajsolar\.com/],
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      environment: import.meta.env.MODE,
      beforeSend(event) {
        // Filter out sensitive data
        if (event.request?.headers) {
          delete event.request.headers['Authorization']
        }
        return event
      }
    })
  }
}
```

4. **Update `main.tsx`** (10 min):
```typescript
import { initSentry } from './lib/sentry'

// Initialize Sentry first
initSentry()

// Then render app
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

5. **Add error boundary** (45 min):
`src/app/components/ErrorBoundary.tsx`:
```typescript
import React from 'react'
import * as Sentry from '@sentry/react'
import { Button } from './ui/button'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, {
      contexts: { react: { componentStack: errorInfo.componentStack } }
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              We've been notified and are working on a fix.
            </p>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

6. **Wrap App with ErrorBoundary** (10 min):
Update `App.tsx`:
```typescript
import { ErrorBoundary } from './components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      {/* existing app content */}
    </ErrorBoundary>
  )
}
```

7. **Add environment variable** (5 min):
`.env.local`:
```
VITE_SENTRY_DSN=your-sentry-dsn-here
```

8. **Test error tracking** (10 min):
Add test button temporarily:
```typescript
<button onClick={() => { throw new Error('Test Sentry') }}>
  Test Error
</button>
```

**Success Criteria**:
- ✅ Errors appear in Sentry dashboard
- ✅ Source maps uploaded (optional)
- ✅ Error boundary catches React errors
- ✅ No sensitive data in logs

**Time**: 2 hours  
**Impact**: Critical - Essential for debugging production issues

---

### P0.5: Run Lighthouse Performance Audit ⏱️ 3-4 hours

**Objective**: Achieve Lighthouse scores >90 in all categories.

**Implementation Steps**:

1. **Build production version** (5 min):
```bash
npm run build
npm run preview
```

2. **Run Lighthouse audit** (15 min):
   - Open Chrome DevTools
   - Go to Lighthouse tab
   - Select "Desktop" and "Mobile"
   - Run audit on key pages:
     - Home `/`
     - Products `/products`
     - Admin Dashboard `/admin/dashboard`

3. **Analyze results and fix issues** (2-3 hours):

**Common issues and fixes**:

**Images not optimized**:
```typescript
// Add to components/ImageWithFallback.tsx
<img
  src={src}
  alt={alt}
  loading="lazy"
  decoding="async"
  width={width}
  height={height}
/>
```

**Missing meta tags**:
```html
<!-- index.html -->
<meta name="description" content="Feraj Solar Limited - Solar energy solutions in Kenya">
<meta name="theme-color" content="#10b981">
<link rel="manifest" href="/manifest.json">
```

**Unused JavaScript**:
```typescript
// Implement code splitting
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const Products = lazy(() => import('./pages/Products'))

// Wrap in Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
  </Routes>
</Suspense>
```

**Add Web App Manifest** (30 min):
`public/manifest.json`:
```json
{
  "name": "Feraj Solar Limited",
  "short_name": "Feraj Solar",
  "description": "Solar energy solutions in Kenya",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#10b981",
  "icons": [
    {
      "src": "/images/logos/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/images/logos/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

4. **Re-run audit** (15 min):
   - Build again: `npm run build && npm run preview`
   - Run Lighthouse again
   - Verify scores improved

5. **Document results** (15 min):
Create `docs/PERFORMANCE_AUDIT.md`:
```markdown
# Performance Audit Results

## Lighthouse Scores

### Desktop
- Performance: 95/100
- Accessibility: 100/100
- Best Practices: 100/100
- SEO: 100/100

### Mobile
- Performance: 90/100
- Accessibility: 100/100
- Best Practices: 100/100
- SEO: 100/100

## Issues Fixed
1. Added lazy loading for images
2. Implemented code splitting for admin routes
3. Added web app manifest
4. Optimized bundle size

## Remaining Issues
- None critical

**Date**: January 24, 2026
```

**Success Criteria**:
- ✅ Performance score >85 (mobile), >90 (desktop)
- ✅ Accessibility score = 100
- ✅ Best Practices score >95
- ✅ SEO score = 100

**Time**: 3-4 hours  
**Impact**: High - User experience, SEO rankings, conversion rates

---

## 🟡 P1 - Important (3-4 Days)

Complete before v1.4.0 release.

---

### P1.1: Set Up GitHub Actions CI/CD ⏱️ 4-6 hours

**Objective**: Automate testing, building, and deployment.

**Implementation Steps**:

1. **Create workflow file** (1 hour):
`.github/workflows/ci.yml`:
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm run test:run
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod
        env:
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
```

2. **Configure secrets** (30 min):
   - Go to GitHub repo → Settings → Secrets
   - Add:
     - `NETLIFY_SITE_ID`
     - `NETLIFY_AUTH_TOKEN`
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_SENTRY_DSN`

3. **Create PR template** (20 min):
`.github/pull_request_template.md`:
```markdown
## Description
<!-- Describe your changes -->

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] Tests pass locally
- [ ] Linter passes
- [ ] Added tests for new features
- [ ] Updated documentation
- [ ] No console errors
- [ ] Lighthouse score maintained

## Screenshots
<!-- If UI changes, add screenshots -->
```

4. **Test workflow** (1 hour):
   - Create test PR
   - Verify workflow runs
   - Check all jobs pass

**Success Criteria**:
- ✅ Tests run automatically on PR
- ✅ Deploys to Netlify on merge to main
- ✅ Build fails if tests fail
- ✅ Coverage report generated

**Time**: 4-6 hours  
**Impact**: High - Prevents bugs, automates deployment

---

### P1.2: Add Input Validation (Zod) ⏱️ 3-4 hours

**Objective**: Validate user input on both client and server.

**Implementation Steps**:

1. **Install Zod** (5 min):
```bash
npm install zod
```

2. **Create validation schemas** (2 hours):
`src/utils/schemas.ts`:
```typescript
import { z } from 'zod'

// Auth schemas
export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain number'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

// Product schemas
export const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters')
    .max(100, 'Name too long'),
  description: z.string().min(10, 'Description too short')
    .max(1000, 'Description too long'),
  category: z.enum(['panels', 'inverters', 'batteries', 'accessories']),
  price: z.number().positive('Price must be positive')
    .max(10000000, 'Price too high'),
  stock_quantity: z.number().int().min(0, 'Stock cannot be negative'),
  specifications: z.array(z.string()).min(1, 'At least 1 specification required'),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least 1 image required'),
  is_active: z.boolean()
})

// Profile schema
export const profileSchema = z.object({
  full_name: z.string().min(2, 'Name too short').max(100),
  phone: z.string().regex(/^\+254\d{9}$/, 'Invalid phone format (+254XXXXXXXXX)').optional(),
  company_name: z.string().max(100).optional()
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type ProductInput = z.infer<typeof productSchema>
export type ProfileInput = z.infer<typeof profileSchema>
```

3. **Use validation in forms** (1-2 hours):
Update forms to use Zod validation:
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema } from '@/utils/schemas'

const form = useForm({
  resolver: zodResolver(productSchema),
  defaultValues: {
    name: '',
    description: '',
    // ...
  }
})
```

4. **Add to service layer** (30 min):
```typescript
// src/services/products.service.ts
import { productSchema } from '@/utils/schemas'

export async function createProduct(data: unknown) {
  // Validate input
  const validated = productSchema.parse(data)
  
  // Proceed with API call
  const { data: product, error } = await supabase
    .from('products')
    .insert(validated)
  
  if (error) throw error
  return product
}
```

**Success Criteria**:
- ✅ All forms have validation
- ✅ Clear error messages shown
- ✅ Invalid data rejected before API calls
- ✅ Type-safe validation

**Time**: 3-4 hours  
**Impact**: High - Prevents bad data, improves UX

---

### P1.3: Configure Staging Environment ⏱️ 2 hours

**Objective**: Separate environment for testing before production.

**Implementation Steps**:

1. **Create staging Supabase project** (30 min):
   - Create new project: "Feraj Solar - Staging"
   - Run all migrations
   - Copy API keys

2. **Set up Netlify staging site** (30 min):
   - Create new site: "feraj-solar-staging"
   - Connect to `develop` branch
   - Add environment variables (staging Supabase keys)

3. **Update `.env` files** (15 min):
```bash
# .env.development
VITE_SUPABASE_URL=https://staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=staging-key

# .env.production
VITE_SUPABASE_URL=https://prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=prod-key
```

4. **Update CI/CD** (30 min):
Modify `.github/workflows/ci.yml`:
```yaml
deploy-staging:
  if: github.ref == 'refs/heads/develop'
  steps:
    - name: Deploy to Staging
      run: netlify deploy
      env:
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_STAGING_SITE_ID }}

deploy-production:
  if: github.ref == 'refs/heads/main'
  steps:
    - name: Deploy to Production
      run: netlify deploy --prod
      env:
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_PROD_SITE_ID }}
```

**Success Criteria**:
- ✅ Staging site accessible
- ✅ Staging uses separate database
- ✅ Auto-deploys from `develop` branch
- ✅ Production unaffected by staging

**Time**: 2 hours  
**Impact**: Medium - Safe testing environment

---

### P1.4: Add Analytics Tracking ⏱️ 2-3 hours

**Objective**: Track user behavior and conversion metrics.

**Implementation Steps**:

1. **Choose analytics platform** (30 min):
   - Option A: Google Analytics 4 (free, comprehensive)
   - Option B: Plausible (privacy-focused, paid)
   - Recommendation: Start with Google Analytics 4

2. **Set up GA4** (30 min):
   - Create GA4 property
   - Get Measurement ID
   - Add to `.env`: `VITE_GA_MEASUREMENT_ID`

3. **Install analytics library** (10 min):
```bash
npm install react-ga4
```

4. **Initialize analytics** (30 min):
`src/lib/analytics.ts`:
```typescript
import ReactGA from 'react-ga4'

export const initAnalytics = () => {
  if (import.meta.env.PROD && import.meta.env.VITE_GA_MEASUREMENT_ID) {
    ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID)
  }
}

export const trackPageView = (path: string) => {
  if (import.meta.env.PROD) {
    ReactGA.send({ hitType: 'pageview', page: path })
  }
}

export const trackEvent = (category: string, action: string, label?: string) => {
  if (import.meta.env.PROD) {
    ReactGA.event({ category, action, label })
  }
}
```

5. **Track page views** (30 min):
```typescript
// App.tsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { initAnalytics, trackPageView } from './lib/analytics'

initAnalytics()

function App() {
  const location = useLocation()
  
  useEffect(() => {
    trackPageView(location.pathname)
  }, [location])
  
  // ...
}
```

6. **Track key events** (1 hour):
```typescript
// Track product views
trackEvent('Product', 'View', productName)

// Track add to cart
trackEvent('Cart', 'Add', productName)

// Track checkout
trackEvent('Checkout', 'Start')

// Track signup
trackEvent('Auth', 'Signup', 'Success')
```

**Success Criteria**:
- ✅ Page views tracked
- ✅ Key events tracked
- ✅ Data visible in GA4 dashboard
- ✅ Privacy compliant

**Time**: 2-3 hours  
**Impact**: Medium - Understand user behavior, optimize conversion

---

### P1.5: Add Pre-commit Hooks (Husky) ⏱️ 1 hour

**Objective**: Automatically run checks before commits.

**Implementation Steps**:

1. **Install Husky and lint-staged** (10 min):
```bash
npm install --save-dev husky lint-staged
npx husky init
```

2. **Configure lint-staged** (15 min):
Add to `package.json`:
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,json,md}": [
      "prettier --write"
    ]
  }
}
```

3. **Create pre-commit hook** (10 min):
`.husky/pre-commit`:
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
npm run test:run
```

4. **Test hooks** (15 min):
```bash
# Make a change
echo "test" >> README.md

# Commit (should trigger hooks)
git add README.md
git commit -m "test: verify husky hooks"
```

**Success Criteria**:
- ✅ Linter runs before commit
- ✅ Formatter runs before commit
- ✅ Tests run before commit
- ✅ Commit blocked if checks fail

**Time**: 1 hour  
**Impact**: High - Prevents bad code from entering codebase

---

## 🟢 P2 - Nice to Have (2-3 Days)

Improves developer experience and maintainability.

---

### P2.1: Add Error Boundaries ⏱️ 2 hours

Already covered in P0.4 (Sentry section). Additional work:

1. **Create granular error boundaries** (1 hour):
```typescript
// ComponentErrorBoundary.tsx
export function ComponentErrorBoundary({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode 
}) {
  return (
    <ErrorBoundary fallback={fallback || <ErrorFallback />}>
      {children}
    </ErrorBoundary>
  )
}
```

2. **Wrap key components** (1 hour):
```typescript
<ComponentErrorBoundary>
  <ProductsList />
</ComponentErrorBoundary>
```

**Time**: 2 hours  
**Impact**: Medium - Better error isolation

---

### P2.2: Document Database Schema ⏱️ 3 hours

**Create `docs/architecture/DATABASE_SCHEMA.md`**:
- List all tables with columns and types
- Document relationships and foreign keys
- Show RLS policies
- Include ER diagram

**Time**: 3 hours  
**Impact**: Low - Helps onboarding

---

### P2.3: Create CHANGELOG.md ⏱️ 2 hours

**Generate version history**:
```markdown
# Changelog

## [1.3.0] - 2026-01-23
### Added
- Admin dashboard with user management
- Admin product CRUD operations
- Product image management

### Fixed
- Infinite recursion in RLS policies
- Products not loading from database
```

**Time**: 2 hours  
**Impact**: Low - Good for release notes

---

### P2.4: Set Up E2E Tests (Playwright) ⏱️ 6-8 hours

1. **Install Playwright** (10 min):
```bash
npm init playwright@latest
```

2. **Write E2E tests** (5-7 hours):
```typescript
// tests/auth.spec.ts
test('user can sign up and login', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Sign Up')
  // ... test signup flow
})
```

**Time**: 6-8 hours  
**Impact**: High - Catches integration bugs

---

## ⚪ P3 - Future Enhancement (5-7 Days)

For v1.5.0 and beyond.

---

### P3.1: Add React Query for Caching ⏱️ 4-6 hours

**Benefits**: Automatic caching, background refetching, optimistic updates

**Implementation**: Wrap services with React Query hooks

**Time**: 4-6 hours  
**Impact**: Medium - Better performance

---

### P3.2: Implement Code Splitting ⏱️ 2-3 hours

**Use React.lazy() for route-based splitting**:
```typescript
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
```

**Time**: 2-3 hours  
**Impact**: Medium - Faster initial load

---

### P3.3: Set Up Storybook ⏱️ 6-8 hours

**Component documentation and testing in isolation**

**Time**: 6-8 hours  
**Impact**: Low - Nice for design system

---

## Summary

### Priority Timeline

**Week 1 (P0 - Production Ready)**:
- Day 1-2: ESLint, Prettier, Basic Tests
- Day 3: Error Monitoring, Performance Audit

**Week 2 (P1 - Polish)**:
- Day 4: CI/CD, Input Validation
- Day 5: Staging Environment, Analytics, Pre-commit Hooks

**Week 3-4 (P2 - Quality)**:
- Error boundaries, documentation, E2E tests

**Future (P3 - Optimization)**:
- React Query, code splitting, Storybook

### Total Investment

- **P0**: 16-21 hours (2-3 days)
- **P1**: 12-16 hours (2 days)
- **P2**: 13-15 hours (2 days)
- **P3**: 12-17 hours (2 days)

**Total**: 53-69 hours (7-9 days)

---

**Next Step**: Start with P0.1 (ESLint) or continue manual testing?
