# Exabyte Studio Website Documentation

**Version:** 1.0
**Last Updated:** November 11, 2025
**Purpose:** Complete documentation for the Exabyte Studio marketing website

---

## Table of Contents

1. [Overview](#overview)
2. [File Structure](#file-structure)
3. [Architecture](#architecture)
4. [Particle Hero Animation System](#particle-hero-animation-system)
5. [Scroll Behavior Logic](#scroll-behavior-logic)
6. [Page Descriptions](#page-descriptions)
7. [Styling System](#styling-system)
8. [Content Update Guide](#content-update-guide)
9. [Technical Specifications](#technical-specifications)
10. [Maintenance Best Practices](#maintenance-best-practices)

---

## Overview

The Exabyte Studio website is a professional marketing site showcasing a **3D spatial intelligence software platform** for multimodal data processing. The website features:

- **Interactive 3D particle animation** hero section
- **Five main pages**: Home, Features, Technology, Solutions, API
- **Dark theme** with gold (#FFB300) and purple (#7E57C2) accent colors
- **Responsive design** for desktop, tablet, and mobile
- **Scroll-based particle zoom** interaction system

**Target Audience:** Professional developers, AI researchers, content creators, enterprise users

**Key Message:** Professional software for 3D reconstruction, AI-powered workflows, and immersive content creation

---

## File Structure

```
website/
├── index.html              # Homepage with particle hero
├── features.html           # Feature showcase (6 modalities)
├── technology.html         # Technical architecture details
├── solutions.html          # Use cases and workflows
├── api.html                # API documentation (coming soon placeholder)
├── styles.css              # Global styles and theme
├── particle-hero.js        # 3D particle animation system
├── main.js                 # Navigation and UI interactions
├── exabyte_studio.html     # Original particle demo (reference only)
└── WEBSITE_DOCUMENTATION.md # This file
```

### Active Files (Production)
- **HTML Pages**: index.html, features.html, technology.html, solutions.html, api.html
- **Stylesheets**: styles.css
- **JavaScript**: particle-hero.js, main.js

### Reference Files
- **exabyte_studio.html**: Original particle animation demo (DO NOT deploy, reference only)

---

## Architecture

### Technology Stack
- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **No Frameworks**: Vanilla JS for maximum performance
- **Canvas API**: Used for particle rendering
- **No Build Process**: Direct deployment of source files

### Design Principles
1. **Performance-First**: Optimized particle rendering with requestAnimationFrame
2. **Zero Dependencies**: No external libraries (except browser APIs)
3. **Progressive Enhancement**: Works without JavaScript (content still accessible)
4. **Responsive Design**: Mobile-first CSS with breakpoints

### Page Architecture
```
┌─────────────────────┐
│   Navigation Bar    │ ← Sticky, appears on all pages
├─────────────────────┤
│   Hero Section      │ ← Particle canvas (index.html only)
├─────────────────────┤
│  Content Sections   │ ← Feature grids, text blocks, diagrams
├─────────────────────┤
│   Footer            │ ← Links, contact, copyright
└─────────────────────┘
```

---

## Particle Hero Animation System

### Overview
The particle hero (`particle-hero.js`) creates an interactive 3D text effect using thousands of particles that form the text "EXABYTE STUDIO".

### Configuration Parameters

Located at the top of `particle-hero.js` (lines 6-26):

```javascript
// Text
const TEXT_VALUE = "EXABYTE STUDIO";

// Appearance
const PARTICLE_SIZE_SCALE = 1.0;      // Particle size multiplier (0.2-4)
const PARTICLE_DENSITY_SCALE = 4.0;   // Particle count multiplier (0.25-6)
const EXTRUSION_DEPTH = 80;           // 3D thickness in pixels
const TEXT_SIZE_FACTOR = 8;           // Text sizing (smaller = larger)
const TEXT_FIT_WIDTH_RATIO = 0.50;    // 50% of canvas width
const TEXT_FIT_HEIGHT_RATIO = 0.6;    // 60% of canvas height

// Camera
const FOV = 1200;                     // Perspective focal length
const BASE_CAMERA_Z = 1400;           // Camera distance

// 3D Mask Effect
const FACE_LAYERS = 8;                // Depth layers for 3D text
const FACE_LAYER_SHIFT_PX = 1.0;      // Offset between layers

// Mouse Interaction
const MOUSE_REPEL_RADIUS = 90;        // Scatter radius in pixels
const MOUSE_FORCE_SCALE = 2.0;        // Scatter strength
```

### Zoom Configuration

```javascript
const minZoom = 0.5;    // Minimum zoom (fully zoomed out)
const maxZoom = 4.0;    // Maximum zoom (fully zoomed in)
let zoom = 1.0;         // Initial zoom (comfortable viewing size)

const scrollZoomRange = 1000; // Wheel delta for full zoom range
```

### Color Scheme

```javascript
const colors = [
  "#FFB300",  // Gold (primary)
  "#FFD54F",  // Light gold
  "#FF8F00",  // Dark gold
  "#4D0099",  // Purple (primary)
  "#7E57C2",  // Medium purple
  "#B388FF"   // Light purple
];
```

### Particle Physics

Each particle has:
- **Position** (x, y, z): Current 3D coordinates
- **Destination** (dest.x, dest.y, dest.z): Target position in text
- **Velocity** (vx, vy, vz): Movement speed in each axis
- **Acceleration** (accX, accY, accZ): Spring force toward destination
- **Friction**: 0.93-0.98 (dampening factor)
- **Size** (r): 1-5 pixels × PARTICLE_SIZE_SCALE
- **Ellipse** (ax, ay, theta): Rotation and stretch
- **Alpha**: 0.4-1.0 opacity
- **Color**: Random from color array

### Animation Loop

**60 FPS render cycle:**

```javascript
function render() {
  requestAnimationFrame(render);

  // 1. Clear canvas
  ctx.clearRect(0, 0, w, h);

  // 2. Update physics (spring to destination)
  for (particle of particles) {
    particle.integrate();
  }

  // 3. Apply 3D rotation
  rotated = rotatePoint(particle, rotX, rotY);

  // 4. Project to 2D screen
  projected = project(rotated, cx, cy);

  // 5. Apply mouse repulsion
  if (distance < MOUSE_REPEL_RADIUS) {
    applyScatterForce();
  }

  // 6. Depth sort (far to near)
  screenPts.sort((a, b) => b.z - a.z);

  // 7. Draw particles as ellipses
  for (point of screenPts) {
    ctx.ellipse(...);
  }
}
```

### Interaction Handlers

**Mouse/Touch Drag:**
- Updates `rotX` (vertical rotation) and `rotY` (horizontal rotation)
- Constrained to -π/2 to π/2 for rotX

**Mouse Move:**
- Tracks mouse position for particle repulsion effect
- Particles scatter away from cursor within MOUSE_REPEL_RADIUS

**Double Click:**
- Resets rotation to front view (rotX = 0, rotY = 0)
- Resets zoom to initial state (1.0)
- Scrolls page to top

**Wheel Scroll:**
- See [Scroll Behavior Logic](#scroll-behavior-logic) section

---

## Scroll Behavior Logic

### State Machine

The scroll behavior operates as a **state machine** with two distinct states:

**State 1: Page at Top (`scrollY = 0`)**
- Particle zoom is **active** and controlled by wheel events
- Page scroll is **intercepted** until zoom limits reached

**State 2: Page Scrolled (`scrollY > 0`)**
- Particle zoom is **frozen** at current value
- Page scroll behaves **normally** (standard webpage)

### Flow Diagram

```
┌────────────────────────────────────────────────────────────┐
│                     INITIAL STATE                          │
│  - Page at top (scrollY = 0)                               │
│  - Particles visible, zoom = 1.0                           │
│  - Content below hidden                                    │
└────────────────────────────────────────────────────────────┘
                           │
           ┌───────────────┴───────────────┐
           │                               │
       SCROLL UP                       SCROLL DOWN
           │                               │
           ▼                               ▼
┌─────────────────────┐         ┌─────────────────────┐
│  Zoom IN particles  │         │  Zoom OUT particles │
│  (1.0 → 4.0)        │         │  (1.0 → 0.5)        │
└─────────────────────┘         └─────────────────────┘
           │                               │
    Further scroll up              Further scroll down
    (at max zoom)                  (at min zoom)
           │                               │
           ▼                               ▼
┌─────────────────────┐         ┌─────────────────────┐
│  No effect          │         │  PAGE SCROLLS DOWN  │
│  (already max)      │         │  (show content)     │
└─────────────────────┘         └─────────────────────┘
                                           │
                                  State changes to:
                                  scrollY > 0
                                           │
           ┌───────────────────────────────┴───────────────┐
           │                                               │
       SCROLL UP                                       SCROLL DOWN
           │                                               │
           ▼                                               ▼
┌─────────────────────┐                         ┌─────────────────────┐
│  PAGE SCROLLS UP    │                         │  PAGE SCROLLS DOWN  │
│  (normal behavior)  │                         │  (show more)        │
└─────────────────────┘                         └─────────────────────┘
           │
    Reach top (scrollY = 0)
    Particles still at min zoom (0.5)
           │
       SCROLL UP
           │
           ▼
┌─────────────────────┐
│  Zoom IN particles  │
│  (0.5 → 4.0)        │
│  Back to initial    │
└─────────────────────┘
```

### Implementation Details

**Lines 288-337 in particle-hero.js:**

```javascript
function onWheel(e) {
  const delta = e.deltaY;

  // STATE CHECK: If page scrolled, allow normal scroll
  if (window.scrollY > 0) {
    // Particle zoom DISABLED
    // Normal page scroll (don't preventDefault)
    return;
  }

  // STATE: Page at top, control particle zoom
  const isScrollingDown = delta > 0;
  const isScrollingUp = delta < 0;

  // Accumulate scroll (positive = zoom out, negative = zoom in)
  accumulatedScroll += delta;

  // Clamp to range [0, scrollZoomRange]
  // 0 = maxZoom (4.0), scrollZoomRange = minZoom (0.5)
  accumulatedScroll = Math.max(0, Math.min(scrollZoomRange, accumulatedScroll));

  // Calculate zoom
  scrollProgress = accumulatedScroll / scrollZoomRange;
  zoom = maxZoom - (maxZoom - minZoom) * scrollProgress;

  // Prevent default scroll if still within zoom range
  let shouldPreventScroll = false;

  if (isScrollingDown) {
    // Prevent until min zoom reached
    if (scrollProgress < 0.99) {
      shouldPreventScroll = true;
    }
  } else if (isScrollingUp) {
    // Prevent until max zoom reached
    if (scrollProgress > 0.01) {
      shouldPreventScroll = true;
    }
  }

  if (shouldPreventScroll) {
    e.preventDefault();
  }
}
```

### Key Variables

| Variable | Range | Meaning |
|----------|-------|---------|
| `scrollProgress` | 0.0 - 1.0 | Zoom progress (0 = max, 1 = min) |
| `accumulatedScroll` | 0 - 1000 | Wheel delta accumulator |
| `zoom` | 0.5 - 4.0 | Current zoom level |
| `scrollZoomRange` | 1000 | Delta needed for full zoom range |
| `window.scrollY` | 0+ | Page scroll position (pixels) |

### Edge Cases Handled

1. **Scrolling up at max zoom (scrollY = 0)**: No effect, zoom already at maximum
2. **Scrolling down at min zoom (scrollY = 0)**: Page scrolls, content revealed
3. **Scrolling up from content**: Normal page scroll until top, then zoom in
4. **Double-click while scrolled**: Resets both page scroll and particle zoom
5. **Resize window**: Rebuilds particle model, preserves zoom state

---

## Page Descriptions

### index.html - Homepage

**Purpose:** First impression, hero animation, overview of platform

**Sections:**
1. **Hero Section** (`#hero`)
   - Particle canvas animation
   - Scroll indicator ("Scroll to explore")

2. **Hero Content Section** (`#hero-content`)
   - Main headline: "Professional 3D Spatial Intelligence Platform"
   - Subtitle describing AI-powered features
   - CTA buttons: "Explore Features", "View Documentation"
   - Stats: 272K+ lines of code, 6 modalities, 100% AI test coverage

3. **Overview Section** (`#overview`)
   - "What is Exabyte Studio?" explanation
   - 6 feature cards:
     - 3D Reconstruction (VGGT, Gaussian Splatting, COLMAP)
     - Professional Editing (multi-track timeline)
     - AI Generation (ExabyteImage, ExabyteVideo, ExabyteWorld)
     - Spatial Audio (Ambisonics, HRTF)
     - Real-Time Processing (GPU acceleration)
     - Open API (REST/WebSocket)

4. **Capabilities Section** (`#capabilities`)
   - 6 numbered capability items with tags:
     - Image Processing
     - Video Production
     - Audio Processing
     - 3D Reconstruction
     - Spatial/360° Media
     - AI-Powered Workflows

5. **Architecture Section** (`#architecture`)
   - Six-layer architecture diagram
   - Key features: Zero-Copy IPC, Async-First, Type-Safe
   - CTA: "Explore Technology" button

6. **CTA Section** (`.section-cta`)
   - "Ready to Transform Your Workflow?"
   - Buttons: "View Documentation", "Get in Touch"

7. **Contact Section** (`#contact`)
   - Email: info@exabytespatial.ai
   - Documentation link
   - GitHub repository link

8. **Footer**
   - Logo and tagline
   - Three columns: Product, Resources, Company
   - Copyright notice

**Key Files:**
- HTML: `index.html`
- CSS: `styles.css` (sections: `.hero`, `.hero-content-section`, `.section`, `.footer`)
- JS: `particle-hero.js`, `main.js`

**Update Frequency:** Quarterly for stats, as needed for messaging

---

### features.html - Feature Showcase

**Purpose:** Detailed breakdown of all 6 modalities and features

**Sections:**
1. **Hero Section**
   - Title: "Comprehensive Features"
   - Subtitle: "Six data modalities, one unified platform"

2. **Image Processing** (`#image-processing`)
   - Professional editing tools
   - AI generation (ExabyteImage)
   - Feature cards: Filters, Adjustments, Transforms, Detection

3. **Video Production** (`#video-production`)
   - Multi-track timeline editor
   - Professional codecs (ProRes, H.265)
   - 4K/8K support
   - AI video generation (ExabyteVideo)

4. **Audio Processing** (`#audio-processing`)
   - Spatial audio (3rd-order Ambisonics)
   - HRTF binaural processing
   - Multi-channel mixing (up to 20 channels)

5. **3D Reconstruction** (`#3d-reconstruction`)
   - VGGT transformer algorithm
   - Gaussian Splatting for real-time rendering
   - COLMAP structure-from-motion

6. **Spatial/360° Media** (`#spatial-media`)
   - Equirectangular editing
   - 360° stabilization
   - Cubemap and dual-fisheye formats

7. **AI-Powered Workflows** (`#ai-workflows`)
   - Multi-provider support (Claude, ChatGPT, Gemini)
   - Tool execution with permissions
   - Chat interface for automation

**Update Guide:**
- Add new features as feature cards within respective sections
- Update algorithm names if rebranded
- Keep consistent card layout (icon + title + description + tags)

---

### technology.html - Technical Architecture

**Purpose:** Deep dive into architecture, algorithms, and technical implementation

**Sections:**
1. **Hero Section**
   - Title: "Advanced Technology Stack"
   - Subtitle: Engineering excellence

2. **Architecture Deep Dive** (`#architecture`)
   - Six-layer architecture diagram
   - Layer descriptions with technology details
   - Key principles: Zero-Copy IPC, Async-First

3. **AI Algorithms** (`#ai-algorithms`)
   - Three algorithm cards:
     - **ExabyteImage 3.0** (Text-to-image, 48K tests)
     - **ExabyteVideo 1.0** (Text-to-video, 48K tests)
     - **ExabyteWorld 1.0** (Panorama-to-3D, 48K tests)
   - Badges showing "Exabyte" branding

4. **3D Reconstruction Algorithms** (`#reconstruction`)
   - VGGT (Visual Geometry Grounded Transformer)
   - Gaussian Splatting with CUDA acceleration
   - COLMAP pipeline

5. **Technical Features**
   - BufferReference pattern
   - Shared memory IPC
   - Enum-based operations

**Important Notes:**
- **NO CODE EXAMPLES** should be shown (removed as API not ready)
- Keep high-level descriptions only
- Update test counts as testing expands

---

### solutions.html - Use Cases

**Purpose:** Show real-world applications and workflows

**Sections:**
1. **Hero Section**
   - Title: "Solutions for Every Industry"
   - Subtitle: From film to education

2. **Industry Solutions** (6 cards)
   - Film & Entertainment
   - Architecture & Real Estate
   - Education & Training
   - Scientific Research
   - Marketing & Advertising
   - Gaming & Interactive Media

3. **Workflow Examples** (`#workflows`)
   - 360° Video Production Workflow
   - 3D Reconstruction Workflow
   - AI Content Generation Workflow
   - Spatial Audio Workflow

4. **Case Studies** (if added in future)
   - Customer success stories
   - Before/after comparisons

**Update Guide:**
- Add new industries as use cases expand
- Update workflow steps as features change
- Add case studies when available

---

### api.html - API Documentation (Placeholder)

**Purpose:** Placeholder for future API documentation

**Current Status:** "Coming Soon" page with:
- Launch notification signup form
- High-level feature previews (no implementation details)
- Contact information

**Sections:**
1. **Coming Soon Section**
   - Rocket icon
   - "API Documentation Coming Soon" message
   - Expected features list

2. **Feature Preview Grid** (6 cards)
   - RESTful Architecture
   - WebSocket Support
   - Authentication & RBAC
   - Comprehensive Documentation
   - SDKs & Libraries
   - Rate Limiting & Quotas

3. **Notify Section**
   - Email signup form (non-functional, placeholder)

**Future Updates:**
- Replace entire page when API is ready
- Add: Installation, Authentication, Endpoints, Code Examples
- Use OpenAPI/Swagger documentation format

---

## Styling System

### CSS Architecture

**File:** `styles.css` (17,743 bytes)

**Structure:**
```css
/* 1. CSS Variables (theme colors, spacing, etc.) */
/* 2. Reset & Base Styles */
/* 3. Layout Components (navbar, footer) */
/* 4. Section Styles (hero, features, etc.) */
/* 5. Component Styles (buttons, cards, etc.) */
/* 6. Utility Classes */
/* 7. Responsive Breakpoints */
```

### CSS Variables (Theme)

Located at `:root` in `styles.css`:

```css
:root {
  /* Colors */
  --color-bg-primary: #0a0a0a;      /* Main background */
  --color-bg-secondary: #1a1a1a;    /* Section backgrounds */
  --color-bg-tertiary: #2a2a2a;     /* Card backgrounds */
  --color-text-primary: #ffffff;    /* Main text */
  --color-text-secondary: #b0b0b0;  /* Secondary text */
  --color-accent-gold: #FFB300;     /* Primary accent */
  --color-accent-purple: #7E57C2;   /* Secondary accent */

  /* Spacing */
  --spacing-xs: 0.5rem;   /* 8px */
  --spacing-sm: 1rem;     /* 16px */
  --spacing-md: 2rem;     /* 32px */
  --spacing-lg: 4rem;     /* 64px */
  --spacing-xl: 6rem;     /* 96px */

  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", ...;
  --font-size-base: 16px;
  --line-height-base: 1.6;

  /* Borders */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;

  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 8px rgba(0,0,0,0.2);
  --shadow-lg: 0 8px 16px rgba(0,0,0,0.3);
}
```

### Color Palette

**Primary Colors:**
- **Gold (#FFB300)**: Primary accent, CTAs, highlights
- **Purple (#7E57C2)**: Secondary accent, links, gradients
- **Dark (#0a0a0a)**: Main background

**Gradient Usage:**
```css
.gradient-text {
  background: linear-gradient(135deg,
    var(--color-accent-gold),
    var(--color-accent-purple)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Typography Scale

```css
h1 { font-size: 3.5rem; font-weight: 700; }  /* 56px */
h2 { font-size: 2.5rem; font-weight: 700; }  /* 40px */
h3 { font-size: 1.75rem; font-weight: 600; } /* 28px */
h4 { font-size: 1.25rem; font-weight: 600; } /* 20px */
p  { font-size: 1rem; line-height: 1.6; }    /* 16px */
```

### Responsive Breakpoints

```css
/* Desktop first approach */
@media (max-width: 1200px) { /* Large tablets */ }
@media (max-width: 992px)  { /* Tablets */ }
@media (max-width: 768px)  { /* Small tablets */ }
@media (max-width: 576px)  { /* Mobile */ }
```

### Component Classes

**Buttons:**
```css
.btn { /* Base button styles */ }
.btn-primary { /* Gold background */ }
.btn-secondary { /* Transparent with border */ }
.btn-lg { /* Larger size */ }
```

**Cards:**
```css
.feature-card { /* Feature grid items */ }
.capability-item { /* Numbered capability cards */ }
.contact-card { /* Contact information boxes */ }
```

**Sections:**
```css
.section { /* Standard section padding */ }
.section-dark { /* Dark background variant */ }
.section-cta { /* Call-to-action section */ }
```

---

## Content Update Guide

### Common Update Tasks

#### 1. Update Statistics (index.html)

**Location:** `.hero-stats` section

```html
<div class="stat">
  <span class="stat-number">272K+</span>
  <span class="stat-label">Lines of Code</span>
</div>
```

**How to Update:**
1. Open `index.html`
2. Find `.hero-stats` (around line 61)
3. Update `stat-number` values
4. Keep formatting consistent (K for thousands, + for "more than")

#### 2. Add New Feature

**Location:** `features.html`, appropriate modality section

**Steps:**
1. Copy existing feature card structure
2. Update icon SVG path
3. Update title and description
4. Add/update tags

**Template:**
```html
<div class="feature-card">
  <div class="feature-icon">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <!-- SVG path here -->
    </svg>
  </div>
  <h3>Feature Name</h3>
  <p>Feature description explaining benefits and capabilities.</p>
  <div class="feature-tags">
    <span class="tag">Tag 1</span>
    <span class="tag">Tag 2</span>
  </div>
</div>
```

#### 3. Update AI Algorithm Names

**Files to Update:**
- `index.html` (line 123)
- `features.html` (multiple locations)
- `solutions.html` (workflow sections)
- `technology.html` (algorithm cards)

**Find & Replace:**
- Use global search across files
- Maintain consistency across all pages
- Update badges if needed

#### 4. Add New Page

**Steps:**
1. Copy existing HTML template (e.g., `features.html`)
2. Update `<title>` tag
3. Update navigation active state
4. Add content sections
5. Update footer links if needed
6. Add link to navigation in all other pages

#### 5. Change Color Scheme

**Location:** `styles.css`, `:root` variables

**Steps:**
1. Update CSS variables for primary colors
2. Test all pages for contrast/readability
3. Update particle colors in `particle-hero.js` if needed

#### 6. Update Contact Information

**Locations:**
- `index.html` (contact section)
- All page footers

**Email:** `info@exabytespatial.ai`
**GitHub:** `https://github.com/exabyte-spatial-ai`

---

## Technical Specifications

### Browser Support

**Minimum Requirements:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Required Features:**
- Canvas API
- ES6+ JavaScript
- CSS Grid & Flexbox
- CSS Custom Properties

### Performance Targets

**Particle Animation:**
- Target: 60 FPS on modern hardware
- Particle count: ~5,000-15,000 (varies by screen size and density)
- Frame budget: 16.67ms per frame

**Page Load:**
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Total page size: < 200KB (excluding images)

**Optimization Techniques:**
- `requestAnimationFrame` for smooth animation
- Device pixel ratio scaling for sharp rendering
- Depth sorting only once per frame
- Object pooling for particle data structures

### Accessibility

**Current Status:** Limited accessibility features

**Improvements Needed:**
- Add ARIA labels to interactive elements
- Ensure keyboard navigation works
- Add alt text to decorative icons
- Provide "Skip to content" link
- Add reduced motion media query for particle animation

**Reduced Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  /* Disable particle animation */
  /* Show static hero image instead */
}
```

### SEO Considerations

**Meta Tags Present:**
- `<title>` on all pages
- `<meta name="description">` on index.html

**Recommended Additions:**
- Open Graph tags for social sharing
- Twitter Card tags
- Structured data (JSON-LD) for organization
- Sitemap.xml
- robots.txt

**Example Open Graph:**
```html
<meta property="og:title" content="Exabyte Studio - 3D Spatial Intelligence">
<meta property="og:description" content="Professional multimodal processing platform...">
<meta property="og:image" content="https://example.com/og-image.jpg">
<meta property="og:url" content="https://example.com">
```

---

## Maintenance Best Practices

### Version Control

**Git Workflow:**
1. Create feature branch: `git checkout -b feature/update-stats`
2. Make changes
3. Test locally
4. Commit with descriptive message: `git commit -m "Update homepage statistics"`
5. Push and create pull request

**Commit Message Format:**
```
[Component] Brief description

- Detailed change 1
- Detailed change 2

Refs: #issue-number (if applicable)
```

### Testing Checklist

Before deploying updates:

- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile devices (iOS, Android)
- [ ] Verify particle animation runs smoothly
- [ ] Check scroll behavior on all pages
- [ ] Verify all navigation links work
- [ ] Check for console errors
- [ ] Validate HTML (W3C validator)
- [ ] Test with slow 3G network throttling
- [ ] Verify contact form (when implemented)
- [ ] Check footer links

### Backup Strategy

**Before Major Updates:**
1. Create backup: `cp -r website/ website-backup-$(date +%Y%m%d)/`
2. Or use git tag: `git tag -a v1.0 -m "Release v1.0"`

### Performance Monitoring

**Recommended Tools:**
- Google PageSpeed Insights
- Lighthouse (Chrome DevTools)
- WebPageTest.org

**Key Metrics to Track:**
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- Total Blocking Time (TBT)

### Common Issues & Solutions

**Issue: Particle animation laggy**
- **Solution:** Reduce `PARTICLE_DENSITY_SCALE` in `particle-hero.js`
- **Alternative:** Check browser console for errors

**Issue: Scroll not working on mobile**
- **Solution:** Verify `{ passive: false }` on wheel event listener
- **Check:** Mobile browser support for wheel events (may need touch events)

**Issue: Content overlapping particles**
- **Solution:** Check hero section height in `styles.css`
- **Verify:** `.hero { height: 100vh; }` is set

**Issue: Navigation not sticky**
- **Solution:** Check `.navbar { position: sticky; top: 0; }`
- **Verify:** Z-index is high enough

**Issue: Colors look different on mobile**
- **Solution:** Check color profile rendering
- **Alternative:** Use simpler color values (avoid complex gradients on low-end devices)

### File Size Monitoring

**Current Sizes (Nov 2025):**
- index.html: 16.3 KB
- features.html: 21.9 KB
- technology.html: 29.4 KB
- solutions.html: 29.7 KB
- api.html: 9.7 KB
- styles.css: 17.7 KB
- particle-hero.js: 11.9 KB
- main.js: 5.2 KB

**Total:** ~142 KB (HTML + CSS + JS)

**Targets:**
- Keep individual HTML files < 50 KB
- Keep CSS < 30 KB
- Keep JS files < 20 KB each

### Regular Maintenance Tasks

**Monthly:**
- [ ] Update statistics (if changed)
- [ ] Check for broken links
- [ ] Review analytics (when implemented)
- [ ] Update browser compatibility notes

**Quarterly:**
- [ ] Review and update content accuracy
- [ ] Performance audit
- [ ] Accessibility audit
- [ ] Update dependencies (if any added)

**Annually:**
- [ ] Major content refresh
- [ ] Design review
- [ ] Full cross-browser testing
- [ ] Update copyright year in footer

---

## Deployment

### Deployment Checklist

- [ ] Run testing checklist
- [ ] Minify CSS and JS (if not using CDN)
- [ ] Optimize images (if any added)
- [ ] Update meta tags
- [ ] Generate sitemap.xml
- [ ] Test on staging environment
- [ ] Backup current production
- [ ] Deploy to production
- [ ] Verify live site
- [ ] Update DNS if needed
- [ ] Monitor for errors

### Recommended Hosting

**Static Site Hosts:**
- **Netlify** (recommended): Auto-deploy from git, free SSL
- **Vercel**: Great performance, edge network
- **GitHub Pages**: Simple, free for public repos
- **AWS S3 + CloudFront**: Scalable, professional

**Configuration:**
- Enable HTTPS
- Set caching headers (1 year for CSS/JS, 1 hour for HTML)
- Enable gzip/brotli compression
- Set up redirects (www → non-www, or vice versa)

---

## Future Enhancements

### Planned Features

1. **Contact Form Implementation**
   - Backend API for email submission
   - Form validation
   - Success/error messages

2. **API Documentation Integration**
   - Replace api.html placeholder
   - Interactive API explorer
   - Code examples in multiple languages

3. **Case Studies Section**
   - Customer success stories
   - Video testimonials
   - Before/after comparisons

4. **Blog/News Section**
   - Company updates
   - Technical articles
   - Product announcements

5. **Interactive Demos**
   - Live algorithm demonstrations
   - Upload and process sample files
   - Interactive 3D viewer

### Technical Improvements

1. **Accessibility**
   - Full WCAG 2.1 AA compliance
   - Screen reader optimization
   - Keyboard navigation
   - Reduced motion support

2. **Performance**
   - Lazy loading for images
   - Code splitting for JS
   - Critical CSS inlining
   - Service worker for offline support

3. **Analytics**
   - Google Analytics / Plausible
   - Event tracking (CTA clicks, scrolls)
   - Heatmaps (Hotjar)

4. **Internationalization**
   - Multi-language support
   - RTL layout support
   - Locale-specific content

---

## Contact & Support

**For Website Issues:**
- Create issue in repository
- Email: info@exabytespatial.ai

**Documentation Updates:**
- Update this file with any changes
- Include date and description of changes
- Follow version control best practices

---

## Changelog

### Version 1.0 (November 11, 2025)
- Initial documentation created
- Covers all current pages and features
- Particle animation system documented
- Scroll behavior logic documented
- Maintenance guidelines established

---

**End of Documentation**

*Last updated: November 11, 2025*
*Document version: 1.0*
*Maintained by: Exabyte Studio Team*
