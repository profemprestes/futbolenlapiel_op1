'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const DEFAULT_LOGO_URL =
  'https://ynqvddgxxtmflpouursq.supabase.co/storage/v1/object/public/marifertiendauy/futbol_logo_mejorado_v2.png';

export interface Logo3DProps {
  /** URL de la imagen del logo a renderizar en el plano 3D. */
  imageUrl?: string;
  /** Clases CSS para dimensionar o posicionar el contenedor del canvas. */
  className?: string;
  /** Velocidad de rotación automática de OrbitControls. */
  autoRotateSpeed?: number;
  /** Alto del plano 3D en unidades de escena (el ancho se calcula según el aspect ratio). */
  planeHeight?: number;
  /** Etiqueta accesible del contenedor. */
  ariaLabel?: string;
}

export default function Logo3D({
  imageUrl = DEFAULT_LOGO_URL,
  className = 'relative h-full w-full',
  autoRotateSpeed = 1.8,
  planeHeight = 1.8,
  ariaLabel = 'Emblema 3D giratorio',
}: Logo3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let animationFrameId = 0;

    const getSize = () => ({
      width: container.clientWidth || window.innerWidth,
      height: container.clientHeight || window.innerHeight,
    });

    const { width: initialWidth, height: initialHeight } = getSize();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      35,
      initialWidth / initialHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 3.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(initialWidth, initialHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(2, 3, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xcbd5e1, 1.5);
    rimLight.position.set(-3, 1, -3);
    scene.add(rimLight);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = !motionQuery.matches;
    controls.autoRotateSpeed = autoRotateSpeed;
    controls.minDistance = 1.5;
    controls.maxDistance = 6;

    const handleMotionChange = (event: MediaQueryListEvent) => {
      controls.autoRotate = !event.matches;
    };
    motionQuery.addEventListener('change', handleMotionChange);

    let mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshPhysicalMaterial> | null =
      null;
    let loadedTexture: THREE.Texture | null = null;

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    loader.load(
      imageUrl,
      (texture) => {
        if (disposed) {
          texture.dispose();
          return;
        }

        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        loadedTexture = texture;

        const image = texture.image as { width?: number; height?: number } | undefined;
        const aspect =
          image?.width && image?.height ? image.width / image.height : 1;

        const geometry = new THREE.PlaneGeometry(
          planeHeight * aspect,
          planeHeight,
        );
        const material = new THREE.MeshPhysicalMaterial({
          map: texture,
          transparent: true,
          alphaTest: 0.02,
          side: THREE.DoubleSide,
          metalness: 0.25,
          roughness: 0.32,
          clearcoat: 0.75,
          clearcoatRoughness: 0.2,
        });

        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
      },
      undefined,
      (error) => {
        console.error('No se pudo cargar la imagen:', error);
      },
    );

    const handleResize = () => {
      const { width, height } = getSize();
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);

    const animate = () => {
      if (disposed) return;
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      motionQuery.removeEventListener('change', handleMotionChange);

      controls.dispose();

      if (mesh) {
        scene.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
      }
      if (loadedTexture) {
        loadedTexture.dispose();
      }

      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [imageUrl, autoRotateSpeed, planeHeight]);

  return (
    <div
      ref={containerRef}
      className={className}
      role="img"
      aria-label={ariaLabel}
    />
  );
}
