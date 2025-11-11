# Website Quick Reference Guide

**Quick access guide for common updates and maintenance tasks.**

---

## Quick Links

- **Full Documentation:** [WEBSITE_DOCUMENTATION.md](./WEBSITE_DOCUMENTATION.md)
- **Website URL:** (Add when deployed)
- **Repository:** https://github.com/exabyte-spatial-ai

---

## Common Updates

### 1. Update Homepage Statistics

**File:** `index.html`
**Location:** Line ~61-74

```html
<div class="stat">
  <span class="stat-number">272K+</span>
  <span class="stat-label">Lines of Code</span>
</div>
```

**Quick Edit:**
```bash
# Edit index.html, find .hero-stats section, update numbers
```

---

### 2. Change Particle Text

**File:** `particle-hero.js`
**Location:** Line 6

```javascript
const TEXT_VALUE = "EXABYTE STUDIO";
```

---

### 3. Adjust Particle Size

**File:** `particle-hero.js`
**Location:** Lines 9-10

```javascript
const PARTICLE_SIZE_SCALE = 1.0;     // Increase for bigger particles
const PARTICLE_DENSITY_SCALE = 4.0;  // Increase for more particles
```

---

### 4. Change Zoom Range

**File:** `particle-hero.js`
**Location:** Line 44

```javascript
const minZoom = 0.5, maxZoom = 4.0;
```

---

### 5. Update Color Scheme

**File:** `styles.css`
**Location:** Line ~1-20

```css
:root {
  --color-accent-gold: #FFB300;    /* Primary accent */
  --color-accent-purple: #7E57C2;  /* Secondary accent */
}
```

**Also update:** `particle-hero.js` line 36 (particle colors)

---

### 6. Update Contact Email

**Files to update:**
- `index.html` (contact section)
- All page footers

**Find & replace:** `info@exabytespatial.ai`

---

### 7. Add New Feature to Features Page

**File:** `features.html`
**Template:**

```html
<div class="feature-card">
  <div class="feature-icon">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <!-- Icon SVG path -->
    </svg>
  </div>
  <h3>Feature Name</h3>
  <p>Description of the feature...</p>
  <div class="feature-tags">
    <span class="tag">Tag 1</span>
    <span class="tag">Tag 2</span>
  </div>
</div>
```

---

### 8. Update AI Algorithm Names

**Files:** `index.html`, `features.html`, `solutions.html`, `technology.html`

**Current names:**
- ExabyteImage 3.0
- ExabyteVideo 1.0
- ExabyteWorld 1.0

**Global find & replace across all files**

---

## File Structure at a Glance

```
website/
├── index.html              # Homepage with particles
├── features.html           # 6 modalities showcase
├── technology.html         # Architecture & algorithms
├── solutions.html          # Use cases & workflows
├── api.html                # Coming Soon placeholder
├── styles.css              # All styling
├── particle-hero.js        # 3D particle animation
├── main.js                 # Navigation & UI
└── WEBSITE_DOCUMENTATION.md # Full documentation
```

---

## Color Palette Reference

```
Gold Family:
- Primary:   #FFB300
- Light:     #FFD54F
- Dark:      #FF8F00

Purple Family:
- Primary:   #7E57C2
- Dark:      #4D0099
- Light:     #B388FF

Backgrounds:
- Primary:   #0a0a0a
- Secondary: #1a1a1a
- Cards:     #2a2a2a

Text:
- Primary:   #ffffff
- Secondary: #b0b0b0
```

---

## Particle Animation Quick Config

```javascript
// Text
TEXT_VALUE = "EXABYTE STUDIO"

// Appearance
PARTICLE_SIZE_SCALE = 1.0      // 0.2-4 (bigger = larger particles)
PARTICLE_DENSITY_SCALE = 4.0   // 0.25-6 (bigger = more particles)

// Zoom
minZoom = 0.5  // Fully zoomed out
maxZoom = 4.0  // Fully zoomed in
zoom = 1.0     // Initial size

// Colors (line 36)
colors = ["#FFB300", "#FFD54F", "#FF8F00", "#4D0099", "#7E57C2", "#B388FF"]
```

**Performance tips:**
- Reduce `PARTICLE_DENSITY_SCALE` if laggy (try 2.0 or 3.0)
- Reduce `PARTICLE_SIZE_SCALE` for cleaner look
- Increase `scrollZoomRange` for slower zoom (try 1500)

---

## Scroll Behavior Logic

**How it works:**
1. **At page top (`scrollY = 0`)**: Wheel controls particle zoom
2. **Page scrolled (`scrollY > 0`)**: Normal page scroll, zoom frozen

**User experience:**
- Scroll up → zoom in particles (until max)
- Scroll down → zoom out particles (until min)
- At min zoom + scroll down → page scrolls, shows content
- Scrolling up from content → normal page scroll
- Reach top with min zoom → scroll up zooms in again

**Code location:** `particle-hero.js` lines 288-337

---

## Testing Checklist (Before Deploy)

```bash
# Browser testing
✓ Chrome (latest)
✓ Firefox (latest)
✓ Safari (latest)
✓ Mobile Safari (iOS)
✓ Chrome Mobile (Android)

# Functionality
✓ Particle animation runs smoothly
✓ Scroll behavior works correctly
✓ All navigation links work
✓ No console errors
✓ Footer links work
✓ Responsive on mobile

# Performance
✓ 60 FPS animation
✓ Page loads < 3s
✓ No layout shift
```

---

## Emergency Fixes

### Particle animation not working
1. Check browser console for errors
2. Verify `<canvas id="scene">` exists
3. Check `particle-hero.js` is loaded
4. Clear browser cache

### Scroll stuck/broken
1. Check `window.scrollY` in console
2. Verify event listener: `wheel` with `{ passive: false }`
3. Check for conflicting scroll libraries
4. Test in incognito mode

### Content overlapping particles
1. Check `.hero { height: 100vh; }` in CSS
2. Verify `.hero-content-section` is separate
3. Clear any custom CSS overrides

### Navigation not showing
1. Check `.navbar { position: sticky; top: 0; }`
2. Verify z-index is high (try `z-index: 1000;`)
3. Check display property isn't `none`

---

## Deployment Quick Steps

```bash
# 1. Test locally
# 2. Commit changes
git add .
git commit -m "Update: [description]"
git push origin main

# 3. Deploy (depends on hosting)
# - Netlify: Auto-deploys from git
# - Vercel: Auto-deploys from git
# - Manual: Upload files via FTP/SFTP
# - S3: aws s3 sync ./website s3://bucket-name/

# 4. Verify live site
# 5. Check analytics (if configured)
```

---

## File Sizes (Current)

```
index.html:        16.3 KB
features.html:     21.9 KB
technology.html:   29.4 KB
solutions.html:    29.7 KB
api.html:          9.7 KB
styles.css:        17.7 KB
particle-hero.js:  11.9 KB
main.js:           5.2 KB
------------------------
Total:            ~142 KB
```

---

## Support Contacts

**Website Issues:** info@exabytespatial.ai
**GitHub Issues:** https://github.com/exabyte-spatial-ai/issues
**Documentation:** See WEBSITE_DOCUMENTATION.md

---

## Version History

- **v1.0** (Nov 11, 2025): Initial website launch
  - 5 pages created
  - Particle hero animation
  - Scroll-based zoom
  - Dark theme with gold/purple accents

---

**For detailed information, see [WEBSITE_DOCUMENTATION.md](./WEBSITE_DOCUMENTATION.md)**
