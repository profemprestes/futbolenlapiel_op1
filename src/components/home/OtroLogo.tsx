'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface Emblema3DProps {
    imageUrl?: string;
    autoRotateSpeed?: number;
    className?: string;
}

const DEFAULT_IMAGE_URL =
    'https://ynqvddgxxtmflpouursq.supabase.co/storage/v1/object/public/marifertiendauy/futbol_logo_mejorado_v2.png';

export default function Emblema3D({
    imageUrl = DEFAULT_IMAGE_URL,
    autoRotateSpeed = 1.8,
    className = '',
}: Emblema3DProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;

        // Escena y cámara
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
        camera.position.set(0, 0, 3.2);

        // Renderizador
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
        container.appendChild(renderer.domElement);

        // Iluminación
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
        keyLight.position.set(2, 3, 4);
        scene.add(keyLight);

        const rimLight = new THREE.DirectionalLight(0xcbd5e1, 1.5);
        rimLight.position.set(-3, 1, -3);
        scene.add(rimLight);

        // Controles orbitales
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = autoRotateSpeed;
        controls.minDistance = 1.5;
        controls.maxDistance = 6;

        // Referencias para limpieza
        let mesh: THREE.Mesh | null = null;
        let geometry: THREE.PlaneGeometry | null = null;
        let material: THREE.MeshPhysicalMaterial | null = null;
        let loadedTexture: THREE.Texture | null = null;

        // Carga de textura
        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin('anonymous');
        loader.load(
            imageUrl,
            (texture) => {
                loadedTexture = texture;
                texture.colorSpace = THREE.SRGBColorSpace;
                texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

                const aspect = texture.image.width / texture.image.height;
                const planeHeight = 1.8;

                geometry = new THREE.PlaneGeometry(planeHeight * aspect, planeHeight);
                material = new THREE.MeshPhysicalMaterial({
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
            (error) => console.error('No se pudo cargar la imagen:', error)
        );

        // Redimensionado responsivo al contenedor
        const handleResize = () => {
            if (!container) return;
            const newWidth = container.clientWidth || window.innerWidth;
            const newHeight = container.clientHeight || window.innerHeight;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        };
        window.addEventListener('resize', handleResize);

        // Loop de animación
        let animationFrameId: number;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Limpieza al desmontar
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            controls.dispose();
            if (mesh) scene.remove(mesh);
            geometry?.dispose();
            material?.dispose();
            loadedTexture?.dispose();
            renderer.dispose();
            if (renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [imageUrl, autoRotateSpeed]);

    return (
        <div
            ref={containerRef}
            aria-label="Emblema 3D giratorio"
            className={`fixed inset-0 w-full h-full overflow-hidden ${className}`}
            style={{
                background:
                    'radial-gradient(circle at 50% 45%, #232832 0%, #101318 60%, #07090c 100%)',
            }}
        />
    );
}