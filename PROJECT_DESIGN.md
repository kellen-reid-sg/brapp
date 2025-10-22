# The Boot Room - Design System

> Inspired by LENS player analysis platform - Clean, professional, sports-focused design system for soccer coaching.

---

## 📐 Design Philosophy

**Core Principles:**
- **Minimalist & Clean**: Flat surfaces, sharp typography, minimal color usage
- **High Contrast**: Strong text on backgrounds, accent used sparingly
- **Sports Energy**: Bold typography with italic/skewed treatments, dynamic hover states
- **Data-Forward**: Clear hierarchy, tabular numbers, progress indicators
- **Professional**: Premium feel through generous spacing, smooth animations

---

## 🎨 Color System

### Base Colors
```css
/* Backgrounds */
--bg-canvas: #1a1a1a;           /* Dark canvas (current) */
--bg-surface: #FFFFFF;           /* White cards/sections */
--bg-surface-alt: #F7F7F8;       /* Subtle variation */

/* Text */
--text-primary: #FFFFFF;         /* On dark backgrounds */
--text-primary-dark: #0A0A0A;    /* On light backgrounds */
--text-secondary: #3F3F46;       /* Medium emphasis */
--text-muted: #71717A;           /* Low emphasis */
--text-muted-light: #d1d5db;     /* Muted on dark */

/* Borders */
--border-default: #E5E7EB;       /* Light borders */
--border-subtle: #EEF2F6;        /* Hairline dividers */
--border-strong: #D1D5DB;        /* Emphasis */
--border-dark: rgba(255,255,255,0.10);  /* On dark backgrounds */
```

### Accent Colors
```css
/* Primary Accent - Pitch Green */
--accent-primary: #16a34a;       /* Main green */
--accent-primary-hover: #15803D;
--accent-primary-light: #22C55E;
--accent-primary-bg: #F0FDF4;    /* Tint for badges */

/* Data Visualization */
--data-cyan: #00D9FF;            /* Data metrics */
--data-blue: #0EA5E9;            /* Progress fills */
--success-green: #10B981;        /* Results/success */
--warning-amber: #F59E0B;        /* Important labels */
--danger-red: #EF4444;           /* Critical/top priority */

/* Position-Specific (for drill categories) */
--position-forward: #00E6FF;     /* Cyan */
--position-midfielder: #7CFF8D;  /* Green */
--position-defender: #A2A8FF;    /* Blue */
--position-goalkeeper: #FFC14D;  /* Amber */
```

### Dark Theme Overlays
```css
--overlay-01: rgba(255,255,255,0.04);
--overlay-02: rgba(255,255,255,0.06);
--overlay-03: rgba(255,255,255,0.08);
--overlay-04: rgba(255,255,255,0.12);
--scrim-strong: rgba(0,0,0,0.50);
```

---

## 📝 Typography

### Font Families
```css
--font-display: "Arial Black", "Helvetica Neue", sans-serif;
--font-body: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
--font-mono: ui-monospace, "SF Mono", Consolas, monospace;
```

### Font Sizes
```css
--text-display-xl: 96px;    /* Hero headlines */
--text-h1: 56px;            /* Page titles */
--text-h2: 40px;            /* Section headers */
--text-h3: 32px;            /* Card titles */
--text-h4: 24px;            /* Sub-sections */
--text-body-l: 18px;        /* Intro/lead text */
--text-body: 16px;          /* Default body */
--text-body-s: 14px;        /* Meta/descriptions */
--text-caption: 12px;       /* Labels/tags */
--text-overline: 11px;      /* Uppercase labels */
```

### Font Weights
```css
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
--font-black: 900;
```

### Typography Patterns

#### Hero Display Text
```css
.hero-title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  font-style: italic;
  line-height: 1.1;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}
```

#### Outlined/Stroke Text
```css
.text-outline {
  color: transparent;
  -webkit-text-stroke: 2px currentColor;
  text-stroke: 2px currentColor;
}
```

#### Stat Numbers
```css
.stat-value {
  font-size: 28-32px;
  font-weight: 700-800;
  font-feature-settings: "tnum" 1;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}

.stat-label {
  font-size: 11-12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
```

---

## 📏 Spacing System

### Base Scale (4px grid)
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
--space-32: 128px;
```

### Layout Patterns
```css
/* Section Spacing */
--section-padding-y: 80-120px;
--hero-padding-y: 120-160px;
--section-gap: 24-40px;

/* Component Spacing */
--card-padding: 16-24px;
--card-grid-gap: 24-32px;
--nav-height: 64-72px;
--nav-gap: 80px;  /* Between nav items */
```

### Container Widths
```css
--container-max: 1280px;
--container-padding: 24px;  /* Desktop */
--container-padding-tablet: 20px;
--container-padding-mobile: 16px;
```

---

## 🎯 Component Library

### 1. Navigation Bar

```css
.navbar {
  height: 64-72px;
  padding: 0 24px;
  border-bottom: 1px solid rgba(255,255,255,0.10);
}

.nav-link {
  font-size: 14px;
  font-weight: 500;
  font-style: italic;
  color: white;
  text-decoration: underline;
  letter-spacing: 0.05em;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--accent-primary);
}
```

### 2. Buttons

```css
/* Primary Button */
.btn-primary {
  background: var(--accent-primary);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-style: italic;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: var(--accent-primary-hover);
}

/* Secondary (Outline) */
.btn-secondary {
  background: transparent;
  border: 1px solid #D1D5DB;
  color: #111827;
  padding: 12px 24px;
  border-radius: 8px;
}

/* Sizes */
.btn-sm { padding: 8px 12px; min-height: 36px; }
.btn-md { padding: 10px 16px; min-height: 40px; }
.btn-lg { padding: 12px 20px; min-height: 44px; }
```

### 3. Cards

```css
.card {
  background: white;
  border: 2px solid var(--accent-primary);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.2s;
}

.card:hover {
  border-color: var(--accent-primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}

/* Dark Card (for dark backgrounds) */
.card-dark {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 12px;
  padding: 20px;
}

/* Card with Left Accent Bar */
.card-accented {
  border-left: 4px solid var(--accent-primary);
  border-radius: 12px 12px 12px 12px;
}
```

### 4. Tabs/Pills Navigation

```css
.tabs {
  display: flex;
  gap: 8px;
}

.tab-pill {
  height: 36px;
  padding: 0 14-16px;
  border-radius: 999px;
  font-size: 13-14px;
  font-weight: 500;
  letter-spacing: 0.2px;
  transition: all 0.2s;
}

/* Active */
.tab-pill.active {
  background: var(--data-cyan);
  color: white;
  border: 1px solid rgba(0,217,255,0.30);
}

/* Inactive */
.tab-pill {
  background: transparent;
  color: rgba(255,255,255,0.70);
  border: 1px solid rgba(255,255,255,0.20);
}

.tab-pill:hover {
  background: rgba(255,255,255,0.08);
  color: white;
}
```

### 5. Badges/Pills

```css
.badge {
  height: 24px;
  padding: 0 10-12px;
  border-radius: 999px;
  font-size: 11-12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

/* Variants */
.badge-important {
  background: #F59E0B;
  color: #0B1120;
}

.badge-priority {
  background: #EF4444;
  color: white;
}

.badge-optional {
  background: rgba(255,255,255,0.10);
  color: rgba(255,255,255,0.90);
  border: 1px solid rgba(255,255,255,0.20);
}
```

### 6. Progress Bars

```css
.progress {
  height: 8px;
  background: rgba(255,255,255,0.08);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00D9FF 0%, #0EA5E9 100%);
  border-radius: 999px;
  transition: width 0.3s ease-out;
}

.progress-label {
  font-size: 12-13px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: rgba(255,255,255,0.80);
  margin-bottom: 4px;
}
```

### 7. Numbered Sections

```css
.section-numbered {
  display: flex;
  gap: 12px;
  padding: 16-24px;
  border-left: 4px solid var(--accent-cyan);
}

.section-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0,217,255,0.20);
  color: var(--data-cyan);
  font-size: 12-13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-title {
  font-size: 18-20px;
  font-weight: 600-700;
  color: var(--data-cyan);
}
```

### 8. Formula/Calculation Display

```css
.formula-block {
  background: rgba(16,185,129,0.12);
  border: 1px solid rgba(16,185,129,0.32);
  border-radius: 12px;
  padding: 16-20px;
}

.formula-text {
  font-size: 13-14px;
  font-weight: 500;
  font-family: var(--font-mono);
  color: #A7F3D0;
  margin-bottom: 8px;
}

.formula-result {
  font-size: 18-20px;
  font-weight: 700;
  color: #10B981;
}
```

---

## 🎬 Animations & Interactions

### Timing Functions
```css
--ease-standard: cubic-bezier(0.22, 1, 0.36, 1);  /* Premium ease-out */
--ease-fast: 150ms ease-out;
--ease-base: 200ms ease-out;
--ease-slow: 250ms ease;
```

### Expanding Card Pattern

**Use Case:** Drill category selection, session type choosers

```css
.card-grid {
  display: flex;
  gap: 16px;
  height: 440px;  /* Desktop */
}

.expanding-card {
  flex: 1 1 0;
  min-width: 180px;
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  transition: flex-grow 420ms var(--ease-standard),
              box-shadow 240ms ease-out,
              filter 240ms ease-out;
}

/* Hover/Active State */
.expanding-card:hover {
  flex-grow: 3;  /* Expands to ~50% */
  box-shadow: 0 12px 32px rgba(0,0,0,0.32);
  filter: grayscale(0) saturate(1.1) brightness(1.05);
}

/* Inactive/Sibling State */
.card-grid:has(.expanding-card:hover) .expanding-card:not(:hover) {
  flex-grow: 1;
  filter: grayscale(0.8) brightness(0.75);
}

/* Image Overlay */
.card-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, 
    rgba(0,0,0,0.72) 0%, 
    rgba(0,0,0,0.22) 55%, 
    rgba(0,0,0,0.60) 100%);
  transition: opacity 220ms ease-out;
}

.expanding-card:hover .card-image-overlay {
  opacity: 0.3;  /* Lighter on hover */
}

/* Content Reveal (staggered) */
.card-title {
  transition: all 150ms ease-out;
}

.expanding-card:hover .card-title {
  font-size: 28px;
  color: var(--accent-primary);
}

.card-subtitle {
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 260ms ease-out 140ms,
              transform 260ms var(--ease-standard) 140ms;
}

.expanding-card:hover .card-subtitle {
  opacity: 1;
  transform: translateY(0);
}

.card-description {
  opacity: 0;
  transition: opacity 200ms ease-out 180ms;
}

.expanding-card:hover .card-description {
  opacity: 1;
}
```

### Hover Translations
```css
/* Subtle lift on cards */
.card-hover {
  transition: transform 0.2s ease-out;
}

.card-hover:hover {
  transform: translateY(-2px);
}

/* Button hover */
.btn:hover {
  transform: translateY(-1px);
}
```

### Accessibility
```css
/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Focus states */
.btn:focus-visible,
.card:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 2px;
}
```

---

## 📱 Responsive Breakpoints

```css
--breakpoint-mobile: 640px;
--breakpoint-tablet: 768px;
--breakpoint-desktop: 1024px;
--breakpoint-wide: 1280px;
```

### Mobile Adjustments
- Reduce font sizes by 10-15%
- Stack cards vertically
- Reduce spacing scale (16px instead of 24px)
- Navigation becomes hamburger menu
- Touch targets minimum 44px
- Expanding cards become vertical scroll with tap-to-expand

---

## ✅ Accessibility Standards

### Contrast Ratios
- **Normal text**: 4.5:1 minimum (WCAG AA)
- **Large text** (≥24px): 3:1 minimum
- **Interactive elements**: 3:1 against background

### Focus Indicators
- 2px solid outline in accent color
- 2px offset from element
- Visible on all interactive elements

### Touch Targets
- Minimum 44×44px for all interactive elements
- 8px spacing between adjacent targets

---

## 🎨 Usage Examples

### Hero Section
```jsx
<div className="hero">
  <h1 style={{
    fontFamily: '"Arial Black", sans-serif',
    fontSize: 'clamp(3rem, 8vw, 6rem)',
    fontWeight: 900,
    fontStyle: 'italic',
    color: 'white',
    textTransform: 'uppercase',
    lineHeight: 1.1
  }}>
    TAKE YOUR COACHING<br />
    TO THE <span style={{color: '#16a34a'}}>NEXT LEVEL</span>
  </h1>
</div>
```

### Drill Card
```jsx
<div className="card">
  <span className="badge badge-category">POSSESSION</span>
  <h3 className="card-title">4v4 Rondo</h3>
  <p className="card-description">Small-sided possession game...</p>
  <div className="stats">
    <div>
      <span className="stat-value">20</span>
      <span className="stat-label">MIN</span>
    </div>
    <div>
      <span className="stat-value">42</span>
      <span className="stat-label">UPVOTES</span>
    </div>
  </div>
</div>
```

---

## 📦 Implementation Notes

### CSS Variables Setup
```css
:root {
  /* Colors */
  --accent-primary: #16a34a;
  --data-cyan: #00D9FF;
  
  /* Typography */
  --font-display: "Arial Black", sans-serif;
  --font-body: "Inter", sans-serif;
  
  /* Spacing */
  --space-4: 16px;
  --space-6: 24px;
  
  /* Timing */
  --ease-standard: cubic-bezier(0.22, 1, 0.36, 1);
}
```

### Performance Considerations
- Use `will-change` sparingly (only on active hover states)
- Animate only `transform`, `opacity`, `filter` for 60fps
- Avoid animating `width`, `height`, `background-size`
- Use `contain: layout` on cards to isolate reflows

---

## 📚 References

- Inspired by: [LENS Player Analysis](https://lens-v1.vercel.app/)
- Font: Inter from [Google Fonts](https://fonts.google.com/specimen/Inter)
- Icons: [Heroicons](https://heroicons.com/) or similar minimal set
- Accessibility: [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Version:** 1.0  
**Last Updated:** October 2025  
**Maintained by:** The Boot Room Team
