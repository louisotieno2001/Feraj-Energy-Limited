# Changelog

All notable changes to the Feraj Solar Limited website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### In Progress
- Comprehensive testing framework setup
- ESLint and Prettier configuration
- CI/CD pipeline implementation
- Products integration with Supabase (next priority)
- Admin dashboard development

### Planned Features
- Real-time inventory management system
- Payment gateway integration (M-Pesa, Stripe)
- Multi-language support (English, Swahili)
- Live chat support system
- Blog/News section
- Email notification system
- Advanced search and filtering
- Progressive Web App (PWA) features

### Known Issues
- [HIGH] No test coverage
- [HIGH] Missing error boundaries
- [MEDIUM] Bundle size optimization needed (2.4MB - target <1MB)
- [LOW] Missing max-feng.jpeg team member photo

---

## [1.1.1] - 2026-01-23

### Fixed
- **TypeScript Errors** - Fixed Profile interface to include `phone`, `company_name`, `created_at`, `updated_at` fields
- **tsconfig Warning** - Removed `noEmit` from tsconfig.node.json to fix project reference warning
- **Orders Page** - Implemented Supabase integration to fetch user orders from database
- **AuthContext** - Removed problematic localStorage cleanup code with import.meta.env error

### Added
- **SEO Meta Tags** - Comprehensive Open Graph and Twitter Card meta tags in index.html
- **Favicon** - Added favicon and apple-touch-icon using company logo
- **Meta Keywords** - Added relevant keywords for better search engine visibility
- **Theme Color** - Added green theme color for mobile browsers

### Changed
- **Orders Component** - Now fetches real data from Supabase instead of showing TODO
- **HTML Title** - Enhanced title with "in Kenya" for better local SEO

---

## [1.1.0] - 2026-01-22

### Added - Supabase Authentication System

#### Backend Infrastructure
- **Supabase Integration** - PostgreSQL database with real-time capabilities
- **Database Schema** - Complete schema with 6 tables (profiles, products, orders, order_items, installation_requests, support_tickets)
- **Row Level Security** - Database-level security policies for all tables
- **Auto-profile Creation** - Trigger to create user profile on signup
- **Performance Indexes** - Optimized queries with strategic indexes

#### Authentication Features
- **Secure Signup** - Email + password with validation (8+ chars, uppercase, lowercase, number, special char)
- **Email Verification** - Optional email confirmation flow
- **JWT Authentication** - Secure token-based authentication with auto-refresh
- **Password Reset** - Complete password recovery flow via email
- **Session Management** - Persistent sessions across page reloads
- **Protected Routes** - Route guards for authenticated-only pages
- **User Profile System** - Automatic profile creation with role-based access (customer, admin, installer)

#### Frontend Implementation
- **AuthContext Provider** - Global authentication state management
- **AuthService** - Clean service layer for all auth operations
- **Updated Login Page** - Real authentication flows with loading states and error handling
- **Password Reset Page** - Dedicated page for password recovery
- **Updated Navbar** - User profile display and logout functionality
- **ProtectedRoute Component** - Reusable route protection with loading states
- **Input Validation** - Zod schemas for client-side validation
- **TypeScript Types** - Auto-generated Supabase database types

#### Security Improvements
- **Environment Variables** - Secure configuration management
- **Input Validation** - Client and server-side validation
- **Rate Limiting** - Built-in Supabase rate limiting (30 req/min)
- **CORS Configuration** - Proper cross-origin resource sharing
- **No localStorage Auth** - Removed insecure mock authentication

#### Documentation
- **SUPABASE_ARCHITECTURE.md** - Complete backend architecture design
- **SUPABASE_SETUP.md** - Step-by-step setup guide with SQL schema
- **Documentation Reorganization** - Moved all docs to `docs/` subdirectories
- **supabase-schema.sql** - Clean, production-ready database schema

#### Dependencies
- `@supabase/supabase-js@^2.x` - Supabase client library
- `zod@^3.x` - TypeScript-first schema validation

### Changed
- **Authentication Flow** - Migrated from mock localStorage to Supabase
- **Login Component** - Complete rewrite with real authentication
- **Navbar Component** - Added user profile and logout functionality
- **App.tsx** - Added reset password route
- **main.tsx** - Wrapped app with AuthProvider

### Fixed
- [CRITICAL] Insecure localStorage authentication replaced with JWT tokens
- [CRITICAL] Backend integration completed with Supabase
- [CRITICAL] Input validation added with Zod schemas
- [HIGH] Loading states added for authentication operations

### Security
- Removed all mock authentication code
- Implemented secure JWT-based authentication
- Added Row Level Security policies
- Implemented input validation on all auth forms

---

## [1.0.0] - 2026-01-22

### Added - Initial Release

#### Core Features
- **Landing Page** with hero section and company overview
- **About Page** showcasing company mission, vision, and values
- **Team Page** displaying leadership team with profiles
- **Products Page** with comprehensive solar product catalog
- **Shopping Cart** with add/remove/update quantity functionality
- **Energy Statistics Dashboard** with global data visualization
- **3D Interactive Globe** showing worldwide energy data
- **Partnerships Page** highlighting business collaborations
- **Why Green Energy Page** with climate data and sustainability info
- **User Authentication** (Login/Signup UI - mock implementation)

#### Components & UI
- Responsive navigation bar with mobile menu
- Footer with company information and links
- 40+ Radix UI components integrated
- Custom UI component library (buttons, cards, forms, dialogs)
- Image fallback component for graceful error handling
- Toast notifications using Sonner
- Responsive design for mobile, tablet, and desktop
- Dark mode support structure (not fully implemented)

#### Technical Infrastructure
- **React 18.3.1** with TypeScript
- **Vite 6.3.5** build system
- **React Router 7.12.0** for client-side routing
- **Tailwind CSS 4.1.12** for styling
- **Radix UI** for accessible components
- **Recharts** for data visualization
- **React Globe.gl** for 3D globe visualization
- **Lucide React** for icons

#### Development Setup
- TypeScript strict mode configuration
- Vite configuration with path aliases
- PostCSS configuration
- Custom theme and design tokens
- Font loading optimization
- Asset optimization pipeline

#### Documentation
- Comprehensive README.md with setup instructions
- Deployment guide (DEPLOY.md)
- Netlify setup instructions (NETLIFY_SETUP.md)
- Architecture documentation (ARCHITECTURE.md)
- API Standards documentation (API_STANDARDS.md)
- Workflow documentation (WORKFLOW.md)
- Team roles documentation (TEAM_ROLES.md)
- Attributions file (ATTRIBUTIONS.md)
- Development guidelines structure (Guidelines.md)
- Comprehensive audit report (COMPREHENSIVE_AUDIT.md)
- Documentation audit (DOCUMENTATION_AUDIT.md)

#### Deployment
- Netlify configuration (netlify.toml)
- Production build optimization
- SPA routing configuration
- Security headers configuration
- Asset caching strategy
- Environment variable structure

#### Data & Content
- Product catalog with 6+ solar products
- Energy statistics for 50+ countries
- Team member profiles for 4 directors
- Partnership information for 6 companies
- Climate and sustainability data

### Changed
- N/A (Initial Release)

### Deprecated
- N/A (Initial Release)

### Removed
- N/A (Initial Release)

### Fixed
- N/A (Initial Release)

### Security
- [WARNING] Known Issue: Authentication is mock-only (localStorage) - NOT production-ready
- [WARNING] Known Issue: No CSRF protection
- [WARNING] Known Issue: No rate limiting
- [WARNING] Known Issue: No input sanitization
- [PLANNED] Will implement Supabase authentication in v1.1.0

---

## Release History

### Version 1.0.0 - Initial Release (January 22, 2026)
**Type**: Major Release  
**Status**: Development/Staging  
**Breaking Changes**: N/A  

**Summary**: Complete website foundation with all major pages, component library, and deployment configuration. Mock authentication for UI demonstration only - not production-ready.

**Migration Guide**: N/A (Initial Release)

---

## Upcoming Releases

### [1.1.0] - Planned for February 2026
**Focus**: Authentication & Backend Integration

#### Planned Additions
- Supabase backend integration
- Real user authentication with JWT
- Secure session management
- Password reset functionality
- Email verification
- User profile management
- Protected routes implementation
- API integration layer

#### Planned Security Fixes
- Remove localStorage authentication
- Implement HTTP-only cookies
- Add CSRF protection
- Implement rate limiting
- Add input validation and sanitization
- Add security headers
- Implement content security policy

### [1.2.0] - Planned for March 2026
**Focus**: Testing & Quality Assurance

#### Planned Additions
- Vitest testing framework
- React Testing Library integration
- Unit tests for components
- Integration tests for features
- E2E tests with Playwright
- Test coverage reporting
- CI/CD pipeline with automated testing

#### Planned Code Quality
- ESLint configuration
- Prettier code formatting
- Husky pre-commit hooks
- lint-staged for staged files
- TypeScript strict mode enhancements

### [1.3.0] - Planned for April 2026
**Focus**: Performance & Optimization

#### Planned Additions
- Code splitting and lazy loading
- Image optimization (WebP, lazy loading)
- Bundle size optimization
- Performance monitoring
- Service worker for PWA
- Offline functionality
- Cache strategies

### [2.0.0] - Planned for Q2 2026
**Focus**: E-commerce & Customer Portal

#### Planned Major Features
- Payment gateway integration
- Order management system
- Customer dashboard
- Invoice generation
- Inventory tracking
- Admin panel
- Email notifications
- SMS notifications (M-Pesa integration)

---

## Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version (X.0.0): Incompatible API changes
- **MINOR** version (0.X.0): New features, backward compatible
- **PATCH** version (0.0.X): Bug fixes, backward compatible

### Version Tags
- `alpha`: Early development, unstable
- `beta`: Feature complete, testing phase
- `rc`: Release candidate, final testing
- `stable`: Production-ready release

---

## Release Process

### 1. Development
```bash
# Create feature branch
git checkout -b feature/feature-name

# Commit changes with conventional commits
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
git commit -m "docs: update documentation"
```

### 2. Testing
```bash
# Run tests
npm run test

# Check linting
npm run lint

# Type check
npm run type-check

# Build test
npm run build
```

### 3. Version Update
```bash
# Update version in package.json
npm version major|minor|patch

# Update CHANGELOG.md
# Move unreleased items to new version section
# Add release date
# Document all changes
```

### 4. Release
```bash
# Create release tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push to repository
git push origin main --tags

# Deploy to production
# Netlify auto-deploys on push to main
```

---

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Other changes (dependencies, etc.)

### Examples
```bash
feat: add user profile page
fix: resolve cart total calculation bug
docs: update API documentation
refactor: simplify authentication logic
perf: optimize image loading
test: add unit tests for product component
```

---

## Breaking Changes

### How We Handle Breaking Changes

1. **Deprecation Notice**: 6 months advance notice
2. **Migration Guide**: Detailed upgrade instructions
3. **Backward Compatibility**: Maintain for at least 2 major versions
4. **Version Bump**: Always requires major version increase

### Example Migration Guide
```markdown
## Migrating from v1.x to v2.x

### Breaking Changes
1. Authentication API changed from localStorage to Supabase
   - **Before**: `localStorage.getItem('isLoggedIn')`
   - **After**: `supabase.auth.getSession()`

### Step-by-Step Migration
1. Install Supabase client
2. Update authentication calls
3. Migrate user data
4. Test authentication flow
```

---

## Deprecation Policy

- Features marked as deprecated will be removed in the next major version
- Deprecation warnings will be added to console in development mode
- Alternative solutions will be provided in documentation
- Minimum 6 months notice before removal

---

## Support Policy

### Supported Versions

| Version | Status | Support Until | Security Fixes |
|---------|--------|--------------|----------------|
| 1.x.x | Current | Active | [OK] Yes |
| 0.x.x | Beta | End of Life | [NO] No |

### Update Recommendations
- **Patch updates**: Apply immediately (bug fixes, security)
- **Minor updates**: Review changelog, test, then apply
- **Major updates**: Plan migration, follow guide, thorough testing

---

## Contributors

### How to Contribute to Changelog

When submitting a PR:
1. Add entry to `[Unreleased]` section
2. Use appropriate category (Added, Changed, Fixed, etc.)
3. Write clear, concise description
4. Reference issue/PR number if applicable

Example:
```markdown
### Added
- User profile page with avatar upload ([#123](link-to-pr))

### Fixed
- Cart total calculation error for multiple items ([#456](link-to-issue))
```

---

## Contact

For questions about releases or changelog:
- **Email**: dev@ferajsolar.com
- **GitHub**: [Issues](https://github.com/onyangojerry/Feraj-Energy-Limited/issues)
- **Documentation**: [README.md](README.md)

---

**Last Updated**: January 22, 2026  
**Maintained By**: Feraj Solar Limited Development Team
