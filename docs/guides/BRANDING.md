# Brand Guidelines

## Status Update (February 4, 2026)
- Roles now supported: admin, co_admin, employee, customer (installer replaced by employee).
- Staff access: admin/co_admin/employee can access /admin; user management limited to admin/co_admin.
- Co-admins cannot change admin/co_admin roles; they can manage employee/customer roles.
- Per-user permissions added: can_manage_products, can_manage_tickets, can_promote_to_co_admin (admin-only).
- Audit & monitoring: /admin/audit shows activity feed + ticket queue; profile sensitive edits, role/permission changes, and product CRUD are logged.
- Product images: URL or device upload, max 4 images, 2MB per image, primary image = first.
- Environment files (.env, .env.local, etc.) must never be committed; use host env vars.
- Linting: Prettier applied; ESLint passes with warnings only (mostly any/fast-refresh).
**Company**: Feraj Solar Limited  
**Version**: 1.0  
**Last Updated**: January 22, 2026  
**Status**: Official Brand Standards

---

## Table of Contents
1. [Brand Overview](#brand-overview)
2. [Brand Identity](#brand-identity)
3. [Logo Guidelines](#logo-guidelines)
4. [Color Palette](#color-palette)
5. [Typography](#typography)
6. [Visual Style](#visual-style)
7. [Photography](#photography)
8. [Voice & Tone](#voice--tone)
9. [Brand Applications](#brand-applications)
10. [Digital Brand Standards](#digital-brand-standards)

---

## 1. Brand Overview

### Mission Statement
**"Powering Kenya's sustainable future through innovative solar energy solutions."**

We make clean, renewable energy accessible to every Kenyan household and business, driving the nation's transition to sustainable power while creating economic opportunities and environmental stewardship.

### Vision Statement
**"To be East Africa's leading solar energy provider by 2030, transforming one million lives through sustainable power solutions."**

### Brand Values

1. **Sustainability First**
   - Environmental responsibility in everything we do
   - Long-term thinking over short-term gains
   - Commitment to reducing carbon footprint

2. **Innovation**
   - Cutting-edge solar technology
   - Continuous improvement and research
   - Adapting to customer needs

3. **Integrity**
   - Transparent business practices
   - Honest communication
   - Ethical partnerships

4. **Community Focus**
   - Local employment and training
   - Supporting Kenyan communities
   - Accessible energy for all

5. **Excellence**
   - Quality products and services
   - Professional installation and support
   - Reliable performance guarantees

### Brand Personality

**Adjectives that describe our brand:**
- Professional yet approachable
- Innovative and forward-thinking
- Trustworthy and reliable
- Environmentally conscious
- Community-oriented
- Optimistic and inspiring

**We are NOT:**
- Corporate or cold
- Complicated or technical (to customers)
- Pushy or aggressive
- Luxury or exclusive
- Western-centric

---

## 2. Brand Identity

### Brand Positioning

**Target Audience:**
- Primary: Middle to upper-middle class Kenyan homeowners
- Secondary: Small to medium businesses in Kenya
- Tertiary: Large enterprises and government institutions

**Positioning Statement:**
*"For environmentally-conscious Kenyan property owners seeking reliable, cost-effective energy solutions, Feraj Solar Limited delivers premium solar installations with local expertise and international quality standards, unlike generic energy providers."*

### Competitive Advantages
1. Local expertise with global technology
2. 30-year warranty on all installations
3. 24/7 customer support
4. Flexible payment options including M-Pesa
5. Comprehensive maintenance packages
6. AI-powered energy optimization

---

## 3. Logo Guidelines

### Primary Logo

**File Naming Convention:**
- `feraj-solar-logo.svg` (vector)
- `feraj-solar-logo.png` (raster, high-res)
- `feraj-solar-logo-small.png` (web optimized)

### Logo Specifications

#### Full Logo (Horizontal)
```
┌─────────────────────────────────────┐
│  [SOLAR ICON]  FERAJ SOLAR LIMITED  │
│                 Powering Tomorrow    │
└─────────────────────────────────────┘
```

**Proportions:**
- Icon: Logo text ratio = 1:3
- Minimum width: 200px (digital), 2 inches (print)
- Clear space: Equal to height of icon on all sides

#### Logo Icon Only
Use when space is limited (favicons, social media avatars, app icons)
- Minimum size: 32px × 32px (digital)
- Always use on appropriate background colors

### Logo Colors

**Primary Logo Colors:**
1. **Full Color** (Preferred)
   - Solar icon: Green gradient (#10B981 → #059669)
   - Text: Charcoal (#1F2937)
   - Tagline: Gray (#6B7280)

2. **Single Color Variations**
   - All Green (#10B981) - on white background
   - All White - on dark backgrounds
   - All Black - for print/grayscale

### Logo Don'ts

[NEVER]:
- Rotate or distort the logo
- Change logo colors outside approved palette
- Add effects (shadows, glows, gradients except approved)
- Place logo on busy backgrounds without contrast
- Use low-resolution or pixelated versions
- Recreate or redraw the logo
- Animate the logo (except approved animations)
- Place logo within 50% clear space of other elements

[ALWAYS]:
- Use provided logo files
- Maintain aspect ratio when scaling
- Ensure sufficient contrast with background
- Use appropriate logo variant for the medium
- Provide adequate clear space

### Logo Clear Space

**Minimum Clear Space Rule:**
Clear space = Height of the solar icon (X)

```
        X
    ┌───────┐
  X │ LOGO  │ X
    └───────┘
        X
```

### Logo on Backgrounds

**Approved Background Colors:**
- White (#FFFFFF)
- Light Gray (#F9FAFB)
- Dark Charcoal (#111827)
- Green (#10B981) - use white logo
- Light Green (#D1FAE5) - use full color logo

**Photography Backgrounds:**
- Use white or dark logo depending on image brightness
- Add subtle background overlay if needed (20% opacity)
- Ensure contrast ratio ≥ 4.5:1

---

## 4. Color Palette

### Primary Colors

#### Brand Green
```css
/* Primary Brand Color */
--primary-green: #10B981;      /* Emerald 500 */
--primary-green-dark: #059669;  /* Emerald 600 */
--primary-green-light: #34D399; /* Emerald 400 */
```

**Usage:**
- Primary CTAs (Call-to-Actions)
- Links and interactive elements
- Success states
- Primary branding elements
- Solar panel icons
- Environmental messaging

**Psychology:** Growth, sustainability, energy, nature, trust

---

#### Secondary Green
```css
/* Complementary Green Shades */
--green-50: #F0FDF4;
--green-100: #DCFCE7;
--green-200: #BBF7D0;
--green-300: #86EFAC;
--green-400: #4ADE80;
--green-500: #22C55E;
--green-600: #16A34A;
--green-700: #15803D;
--green-800: #166534;
--green-900: #14532D;
```

**Usage:**
- Backgrounds and subtle accents
- Hover states
- Progress indicators
- Badges and labels

---

#### Brand Blue
```css
/* Secondary Brand Color */
--primary-blue: #3B82F6;      /* Blue 500 */
--primary-blue-dark: #2563EB; /* Blue 600 */
--primary-blue-light: #60A5FA; /* Blue 400 */
```

**Usage:**
- Secondary CTAs
- Information states
- Technology and innovation messaging
- Data visualizations
- Links (secondary)

**Psychology:** Trust, professionalism, technology, reliability

---

### Neutral Colors

```css
/* Grays - Text and Backgrounds */
--gray-50: #F9FAFB;    /* Lightest background */
--gray-100: #F3F4F6;   /* Light background */
--gray-200: #E5E7EB;   /* Borders */
--gray-300: #D1D5DB;   /* Borders (darker) */
--gray-400: #9CA3AF;   /* Placeholder text */
--gray-500: #6B7280;   /* Secondary text */
--gray-600: #4B5563;   /* Body text */
--gray-700: #374151;   /* Headings */
--gray-800: #1F2937;   /* Dark headings */
--gray-900: #111827;   /* Darkest text */
```

**Usage:**
- Text hierarchy (50% → 900%)
- Backgrounds and surfaces
- Borders and dividers
- Disabled states

---

### Accent Colors

#### Success (Green)
```css
--success: #10B981;
--success-light: #D1FAE5;
--success-dark: #047857;
```
**Usage:** Confirmations, successful operations, positive feedback

#### Warning (Amber)
```css
--warning: #F59E0B;
--warning-light: #FEF3C7;
--warning-dark: #D97706;
```
**Usage:** Warnings, alerts that need attention (non-critical)

#### Error (Red)
```css
--error: #EF4444;
--error-light: #FEE2E2;
--error-dark: #DC2626;
```
**Usage:** Errors, critical alerts, destructive actions

#### Info (Blue)
```css
--info: #3B82F6;
--info-light: #DBEAFE;
--info-dark: #1D4ED8;
```
**Usage:** Information, tips, neutral notifications

---

### Color Usage Guidelines

#### Text Colors
- **Headings:** Gray 900 (#111827) or Gray 800 (#1F2937)
- **Body Text:** Gray 700 (#374151) or Gray 600 (#4B5563)
- **Secondary Text:** Gray 500 (#6B7280)
- **Placeholder:** Gray 400 (#9CA3AF)
- **Disabled:** Gray 300 (#D1D5DB)

#### Background Colors
- **Page Background:** White (#FFFFFF) or Gray 50 (#F9FAFB)
- **Card Background:** White (#FFFFFF)
- **Subtle Background:** Gray 100 (#F3F4F6)
- **Dark Background:** Gray 900 (#111827) or Gray 800 (#1F2937)

#### Interactive Elements
- **Primary Button:** Green 600 (#059669)
  - Hover: Green 700 (#047857)
  - Active: Green 800 (#065F46)
- **Secondary Button:** Gray 200 (#E5E7EB)
  - Hover: Gray 300 (#D1D5DB)
  - Active: Gray 400 (#9CA3AF)
- **Links:** Blue 600 (#2563EB)
  - Hover: Blue 700 (#1D4ED8)
  - Visited: Purple 600 (#9333EA)

---

### Accessibility Requirements

**WCAG 2.1 AA Compliance:**
- Text contrast ratio: Minimum 4.5:1 (normal text)
- Large text contrast ratio: Minimum 3:1 (18pt+ or 14pt+ bold)
- UI component contrast ratio: Minimum 3:1

**Approved Text/Background Combinations:**
[OK] Gray 900 on White (21:1)
[OK] Gray 800 on White (14.8:1)
[OK] Gray 700 on White (10.7:1)
[OK] Gray 600 on White (7.6:1)
[OK] White on Green 600 (4.1:1)
[OK] White on Blue 600 (4.6:1)

[AVOID]:
- Gray 500 or lighter on White for body text
- Any text < 14pt on Gray 400 or lighter
- Green 400 text on White (insufficient contrast)

---

## 5. Typography

### Font Families

#### Primary Font: **Inter**
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Usage:**
- All body text
- Headings and subheadings
- UI elements
- Buttons and forms

**Why Inter:**
- Excellent readability at small sizes
- Wide language support
- Professional and modern
- Open source and web-optimized

**Weights Used:**
- 400 (Regular) - Body text
- 500 (Medium) - Emphasis, labels
- 600 (Semi-bold) - Subheadings, buttons
- 700 (Bold) - Headings
- 800 (Extra-bold) - Display headings

#### Fallback Fonts
```css
/* System font stack */
-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
'Helvetica Neue', Arial, sans-serif
```

---

### Type Scale

#### Desktop/Tablet
```css
/* Display - Large headlines */
--text-5xl: 3rem;      /* 48px */
--text-4xl: 2.25rem;   /* 36px */
--text-3xl: 1.875rem;  /* 30px */

/* Headings */
--text-2xl: 1.5rem;    /* 24px */
--text-xl: 1.25rem;    /* 20px */
--text-lg: 1.125rem;   /* 18px */

/* Body */
--text-base: 1rem;     /* 16px - Base size */
--text-sm: 0.875rem;   /* 14px */
--text-xs: 0.75rem;    /* 12px */
```

#### Mobile
```css
/* Reduce by 0.875× for mobile */
--text-5xl-mobile: 2.625rem;  /* 42px */
--text-4xl-mobile: 2rem;      /* 32px */
--text-3xl-mobile: 1.625rem;  /* 26px */
/* Body text stays at 16px */
```

---

### Typography Styles

#### Heading 1 (H1)
```css
font-size: 3rem;        /* 48px desktop, 42px mobile */
font-weight: 800;       /* Extra-bold */
line-height: 1.2;
letter-spacing: -0.02em;
color: var(--gray-900);
```
**Usage:** Page titles, hero headlines (1 per page)

#### Heading 2 (H2)
```css
font-size: 2.25rem;     /* 36px desktop, 32px mobile */
font-weight: 700;       /* Bold */
line-height: 1.3;
letter-spacing: -0.01em;
color: var(--gray-900);
```
**Usage:** Section titles (2-3 per page)

#### Heading 3 (H3)
```css
font-size: 1.875rem;    /* 30px desktop, 26px mobile */
font-weight: 700;
line-height: 1.4;
color: var(--gray-800);
```
**Usage:** Subsection titles

#### Heading 4 (H4)
```css
font-size: 1.5rem;      /* 24px */
font-weight: 600;       /* Semi-bold */
line-height: 1.4;
color: var(--gray-800);
```
**Usage:** Card titles, minor sections

#### Body Text
```css
font-size: 1rem;        /* 16px */
font-weight: 400;       /* Regular */
line-height: 1.6;
color: var(--gray-700);
```
**Usage:** Paragraphs, descriptions, main content

#### Body Small
```css
font-size: 0.875rem;    /* 14px */
font-weight: 400;
line-height: 1.5;
color: var(--gray-600);
```
**Usage:** Captions, metadata, secondary information

#### Button Text
```css
font-size: 1rem;        /* 16px or 14px for small buttons */
font-weight: 600;       /* Semi-bold */
letter-spacing: 0.01em;
text-transform: none;   /* Sentence case preferred */
```

---

### Typography Best Practices

[DO]:
- Use sentence case for headings (capitalize first word only)
- Maintain consistent line-height for readability
- Limit line length to 60-80 characters for body text
- Use appropriate heading hierarchy (H1 → H2 → H3)
- Ensure sufficient contrast for all text

[DON'T]:
- Use ALL CAPS for long text
- Center-align body text (left-align preferred)
- Use more than 3 font weights on a page
- Make text too small (minimum 14px for body text)
- Use pure black (#000000) for text

---

## 6. Visual Style

### Design Principles

#### 1. Clean & Minimal
- Generous white space
- Simple layouts
- Focus on content
- Avoid clutter

#### 2. Modern & Professional
- Contemporary aesthetics
- Clean lines and shapes
- Subtle shadows and depth
- Professional imagery

#### 3. Eco-Friendly & Natural
- Green color prominence
- Natural imagery (sun, nature, sky)
- Organic shapes occasionally
- Environmental themes

---

### UI Elements

#### Buttons

**Primary Button**
```css
background: linear-gradient(135deg, #10B981 0%, #059669 100%);
color: white;
padding: 12px 24px;
border-radius: 8px;
font-weight: 600;
box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
transition: all 0.2s ease;

/* Hover */
box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
transform: translateY(-1px);
```

**Secondary Button**
```css
background: white;
color: var(--gray-700);
border: 1px solid var(--gray-300);
padding: 12px 24px;
border-radius: 8px;
font-weight: 600;
transition: all 0.2s ease;

/* Hover */
background: var(--gray-50);
border-color: var(--gray-400);
```

#### Cards
```css
background: white;
border-radius: 12px;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
padding: 24px;
transition: all 0.2s ease;

/* Hover */
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
transform: translateY(-2px);
```

#### Forms
```css
input, textarea, select {
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 1rem;
  transition: all 0.2s ease;
}

/* Focus */
input:focus {
  border-color: var(--primary-green);
  outline: none;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}
```

---

### Spacing System

**8px Grid System**
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-20: 5rem;    /* 80px */
--space-24: 6rem;    /* 96px */
```

**Usage:**
- Component padding: 16px, 24px, 32px
- Section spacing: 48px, 64px, 96px
- Element gaps: 8px, 12px, 16px, 24px

---

### Border Radius

```css
--radius-sm: 4px;    /* Small elements, badges */
--radius-md: 8px;    /* Buttons, inputs, cards */
--radius-lg: 12px;   /* Large cards, modals */
--radius-xl: 16px;   /* Feature cards */
--radius-full: 9999px; /* Pills, avatars */
```

---

### Shadows

```css
/* Elevation levels */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);

/* Colored shadows */
--shadow-green: 0 4px 12px rgba(16, 185, 129, 0.2);
--shadow-blue: 0 4px 12px rgba(59, 130, 246, 0.2);
```

---

## 7. Photography

### Image Style

**Characteristics:**
- Bright and optimistic
- Natural lighting preferred
- Authentic, not overly staged
- Featuring real people and installations
- Kenyan context and landscapes
- Focus on solar panels and clean energy

**Color Treatment:**
- Vibrant but natural colors
- Slight increase in saturation (5-10%)
- Enhanced contrast for clarity
- Avoid heavy filters or effects

---

### Photography Subjects

#### Priority Subjects:
1. **Solar Installations**
   - Rooftop panels on Kenyan homes
   - Ground-mounted systems
   - Commercial installations
   - Installation process

2. **People**
   - Happy customers with their systems
   - Technicians at work
   - Families using solar-powered appliances
   - Community impact

3. **Technology**
   - Close-ups of solar panels
   - Inverters and batteries
   - Mobile app interface
   - Monitoring systems

4. **Environment**
   - Kenyan landscapes
   - Sunrise/sunset with panels
   - Clean energy vs. pollution contrast
   - Nature and sustainability

---

### Image Requirements

**Technical Specifications:**
- **Format:** JPEG (photography), PNG (graphics with transparency), WebP (web optimization)
- **Resolution:** Minimum 1920×1080px for hero images
- **Aspect Ratios:**
  - Hero: 16:9 or 21:9
  - Cards: 4:3 or 3:2
  - Portraits: 3:4 or 2:3
  - Square: 1:1
- **File Size:** Optimize for web (< 200KB per image)
- **Alt Text:** Always required for accessibility

---

### Image Don'ts

[AVOID]:
- Stock photos that look generic or Western-centric
- Over-processed or heavily filtered images
- Images without proper licensing
- Low-resolution or pixelated photos
- Culturally insensitive imagery
- Dark or unclear compositions

---

## 8. Voice & Tone

### Brand Voice Characteristics

#### 1. **Professional but Approachable**
- Expert knowledge without jargon
- Friendly without being casual
- Confident without arrogance

**Example:**
- [BAD] "Our photovoltaic systems utilize advanced PERC technology..."
- [GOOD] "Our solar panels use advanced technology to capture more sunlight, giving you more power."

#### 2. **Inspiring and Optimistic**
- Focus on possibilities and benefits
- Positive language about the future
- Empowering customers to make change

**Example:**
- [BAD] "High electricity bills are a problem."
- [GOOD] "Imagine a future where your electricity bills are a thing of the past."

#### 3. **Clear and Transparent**
- Honest about costs and benefits
- No hidden fees or misleading claims
- Straightforward explanations

**Example:**
- [BAD] "Get solar today! (Terms and conditions apply)"
- [GOOD] "Our 5kW system costs KSh 450,000 installed, includes 30-year warranty, and typically pays for itself in 6 years."

#### 4. **Locally Relevant**
- References to Kenyan context
- Understanding of local challenges
- Community-focused language

**Example:**
- [BAD] "Beat rising energy costs"
- [GOOD] "Beat KPLC rate increases and power outages with reliable solar power."

---

### Tone Variations by Context

#### Website Copy
- Professional and informative
- Medium formality
- Educational without being condescending

#### Marketing Materials
- Enthusiastic and inspiring
- Benefit-focused
- Call-to-action oriented

#### Technical Documentation
- Clear and precise
- Step-by-step instructions
- Safety-focused

#### Customer Support
- Patient and helpful
- Empathetic to concerns
- Solution-oriented

#### Social Media
- Friendly and engaging
- Conversational
- Community-building

---

### Writing Guidelines

#### Word Choice

[PREFER]:
- "You" and "your" (direct address)
- Active voice
- Simple, everyday words
- Specific numbers and facts
- Positive framing

[AVOID]:
- "We" and "our" overuse
- Passive voice
- Technical jargon without explanation
- Vague claims
- Negative framing

#### Sentence Structure

[DO]:
- Keep sentences under 20 words
- One idea per sentence
- Vary sentence length for rhythm
- Use bullet points for lists
- Break up long paragraphs

[DON'T]:
- Write run-on sentences
- Use complex clause structures
- Create walls of text
- Mix multiple ideas in one sentence

---

### Example Copy

#### Hero Headline
[GOOD] "Power Your Home with Clean, Affordable Solar Energy"
[BAD] "Implement Sustainable Photovoltaic Solutions for Residential Applications"

#### Product Description
[GOOD] "This 400W solar panel captures enough energy to power your entire home during the day, with extra stored for nighttime use."
[BAD] "400W monocrystalline solar module with 21% efficiency rating featuring advanced PERC cell technology."

#### Call-to-Action
[GOOD] "Get Your Free Quote Today"
[BAD] "Request Solar Installation Information"

---

## 9. Brand Applications

### Business Cards

**Front:**
- Logo (top left)
- Name and title
- Contact information
- Green accent color

**Back:**
- Tagline: "Powering Tomorrow"
- Website and social media
- Subtle solar panel pattern background

---

### Email Signatures

```
[Name]
[Title]
Feraj Solar Limited

📧 [email]
📱 [phone]
🌐 www.ferajsolar.com

🌿 Powering Kenya's Sustainable Future
```

---

### Letterhead

- Logo (top center)
- Company address (bottom left)
- Contact info (bottom right)
- Subtle green accent line

---

### Marketing Materials

#### Brochures
- High-quality product photography
- Clear benefit statements
- Case studies and testimonials
- Technical specifications on separate panel
- Strong call-to-action

#### Flyers
- Eye-catching headline
- One clear offer or message
- Compelling imagery
- QR code to website
- Contact information

---

## 10. Digital Brand Standards

### Website

#### Layout
- Maximum content width: 1200px
- Column gaps: 24px
- Section padding: 64px vertical, 24px horizontal
- Mobile breakpoints: 640px, 768px, 1024px, 1280px

#### Navigation
- Logo always links to home
- Clear active state for current page
- Mobile: Hamburger menu
- Sticky header on scroll

#### Buttons
- Primary: Green background, white text
- Secondary: White background, gray border
- Minimum touch target: 44×44px
- Hover states always visible

---

### Social Media

#### Profile Images
- Use logo icon (square)
- Consistent across all platforms
- High resolution (400×400px minimum)

#### Cover Images
- Feature solar installations or team
- Include company name and tagline
- Update seasonally or for campaigns

#### Post Guidelines
- 80/20 rule: 80% educational/community, 20% promotional
- Use brand colors in graphics
- Always include relevant hashtags
- Post consistently (minimum 3× per week)

**Hashtags:**
#FerajSolar #SolarEnergyKenya #CleanEnergyKE #SustainableKenya #GoGreenKenya

---

### Email Marketing

#### Template Structure
- Header with logo
- Hero image (optional)
- Main content with clear hierarchy
- Call-to-action button (green)
- Footer with contact and social links

#### Design
- Mobile-responsive
- Maximum width: 600px
- System fonts for better rendering
- Inline CSS for compatibility

---

### Mobile App (Future)

#### Design Standards
- Follow iOS Human Interface Guidelines / Material Design
- Bottom navigation for main sections
- Green accent for primary actions
- Card-based layouts
- Pull-to-refresh for data updates

---

## Brand Enforcement

### Approval Process

**All Brand Materials Require Approval:**
1. Internal review by marketing team
2. Brand compliance check
3. Final approval by director
4. Archive approved assets

### Brand Violations

**Common Issues to Avoid:**
- Wrong logo version or colors
- Unapproved fonts
- Off-brand imagery
- Inconsistent messaging
- Unauthorized use of company name

### Contact

**Brand Questions:**
- Email: brand@ferajsolar.com
- Marketing Director: [Name]

---

**Document Version**: 1.0  
**Last Review**: January 22, 2026  
**Next Review**: July 22, 2026  
**Owner**: Marketing Team
