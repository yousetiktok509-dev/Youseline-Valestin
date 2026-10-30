import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { Sparkles, Cake, Compass } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';
import { PartyConfig } from '../../types/party';
import { checkIsSoftwareGl, setupLuxuryLighting, createBalloon } from '../../utils/threeHelpers';

interface Scene3Props {
  config: PartyConfig;
  onNext: () => void;
}

export const Scene3Ballroom: React.FC<Scene3Props> = ({ config, onNext }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [showSurpriseText, setShowSurpriseText] = useState(true);

  useEffect(() => {
    // 1. Confetti cannon burst on arrival
    soundEngine.playConfetti();
    soundEngine.playChime(659, 0.3);

    const confettiDefaults = {
      spread: 360,
      ticks: 120,
      gravity: 0.8,
      decay: 0.94,
      startVelocity: 30,
      colors: ['#e5c158', '#ffd700', '#9e1b32', '#f1cbd2', '#ffffff'],
    };

    confetti({ ...confettiDefaults, particleCount: 60, origin: { x: 0.2, y: 0.4 } });
    confetti({ ...confettiDefaults, particleCount: 60, origin: { x: 0.8, y: 0.4 } });
    setTimeout(() => {
      confetti({ ...confettiDefaults, particleCount: 70, origin: { x: 0.5, y: 0.3 } });
    }, 400);

    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = checkIsSoftwareGl();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0a0306');

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 9.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Setup Luxury Lighting
    setupLuxuryLighting(scene, renderer);

    // --- PROCEDURAL BALLROOM ARCHITECTURE ---
    // 1. Polished Parquet / Black Marble Floor with Gold inlays
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x16070d,
      roughness: 0.25,
      metalness: 0.3,
    });
    const floorGeo = new THREE.PlaneGeometry(32, 32);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Circular central gold medallion on floor
    const medallionGeo = new THREE.RingGeometry(0.1, 4.2, 48);
    const medallionMat = new THREE.MeshStandardMaterial({ color: 0xe5c158, metalness: 0.85, roughness: 0.3 });
    const medallion = new THREE.Mesh(medallionGeo, medallionMat);
    medallion.rotation.x = -Math.PI / 2;
    medallion.position.y = 0.01;
    scene.add(medallion);

    // 2. Ballroom Walls & Ceiling
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x220a13, roughness: 0.8 });
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(24, 12, 0.5), wallMat);
    backWall.position.set(0, 6, -8);
    backWall.receiveShadow = true;
    scene.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 12, 24), wallMat);
    leftWall.position.set(-12, 6, 0);
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 12, 24), wallMat);
    rightWall.position.set(12, 6, 0);
    scene.add(rightWall);

    const ceilingMat = new THREE.MeshStandardMaterial({ color: 0x120409, roughness: 0.9 });
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(24, 24), ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 12;
    scene.add(ceiling);

    // 3. Luxurious Crystal Chandelier
    const chandelier = new THREE.Group();
    chandelier.position.set(0, 8.8, 0);

    const crystalStemGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.2, 12);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xe5c158, metalness: 0.9, roughness: 0.15 });
    chandelier.add(new THREE.Mesh(crystalStemGeo, goldMat));

    // Three tiers of crystal rings
    [2.0, 1.4, 0.8].forEach((r, idx) => {
      const ringGeo = new THREE.TorusGeometry(r, 0.04, 8, 36);
      const ring = new THREE.Mesh(ringGeo, goldMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -idx * 0.7;
      chandelier.add(ring);

      // Hanging crystal drops
      const dropCount = Math.floor(r * 12);
      for (let j = 0; j < dropCount; j++) {
        const theta = (j / dropCount) * Math.PI * 2;
        const crystalGeo = new THREE.OctahedronGeometry(0.09, 0);
        const crystalMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.05,
          metalness: 0.1,
        });
        const drop = new THREE.Mesh(crystalGeo, crystalMat);
        drop.position.set(Math.cos(theta) * r, -idx * 0.7 - 0.25, Math.sin(theta) * r);
        chandelier.add(drop);
      }
    });

    const chandelierLight = new THREE.PointLight(0xfff3c4, 3.5, 18);
    chandelierLight.position.set(0, -1, 0);
    chandelier.add(chandelierLight);
    scene.add(chandelier);

    // 4. Central Round Pedestal Table for Birthday Cake
    const tableGroup = new THREE.Group();
    tableGroup.position.set(0, 0, 0);

    const tableBase = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.6, 1.1, 32),
      new THREE.MeshStandardMaterial({ color: 0xfaf5ec, roughness: 0.4 })
    );
    tableBase.position.y = 0.55;
    tableBase.castShadow = true;
    tableBase.receiveShadow = true;
    tableGroup.add(tableBase);

    // Gold decorative tablecloth trim
    const trim = new THREE.Mesh(
      new THREE.CylinderGeometry(1.64, 1.64, 0.1, 32),
      goldMat
    );
    trim.position.y = 1.05;
    tableGroup.add(trim);

    // 5. Stylized 3-tier cake preview on the central table
    const cakeGroup = new THREE.Group();
    cakeGroup.position.set(0, 1.1, 0);

    const cakeTier1 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 0.9, 0.45, 32),
      new THREE.MeshStandardMaterial({ color: 0xfaf5ec, roughness: 0.3 })
    );
    cakeTier1.position.y = 0.225;
    cakeGroup.add(cakeTier1);

    const cakeTier2 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.65, 0.65, 0.4, 32),
      new THREE.MeshStandardMaterial({ color: 0x670d1c, roughness: 0.7 })
    );
    cakeTier2.position.y = 0.65;
    cakeGroup.add(cakeTier2);

    const cakeTier3 = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.42, 0.35, 32),
      new THREE.MeshStandardMaterial({ color: 0xfaf5ec, roughness: 0.3 })
    );
    cakeTier3.position.y = 1.025;
    cakeGroup.add(cakeTier3);

    // Tiny candles on cake
    for (let c = 0; c < 5; c++) {
      const ca = (c / 5) * Math.PI * 2;
      const candle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.2, 12),
        goldMat
      );
      candle.position.set(Math.cos(ca) * 0.22, 1.3, Math.sin(ca) * 0.22);
      cakeGroup.add(candle);

      const flameLight = new THREE.PointLight(0xffa500, 0.6, 2);
      flameLight.position.set(Math.cos(ca) * 0.22, 1.45, Math.sin(ca) * 0.22);
      cakeGroup.add(flameLight);
    }

    tableGroup.add(cakeGroup);
    scene.add(tableGroup);

    // 6. Floating Ceiling Balloons
    const balloons: THREE.Group[] = [];
    const balloonColors = ['#9e1b32', '#e5c158', '#faf5ec', '#7d1224', '#f1cbd2'];
    const bCount = isSoftwareGl ? 25 : 50;

    for (let i = 0; i < bCount; i++) {
      const color = balloonColors[i % balloonColors.length];
      const b = createBalloon(color, 0.3 + Math.random() * 0.15);
      const bx = (Math.random() - 0.5) * 16;
      const bz = (Math.random() - 0.5) * 16;
      const by = 4.5 + Math.random() * 4.5;
      b.position.set(bx, by, bz);
      scene.add(b);
      balloons.push(b);
    }

    // 7. Wrapped Gift Boxes clustered near table
    const giftColors = [0x9e1b32, 0xe5c158, 0x5a0b17, 0xfaf5ec];
    for (let g = 0; g < 8; g++) {
      const gSize = 0.4 + Math.random() * 0.35;
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(gSize, gSize, gSize),
        new THREE.MeshStandardMaterial({ color: giftColors[g % giftColors.length], roughness: 0.4, metalness: 0.2 })
      );
      const gAngle = (g / 8) * Math.PI * 2 + 0.3;
      const gDist = 2.4 + (g % 2) * 0.4;
      box.position.set(Math.cos(gAngle) * gDist, gSize / 2, Math.sin(gAngle) * gDist);
      box.rotation.y = Math.random() * Math.PI;
      box.castShadow = true;
      scene.add(box);

      // Ribbon cross
      const ribbon = new THREE.Mesh(
        new THREE.BoxGeometry(gSize * 1.02, gSize * 1.02, 0.08),
        goldMat
      );
      ribbon.position.copy(box.position);
      scene.add(ribbon);
    }

    // 8. Romantic Velvet Armchairs Lounge (Left side)
    const lounge = new THREE.Group();
    lounge.position.set(-5, 0, 1.5);
    lounge.rotation.y = 0.5;

    const chairMat = new THREE.MeshStandardMaterial({ color: 0x670d1c, roughness: 0.85 });
    [-1.2, 1.2].forEach((cx) => {
      const chair = new THREE.Group();
      chair.position.set(cx, 0, 0);

      const seat = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.45, 1.0), chairMat);
      seat.position.y = 0.45;
      chair.add(seat);

      const back = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 0.25), chairMat);
      back.position.set(0, 1.1, -0.4);
      chair.add(back);

      lounge.add(chair);
    });
    scene.add(lounge);

    // 9. Interactive Touch / Orbit Dragging
    let isDragging = false;
    let previousPointerX = 0;
    let cameraAngle = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousPointerX = e.clientX;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousPointerX;
      previousPointerX = e.clientX;
      cameraAngle -= deltaX * 0.005;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Animation Loop
    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Slow cinematic panoramic pan if not dragging
      if (!isDragging) {
        cameraAngle += delta * 0.12;
      }

      // Smooth camera orbit around center
      const camDist = 9.2;
      const targetX = Math.sin(cameraAngle) * camDist;
      const targetZ = Math.cos(cameraAngle) * camDist;
      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 2.5, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 2.5, delta);
      camera.lookAt(0, 1.8, 0);

      // Gentle balloon floating sway
      balloons.forEach((b, idx) => {
        b.position.y += Math.sin(elapsed * 1.5 + idx) * 0.002;
        b.rotation.y += 0.003;
      });

      // Chandelier crystal sparkle
      chandelier.rotation.y = elapsed * 0.04;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

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
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      renderer.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#0a0306]">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Banner: JOYEUX ANNIVERSAIRE BAGUENS */}
      <div className="absolute top-4 sm:top-6 inset-x-0 flex flex-col items-center pointer-events-none z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <span className="text-[10px] sm:text-xs font-cinzel tracking-[0.35em] text-[#e5c158] uppercase">
            ✦ GRANDE RÉCEPTION PRIVÉE ✦
          </span>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-cinzel font-black tracking-wide text-gold-gradient drop-shadow-[0_0_25px_rgba(229,193,88,0.7)] mt-0.5">
            JOYEUX ANNIVERSAIRE {config.honoreeName.toUpperCase()}
          </h2>
        </motion.div>
      </div>

      {/* Surprise Popup Card */}
      {showSurpriseText && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-20 sm:top-24 inset-x-0 flex justify-center px-4 pointer-events-none z-20"
        >
          <div className="bordeaux-card rounded-2xl px-6 py-4 text-center max-w-sm gold-glow pointer-events-auto border border-[#e5c158]/50">
            <span className="text-xl sm:text-2xl font-cinzel font-black text-rose-gold-gradient block">
              SURPRISE !!! 🎉❤️
            </span>
            <p className="font-playfair text-[#f1cbd2] text-sm mt-1">
              Joyeux anniversaire, mon amour ! Cette fête somptueuse est pour toi.
            </p>
            <button
              onClick={() => setShowSurpriseText(false)}
              className="mt-2 text-[11px] text-[#e5c158] hover:underline font-sans tracking-wide cursor-pointer"
            >
              Fermer et explorer la salle ✕
            </button>
          </div>
        </motion.div>
      )}

      {/* Camera hint badge */}
      <div className="absolute top-28 sm:top-32 right-4 z-10 pointer-events-none hidden sm:flex items-center gap-1.5 text-xs text-[#e5c158]/80 bg-[#140409]/60 px-3 py-1.5 rounded-full border border-[#e5c158]/30">
        <Compass className="w-3.5 h-3.5 text-[#e5c158]" />
        <span>Glisse pour explorer la salle à 360°</span>
      </div>

      {/* Bottom CTA Dock */}
      <div className="absolute bottom-6 sm:bottom-8 inset-x-0 flex justify-center px-4 z-20 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="w-full max-w-sm bordeaux-card rounded-2xl p-4 text-center pointer-events-auto gold-glow"
        >
          <p className="font-playfair text-[#fcf8f2] text-xs sm:text-sm mb-3">
            Un magnifique gâteau d&apos;anniversaire t&apos;attend au centre de la salle...
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
            className="w-full py-3 px-6 rounded-xl font-cinzel font-bold text-xs sm:text-sm tracking-widest uppercase text-[#fff] flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #9e1b32 0%, #5b0e1b 100%)',
              border: '1.5px solid #e5c158',
              boxShadow: '0 8px 24px rgba(158,27,50,0.6)',
            }}
          >
            <Cake className="w-4 h-4 text-[#e5c158]" />
            <span>S&apos;approcher du gâteau ❤️</span>
            <Sparkles className="w-4 h-4 text-[#e5c158]" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};
