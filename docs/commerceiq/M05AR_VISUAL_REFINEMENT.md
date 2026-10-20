# CommerceIQ — M05-A-R: Visual Refinement & Composition Specification
## Cinematic 3D Scene Composition, Volumetric Particle Depth & Centroid Mechanics

**Milestone:** M05-A-R  
**Module:** `frontend/src/components/3d/CustomerConstellationScene.tsx`  
**Graphics Framework:** Three.js (r174) with Hardware-Accelerated WebGL  
**Status:** Visually Refined & Approved

---

## 1. Executive Summary & Aesthetic Objectives

Milestone **M05-A-R** refines the 3D Customer Constellation from a functional prototype into a cinematic, scientifically grounded, and visually compelling data experience.

### Visual Comparison: M05-A vs M05-A-R

| Aesthetic Attribute | M05-A (Baseline) | M05-A-R (Refined) | Visual Impact |
| :--- | :--- | :--- | :--- |
| **Cluster Prominence & Framing** | Distant camera framing at radius $9.0$ with large empty peripheral void | Tight, balanced cinematic framing at radius $6.6$, increasing cluster scale by **+38%** | Clusters occupy prime focal area without clipping across desktop and tablet |
| **Particle Geometry** | Default untextured point quads creating harsh square pixels when zoomed | High-performance circular soft-radial sprite texture generated offscreen | Glowing, organic starlight nodes with smooth quadratic alpha falloff |
| **Centroid Core Markers** | Single simple wireframe sphere per cluster | Dual-layered scientific markers: glowing inner luminous kernel + rotating geometric icosahedron cage | Distinctive astronomical navigation instrument aesthetic |
| **Scene Ground Grid** | Prominent grid helper at $y = -1.8$ drawing attention away from clusters | Subordinated unified polar radar grid at $y = -2.2$ in deep midnight slate (`#162032`) | Subtle depth grounding without competing with glowing particles |
| **Contextual Cluster Insight** | Selection only highlighted cards below canvas | Floating glassmorphism contextual card in 3D canvas showing active segment KPIs | Instantaneous contextual feedback right inside the 3D viewport |
| **Draw Call Overhead** | Variable calls (up to 12) | Strictly bounded to **8 calls** (down to 6 during culling) | Clean GPU pipeline with zero unnecessary state changes |

---

## 2. Scene Framing & Volumetric Composition

### 2.1 Calibrated Camera Distance & Safe Frustum
- **Focal Distance:** Default spherical radius tuned from $9.0$ to **$6.6$** units.
- **Field of View (FOV):** Set to $44^\circ$ for natural perspective compression without wide-angle peripheral distortion.
- **Spatial Span:**
  - Cluster 0 Core: Centroid at $(-2.2, 0.4, 0.3)$ with particle radius $r \approx 1.55 \to [-3.75, -0.65]$.
  - Cluster 1 Browsers: Centroid at $(1.8, -0.2, -0.2)$ with ellipsoidal radius $r \approx 3.35 \to [-1.55, 5.15]$.
  - Total Constellation Width: $\approx 8.9$ units.
  - Frustum Width at $z = 6.6$ with $44^\circ$ FOV: $\approx 15.1$ units at $1440\text{px}$ aspect ratio.
  - **Safe Margin:** $\approx 3.1$ units on left and right, ensuring neither cluster is cropped during auto-rotation or user orbital manipulation.

### 2.2 Camera Boundaries
- **Radius ($\rho$):** Clamped strictly between **$3.8$** (detailed core inspection) and **$10.5$** (wide overview).
- **Polar Angle ($\phi$):** Clamped between **$0.28\text{ rad}$** ($\approx 16^\circ$, preventing gimbal lock) and **$\pi - 0.28\text{ rad}$** ($\approx 164^\circ$, preventing clipping through the ground grid).

---

## 3. Particle System Refinement: Soft Circular Points

### 3.1 Offscreen Radial Alpha Sprite Texture
To eliminate square quad artifacts without requiring heavy external image assets or expensive runtime shader compilations, an offscreen 64×64 canvas texture is generated at initialization:
$$\alpha(r) = \begin{cases} 
1.0 & r = 0.0 \\
0.92 & r = 0.18 \\
0.38 & r = 0.45 \\
0.08 & r = 0.75 \\
0.0 & r \ge 1.0 
\end{cases}$$
The texture is configured with `minFilter = THREE.LinearFilter`, `magFilter = THREE.LinearFilter`, and `generateMipmaps = false`.

### 3.2 Additive Blending & Depth Write Handling
- `depthWrite: false` prevents square bounding quads from obscuring background particles.
- `blending: THREE.AdditiveBlending` allows overlapping particles to accumulate luminance naturally, producing organic volumetric glow in dense regions (Cluster 0 Core) while keeping diffuse areas light and airy (Cluster 1 Browsers).
- `sizeAttenuation: true` scales particle sizes inversely with camera distance for realistic perspective depth.

### 3.3 Sophisticated Color Grading
- **Cluster 0 (Commercial Core):**
  - Vibrant Violet (`#a855f7`) — Base structural tone.
  - Violet Highlight (`#c084fc`) — Core luminance peak.
  - Magenta Accent (`#ec4899`) — High-energy transaction highlights.
  - Indigo Shimmer (`#818cf8`) — Subtle depth boundary.
- **Cluster 1 (Casual Browsers):**
  - Cyan Core (`#06b6d4`) — Central browsing hub.
  - Bright Cyan (`#22d3ee`) — Active exploratory nodes.
  - Sky Blue (`#38bdf8`) — Broad population envelope.
  - Mist Highlight (`#67e8f9`) — Outer diffuse dispersion.

---

## 4. Multi-Layered Scientific Centroid Markers

Rather than simple decorative meshes, each cluster centroid features a multi-layered scientific marker:

```
          [ Outer Wireframe Icosahedron Shell ]
                 (Slow orbital rotation)
                           |
             [ Inner Luminous Kernel Sphere ]
                (Soft sinusoidal pulse)
                           |
                    Centroid Anchor
```

1. **Inner Luminous Kernel:**
   - Cluster 0: `SphereGeometry(0.18, 20, 20)`, `#c084fc`, opacity 0.85, pulsing $1.0 + 0.06 \sin(3t)$.
   - Cluster 1: `SphereGeometry(0.22, 20, 20)`, `#67e8f9`, opacity 0.82, pulsing $1.0 + 0.04 \sin(2t)$.
2. **Outer Geometric Icosahedron Shell:**
   - Cluster 0: `IcosahedronGeometry(0.38, 1)`, `#a855f7`, wireframe, opacity 0.65, counter-rotating along $y$ and $x$ axes.
   - Cluster 1: `IcosahedronGeometry(0.48, 1)`, `#06b6d4`, wireframe, opacity 0.55, counter-rotating along $y$ and $z$ axes.

---

## 5. Subordinated Polar Radar Grid

The ground radar grid is lowered to $y = -2.2$ and constructed using a single unified `LineSegments` geometry:
- 5 concentric range rings ($r \in \{1.24, 2.48, 3.72, 4.96, 6.20\}$).
- 16 radial navigation spokes spaced at $22.5^\circ$ increments.
- Color: Deep midnight slate (`0x162032`) with opacity 0.28.
- Result: Establishes clear 3D floor perspective while keeping the viewer's focus on the floating cluster constellations.
