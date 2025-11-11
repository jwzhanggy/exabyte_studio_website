# Exabyte Studio Website

Professional marketing website for the Exabyte Studio 3D spatial intelligence platform.

![Version](https://img.shields.io/badge/version-1.0-blue)
![Status](https://img.shields.io/badge/status-production-green)

---

## Overview

This is a static website showcasing the **Exabyte Studio** software platform for professional 3D spatial intelligence, multimodal data processing, and AI-powered workflows.

**Live Demo:** (Add URL when deployed)

### Features

- ✨ **Interactive 3D particle hero animation** - "EXABYTE STUDIO" text formed by thousands of particles
- 🎨 **Scroll-based zoom control** - Smooth particle zoom interaction before page scroll
- 📱 **Fully responsive design** - Works on desktop, tablet, and mobile
- 🎯 **Five detailed pages** - Home, Features, Technology, Solutions, API
- ⚡ **High performance** - 60 FPS animation, vanilla JS (no frameworks)
- 🌙 **Dark theme** - Modern design with gold and purple accents

---

## Quick Start

### Viewing Locally

```bash
# Option 1: Use Python's built-in server
cd website
python3 -m http.server 8000

# Option 2: Use Node's http-server
npm install -g http-server
http-server website -p 8000

# Then open: http://localhost:8000
```

### File Structure

```
website/
├── index.html              # Homepage with particle animation
├── features.html           # Feature showcase (6 modalities)
├── technology.html         # Technical architecture
├── solutions.html          # Industry use cases
├── api.html                # API documentation (coming soon)
├── styles.css              # Global styles
├── particle-hero.js        # 3D particle animation system
├── main.js                 # Navigation & UI logic
├── exabyte_studio.html     # Original demo (reference only)
├── README.md               # This file
├── QUICK_REFERENCE.md      # Common tasks quick guide
└── WEBSITE_DOCUMENTATION.md # Comprehensive documentation
```

---

## Documentation

📚 **Full Documentation:** [WEBSITE_DOCUMENTATION.md](./WEBSITE_DOCUMENTATION.md)
- Complete architecture details
- Particle animation system explained
- Scroll behavior logic
- Styling system
- Content update procedures
- Maintenance best practices

⚡ **Quick Reference:** [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- Common update tasks
- Configuration snippets
- Emergency fixes
- Testing checklist

---

## Technology Stack

- **Frontend:** Pure HTML5, CSS3, JavaScript (ES6+)
- **Animation:** Canvas API, requestAnimationFrame
- **No Dependencies:** Zero external libraries or frameworks
- **Build:** None required (static files)

**Browser Support:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Key Concepts

### Particle Animation System

The hero section features an interactive 3D particle system:
- **~5,000-15,000 particles** form text "EXABYTE STUDIO"
- **3D rotation** with mouse drag
- **Mouse repulsion** effect scatters particles
- **Spring physics** returns particles to position
- **60 FPS** performance target

**Configuration:** See `particle-hero.js` lines 6-26

### Scroll-Based Zoom

Unique scroll behavior:
1. **Page at top:** Scroll controls particle zoom
2. **Scroll down:** Particles zoom out → page scrolls to show content
3. **Scroll up from content:** Page scrolls up → particles zoom in when at top
4. **State-based:** Different behavior based on `window.scrollY`

**Implementation:** `particle-hero.js` lines 288-337

---

## Common Tasks

### Update Statistics

```bash
# Edit index.html, find .hero-stats section
<div class="stat">
  <span class="stat-number">272K+</span>  # Update this
  <span class="stat-label">Lines of Code</span>
</div>
```

### Change Particle Configuration

```javascript
// particle-hero.js lines 6-26
const TEXT_VALUE = "EXABYTE STUDIO";
const PARTICLE_SIZE_SCALE = 1.0;     // Adjust particle size
const PARTICLE_DENSITY_SCALE = 4.0;  // Adjust particle count
const minZoom = 0.5, maxZoom = 4.0;  // Zoom range
```

### Update Colors

```css
/* styles.css :root section */
:root {
  --color-accent-gold: #FFB300;    /* Primary accent */
  --color-accent-purple: #7E57C2;  /* Secondary accent */
}
```

```javascript
// particle-hero.js line 36
const colors = ["#FFB300","#FFD54F","#FF8F00","#4D0099","#7E57C2","#B388FF"];
```

---

## Performance

### Current Metrics

- **First Contentful Paint:** ~1.2s
- **Total Size:** ~142 KB (HTML + CSS + JS)
- **Animation:** 60 FPS on modern hardware

### Optimization Tips

If particle animation is laggy:
```javascript
// Reduce particle count
const PARTICLE_DENSITY_SCALE = 2.0; // Instead of 4.0

// Or reduce particle size
const PARTICLE_SIZE_SCALE = 0.7; // Instead of 1.0
```

---

## Testing

### Before Deploying

```bash
# Test checklist
✓ Test on Chrome, Firefox, Safari
✓ Test on mobile (iOS Safari, Chrome Mobile)
✓ Verify particle animation runs smoothly
✓ Check scroll behavior works correctly
✓ Verify all navigation links
✓ Check for console errors
✓ Test responsive layouts
✓ Validate HTML (https://validator.w3.org/)
```

### Browser Testing

```bash
# Local testing on multiple devices
# Use BrowserStack or similar for cross-browser testing
# Test with network throttling (slow 3G)
```

---

## Deployment

### Recommended Hosts

- **Netlify** (recommended)
  - Connect to git repository
  - Auto-deploy on push
  - Free SSL certificate
  - CDN included

- **Vercel**
  - Similar to Netlify
  - Excellent performance
  - Edge network

- **GitHub Pages**
  - Free for public repos
  - Simple setup
  - No custom server needed

### Deployment Steps

```bash
# 1. Test locally
# 2. Commit changes
git add .
git commit -m "Update: description"
git push origin main

# 3. Deploy (automatic if using Netlify/Vercel)
# Or manually upload files to hosting provider

# 4. Verify live site
# 5. Monitor for errors
```

### Build Configuration (Netlify example)

```toml
# netlify.toml
[build]
  publish = "website"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Maintenance

### Regular Tasks

**Monthly:**
- Update statistics if changed
- Check for broken links
- Review analytics

**Quarterly:**
- Content accuracy review
- Performance audit
- Browser compatibility check

**Annually:**
- Major content refresh
- Design review
- Update copyright year

### Backup

```bash
# Create backup before major changes
cp -r website/ website-backup-$(date +%Y%m%d)/

# Or use git tags
git tag -a v1.0 -m "Release version 1.0"
git push --tags
```

---

## Troubleshooting

### Particle animation not working

**Symptoms:** Black screen, no particles
**Solutions:**
1. Check browser console for errors
2. Verify `<canvas id="scene">` exists in HTML
3. Ensure `particle-hero.js` is loaded
4. Clear browser cache and reload

### Scroll stuck or not working

**Symptoms:** Can't scroll, zoom not responding
**Solutions:**
1. Check `window.scrollY` in browser console
2. Verify wheel event listener has `{ passive: false }`
3. Test in incognito mode (disable extensions)
4. Check for conflicting JavaScript

### Content overlapping particles

**Symptoms:** Text appears on top of particles
**Solutions:**
1. Verify `.hero { height: 100vh; }` in CSS
2. Check that `.hero-content-section` is separate element
3. Clear any custom CSS overrides

### Performance issues

**Symptoms:** Laggy animation, low FPS
**Solutions:**
1. Reduce `PARTICLE_DENSITY_SCALE` to 2.0 or 3.0
2. Check browser hardware acceleration is enabled
3. Close other tabs/applications
4. Test on different device

---

## Contributing

### Making Changes

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Update documentation
5. Create pull request

### Code Style

- **HTML:** Indent with 2 spaces
- **CSS:** Indent with 2 spaces, properties alphabetically ordered
- **JavaScript:** Use ES6+, meaningful variable names
- **Comments:** Explain why, not what

### Commit Messages

```
[Component] Brief description

- Detailed change 1
- Detailed change 2

Refs: #issue-number
```

---

## Resources

### Documentation
- [Full Documentation](./WEBSITE_DOCUMENTATION.md) - Complete reference
- [Quick Reference](./QUICK_REFERENCE.md) - Common tasks

### External Links
- [Canvas API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

### Design Resources
- Color Palette: Gold (#FFB300) + Purple (#7E57C2)
- Font Family: System fonts (Apple, Segoe, Roboto)
- Icons: SVG paths (inline, no external dependencies)

---

## License

Copyright © 2025 Exabyte Spatial AI. All rights reserved.

---

## Contact

**Email:** info@exabytespatial.ai
**GitHub:** https://github.com/exabyte-spatial-ai
**Website:** (Add URL when deployed)

---

## Changelog

### Version 1.0 (November 11, 2025)
- Initial website launch
- 5 pages: Home, Features, Technology, Solutions, API
- Interactive particle hero animation
- Scroll-based zoom control
- Responsive design
- Complete documentation

---

**Need help?** See [WEBSITE_DOCUMENTATION.md](./WEBSITE_DOCUMENTATION.md) for detailed information.
