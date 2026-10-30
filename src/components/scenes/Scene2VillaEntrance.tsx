import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, DoorOpen } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';
import { PartyConfig } from '../../types/party';
import { checkIsSoftwareGl, setupLuxuryLighting, createBalloon } from '../../utils/threeHelpers';

interface Scene2Props {
  config: PartyConfig;
  onNext: () => void;
}

export const Scene2VillaEntrance: React.FC<Scene2Props> = ({ config, onNext }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isOpeningDoors, setIsOpeningDoors] = useState(false);
  const [doorsOpenComplete, setDoorsOpenComplete] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = checkIsSoftwareGl();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#060204');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 11);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Setup Luxury Lighting
    setupLuxuryLighting(scene, renderer);

    // --- PROCEDURAL ARCHITECTURE ---
    // 1. Villa Facade Wall
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x1b0a10,
      roughness: 0.85,
      metalness: 0.1,
    });
    const wallGeo = new THREE.BoxGeometry(22, 10, 0.6);
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.position.set(0, 4.5, -2);
    wallMesh.receiveShadow = true;
    scene.add(wallMesh);

    // 2. Classical Portico Pillars
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x2d121c,
      roughness: 0.4,
      metalness: 0.2,
    });
    const pillarGeo = new THREE.CylinderGeometry(0.35, 0.4, 7, 24);
    [-2.5, 2.5].forEach((x) => {
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(x, 3.5, -1.7);
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      scene.add(pillar);

      // Gold capital on top
      const capGeo = new THREE.BoxGeometry(0.9, 0.25, 0.9);
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xe5c158, metalness: 0.8, roughness: 0.2 });
      const cap = new THREE.Mesh(capGeo, goldMat);
      cap.position.set(x, 7.1, -1.7);
      scene.add(cap);
    });

    // 3. Ground / Travertine Terrace
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x14050a,
      roughness: 0.6,
      metalness: 0.1,
    });
    const groundGeo = new THREE.PlaneGeometry(30, 30);
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // 4. Grand Red Carpet
    const carpetMat = new THREE.MeshStandardMaterial({
      color: 0x7e0f22,
      roughness: 0.9,
      metalness: 0.05,
    });
    const carpetGeo = new THREE.PlaneGeometry(2.4, 14);
    const carpet = new THREE.Mesh(carpetGeo, carpetMat);
    carpet.rotation.x = -Math.PI / 2;
    carpet.position.set(0, 0.015, 4);
    carpet.receiveShadow = true;
    scene.add(carpet);

    // Gold borders along carpet
    const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xe5c158, metalness: 0.85, roughness: 0.25 });
    [-1.2, 1.2].forEach((x) => {
      const trimGeo = new THREE.BoxGeometry(0.06, 0.02, 14);
      const trim = new THREE.Mesh(trimGeo, goldTrimMat);
      trim.position.set(x, 0.02, 4);
      scene.add(trim);
    });

    // 5. Grand Double Doors
    const doorFrameMat = new THREE.MeshStandardMaterial({ color: 0xe5c158, metalness: 0.9, roughness: 0.2 });
    const doorLeafMat = new THREE.MeshStandardMaterial({ color: 0x3d0a15, roughness: 0.6, metalness: 0.15 });

    // Door Portal Frame
    const frameGeo = new THREE.BoxGeometry(3.2, 5.2, 0.2);
    const frame = new THREE.Mesh(frameGeo, doorFrameMat);
    frame.position.set(0, 2.5, -1.68);
    scene.add(frame);

    // Left Door Pivot Group
    const leftDoorPivot = new THREE.Group();
    leftDoorPivot.position.set(-1.45, 0, -1.65);
    const doorLeafGeo = new THREE.BoxGeometry(1.4, 4.8, 0.1);
    const leftDoor = new THREE.Mesh(doorLeafGeo, doorLeafMat);
    leftDoor.position.set(0.7, 2.4, 0);
    leftDoorPivot.add(leftDoor);

    // Gold handle
    const handleGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 12);
    const handleL = new THREE.Mesh(handleGeo, doorFrameMat);
    handleL.position.set(1.25, 2.3, 0.1);
    leftDoorPivot.add(handleL);

    scene.add(leftDoorPivot);

    // Right Door Pivot Group
    const rightDoorPivot = new THREE.Group();
    rightDoorPivot.position.set(1.45, 0, -1.65);
    const rightDoor = new THREE.Mesh(doorLeafGeo, doorLeafMat);
    rightDoor.position.set(-0.7, 2.4, 0);
    rightDoorPivot.add(rightDoor);

    const handleR = new THREE.Mesh(handleGeo, doorFrameMat);
    handleR.position.set(-1.25, 2.3, 0.1);
    rightDoorPivot.add(handleR);

    scene.add(rightDoorPivot);

    // Interior Warm Golden Light (Hidden behind doors, floods out when opened)
    const interiorLight = new THREE.PointLight(0xffd778, 0, 15);
    interiorLight.position.set(0, 3, -3);
    scene.add(interiorLight);

    // 6. Grand Balloon Arch
    const archGroup = new THREE.Group();
    const balloonColors = ['#9e1b32', '#e5c158', '#faf5ec', '#7d1224', '#f1cbd2', '#b8860b'];
    const totalBalloons = isSoftwareGl ? 28 : 55;

    for (let i = 0; i <= totalBalloons; i++) {
      const t = i / totalBalloons;
      const angle = t * Math.PI;
      const radiusX = 2.4 + (Math.sin(i * 1.5) * 0.15);
      const radiusY = 3.6 + (Math.cos(i * 1.2) * 0.15);
      const x = -Math.cos(angle) * radiusX;
      const y = Math.sin(angle) * radiusY;
      const z = -1.2 + (Math.sin(i * 3.3) * 0.25);

      const color = balloonColors[i % balloonColors.length];
      const balloon = createBalloon(color, 0.24 + Math.random() * 0.08);
      balloon.position.set(x, y, z);
      balloon.rotation.set(Math.random() * 0.4, Math.random() * Math.PI, Math.random() * 0.4);
      archGroup.add(balloon);
    }
    scene.add(archGroup);

    // 7. LED Lanterns and Candles along Red Carpet
    const candleLightSources: THREE.PointLight[] = [];
    [-1.5, 1.5].forEach((xSide) => {
      for (let z = 0; z < 10; z += 1.8) {
        // Glass lantern
        const lanternMat = new THREE.MeshStandardMaterial({ color: 0xe5c158, metalness: 0.9, roughness: 0.2 });
        const lanternGeo = new THREE.BoxGeometry(0.25, 0.5, 0.25);
        const lantern = new THREE.Mesh(lanternGeo, lanternMat);
        lantern.position.set(xSide, 0.25, z);
        scene.add(lantern);

        // Candle flame point light
        const candleLight = new THREE.PointLight(0xffa534, 0.8, 3.5);
        candleLight.position.set(xSide, 0.35, z);
        scene.add(candleLight);
        candleLightSources.push(candleLight);
      }
    });

    // 8. Scattered Rose Petals on Carpet & Ground
    const petalGeo = new THREE.CircleGeometry(0.06, 6);
    petalGeo.rotateX(-Math.PI / 2);
    const petalMat = new THREE.MeshStandardMaterial({ color: 0x9e1b32, roughness: 0.9 });
    for (let i = 0; i < 75; i++) {
      const petal = new THREE.Mesh(petalGeo, petalMat);
      const px = (Math.random() - 0.5) * 2.1;
      const pz = Math.random() * 9;
      petal.position.set(px, 0.025, pz);
      petal.rotation.y = Math.random() * Math.PI * 2;
      petal.scale.set(1 + Math.random() * 0.5, 1, 1 + Math.random() * 0.5);
      scene.add(petal);
    }

    // 9. Hanging Fairy Lights (Curved Garland over doorway)
    const fairyCount = 30;
    const fairyGroup = new THREE.Group();
    for (let i = 0; i < fairyCount; i++) {
      const t = i / (fairyCount - 1);
      const fx = (t - 0.5) * 6;
      const fy = 6.2 - Math.sin(t * Math.PI) * 1.0;
      const fz = -1.3;

      const bulbGeo = new THREE.SphereGeometry(0.04, 8, 8);
      const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfff0ad });
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(fx, fy, fz);
      fairyGroup.add(bulb);
    }
    scene.add(fairyGroup);

    // Animation loop state
    let frameId = 0;
    let clock = new THREE.Clock();

    const render = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Candle flicker
      candleLightSources.forEach((light, idx) => {
        light.intensity = 0.6 + Math.sin(elapsed * 8 + idx * 1.5) * 0.2 + (Math.random() * 0.05);
      });

      // Camera gentle initial glide forward
      if (camera.position.z > 7.5 && !isOpeningDoors) {
        camera.position.z -= delta * 0.6;
      }

      // Door opening animation
      if (doorOpeningRef.current) {
        // Swing doors open
        leftDoorPivot.rotation.y = THREE.MathUtils.damp(leftDoorPivot.rotation.y, -Math.PI * 0.55, 3, delta);
        rightDoorPivot.rotation.y = THREE.MathUtils.damp(rightDoorPivot.rotation.y, Math.PI * 0.55, 3, delta);

        // Turn up radiant warm ballroom light
        interiorLight.intensity = THREE.MathUtils.damp(interiorLight.intensity, 6.5, 4, delta);

        // Push camera inside through the doors
        camera.position.z = THREE.MathUtils.damp(camera.position.z, -1.2, 1.8, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, 2.5, 1.5, delta);
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const doorOpeningRef = useRef(false);

  const handleEnterParty = () => {
    if (isOpeningDoors) return;
    setIsOpeningDoors(true);
    doorOpeningRef.current = true;
    soundEngine.playDoorOpen();

    setTimeout(() => {
      setDoorsOpenComplete(true);
      setTimeout(() => {
        onNext();
      }, 700);
    }, 1800);
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#060204]">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Luminous Marquee Signs Overlay on Top of 3D Scene */}
      <div className="absolute top-4 sm:top-8 inset-x-0 flex flex-col items-center pointer-events-none z-10 px-4">
        {/* Glowing HAPPY BIRTHDAY sign */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <span className="text-xs sm:text-sm font-cinzel font-semibold tracking-[0.4em] text-[#e5c158] uppercase drop-shadow-[0_0_15px_rgba(229,193,88,0.8)]">
            ✦ VILLA D&apos;EXCEPTION ✦
          </span>
          <h2 className="text-2xl sm:text-4xl font-cinzel font-black tracking-wider text-gold-gradient drop-shadow-[0_0_20px_rgba(229,193,88,0.7)] mt-1">
            HAPPY BIRTHDAY
          </h2>
        </motion.div>

        {/* Grand Marquee Letters BAGUENS */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="mt-2 flex items-center justify-center gap-1.5 sm:gap-3"
        >
          {config.honoreeName.split('').map((char, index) => (
            <span
              key={index}
              className="w-8 h-10 sm:w-11 sm:h-14 flex items-center justify-center font-cinzel font-black text-lg sm:text-2xl rounded-lg bg-gradient-to-b from-[#e5c158] to-[#916b12] text-[#3f0912] shadow-lg border border-[#fff1bd] gold-glow"
            >
              {char}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Cinematic Whiteout / Warm Flash when Entering */}
      <AnimatePresence>
        {doorsOpenComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 bg-[#fff5db] z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Bottom CTA Card */}
      <div className="absolute bottom-6 sm:bottom-10 inset-x-0 flex flex-col items-center px-4 z-20 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="w-full max-w-sm bordeaux-card rounded-2xl p-4 sm:p-5 text-center pointer-events-auto gold-glow"
        >
          <p className="font-playfair text-[#f1cbd2] text-sm sm:text-base italic mb-3">
            « Mon amour, ta soirée commence ici. »
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleEnterParty}
            disabled={isOpeningDoors}
            className="w-full py-3 px-6 rounded-xl font-cinzel font-bold text-xs sm:text-sm tracking-widest uppercase text-[#fff] flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #9e1b32 0%, #500b17 100%)',
              border: '1.5px solid #e5c158',
              boxShadow: '0 8px 24px rgba(158,27,50,0.6)',
            }}
          >
            <DoorOpen className="w-4 h-4 text-[#e5c158]" />
            <span>{isOpeningDoors ? "Ouverture des portes..." : "Entrer dans ma fête ❤️"}</span>
            <Sparkles className="w-4 h-4 text-[#e5c158]" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};
