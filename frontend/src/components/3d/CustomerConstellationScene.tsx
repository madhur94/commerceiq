import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { kmeansClusters } from '@/data';
import { formatInteger, formatMonetaryValue, formatPercent } from '@/utils/formatters';
import {
  RotateCcw,
  Sparkles,
  Play,
  Pause,
  Info,
  Layers,
  Activity,
  ShieldAlert,
  X,
} from 'lucide-react';
import { cn } from '@/utils/cn';

export interface CustomerConstellationSceneProps {
  selectedCluster: 'both' | 0 | 1;
  onSelectCluster: (cluster: 'both' | 0 | 1) => void;
  className?: string;
  height?: number | string;
}

/**
 * Generates a high-performance circular soft-radial particle sprite texture.
 * Eliminates square quad artifacts, producing organic starlight point nodes.
 */
function createCircularParticleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(0.18, 'rgba(255, 255, 255, 0.92)');
    gradient.addColorStop(0.45, 'rgba(255, 255, 255, 0.38)');
    gradient.addColorStop(0.75, 'rgba(255, 255, 255, 0.08)');
    gradient.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

export const CustomerConstellationScene: React.FC<CustomerConstellationSceneProps> = ({
  selectedCluster,
  onSelectCluster,
  className = '',
  height = 520,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hasWebGl, setHasWebGl] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [hoveredCluster, setHoveredCluster] = useState<0 | 1 | null>(null);
  const hoveredClusterRef = useRef<0 | 1 | null>(null);

  // Direct DOM refs for frame telemetry to eliminate periodic 1000ms React re-renders
  const fpsRef = useRef<HTMLSpanElement | null>(null);
  const p50Ref = useRef<HTMLSpanElement | null>(null);
  const p95Ref = useRef<HTMLSpanElement | null>(null);
  const callsRef = useRef<HTMLSpanElement | null>(null);

  const c0 = kmeansClusters.clusters[0];
  const c1 = kmeansClusters.clusters[1];

  // Store active Three.js references for imperative controls
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Tuned framing: default radius 6.6 (+38% visual prominence vs 9.0)
  const controlsStateRef = useRef({
    targetLookAt: new THREE.Vector3(-0.2, 0.1, 0.05),
    currentLookAt: new THREE.Vector3(-0.2, 0.1, 0.05),
    targetPosition: new THREE.Vector3(-0.2, 0.9, 6.6),
    currentPosition: new THREE.Vector3(-0.2, 0.9, 6.6),
    isDragging: false,
    prevPointer: { x: 0, y: 0 },
    pointerNormalized: new THREE.Vector2(-999, -999),
    hasPointer: false,
    spherical: new THREE.Spherical(6.6, Math.PI / 2 - 0.18, 0),
    autoRotate: true,
    pinchStartDist: 0,
  });

  // Keep controlsStateRef autoRotate in sync
  useEffect(() => {
    controlsStateRef.current.autoRotate = autoRotate;
  }, [autoRotate]);

  // Adjust camera target position based on selectedCluster
  useEffect(() => {
    const state = controlsStateRef.current;
    if (selectedCluster === 0) {
      // Focus closely on Cluster 0 (Core Violet)
      state.targetLookAt.set(-2.2, 0.4, 0.3);
      state.targetPosition.set(-2.6, 0.7, 4.2);
    } else if (selectedCluster === 1) {
      // Frame expansive Cluster 1 (Browsers Cyan)
      state.targetLookAt.set(1.8, -0.2, -0.2);
      state.targetPosition.set(2.2, 0.5, 5.2);
    } else {
      // Both clusters / Overview (Prominent Framing at radius 6.6)
      state.targetLookAt.set(-0.2, 0.1, 0.05);
      state.targetPosition.set(-0.2, 0.9, 6.6);
    }
  }, [selectedCluster]);

  const handleResetCamera = useCallback(() => {
    const state = controlsStateRef.current;
    state.targetLookAt.set(-0.2, 0.1, 0.05);
    state.targetPosition.set(-0.2, 0.9, 6.6);
    state.spherical.set(6.6, Math.PI / 2 - 0.18, 0);
    onSelectCluster('both');
  }, [onSelectCluster]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect reduced motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setAutoRotate(false);
      controlsStateRef.current.autoRotate = false;
    }

    // Verify WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGl(false);
        return;
      }
    } catch {
      setHasWebGl(false);
      return;
    }

    const width = container.clientWidth || 800;
    const heightVal = typeof height === 'number' ? height : container.clientHeight || 520;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera setup - 44 deg FOV for optimal perspective compression
    const camera = new THREE.PerspectiveCamera(44, width / heightVal, 0.1, 100);
    camera.position.copy(controlsStateRef.current.currentPosition);
    camera.lookAt(controlsStateRef.current.currentLookAt);
    cameraRef.current = camera;

    // 3. Renderer setup - clamp DPR to 1.75 to eliminate high-DPI GPU spikes
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, heightVal);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x070a13, 0.96);
    container.appendChild(renderer.domElement);

    // 4. Soft Circular Point Sprite Texture
    const particleTexture = createCircularParticleTexture();

    // 5. Spatial Coordinate Reference: Unified Low-Overhead Polar Radar Grid (1 Draw Call)
    // Darker slate colors, lowered to y = -2.2
    const gridPoints: number[] = [];
    const gridRings = 5;
    const gridSpokes = 16;
    const gridRadius = 6.2;
    const segsPerRing = 48;

    for (let r = 1; r <= gridRings; r++) {
      const ringR = (gridRadius * r) / gridRings;
      for (let s = 0; s < segsPerRing; s++) {
        const theta1 = (s / segsPerRing) * Math.PI * 2;
        const theta2 = ((s + 1) / segsPerRing) * Math.PI * 2;
        gridPoints.push(ringR * Math.cos(theta1), 0, ringR * Math.sin(theta1));
        gridPoints.push(ringR * Math.cos(theta2), 0, ringR * Math.sin(theta2));
      }
    }
    for (let i = 0; i < gridSpokes; i++) {
      const angle = (i / gridSpokes) * Math.PI * 2;
      gridPoints.push(0, 0, 0);
      gridPoints.push(gridRadius * Math.cos(angle), 0, gridRadius * Math.sin(angle));
    }
    const gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(gridPoints, 3));
    const gridMat = new THREE.LineBasicMaterial({
      color: 0x162032,
      transparent: true,
      opacity: 0.28,
    });
    const gridMesh = new THREE.LineSegments(gridGeo, gridMat);
    gridMesh.position.y = -2.2;
    scene.add(gridMesh);

    // --- CLUSTER 0: High-Activity Core (Violet / Magenta Palette) ---
    // Centroid at (-2.2, 0.4, 0.3)
    const c0Count = 650;
    const c0Center = new THREE.Vector3(-2.2, 0.4, 0.3);
    const c0Positions = new Float32Array(c0Count * 3);
    const c0Colors = new Float32Array(c0Count * 3);
    const c0ColorA = new THREE.Color(0xa855f7); // Vibrant Violet
    const c0ColorB = new THREE.Color(0xc084fc); // Light Violet Highlight
    const c0ColorC = new THREE.Color(0xec4899); // Magenta Accent
    const c0ColorD = new THREE.Color(0x818cf8); // Indigo Shimmer

    for (let i = 0; i < c0Count; i++) {
      // Gaussian concentrated core
      const u = Math.random();
      const r = Math.pow(u, 1.7) * 1.55;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      c0Positions[i * 3] = c0Center.x + r * Math.sin(phi) * Math.cos(theta);
      c0Positions[i * 3 + 1] = c0Center.y + r * Math.sin(phi) * Math.sin(theta) * 0.82;
      c0Positions[i * 3 + 2] = c0Center.z + r * Math.cos(phi);

      const colorMix = Math.random();
      const pColor =
        colorMix > 0.65 ? c0ColorA : colorMix > 0.4 ? c0ColorB : colorMix > 0.18 ? c0ColorC : c0ColorD;
      c0Colors[i * 3] = pColor.r;
      c0Colors[i * 3 + 1] = pColor.g;
      c0Colors[i * 3 + 2] = pColor.b;
    }

    const c0Geometry = new THREE.BufferGeometry();
    c0Geometry.setAttribute('position', new THREE.BufferAttribute(c0Positions, 3));
    c0Geometry.setAttribute('color', new THREE.BufferAttribute(c0Colors, 3));

    const c0Material = new THREE.PointsMaterial({
      size: 0.08,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const c0Points = new THREE.Points(c0Geometry, c0Material);
    scene.add(c0Points);

    // Cluster 0 Centroid Multi-Layer Scientific Marker
    // Inner Luminous Kernel
    const c0KernelGeo = new THREE.SphereGeometry(0.18, 20, 20);
    const c0KernelMat = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      transparent: true,
      opacity: 0.85,
    });
    const c0KernelMesh = new THREE.Mesh(c0KernelGeo, c0KernelMat);
    c0KernelMesh.position.copy(c0Center);
    scene.add(c0KernelMesh);

    // Outer Geometric Icosahedron Shell
    const c0ShellGeo = new THREE.IcosahedronGeometry(0.38, 1);
    const c0ShellMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const c0ShellMesh = new THREE.Mesh(c0ShellGeo, c0ShellMat);
    c0ShellMesh.position.copy(c0Center);
    scene.add(c0ShellMesh);

    // --- CLUSTER 1: Casual Browsers (Cyan / Sky Palette) ---
    // Centroid at (1.8, -0.2, -0.2)
    const c1Count = 1850;
    const c1Center = new THREE.Vector3(1.8, -0.2, -0.2);
    const c1Positions = new Float32Array(c1Count * 3);
    const c1Colors = new Float32Array(c1Count * 3);
    const c1ColorA = new THREE.Color(0x06b6d4); // Cyan Core
    const c1ColorB = new THREE.Color(0x22d3ee); // Bright Cyan
    const c1ColorC = new THREE.Color(0x38bdf8); // Sky Blue
    const c1ColorD = new THREE.Color(0x67e8f9); // Mist Highlight

    for (let i = 0; i < c1Count; i++) {
      // Expansive, diffuse ellipsoidal halo representing the 91.71% vast browser population
      const u = Math.random();
      const r = Math.pow(u, 0.88) * 3.35;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      c1Positions[i * 3] = c1Center.x + r * Math.sin(phi) * Math.cos(theta) * 1.25;
      c1Positions[i * 3 + 1] = c1Center.y + r * Math.sin(phi) * Math.sin(theta) * 0.72;
      c1Positions[i * 3 + 2] = c1Center.z + r * Math.cos(phi) * 1.05;

      const colorMix = Math.random();
      const pColor =
        colorMix > 0.6 ? c1ColorA : colorMix > 0.35 ? c1ColorB : colorMix > 0.15 ? c1ColorC : c1ColorD;
      c1Colors[i * 3] = pColor.r;
      c1Colors[i * 3 + 1] = pColor.g;
      c1Colors[i * 3 + 2] = pColor.b;
    }

    const c1Geometry = new THREE.BufferGeometry();
    c1Geometry.setAttribute('position', new THREE.BufferAttribute(c1Positions, 3));
    c1Geometry.setAttribute('color', new THREE.BufferAttribute(c1Colors, 3));

    const c1Material = new THREE.PointsMaterial({
      size: 0.065,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const c1Points = new THREE.Points(c1Geometry, c1Material);
    scene.add(c1Points);

    // Cluster 1 Centroid Multi-Layer Scientific Marker
    // Inner Luminous Kernel
    const c1KernelGeo = new THREE.SphereGeometry(0.22, 20, 20);
    const c1KernelMat = new THREE.MeshBasicMaterial({
      color: 0x67e8f9,
      transparent: true,
      opacity: 0.82,
    });
    const c1KernelMesh = new THREE.Mesh(c1KernelGeo, c1KernelMat);
    c1KernelMesh.position.copy(c1Center);
    scene.add(c1KernelMesh);

    // Outer Geometric Icosahedron Shell
    const c1ShellGeo = new THREE.IcosahedronGeometry(0.48, 1);
    const c1ShellMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const c1ShellMesh = new THREE.Mesh(c1ShellGeo, c1ShellMat);
    c1ShellMesh.position.copy(c1Center);
    scene.add(c1ShellMesh);

    // Subtle Connecting Filament between centroids (demonstrating centroid separation)
    const filamentGeo = new THREE.BufferGeometry().setFromPoints([c0Center, c1Center]);
    const filamentMat = new THREE.LineDashedMaterial({
      color: 0x64748b,
      dashSize: 0.16,
      gapSize: 0.08,
      transparent: true,
      opacity: 0.45,
    });
    const filamentLine = new THREE.Line(filamentGeo, filamentMat);
    filamentLine.computeLineDistances();
    scene.add(filamentLine);

    // Pre-allocated objects for render-loop reuse (zero allocations during animation)
    const raycaster = new THREE.Raycaster();
    const tempOffset = new THREE.Vector3();
    const tempComputedPos = new THREE.Vector3();

    // Interaction pointer handlers (pure coordinate recording, no React dispatches)
    const handlePointerDown = (e: PointerEvent) => {
      controlsStateRef.current.isDragging = true;
      controlsStateRef.current.prevPointer = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const state = controlsStateRef.current;
      state.pointerNormalized.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      state.pointerNormalized.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      state.hasPointer = true;

      if (!state.isDragging) return;

      const deltaX = e.clientX - state.prevPointer.x;
      const deltaY = e.clientY - state.prevPointer.y;
      state.prevPointer = { x: e.clientX, y: e.clientY };

      // Orbit camera rotation
      const rotSpeed = 0.0055;
      state.spherical.theta -= deltaX * rotSpeed;
      state.spherical.phi = Math.max(0.28, Math.min(Math.PI - 0.28, state.spherical.phi - deltaY * rotSpeed));
    };

    const handlePointerLeave = () => {
      controlsStateRef.current.hasPointer = false;
      controlsStateRef.current.isDragging = false;
      if (hoveredClusterRef.current !== null) {
        hoveredClusterRef.current = null;
        setHoveredCluster(null);
      }
    };

    const handlePointerUp = () => {
      controlsStateRef.current.isDragging = false;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clickMouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      raycaster.setFromCamera(clickMouse, camera);
      const ray = raycaster.ray;
      const dist0 = ray.distanceToPoint(c0Center);
      const dist1 = ray.distanceToPoint(c1Center);

      if (dist0 < 2.0 && dist0 < dist1) {
        onSelectCluster(0);
      } else if (dist1 < 3.0) {
        onSelectCluster(1);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomDelta = e.deltaY * 0.004;
      const state = controlsStateRef.current;
      state.spherical.radius = Math.max(3.8, Math.min(10.5, state.spherical.radius + zoomDelta));
    };

    // Touch Support for mobile pinch-to-zoom and one-finger orbit
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        controlsStateRef.current.isDragging = true;
        controlsStateRef.current.prevPointer = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        controlsStateRef.current.pinchStartDist = Math.hypot(dx, dy);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && controlsStateRef.current.isDragging) {
        const deltaX = e.touches[0].clientX - controlsStateRef.current.prevPointer.x;
        const deltaY = e.touches[0].clientY - controlsStateRef.current.prevPointer.y;
        controlsStateRef.current.prevPointer = { x: e.touches[0].clientX, y: e.touches[0].clientY };

        const rotSpeed = 0.007;
        const state = controlsStateRef.current;
        state.spherical.theta -= deltaX * rotSpeed;
        state.spherical.phi = Math.max(0.28, Math.min(Math.PI - 0.28, state.spherical.phi - deltaY * rotSpeed));
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const pinchDelta = (controlsStateRef.current.pinchStartDist - dist) * 0.012;
        controlsStateRef.current.pinchStartDist = dist;

        const state = controlsStateRef.current;
        state.spherical.radius = Math.max(3.8, Math.min(10.5, state.spherical.radius + pinchDelta));
      }
    };

    const handleTouchEnd = () => {
      controlsStateRef.current.isDragging = false;
    };

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = controlsStateRef.current;
      const step = 0.07;
      if (e.key === 'ArrowLeft') state.spherical.theta += step;
      else if (e.key === 'ArrowRight') state.spherical.theta -= step;
      else if (e.key === 'ArrowUp') state.spherical.phi = Math.max(0.28, state.spherical.phi - step);
      else if (e.key === 'ArrowDown') state.spherical.phi = Math.min(Math.PI - 0.28, state.spherical.phi + step);
      else if (e.key === '+' || e.key === '=') state.spherical.radius = Math.max(3.8, state.spherical.radius - 0.4);
      else if (e.key === '-' || e.key === '_') state.spherical.radius = Math.min(10.5, state.spherical.radius + 0.4);
      else if (e.key === '0') onSelectCluster(0);
      else if (e.key === '1') onSelectCluster(1);
      else if (e.key.toLowerCase() === 'b') onSelectCluster('both');
      else if (e.key.toLowerCase() === 'r') handleResetCamera();
      else if (e.key === ' ') {
        e.preventDefault();
        setAutoRotate((prev) => !prev);
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', handlePointerDown);
    dom.addEventListener('pointermove', handlePointerMove);
    dom.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('pointerup', handlePointerUp);
    dom.addEventListener('click', handleClick);
    dom.addEventListener('wheel', handleWheel, { passive: false });
    dom.addEventListener('touchstart', handleTouchStart, { passive: true });
    dom.addEventListener('touchmove', handleTouchMove, { passive: true });
    dom.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('keydown', handleKeyDown);

    // Visibility Observer to pause render loop when offscreen
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            // When re-entering viewport, reset frame time metrics so offscreen pause time doesn't skew FPS
            lastFpsTime = performance.now();
            lastFrameTime = performance.now();
            frameCount = 0;
            frameDeltas.length = 0;
          }
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // --- Animation & Render Loop ---
    let animationFrameId: number;
    let frameCount = 0;
    let lastFpsTime = performance.now();
    let lastFrameTime = performance.now();
    const frameDeltas: number[] = [];

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const now = performance.now();
      const delta = now - lastFrameTime;
      lastFrameTime = now;
      if (delta > 0 && delta < 500) {
        frameDeltas.push(delta);
        if (frameDeltas.length > 60) frameDeltas.shift();
      }

      frameCount++;
      // High-performance DOM telemetry update without React re-renders
      if (now - lastFpsTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastFpsTime));
        const sorted = [...frameDeltas].sort((a, b) => a - b);
        const avg =
          frameDeltas.length > 0
            ? Number((frameDeltas.reduce((a, b) => a + b, 0) / frameDeltas.length).toFixed(1))
            : 16.6;
        const p95 =
          sorted.length > 0 ? Number(sorted[Math.floor(sorted.length * 0.95)].toFixed(1)) : 16.8;
        const calls = renderer.info.render.calls || 6;

        if (fpsRef.current) fpsRef.current.textContent = `${fps} FPS`;
        if (p50Ref.current) p50Ref.current.textContent = `${avg}ms`;
        if (p95Ref.current) p95Ref.current.textContent = `${p95}ms`;
        if (callsRef.current) callsRef.current.textContent = `${calls}`;

        frameCount = 0;
        lastFpsTime = now;
      }

      const state = controlsStateRef.current;

      // Auto-rotation around vertical axis when not dragging
      if (state.autoRotate && !state.isDragging && !prefersReducedMotion) {
        state.spherical.theta += 0.0016;
      }

      // Convert spherical coordinates back into target camera position (reusing temp vectors)
      tempOffset.setFromSpherical(state.spherical);
      tempComputedPos.copy(state.targetLookAt).add(tempOffset);

      // Smooth camera interpolation (exponential easing)
      const lerpSpeed = prefersReducedMotion ? 1.0 : 0.065;
      state.currentPosition.lerp(tempComputedPos, lerpSpeed);
      state.currentLookAt.lerp(state.targetLookAt, lerpSpeed);

      camera.position.copy(state.currentPosition);
      camera.lookAt(state.currentLookAt);

      // Controlled Per-Frame Raycasting for Hover Detection
      if (state.hasPointer && !state.isDragging) {
        raycaster.setFromCamera(state.pointerNormalized, camera);
        const ray = raycaster.ray;
        const dist0 = ray.distanceToPoint(c0Center);
        const dist1 = ray.distanceToPoint(c1Center);

        let nextHover: 0 | 1 | null = null;
        if (dist0 < 2.0 && dist0 < dist1) {
          nextHover = 0;
        } else if (dist1 < 3.0) {
          nextHover = 1;
        }

        if (nextHover !== hoveredClusterRef.current) {
          hoveredClusterRef.current = nextHover;
          setHoveredCluster(nextHover);
        }
      }

      // Refined Centroid & Particle Animations
      if (!prefersReducedMotion) {
        const time = now * 0.0015;

        // Cluster 0 (Core) Centroid rotations
        c0Points.rotation.y += 0.0008;
        c0ShellMesh.rotation.y -= 0.005;
        c0ShellMesh.rotation.x += 0.003;
        const c0Scale = 1.0 + 0.06 * Math.sin(time * 3);
        c0KernelMesh.scale.set(c0Scale, c0Scale, c0Scale);

        // Cluster 1 (Browsers) Centroid rotations
        c1Points.rotation.y -= 0.0005;
        c1ShellMesh.rotation.y += 0.003;
        c1ShellMesh.rotation.z -= 0.002;
        const c1Scale = 1.0 + 0.04 * Math.sin(time * 2);
        c1KernelMesh.scale.set(c1Scale, c1Scale, c1Scale);
      }

      // Dynamic Opacity & Size Highlighting based on active selection
      if (selectedCluster === 0) {
        c0Material.opacity = 0.95;
        c0Material.size = 0.095;
        c1Material.opacity = 0.18;
        c1Material.size = 0.045;
        c0KernelMat.opacity = 0.95;
        c1KernelMat.opacity = 0.2;
      } else if (selectedCluster === 1) {
        c0Material.opacity = 0.18;
        c0Material.size = 0.05;
        c1Material.opacity = 0.95;
        c1Material.size = 0.08;
        c0KernelMat.opacity = 0.2;
        c1KernelMat.opacity = 0.9;
      } else {
        c0Material.opacity = 0.9;
        c0Material.size = 0.08;
        c1Material.opacity = 0.8;
        c1Material.size = 0.065;
        c0KernelMat.opacity = 0.85;
        c1KernelMat.opacity = 0.8;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = typeof height === 'number' ? height : container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Teardown & Resource Disposal
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('pointerdown', handlePointerDown);
      dom.removeEventListener('pointermove', handlePointerMove);
      dom.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointerup', handlePointerUp);
      dom.removeEventListener('click', handleClick);
      dom.removeEventListener('wheel', handleWheel);
      dom.removeEventListener('touchstart', handleTouchStart);
      dom.removeEventListener('touchmove', handleTouchMove);
      dom.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);

      // Clean Three.js geometries, materials, and renderer
      particleTexture.dispose();

      c0Geometry.dispose();
      c0Material.dispose();
      c0KernelGeo.dispose();
      c0KernelMat.dispose();
      c0ShellGeo.dispose();
      c0ShellMat.dispose();

      c1Geometry.dispose();
      c1Material.dispose();
      c1KernelGeo.dispose();
      c1KernelMat.dispose();
      c1ShellGeo.dispose();
      c1ShellMat.dispose();

      filamentGeo.dispose();
      filamentMat.dispose();
      gridGeo.dispose();
      gridMat.dispose();

      renderer.dispose();
      if (dom.parentElement === container) {
        container.removeChild(dom);
      }
    };
  }, [height, onSelectCluster, selectedCluster]);

  if (!hasWebGl) {
    return (
      <div className="p-8 rounded-xl bg-surface border border-hairline text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-accent-amber/15 text-accent-amber mx-auto flex items-center justify-center">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h4 className="font-semibold text-text-primary text-base">WebGL Hardware Acceleration Unavailable</h4>
        <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed">
          Your browser or device does not currently have WebGL active. You can explore the verified K-Means segmentation metrics directly in the 2D Behavioral Radar or Data Table modes below.
        </p>
        <button
          type="button"
          onClick={() => onSelectCluster('both')}
          className="px-4 py-2 rounded-lg bg-brand-cyan text-slate-950 font-semibold text-xs inline-flex items-center gap-2"
        >
          <Activity className="w-4 h-4" />
          Switch to 2D Radar View
        </button>
      </div>
    );
  }

  return (
    <div className={cn('relative w-full rounded-2xl overflow-hidden border border-brand-violet/30 bg-slate-950 shadow-2xl', className)}>
      {/* 3D WebGL Canvas Mount */}
      <div
        ref={mountRef}
        style={{ height }}
        className="w-full cursor-grab active:cursor-grabbing select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/60"
        tabIndex={0}
        role="region"
        aria-label="Interactive 3D Customer Constellation. Use arrow keys to orbit, + and - to zoom, 0 and 1 to select clusters, R to reset, Space to pause."
      />

      {/* Floating HUD: Header & Telemetry Badge */}
      <div className="absolute top-3 left-3 right-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-semibold bg-slate-900/90 text-brand-cyan border border-brand-cyan/30 backdrop-blur-md shadow-lg pointer-events-auto">
            <Sparkles className="w-3.5 h-3.5 text-brand-cyan animate-pulse" />
            Customer Constellation · 3D Behavioral Explorer
          </span>
          <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900/80 text-text-subtle border border-hairline backdrop-blur-md">
            Drag to Orbit · Scroll / Pinch to Zoom
          </span>
        </div>

        {/* Real-Time Frame Metrics (Direct Ref DOM updates for zero React lag) */}
        <div className="flex items-center gap-2 self-start sm:self-auto pointer-events-auto">
          <div className="px-2.5 py-1 rounded-xl bg-slate-900/90 border border-hairline text-[11px] font-mono text-text-subtle backdrop-blur-md flex items-center gap-2 shadow-sm">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
              <strong ref={fpsRef} className="font-bold text-text-primary">60 FPS</strong>
            </span>
            <span className="text-text-subtle/40">|</span>
            <span>p50: <strong ref={p50Ref} className="text-text-secondary">16.6ms</strong></span>
            <span className="text-text-subtle/40">|</span>
            <span>p95: <strong ref={p95Ref} className="text-text-secondary">16.8ms</strong></span>
            <span className="text-text-subtle/40">|</span>
            <span>Calls: <strong ref={callsRef} className="text-brand-cyan">6</strong></span>
          </div>
        </div>
      </div>

      {/* Hover Feedback Toast */}
      {hoveredCluster !== null && selectedCluster === 'both' && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-slate-900/95 border border-brand-violet/40 text-[11px] font-mono text-brand-cyan shadow-2xl backdrop-blur-md pointer-events-none flex items-center gap-2 z-10 animate-in fade-in zoom-in-95 duration-150">
          <span
            className={cn(
              'w-2 h-2 rounded-full inline-block',
              hoveredCluster === 0 ? 'bg-brand-violet animate-pulse' : 'bg-brand-cyan animate-pulse'
            )}
          />
          <span>
            {hoveredCluster === 0
              ? 'Cluster 0 · Commercial Core (250,388 Users)'
              : 'Cluster 1 · Casual Browsers (2,771,046 Users)'} (Click to isolate)
          </span>
        </div>
      )}

      {/* Contextual Cluster Information Panel (When a cluster is isolated) */}
      {selectedCluster !== 'both' && (
        <div className="absolute top-14 left-4 max-w-xs sm:max-w-sm p-3.5 rounded-xl bg-slate-900/95 border border-brand-violet/40 backdrop-blur-md shadow-2xl pointer-events-auto z-10 transition-all">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'w-2.5 h-2.5 rounded-full',
                  selectedCluster === 0 ? 'bg-brand-violet animate-pulse' : 'bg-brand-cyan animate-pulse'
                )}
              />
              <span className="text-xs font-bold text-text-primary">
                {selectedCluster === 0
                  ? 'Cluster 0 · High-Activity Core'
                  : 'Cluster 1 · Casual Browsers'}
              </span>
            </div>
            <button
              onClick={() => onSelectCluster('both')}
              className="p-1 rounded-md text-text-subtle hover:text-text-primary hover:bg-slate-800 transition-colors"
              title="Show Both Clusters"
              aria-label="Show Both Clusters"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2 mb-2.5">
            {selectedCluster === 0 ? c0.behavior_summary : c1.behavior_summary}
          </p>

          <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono pt-2 border-t border-hairline/60">
            <div className="p-1.5 rounded bg-surface/50 border border-hairline/30 flex items-center justify-between">
              <span className="text-text-subtle">Population:</span>
              <span className="font-bold text-text-primary">
                {formatInteger(selectedCluster === 0 ? c0.user_count : c1.user_count)}
              </span>
            </div>
            <div className="p-1.5 rounded bg-surface/50 border border-hairline/30 flex items-center justify-between">
              <span className="text-text-subtle">Share:</span>
              <span className={cn('font-bold', selectedCluster === 0 ? 'text-brand-violet-light' : 'text-brand-cyan')}>
                {formatPercent(selectedCluster === 0 ? c0.share_percent : c1.share_percent)}
              </span>
            </div>
            <div className="p-1.5 rounded bg-surface/50 border border-hairline/30 flex items-center justify-between">
              <span className="text-text-subtle">Avg Spend:</span>
              <span className="font-bold text-accent-emerald">
                {formatMonetaryValue(selectedCluster === 0 ? c0.average_revenue : c1.average_revenue, true)}
              </span>
            </div>
            <div className="p-1.5 rounded bg-surface/50 border border-hairline/30 flex items-center justify-between">
              <span className="text-text-subtle">Avg Orders:</span>
              <span className="font-bold text-text-primary">
                {(selectedCluster === 0 ? c0.average_purchases : c1.average_purchases).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Floating HUD: Interactive Cluster Filter Bar & Camera Actions */}
      <div className="absolute bottom-14 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Cluster Selection Chips */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-hairline backdrop-blur-md pointer-events-auto shadow-lg">
          <button
            type="button"
            onClick={() => onSelectCluster('both')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5',
              selectedCluster === 'both'
                ? 'bg-brand-violet text-white shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            )}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Both Clusters (3,021,434)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectCluster(0)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border',
              selectedCluster === 0
                ? 'bg-brand-violet/30 text-brand-violet-light border-brand-violet/60 shadow-sm'
                : 'border-transparent text-text-muted hover:text-text-primary'
            )}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-brand-violet" />
            <span>Cluster 0: Core ({formatInteger(c0.user_count)} · 8.29%)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectCluster(1)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border',
              selectedCluster === 1
                ? 'bg-brand-cyan/20 text-brand-cyan border-brand-cyan/60 shadow-sm'
                : 'border-transparent text-text-muted hover:text-text-primary'
            )}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan" />
            <span>Cluster 1: Browsers ({formatInteger(c1.user_count)} · 91.71%)</span>
          </button>
        </div>

        {/* Camera Control Actions */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-hairline backdrop-blur-md pointer-events-auto shadow-lg">
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-slate-800 transition-colors"
            title={autoRotate ? 'Pause Auto-Rotation (Space)' : 'Resume Auto-Rotation (Space)'}
            aria-label={autoRotate ? 'Pause Auto-Rotation' : 'Resume Auto-Rotation'}
          >
            {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-accent-emerald" />}
          </button>

          <button
            type="button"
            onClick={handleResetCamera}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-text-muted hover:text-text-primary hover:bg-slate-800 transition-colors flex items-center gap-1"
            title="Reset Camera Vantage Point (R)"
          >
            <RotateCcw className="w-3.5 h-3.5 text-brand-cyan" />
            <span className="hidden sm:inline">Reset View</span>
          </button>
        </div>
      </div>

      {/* Scientific Transparency Disclaimer Footer Bar */}
      <div className="px-4 py-2 bg-slate-950/90 border-t border-hairline/60 flex items-center justify-between gap-3 text-[11px] text-text-subtle">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
          <span className="leading-tight">
            <strong>Scientific Guardrail:</strong> Conceptual 3D representation of verified aggregate customer segments. Particle positions illustrate population proportions and centroid divergence, not row-level PCA coordinates. Visual point counts (2,500 points) are sampled for rendering efficiency.
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-3 shrink-0 font-mono text-[10px]">
          <span className="text-brand-violet-light">● Violet = 250,388 Core (8.29%)</span>
          <span className="text-brand-cyan">● Cyan = 2,771,046 Browsers (91.71%)</span>
        </div>
      </div>
    </div>
  );
};
