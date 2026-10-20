# CommerceIQ — M05 Production Readiness & Deployment Guide
**Milestone:** M05 — Final Application Polishing & Production Delivery  
**Deployment Target:** Static Single-Page Application (SPA)  
**Status:** PRODUCTION READY  

---

## 1. Build Verification & Artifact Distribution

CommerceIQ builds deterministically into a standalone, zero-backend static artifact directory (`frontend/dist/`).

### 1.1 Reproducible Build Commands
```bash
# Navigate to the frontend directory
cd frontend

# Verify data integrity invariants (Pre-flight Gate)
npm run validate-data

# Execute unit and component tests
npm test

# Typecheck TypeScript codebase
npx tsc --noEmit

# Compile production bundle
npm run build

# Preview production build locally
npm run preview -- --port 4173
```

---

## 2. Static Hosting & SPA Rewrite Requirements

Because CommerceIQ utilizes HTML5 History API client-side routing (`react-router-dom`), web servers must route all deep-link requests back to `/index.html` with an HTTP 200 status code.

### 2.1 Netlify Deployment (`frontend/public/_redirects` or `netlify.toml`)
Create `_redirects` inside `frontend/public/`:
```text
/*    /index.html   200
```
Or `netlify.toml` in repository root:
```toml
[build]
  base = "frontend"
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2.2 Vercel Deployment (`vercel.json`)
```json
{
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 2.3 Cloudflare Pages
Add `_redirects` to `frontend/public/_redirects`:
```text
/*    /index.html   200
```

### 2.4 Nginx Configuration
```nginx
server {
    listen 80;
    server_name commerceiq.internal;
    root /var/www/commerceiq/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets aggressively
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }
}
```

---

## 3. Technology Stack & Architectural Inventory

- **Frontend Core:** React 18.3.1, TypeScript 5.6.3, Vite 5.4.11
- **Styling Architecture:** Tailwind CSS 3.4.15 with custom design tokens (`canvas`, `surface`, `brand-cyan`, `brand-violet`)
- **Interactive Visualizations:** Apache ECharts 6.1.0 (Canvas-rendered, debounced ResizeObserver, WCAG color calibration)
- **3D Spatial Graphics:** Three.js 0.186.1 (WebGL 2.0, dual-layer centroids, custom canvas point sprites, IntersectionObserver pausing)
- **Icons & Micro-Interactions:** Lucide React 0.460.0, Framer Motion 11.11.17
- **Test Infrastructure:** Vitest 2.1.5, Playwright 1.64.1, TSX 4.19.2

---

## 4. Production Checklist

- [x] Zero API keys, secrets, or internal tokens embedded in client bundle.
- [x] Zero absolute local filesystem paths disclosed in user-facing UI.
- [x] Zero console errors during normal navigation and user interaction.
- [x] 100% of 29 original research visualizations cataloged and accessible in gallery.
- [x] 100% of 4 original interactive Plotly figures converted natively to ECharts and preserved in sandboxed iframes.
- [x] Outlier customer identifier masked as `usr_***849`.
- [x] OWASP CSV formula-injection defense enforced on all export endpoints.
- [x] Responsive layout verified across all breakpoints (360px mobile to 1920px desktop).
