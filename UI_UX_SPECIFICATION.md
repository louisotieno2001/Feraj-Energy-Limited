# UI/UX Specification
**Project**: Feraj Solar Limited Website  
**Version**: 1.0  
**Last Updated**: January 22, 2026  
**Status**: Living Document

---

## Table of Contents
1. [Design System Overview](#design-system-overview)
2. [Design Tokens](#design-tokens)
3. [Component Library](#component-library)
4. [Layout System](#layout-system)
5. [Responsive Design](#responsive-design)
6. [Accessibility Standards](#accessibility-standards)
7. [Interaction Patterns](#interaction-patterns)
8. [Animation Guidelines](#animation-guidelines)
9. [Form Design](#form-design)
10. [Data Visualization](#data-visualization)
11. [Error Handling & States](#error-handling--states)
12. [Performance Guidelines](#performance-guidelines)

---

## 1. Design System Overview

### Philosophy

**"Simple, Sustainable, Accessible"**

Our design system prioritizes:
1. **Usability First** - Clear, intuitive interactions
2. **Accessibility** - WCAG 2.1 AA compliance minimum
3. **Performance** - Fast, responsive experiences
4. **Consistency** - Predictable patterns across the site
5. **Sustainability** - Reflecting our environmental mission

### Technology Stack

- **React 18.3.1** - Component framework
- **TypeScript** - Type safety
- **Tailwind CSS 4.1.12** - Utility-first styling
- **Radix UI** - Accessible primitives
- **Motion** - Animation library
- **Recharts** - Data visualization

---

## 2. Design Tokens

### Colors

Defined in `src/styles/theme.css`:

```css
:root {
  /* Brand Colors */
  --primary: #10B981;        /* Green 500 */
  --primary-dark: #059669;   /* Green 600 */
  --primary-light: #34D399;  /* Green 400 */
  
  /* Secondary */
  --secondary: #3B82F6;      /* Blue 500 */
  --secondary-dark: #2563EB;
  --secondary-light: #60A5FA;
  
  /* Neutrals */
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;
  
  /* Semantic */
  --success: #10B981;
  --success-light: #D1FAE5;
  --warning: #F59E0B;
  --warning-light: #FEF3C7;
  --error: #EF4444;
  --error-light: #FEE2E2;
  --info: #3B82F6;
  --info-light: #DBEAFE;
}
```

### Typography Scale

```css
:root {
  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
  
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
  
  /* Line Heights */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
}
```

### Spacing Scale

Based on 8px grid:

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  --space-32: 8rem;     /* 128px */
}
```

### Border Radius

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.25rem;    /* 4px */
  --radius-md: 0.5rem;     /* 8px */
  --radius-lg: 0.75rem;    /* 12px */
  --radius-xl: 1rem;       /* 16px */
  --radius-2xl: 1.5rem;    /* 24px */
  --radius-full: 9999px;   /* Circular */
}
```

### Shadows

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  
  /* Colored shadows for emphasis */
  --shadow-green: 0 4px 12px rgba(16, 185, 129, 0.2);
  --shadow-blue: 0 4px 12px rgba(59, 130, 246, 0.2);
}
```

### Z-Index Scale

```css
:root {
  --z-negative: -1;
  --z-base: 0;
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
}
```

---

## 3. Component Library

### 3.1 Buttons

#### Primary Button
```tsx
<button className="
  bg-green-600 hover:bg-green-700 active:bg-green-800
  text-white font-semibold
  px-6 py-3 rounded-lg
  shadow-md hover:shadow-lg
  transition-all duration-200
  focus:ring-4 focus:ring-green-200 focus:outline-none
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Get Started
</button>
```

**Usage:** Primary actions, CTAs, form submissions

**States:**
- Default: Green 600 background
- Hover: Green 700, elevated shadow
- Active: Green 800, slight scale down
- Focus: Green ring (4px, 30% opacity)
- Disabled: 50% opacity, no interaction

#### Secondary Button
```tsx
<button className="
  bg-white hover:bg-gray-50 active:bg-gray-100
  text-gray-700 font-semibold
  px-6 py-3 rounded-lg
  border border-gray-300 hover:border-gray-400
  shadow-sm hover:shadow
  transition-all duration-200
  focus:ring-4 focus:ring-gray-200 focus:outline-none
">
  Learn More
</button>
```

**Usage:** Secondary actions, cancellations

#### Ghost Button
```tsx
<button className="
  bg-transparent hover:bg-gray-100
  text-gray-700 font-medium
  px-4 py-2 rounded-md
  transition-colors duration-200
">
  Skip
</button>
```

**Usage:** Tertiary actions, less emphasis

#### Icon Button
```tsx
<button className="
  w-10 h-10
  flex items-center justify-center
  rounded-full
  hover:bg-gray-100
  transition-colors duration-200
  focus:ring-4 focus:ring-gray-200
">
  <MenuIcon className="w-5 h-5" />
</button>
```

**Usage:** Toolbar actions, icon-only controls

#### Button Sizes

```tsx
// Small
className="px-3 py-1.5 text-sm"

// Medium (Default)
className="px-6 py-3 text-base"

// Large
className="px-8 py-4 text-lg"
```

---

### 3.2 Forms & Inputs

#### Text Input
```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Email Address
  </label>
  <input
    type="email"
    className="
      w-full px-4 py-3 rounded-lg
      border border-gray-300
      focus:border-green-600 focus:ring-4 focus:ring-green-100
      transition-all duration-200
      placeholder:text-gray-400
    "
    placeholder="you@example.com"
  />
  <p className="text-sm text-gray-500">
    We'll never share your email
  </p>
</div>
```

**States:**
- Default: Gray border
- Focus: Green border + ring
- Error: Red border + ring
- Success: Green border
- Disabled: Gray background, no interaction

#### Input with Icon
```tsx
<div className="relative">
  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
  <input
    type="email"
    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300"
    placeholder="Email"
  />
</div>
```

#### Textarea
```tsx
<textarea
  rows={4}
  className="
    w-full px-4 py-3 rounded-lg
    border border-gray-300
    focus:border-green-600 focus:ring-4 focus:ring-green-100
    resize-vertical
  "
  placeholder="Your message..."
/>
```

#### Select Dropdown
```tsx
<select className="
  w-full px-4 py-3 rounded-lg
  border border-gray-300
  focus:border-green-600 focus:ring-4 focus:ring-green-100
  appearance-none
  bg-white
">
  <option>Select an option</option>
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

#### Checkbox
```tsx
<label className="flex items-center gap-3 cursor-pointer">
  <input
    type="checkbox"
    className="
      w-5 h-5 rounded
      border-gray-300
      text-green-600
      focus:ring-4 focus:ring-green-100
    "
  />
  <span className="text-gray-700">I agree to the terms</span>
</label>
```

#### Radio Button
```tsx
<label className="flex items-center gap-3 cursor-pointer">
  <input
    type="radio"
    name="option"
    className="
      w-5 h-5
      border-gray-300
      text-green-600
      focus:ring-4 focus:ring-green-100
    "
  />
  <span className="text-gray-700">Option 1</span>
</label>
```

---

### 3.3 Cards

#### Basic Card
```tsx
<div className="
  bg-white rounded-xl
  shadow-md hover:shadow-xl
  p-6
  transition-all duration-300
  hover:-translate-y-1
">
  <h3 className="text-xl font-bold text-gray-900 mb-2">
    Card Title
  </h3>
  <p className="text-gray-600">
    Card content goes here
  </p>
</div>
```

#### Product Card
```tsx
<div className="bg-white rounded-xl shadow-md overflow-hidden group">
  <div className="aspect-[4/3] overflow-hidden">
    <img
      src="/product.jpg"
      alt="Product"
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  </div>
  <div className="p-6">
    <h3 className="text-xl font-bold text-gray-900 mb-2">
      Product Name
    </h3>
    <p className="text-gray-600 mb-4">
      Description
    </p>
    <div className="flex items-center justify-between">
      <span className="text-2xl font-bold text-green-600">
        KSh 25,000
      </span>
      <button className="px-4 py-2 bg-green-600 text-white rounded-lg">
        Add to Cart
      </button>
    </div>
  </div>
</div>
```

#### Feature Card
```tsx
<div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8">
  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
    <Icon className="w-6 h-6 text-green-600" />
  </div>
  <h3 className="text-xl font-bold text-gray-900 mb-2">
    Feature Title
  </h3>
  <p className="text-gray-600">
    Feature description
  </p>
</div>
```

---

### 3.4 Navigation

#### Navbar
```tsx
<nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      {/* Logo */}
      <Logo />
      
      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8">
        <NavLink href="/about">About</NavLink>
        <NavLink href="/products">Products</NavLink>
        <NavLink href="/contact">Contact</NavLink>
      </div>
      
      {/* CTA */}
      <button className="bg-green-600 text-white px-6 py-2 rounded-lg">
        Get Quote
      </button>
      
      {/* Mobile Menu Button */}
      <button className="md:hidden">
        <MenuIcon />
      </button>
    </div>
  </div>
</nav>
```

#### Mobile Menu
```tsx
<div className="
  fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50
  md:hidden
">
  <div className="
    absolute right-0 top-0 h-full w-full max-w-sm
    bg-white shadow-2xl
    transform transition-transform duration-300
  ">
    {/* Menu Content */}
  </div>
</div>
```

#### Footer
```tsx
<footer className="bg-gray-900 text-white py-12">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Footer columns */}
    </div>
    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
      <p>© 2026 Feraj Solar Limited. All rights reserved.</p>
    </div>
  </div>
</footer>
```

---

### 3.5 Modals & Dialogs

#### Modal Structure
```tsx
<Dialog>
  {/* Backdrop */}
  <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50" />
  
  {/* Modal Container */}
  <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
    <div className="
      bg-white rounded-xl shadow-2xl
      max-w-md w-full
      max-h-[90vh] overflow-y-auto
    ">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">
          Modal Title
        </h2>
        <button className="text-gray-400 hover:text-gray-600">
          <XIcon className="w-5 h-5" />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <p className="text-gray-600">Modal content</p>
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
        <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
          Cancel
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg">
          Confirm
        </button>
      </div>
    </div>
  </div>
</Dialog>
```

---

### 3.6 Alerts & Notifications

#### Toast Notification (using Sonner)
```tsx
import { toast } from 'sonner';

// Success
toast.success('Changes saved successfully!');

// Error
toast.error('Something went wrong. Please try again.');

// Info
toast.info('Your session will expire in 5 minutes.');

// Warning
toast.warning('Please verify your email address.');
```

#### Inline Alert
```tsx
<div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
  <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
  <div>
    <h4 className="font-semibold text-green-900">Success</h4>
    <p className="text-green-700 text-sm">Your order has been placed successfully.</p>
  </div>
</div>
```

**Variants:**
- Success: Green
- Error: Red
- Warning: Amber
- Info: Blue

---

### 3.7 Loading States

#### Spinner
```tsx
<div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-green-600" />
```

#### Skeleton Loader
```tsx
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-gray-200 rounded w-3/4" />
  <div className="h-4 bg-gray-200 rounded w-1/2" />
  <div className="h-4 bg-gray-200 rounded w-5/6" />
</div>
```

#### Progress Bar
```tsx
<div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
  <div
    className="h-full bg-green-600 transition-all duration-300"
    style={{ width: '65%' }}
  />
</div>
```

---

## 4. Layout System

### Container
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

**Max Widths:**
- `max-w-7xl`: 1280px (default)
- `max-w-6xl`: 1152px
- `max-w-5xl`: 1024px
- `max-w-4xl`: 896px

### Grid System
```tsx
// 12-column grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>
```

### Section Spacing
```tsx
// Standard section
<section className="py-16 md:py-24">
  {/* Content */}
</section>

// Narrow section
<section className="py-12 md:py-16">
  {/* Content */}
</section>

// Wide section
<section className="py-20 md:py-32">
  {/* Content */}
</section>
```

---

## 5. Responsive Design

### Breakpoints
```css
/* Mobile: < 640px (default) */
/* Tablet: >= 640px (sm:) */
/* Desktop: >= 768px (md:) */
/* Large Desktop: >= 1024px (lg:) */
/* XL Desktop: >= 1280px (xl:) */
/* 2XL Desktop: >= 1536px (2xl:) */
```

### Mobile-First Approach
```tsx
<div className="
  text-2xl     /* Mobile: 24px */
  sm:text-3xl  /* Tablet: 30px */
  lg:text-4xl  /* Desktop: 36px */
">
  Responsive Heading
</div>
```

### Responsive Layout Example
```tsx
<div className="
  grid
  grid-cols-1      /* Mobile: 1 column */
  sm:grid-cols-2   /* Tablet: 2 columns */
  lg:grid-cols-3   /* Desktop: 3 columns */
  gap-4 sm:gap-6 lg:gap-8
">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

### Show/Hide on Breakpoints
```tsx
{/* Show only on mobile */}
<div className="md:hidden">Mobile Menu</div>

{/* Show only on desktop */}
<div className="hidden md:block">Desktop Nav</div>
```

---

## 6. Accessibility Standards

### WCAG 2.1 AA Compliance

#### Color Contrast
- Normal text: Minimum 4.5:1
- Large text (18pt+): Minimum 3:1
- UI components: Minimum 3:1

#### Keyboard Navigation
```tsx
// All interactive elements must be keyboard accessible
<button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Click me
</button>
```

#### Focus Indicators
```tsx
// Always visible focus state
<button className="
  focus:outline-none
  focus:ring-4 focus:ring-green-200
">
  Accessible Button
</button>
```

#### ARIA Labels
```tsx
// Descriptive labels for screen readers
<button aria-label="Close dialog">
  <XIcon className="w-5 h-5" />
</button>

<input
  type="search"
  aria-label="Search products"
  placeholder="Search..."
/>
```

#### Alt Text
```tsx
// Descriptive alt text for images
<img
  src="/solar-panel.jpg"
  alt="Technician installing solar panels on residential rooftop"
/>

// Decorative images
<img src="/decoration.svg" alt="" role="presentation" />
```

#### Skip Links
```tsx
<a
  href="#main-content"
  className="
    sr-only focus:not-sr-only
    focus:absolute focus:top-4 focus:left-4
    bg-green-600 text-white px-4 py-2 rounded
    z-50
  "
>
  Skip to main content
</a>
```

---

## 7. Interaction Patterns

### Hover States
All interactive elements must have visible hover states:
```tsx
<button className="hover:bg-green-700 transition-colors duration-200">
  Button
</button>

<a className="hover:text-green-600 transition-colors duration-200">
  Link
</a>

<div className="hover:shadow-lg transition-shadow duration-200">
  Card
</div>
```

### Click/Tap Feedback
```tsx
<button className="
  active:scale-95
  transition-transform duration-100
">
  Button
</button>
```

### Minimum Touch Target
All interactive elements: **44×44px minimum**

```tsx
// Too small [BAD]
<button className="w-8 h-8">Icon</button>

// Good [OK]
<button className="w-11 h-11">Icon</button>
```

---

## 8. Animation Guidelines

### Timing Functions
```css
/* Ease out: Elements entering */
transition-timing-function: ease-out;
duration: 200ms;

/* Ease in: Elements exiting */
transition-timing-function: ease-in;
duration: 150ms;

/* Ease in-out: State changes */
transition-timing-function: ease-in-out;
duration: 200ms;
```

### Animation Durations
- **Fast**: 100-150ms (state changes, hover)
- **Medium**: 200-300ms (transitions, slides)
- **Slow**: 400-500ms (complex animations)

### Common Animations
```tsx
// Fade in
className="animate-fade-in opacity-0"

// Slide in from right
className="animate-slide-in-right transform translate-x-full"

// Scale in
className="animate-scale-in transform scale-0"
```

### Respect Reduced Motion
```tsx
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Form Design

### Form Layout
```tsx
<form className="space-y-6 max-w-md">
  {/* Form fields with consistent spacing */}
</form>
```

### Field Validation

#### Error State
```tsx
<div>
  <input
    className="border-red-500 focus:ring-red-200"
    aria-invalid="true"
    aria-describedby="email-error"
  />
  <p id="email-error" className="text-sm text-red-600 mt-1">
    Please enter a valid email address
  </p>
</div>
```

#### Success State
```tsx
<div>
  <input className="border-green-500" />
  <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
    <CheckIcon className="w-4 h-4" />
    Email verified
  </p>
</div>
```

### Form Submission
```tsx
<button
  type="submit"
  disabled={isSubmitting}
  className="
    bg-green-600 text-white px-6 py-3 rounded-lg
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center gap-2
  "
>
  {isSubmitting ? (
    <>
      <Spinner />
      Submitting...
    </>
  ) : (
    'Submit'
  )}
</button>
```

---

## 10. Data Visualization

### Chart Colors
Use brand colors consistently:
```tsx
const CHART_COLORS = {
  primary: '#10B981',     // Green
  secondary: '#3B82F6',   // Blue
  tertiary: '#F59E0B',    // Amber
  quaternary: '#8B5CF6',  // Purple
  quinary: '#EC4899',     // Pink
};
```

### Chart Types

#### Line Chart (Trends)
- Use for time series data
- Smooth curves for continuous data
- Dots for discrete data points

#### Bar Chart (Comparisons)
- Use for comparing categories
- Horizontal for long labels
- Vertical for time-based data

#### Pie Chart (Proportions)
- Use sparingly (max 5-6 segments)
- Consider donut chart for better readability
- Always include percentages

---

## 11. Error Handling & States

### Empty States
```tsx
<div className="text-center py-12">
  <InboxIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
  <h3 className="text-xl font-semibold text-gray-900 mb-2">
    No items yet
  </h3>
  <p className="text-gray-600 mb-6">
    Get started by adding your first item
  </p>
  <button className="bg-green-600 text-white px-6 py-3 rounded-lg">
    Add Item
  </button>
</div>
```

### Error States
```tsx
<div className="text-center py-12">
  <AlertCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
  <h3 className="text-xl font-semibold text-gray-900 mb-2">
    Something went wrong
  </h3>
  <p className="text-gray-600 mb-6">
    We couldn't load the data. Please try again.
  </p>
  <button className="bg-green-600 text-white px-6 py-3 rounded-lg">
    Retry
  </button>
</div>
```

### Loading States
```tsx
<div className="text-center py-12">
  <Spinner className="w-8 h-8 mx-auto mb-4" />
  <p className="text-gray-600">Loading...</p>
</div>
```

---

## 12. Performance Guidelines

### Image Optimization
- Use WebP format when possible
- Lazy load images below the fold
- Use responsive images with `srcset`
- Optimize image sizes (< 200KB per image)

```tsx
<img
  src="/image.webp"
  srcSet="/image-small.webp 640w, /image-large.webp 1280w"
  sizes="(max-width: 640px) 640px, 1280px"
  loading="lazy"
  alt="Description"
/>
```

### Code Splitting
```tsx
// Lazy load pages
const Products = lazy(() => import('./pages/Products'));
const EnergyStats = lazy(() => import('./pages/EnergyStats'));

// Use Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Products />
</Suspense>
```

### Performance Budget
- First Contentful Paint: < 1.8s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.8s
- Cumulative Layout Shift: < 0.1
- Total Bundle Size: < 300KB (gzipped)

---

## Critical Issues & High Priority Items

### [CRITICAL] Critical UI/UX Issues

1. **No Error Boundaries**
   - Impact: App crashes without recovery
   - Fix: Implement error boundary components
   - Timeline: Week 1

2. **Missing Loading States**
   - Impact: Poor user experience, confusion
   - Fix: Add skeleton loaders and spinners
   - Timeline: Week 1

3. **Form Validation Missing**
   - Impact: Bad data submission, security risk
   - Fix: Implement client-side and server-side validation
   - Timeline: Week 1-2

### [HIGH] High Priority Improvements

4. **Accessibility Gaps**
   - Missing ARIA labels on icons
   - No skip links
   - Insufficient focus indicators
   - Timeline: Week 2-3

5. **Mobile UX Issues**
   - Touch targets too small in some areas
   - Hamburger menu needs improvement
   - Forms difficult to use on mobile
   - Timeline: Week 2-3

6. **Performance Optimization Needed**
   - No code splitting implemented
   - Images not optimized
   - No lazy loading
   - Timeline: Week 3-4

---

**Document Owner**: UI/UX Team  
**Next Review**: February 22, 2026  
**Status**: Living Document - Updates ongoing
