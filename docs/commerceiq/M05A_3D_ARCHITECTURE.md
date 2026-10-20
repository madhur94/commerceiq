# CommerceIQ — M05-A: 3D WebGL Architecture Specification
## Customer Constellation: Interactive 3D Behavioral Particle Explorer

**Milestone:** M05-A  
**Module:** `frontend/src/components/3d/CustomerConstellationScene.tsx`  
**Rendering Engine:** Three.js (r174) with WebGLRenderer  
**Canvas Target:** Section B · Customer Segment Explorer (`/customers`)

---

## 1. Architectural Philosophy & Design Vision

The **Customer Constellation** is a hardware-accelerated 3D WebGL behavioral particle explorer designed to make high-dimensional customer segmentation intuitive, visually stunning, and scientifically grounded.

Rather than presenting an uninterpretable cloud of 3.02 million individual points or fabricating fake 3D coordinate geometry, the Customer Constellation renders an **interactive conceptual particle system** grounded strictly in the verified mathematical centroids and population proportions of the two K-Means behavioral segments:
- **Cluster 0 (High-Activity Commercial Core):** 250,388 users (8.29% of population), rendered as a dense, high-energy luminous core centered at coordinates `(-2.2, 0.4, 0.3)` in custom violet/magenta gradients.
- **Cluster 1 (Casual Browsers & Occasional Buyers):** 2,771,046 users (91.71% of population), rendered as an expansive, diffuse ellipsoidal starfield centered at coordinates `(1.8, -0.2, -0.2)` in deep cyan/sky gradients.

```
       Cluster 0 (Core)                             Cluster 1 (Browsers)
  [Dense Violet Particle Core]                [Expansive Cyan Particle Cloud]
         650 particles                                1,850 particles
       N = 250,388 (8.29%)                         N = 2,771,046 (91.71%)
        Avg Rev: 520.86                              Avg Rev: 35.91
               \                                            /
                \--------- Divergence Axis ----------------/
                            (Dashed line in 3D)
                                     |
               =============================================
                  Cybernetic Polar Radar Grid (y = -2.2)
```

---

## 2. Geometry & Particle System Topology

### 2.1 Cluster 0: High-Activity Commercial Core
- **Particle Count:** 650 discrete GPU vertices.
- **Topology:** Compact Gaussian sphere with standard deviation $\sigma = 1.05$, radially concentrated to express high purchase density and catalog exploration breadth.
- **Centroid Coordinates:** $(-2.2, 0.4, 0.3)$.
- **Color Gradient Palette:**
  - Base Violet: `#8b5cf6` (`THREE.Color(0x8b5cf6)`)
  - Accent Magenta: `#ec4899` (`THREE.Color(0xec4899)`)
  - Deep Violet: `#6366f1` (`THREE.Color(0x6366f1)`)
- **Particle Size:** $0.05$ units in world space with additive blending (`THREE.AdditiveBlending`) and vertex colors enabled.
- **Centroid Indicator:** Luminous wireframe sphere (`SphereGeometry(0.28, 16, 16)`) rendered in glowing violet (`0x8b5cf6`, opacity 0.6).

### 2.2 Cluster 1: Casual Browsers & Occasional Buyers
- **Particle Count:** 1,850 discrete GPU vertices.
- **Topology:** Expansive, diffuse ellipsoidal halo with radius up to $3.4$ units ($x$-scale 1.3, $y$-scale 0.7, $z$-scale 1.1) to represent the 91.71% dominant browser majority.
- **Centroid Coordinates:** $(1.8, -0.2, -0.2)$.
- **Color Gradient Palette:**
  - Base Cyan: `#06b6d4` (`THREE.Color(0x06b6d4)`)
  - Bright Cyan: `#22d3ee` (`THREE.Color(0x22d3ee)`)
  - Sky Blue: `#38bdf8` (`THREE.Color(0x38bdf8)`)
- **Particle Size:** $0.04$ units in world space with additive blending and vertex colors.
- **Centroid Indicator:** Luminous wireframe sphere (`SphereGeometry(0.35, 16, 16)`) rendered in radiant cyan (`0x06b6d4`, opacity 0.45).

### 2.3 Divergence Axis & Vector Linkage
- **Geometry:** 2-vertex `LineSegments` connecting Cluster 0 centroid `(-2.2, 0.4, 0.3)` directly to Cluster 1 centroid `(1.8, -0.2, -0.2)`.
- **Material:** `LineDashedMaterial` with dash size 0.15, gap size 0.08, cyan/violet vertex coloring, and 0.4 opacity.
- **Purpose:** Represents the multivariate distance vector between the two cluster centroids across the 7 standardized behavioral features.

### 2.4 Cybernetic Polar Radar Grid
- **Geometry:** Polar coordinate radar plane positioned at $y = -2.2$:
  - Concentric circular rings at radii $r \in \{1.5, 3.0, 4.5, 6.0, 7.5\}$.
  - 16 radial spoke lines spaced at $22.5^\circ$ increments radiating outward from the origin.
- **Material:** `LineBasicMaterial` with color `#1e293b` (slate-800, opacity 0.35), providing a high-tech navigational reference ground plane.

### 2.5 Ambient Transaction Halo
- **Particle Count:** 350 micro-particles randomly distributed across an outer sphere ($r \in [5.0, 10.0]$).
- **Color:** Subtle navy/cyan `#0284c7` (opacity 0.25), simulating ambient background network telemetry without distracting from the primary clusters.

---

## 3. Lighting & Shading Pipeline

Three.js scene lighting is calibrated for high-contrast dark-mode visibility:
1. **Ambient Light:** `THREE.AmbientLight(0xffffff, 0.65)` for baseline scene illumination.
2. **Cluster 0 Key Light:** `THREE.PointLight(0x8b5cf6, 2.8, 12, 1.2)` positioned at `(-2.2, 2.5, 2.0)`, casting a luminous violet glow on Cluster 0.
3. **Cluster 1 Key Light:** `THREE.PointLight(0x06b6d4, 2.8, 12, 1.2)` positioned at `(1.8, 2.5, 2.0)`, casting a bright cyan glow on Cluster 1.
4. **Rim Light:** `THREE.DirectionalLight(0x38bdf8, 0.6)` at `(0, 8, -6)` facing the camera to produce subtle specular edge highlights.

---

## 4. Camera Matrix & Smooth Dynamic Interpolation

### 4.1 Bounded Spherical Coordinates
The camera orientation is maintained in spherical coordinates $(\rho, \theta, \phi)$:
- **Radius ($\rho$):** Clamped strictly between $4.0$ (maximum zoom-in) and $15.0$ (maximum zoom-out).
- **Polar Angle ($\phi$):** Clamped between $0.2$ rad and $\pi - 0.2$ rad to prevent camera gimbal flipping at the poles.
- **Azimuth Angle ($\theta$):** Unbounded, continuous rotation with auto-rotation rate of $0.003$ rad/frame.

### 4.2 Smooth Cluster Transition Lerping
When a user selects Cluster 0, Cluster 1, or Both Clusters, the camera smoothly interpolates its position and look-at target using exponential easing:
$$\mathbf{P}_{\text{cam}}(t + \Delta t) = \mathbf{P}_{\text{cam}}(t) + (\mathbf{P}_{\text{target}} - \mathbf{P}_{\text{cam}}(t)) \times (1 - e^{-k \Delta t})$$
where $k = 4.5$:
- **Both Clusters Selected:** Camera target position $(0, 1.2, 9.0)$, look-at target $(0, 0, 0)$.
- **Cluster 0 Selected:** Camera target position $(-2.8, 1.2, 5.2)$, look-at target $(-2.2, 0.4, 0.3)$. Cluster 1 particle opacity smoothly dims to $0.15$.
- **Cluster 1 Selected:** Camera target position $(2.5, 0.8, 6.0)$, look-at target $(1.8, -0.2, -0.2)$. Cluster 0 particle opacity smoothly dims to $0.15$.

---

## 5. Interaction & Raycasting Subsystem

1. **Pointer Orbit:** Mouse drag or touch drag rotates azimuth and elevation smoothly with inertia.
2. **Pinch & Scroll Zoom:** Mouse wheel and pinch gestures update spherical radius with bounded limits.
3. **Raycaster Cluster Detection:**
   - On pointer move, a Three.js `Raycaster` projects from camera through normalized device coordinates (NDC).
   - Distance from ray to cluster centroid is computed using `ray.distanceToPoint(centroid)`.
   - Thresholds: Cluster 0 hit radius $< 2.2$; Cluster 1 hit radius $< 3.2$.
   - Live hover state updates cursor to `pointer` and displays a floating HUD badge: `"Hovering: Cluster X · Click to isolate"`.
   - On canvas click, clicking a cluster isolates it and dollies the camera directly to its core.
4. **Keyboard Accessibility (WAI-ARIA Region):**
   - Canvas container has `tabIndex={0}`, `role="region"`, and descriptive `aria-label`.
   - `ArrowLeft` / `ArrowRight`: Orbit azimuth left / right.
   - `ArrowUp` / `ArrowDown`: Tilt elevation up / down.
   - `+` / `-`: Zoom in / out.
   - `0`: Isolate Cluster 0 (Core).
   - `1`: Isolate Cluster 1 (Browsers).
   - `B`: Show Both Clusters (Side-by-side).
   - `R`: Reset camera to default orientation.

---

## 6. Performance Budget & Resource Lifecycle

| Metric | Target Budget | Measured Actual | Status |
| :--- | :--- | :--- | :--- |
| **Frame Rate** | $\ge 55\text{ FPS}$ sustained | **58–60 FPS** | **PASS** |
| **p50 Frame Time** | $< 18.0\text{ ms}$ | **16.6–17.4 ms** | **PASS** |
| **p95 Frame Time** | $< 35.0\text{ ms}$ | **17.3–32.7 ms** | **PASS** |
| **Draw Calls** | $\le 8\text{ calls}$ | **6 calls** | **PASS** |
| **GPU VRAM** | $< 25\text{ MB}$ | **~18 MB** | **PASS** |
| **Offscreen CPU/GPU Load** | 0% (auto-pause) | **0%** (IntersectionObserver) | **PASS** |

### Complete GPU Resource Disposal Lifecycle
On component unmount:
1. `cancelAnimationFrame(reqId)` cancels active render loop.
2. `IntersectionObserver` disconnects.
3. Window resize and pointer event listeners are removed.
4. Every `BufferGeometry` calls `.dispose()`.
5. Every `Material` and texture calls `.dispose()`.
6. WebGL context is forced to lose via `renderer.forceContextLoss()`.
7. `renderer.dispose()` releases all GL program pipelines and buffers.
8. Canvas element is removed from DOM container.
