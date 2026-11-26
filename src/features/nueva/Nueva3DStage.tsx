'use client';

import { ChevronLeft, ChevronRight, Pause, Play, RotateCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { renderCamisetaCanvas } from '@/lib/camiseta-assets';
import { PRICE_REFERENCES } from '@/lib/config/brand';
import { MODELOS, type ModeloId } from '@/lib/data/modelos';

interface Nueva3DStageProps {
  modelo: ModeloId;
  reducedMotion: boolean;
  onSelectModelo: (modelo: ModeloId) => void;
}

const RIM_COLORS: Record<ModeloId, number> = {
  uruguay: 0xa8d6f0,
  retro: 0xf5ead6,
  club: 0x8ecbf5,
};

function getPriceForModelo(id: ModeloId): string {
  if (id === 'retro') return PRICE_REFERENCES.retro;
  if (id === 'club') return PRICE_REFERENCES.jugador;
  return PRICE_REFERENCES.fan;
}

export default function Nueva3DStage({
  modelo,
  reducedMotion,
  onSelectModelo,
}: Nueva3DStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const meshRef = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshPhysicalMaterial> | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);
  const targetAzimuthRef = useRef<number | null>(null);
  const textureCacheRef = useRef<Partial<Record<ModeloId, THREE.CanvasTexture>>>({});

  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [angleDeg, setAngleDeg] = useState(0);
  const [isBack, setIsBack] = useState(false);

  const activeInfo = MODELOS.find((m) => m.id === modelo) ?? MODELOS[0];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let rafId = 0;

    const getSize = () => ({
      width: Math.max(280, container.clientWidth),
      height: Math.max(320, container.clientHeight),
    });

    const { width, height } = getSize();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0.08, 3.65);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    // 3-point studio lighting calibrated to Midnight Field & Celeste Sky
    const ambient = new THREE.AmbientLight(0xf5ead6, 1.05);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xf5ead6, 2.3);
    keyLight.position.set(2.4, 3.2, 4.2);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(RIM_COLORS[modelo], 1.85);
    rimLight.position.set(-3.2, 1.2, -2.8);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    const fillLight = new THREE.DirectionalLight(0x8ecbf5, 0.75);
    fillLight.position.set(0, -2.5, 2.0);
    scene.add(fillLight);

    // Subtle curved jersey plane so 3D rotation reveals volume and fabric specular highlights
    const geo = new THREE.PlaneGeometry(2.65, 1.58, 32, 20);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const curve = Math.cos((x / 1.35) * (Math.PI / 2)) * 0.16;
      const drape = Math.sin(y * 2.2) * 0.018;
      pos.setZ(i, curve + drape);
    }
    geo.computeVertexNormals();

    const mat = new THREE.MeshPhysicalMaterial({
      transparent: true,
      alphaTest: 0.03,
      side: THREE.DoubleSide,
      roughness: 0.48,
      metalness: 0.06,
      clearcoat: 0.14,
      clearcoatRoughness: 0.42,
      sheen: 0.35,
      sheenColor: new THREE.Color(0xa8d6f0),
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    meshRef.current = mesh;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.065;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI * 0.38;
    controls.maxPolarAngle = Math.PI * 0.62;
    controls.autoRotate = !reducedMotion;
    controls.autoRotateSpeed = 1.45;
    controlsRef.current = controls;

    const clock = new THREE.Clock();

    const renderLoop = () => {
      if (disposed) return;
      rafId = requestAnimationFrame(renderLoop);

      const t = clock.getElapsedTime();
      if (!reducedMotion) {
        mesh.position.y = Math.sin(t * 1.4) * 0.032;
      } else {
        mesh.position.y = 0;
      }

      if (targetAzimuthRef.current !== null) {
        const cur = controls.getAzimuthalAngle();
        let diff = targetAzimuthRef.current - cur;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        if (Math.abs(diff) < 0.01) {
          targetAzimuthRef.current = null;
        } else {
          // Gently steer camera around Y axis
          const next = cur + diff * 0.14;
          const r = camera.position.length();
          const polar = controls.getPolarAngle();
          camera.position.x = r * Math.sin(polar) * Math.sin(next);
          camera.position.z = r * Math.sin(polar) * Math.cos(next);
          camera.position.y = r * Math.cos(polar);
          camera.lookAt(controls.target);
        }
      }

      controls.update();
      renderer.render(scene, camera);

      const deg = Math.round((((controls.getAzimuthalAngle() * 180) / Math.PI) % 360 + 360) % 360);
      setAngleDeg((prev) => (Math.abs(prev - deg) >= 4 ? deg : prev));
    };

    renderLoop();

    const ro = new ResizeObserver(() => {
      if (disposed) return;
      const s = getSize();
      camera.aspect = s.width / s.height;
      camera.updateProjectionMatrix();
      renderer.setSize(s.width, s.height);
    });
    ro.observe(container);

    const cachedTextures = textureCacheRef.current;

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      controls.dispose();
      geo.dispose();
      mat.dispose();
      Object.values(cachedTextures).forEach((tex) => tex?.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update texture & rim light when model changes
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    let tex = textureCacheRef.current[modelo];
    if (!tex) {
      const canvas = renderCamisetaCanvas(modelo);
      if (canvas) {
        tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.needsUpdate = true;
        textureCacheRef.current[modelo] = tex;
      }
    }

    if (tex) {
      mesh.material.map = tex;
      mesh.material.needsUpdate = true;
    }

    if (rimLightRef.current) {
      rimLightRef.current.color.setHex(RIM_COLORS[modelo]);
    }
  }, [modelo]);

  // Sync autoRotate with paused, hover, and reducedMotion (Gate 18)
  useEffect(() => {
    if (!controlsRef.current) return;
    controlsRef.current.autoRotate = !reducedMotion && !paused && !hovered;
  }, [reducedMotion, paused, hovered]);

  const stepRotation = (dir: -1 | 1) => {
    const controls = controlsRef.current;
    if (!controls) return;
    const base = targetAzimuthRef.current ?? controls.getAzimuthalAngle();
    targetAzimuthRef.current = base + dir * (Math.PI / 4);
  };

  const flipView = () => {
    const controls = controlsRef.current;
    if (!controls) return;
    const nextBack = !isBack;
    setIsBack(nextBack);
    targetAzimuthRef.current = nextBack ? Math.PI : 0;
  };

  return (
    <div
      className="nueva-stage-surface relative flex flex-col justify-between p-5 sm:p-6 min-h-[460px] lg:min-h-[540px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {/* Top stage bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="nueva-mono text-[13px] text-[var(--nh-celeste)]">
            {activeInfo.num} / {getPriceForModelo(activeInfo.id)}
          </p>
          <p className="text-[15px] font-semibold text-[var(--nh-parchment)]">
            {activeInfo.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={flipView}
            className="nueva-btn-secondary !min-h-10 !px-3.5 !text-[13px]"
          >
            <RotateCw className="w-4 h-4" aria-hidden="true" />
            <span>{isBack ? 'Ver frente' : 'Girar 180°'}</span>
          </button>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Reanudar rotación 3D' : 'Pausar rotación 3D'}
            className="nueva-btn-secondary !min-h-10 !w-10 !px-0"
          >
            {paused ? (
              <Play className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Pause className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        role="slider"
        tabIndex={0}
        aria-label={`Visor 3D de ${activeInfo.name}. Usá las flechas izquierda o derecha para girar.`}
        aria-valuemin={0}
        aria-valuemax={359}
        aria-valuenow={angleDeg}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            stepRotation(-1);
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            stepRotation(1);
          }
        }}
        className="relative w-full h-[300px] sm:h-[360px] cursor-grab active:cursor-grabbing touch-pan-y"
      />

      {/* Bottom stage controls: model switcher + accessible rotation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[var(--nh-rule)]">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Modelos en escenario">
          {MODELOS.map((m) => {
            const selected = m.id === modelo;
            return (
              <button
                key={m.id}
                type="button"
                aria-pressed={selected}
                onClick={() => onSelectModelo(m.id)}
                className={`min-h-10 px-3.5 rounded-full text-[13px] font-semibold border cursor-pointer transition-colors ${
                  selected
                    ? 'bg-[var(--nh-celeste)] text-[var(--nh-ink)] border-[var(--nh-celeste)]'
                    : 'bg-transparent text-[var(--nh-parchment)] border-[var(--nh-rule)] hover:border-[var(--nh-celeste)]'
                }`}
              >
                {m.shortName}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => stepRotation(-1)}
            aria-label="Girar camiseta a la izquierda"
            className="nueva-btn-secondary !min-h-10 !w-10 !px-0"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => stepRotation(1)}
            aria-label="Girar camiseta a la derecha"
            className="nueva-btn-secondary !min-h-10 !w-10 !px-0"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
