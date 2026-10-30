import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Mic, MicOff, RefreshCw, ArrowRight, Heart } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';
import { PartyConfig } from '../../types/party';
import { checkIsSoftwareGl, setupLuxuryLighting, createFlameTexture } from '../../utils/threeHelpers';

interface Scene4Props {
  config: PartyConfig;
  onNext: () => void;
}

export const Scene4BirthdayCake: React.FC<Scene4Props> = ({ config, onNext }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [candlesLit, setCandlesLit] = useState(true);
  const [isMicListening, setIsMicListening] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [blowAudioLevel, setBlowAudioLevel] = useState(0);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // References to 3D elements for dynamic updates
  const flameMeshesRef = useRef<THREE.Mesh[]>([]);
  const flameLightsRef = useRef<THREE.PointLight[]>([]);
  const smokeParticlesRef = useRef<THREE.Points | null>(null);

  // THREE.js Scene setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = checkIsSoftwareGl();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#080205');

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 4.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    setupLuxuryLighting(scene, renderer);

    // --- PROCEDURAL 3-TIER CAKE ---
    const cakeGroup = new THREE.Group();
    cakeGroup.position.set(0, -0.6, 0);

    // Gold Pedestal Stand
    const standMat = new THREE.MeshStandardMaterial({ color: 0xe5c158, metalness: 0.9, roughness: 0.2 });
    const standPlate = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.08, 48), standMat);
    standPlate.position.y = 0;
    cakeGroup.add(standPlate);

    const standStem = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 0.5, 32), standMat);
    standStem.position.y = -0.28;
    cakeGroup.add(standStem);

    // Materials
    const creamMat = new THREE.MeshStandardMaterial({ color: 0xfcf8f2, roughness: 0.35, metalness: 0.05 });
    const bordeauxMat = new THREE.MeshStandardMaterial({ color: 0x670d1c, roughness: 0.7, metalness: 0.1 });
    const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xe5c158, metalness: 0.85, roughness: 0.25 });

    // Tier 1 (Bottom)
    const t1Geo = new THREE.CylinderGeometry(1.3, 1.3, 0.65, 48);
    const tier1 = new THREE.Mesh(t1Geo, creamMat);
    tier1.position.y = 0.36;
    tier1.castShadow = true;
    tier1.receiveShadow = true;
    cakeGroup.add(tier1);

    // Gold beaded trim bottom
    const trim1 = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.04, 12, 48), goldTrimMat);
    trim1.rotation.x = Math.PI / 2;
    trim1.position.y = 0.04;
    cakeGroup.add(trim1);

    // Tier 2 (Middle)
    const t2Geo = new THREE.CylinderGeometry(0.95, 0.95, 0.55, 48);
    const tier2 = new THREE.Mesh(t2Geo, bordeauxMat);
    tier2.position.y = 0.95;
    tier2.castShadow = true;
    tier2.receiveShadow = true;
    cakeGroup.add(tier2);

    // Gold beaded trim middle
    const trim2 = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.035, 12, 48), goldTrimMat);
    trim2.rotation.x = Math.PI / 2;
    trim2.position.y = 0.68;
    cakeGroup.add(trim2);

    // Tier 3 (Top)
    const t3Geo = new THREE.CylinderGeometry(0.62, 0.62, 0.5, 48);
    const tier3 = new THREE.Mesh(t3Geo, creamMat);
    tier3.position.y = 1.45;
    tier3.castShadow = true;
    tier3.receiveShadow = true;
    cakeGroup.add(tier3);

    const trim3 = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.03, 12, 48), goldTrimMat);
    trim3.rotation.x = Math.PI / 2;
    trim3.position.y = 1.21;
    cakeGroup.add(trim3);

    // Edible sugar red roses decorating the cake layers
    const roseGeo = new THREE.SphereGeometry(0.08, 12, 12);
    roseGeo.scale(1, 0.7, 1);
    const roseMat = new THREE.MeshStandardMaterial({ color: 0x9e1b32, roughness: 0.8 });
    for (let r = 0; r < 12; r++) {
      const angle = (r / 12) * Math.PI * 2;
      const rose = new THREE.Mesh(roseGeo, roseMat);
      rose.position.set(Math.cos(angle) * 0.96, 0.72, Math.sin(angle) * 0.96);
      cakeGroup.add(rose);
    }

    // Candles on Top
    const candleCount = 5;
    const flameTexture = createFlameTexture();
    const flames: THREE.Mesh[] = [];
    const lights: THREE.PointLight[] = [];

    for (let i = 0; i < candleCount; i++) {
      const angle = (i / candleCount) * Math.PI * 2;
      const radius = 0.32;
      const cx = Math.cos(angle) * radius;
      const cz = Math.sin(angle) * radius;

      // Candle wax stick
      const candleMat = new THREE.MeshStandardMaterial({ color: 0xe5c158, metalness: 0.7, roughness: 0.3 });
      const candleGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.3, 16);
      const candle = new THREE.Mesh(candleGeo, candleMat);
      candle.position.set(cx, 1.82, cz);
      candle.castShadow = true;
      cakeGroup.add(candle);

      // Wick
      const wick = new THREE.Mesh(
        new THREE.CylinderGeometry(0.005, 0.005, 0.05, 8),
        new THREE.MeshBasicMaterial({ color: 0x111111 })
      );
      wick.position.set(cx, 1.98, cz);
      cakeGroup.add(wick);

      // Realistic flame billboard
      const flameMat = new THREE.MeshBasicMaterial({
        map: flameTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const flameGeo = new THREE.PlaneGeometry(0.12, 0.24);
      const flameMesh = new THREE.Mesh(flameGeo, flameMat);
      flameMesh.position.set(cx, 2.1, cz);
      cakeGroup.add(flameMesh);
      flames.push(flameMesh);

      // Candle light
      const candleLight = new THREE.PointLight(0xffa500, 0.8, 2.5);
      candleLight.position.set(cx, 2.12, cz);
      cakeGroup.add(candleLight);
      lights.push(candleLight);
    }

    flameMeshesRef.current = flames;
    flameLightsRef.current = lights;

    // Soft smoke particles (shown when candles extinguish)
    const smokeCount = 35;
    const smokeGeo = new THREE.BufferGeometry();
    const smokePositions = new Float32Array(smokeCount * 3);
    for (let s = 0; s < smokeCount; s++) {
      smokePositions[s * 3] = (Math.random() - 0.5) * 0.5;
      smokePositions[s * 3 + 1] = 2.0 + Math.random() * 0.8;
      smokePositions[s * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePositions, 3));
    const smokeMat = new THREE.PointsMaterial({
      color: 0xbbbbbb,
      size: 0.1,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const smokePoints = new THREE.Points(smokeGeo, smokeMat);
    cakeGroup.add(smokePoints);
    smokeParticlesRef.current = smokePoints;

    scene.add(cakeGroup);

    // Interactive Drag to Rotate Cake
    let isDragging = false;
    let previousPointerX = 0;
    let targetRotationY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousPointerX = e.clientX;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - previousPointerX;
      previousPointerX = e.clientX;
      targetRotationY += dx * 0.008;
    };
    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Animation loop
    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth cake rotation
      if (!isDragging) {
        targetRotationY += delta * 0.2;
      }
      cakeGroup.rotation.y = THREE.MathUtils.damp(cakeGroup.rotation.y, targetRotationY, 4, delta);

      // Flickering candle flame animation
      flames.forEach((flame, idx) => {
        flame.quaternion.copy(camera.quaternion); // billboard
        const flicker = Math.sin(elapsed * 12 + idx * 2.1) * 0.08;
        flame.scale.set(1 + flicker, 1 + flicker * 1.2, 1);
      });

      lights.forEach((light, idx) => {
        light.intensity = 0.7 + Math.sin(elapsed * 10 + idx * 3) * 0.25;
      });

      // Smoke rising effect if extinguished
      if (smokePoints && smokePoints.material instanceof THREE.PointsMaterial && smokePoints.material.opacity > 0) {
        const posAttr = smokePoints.geometry.attributes.position;
        for (let i = 0; i < smokeCount; i++) {
          let y = posAttr.getY(i);
          y += delta * 0.4;
          if (y > 3.0) y = 2.0;
          posAttr.setY(i, y);
        }
        posAttr.needsUpdate = true;
      }

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

  // Extinguish candles logic
  const extinguishCandles = () => {
    if (!candlesLit) return;
    setCandlesLit(false);

    soundEngine.playCandleBlow();
    soundEngine.playChime(880, 0.35);

    // Hide flames and lights
    flameMeshesRef.current.forEach((f) => (f.visible = false));
    flameLightsRef.current.forEach((l) => (l.intensity = 0));

    // Show smoke wisps
    if (smokeParticlesRef.current && smokeParticlesRef.current.material instanceof THREE.PointsMaterial) {
      smokeParticlesRef.current.material.opacity = 0.6;
      setTimeout(() => {
        if (smokeParticlesRef.current && smokeParticlesRef.current.material instanceof THREE.PointsMaterial) {
          smokeParticlesRef.current.material.opacity = 0;
        }
      }, 3500);
    }

    // Confetti celebration
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#e5c158', '#ffd700', '#9e1b32', '#f1cbd2', '#ffffff'],
    });

    // Stop mic if listening
    stopMicListening();
  };

  // Relight candles logic
  const relightCandles = () => {
    setCandlesLit(true);
    soundEngine.playChime(660, 0.2);
    flameMeshesRef.current.forEach((f) => (f.visible = true));
    flameLightsRef.current.forEach((l) => (l.intensity = 0.8));
    if (smokeParticlesRef.current && smokeParticlesRef.current.material instanceof THREE.PointsMaterial) {
      smokeParticlesRef.current.material.opacity = 0;
    }
  };

  // Microphone breath detection
  const startMicListening = async () => {
    try {
      setMicError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      micStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      setIsMicListening(true);

      const checkBlow = () => {
        if (!micStreamRef.current) return;
        analyser.getByteFrequencyData(dataArray);

        // Calculate average volume in low-mid frequencies characteristic of blowing breath
        let sum = 0;
        for (let i = 0; i < 30; i++) {
          sum += dataArray[i];
        }
        const avg = sum / 30;
        setBlowAudioLevel(Math.min(100, Math.round((avg / 160) * 100)));

        // If strong breath noise detected (> 70)
        if (avg > 72) {
          extinguishCandles();
        } else {
          requestAnimationFrame(checkBlow);
        }
      };

      requestAnimationFrame(checkBlow);
    } catch (err) {
      console.warn('Microphone permission or access error:', err);
      setMicError("Microphone non disponible. Touche le bouton pour souffler !");
      setIsMicListening(false);
    }
  };

  const stopMicListening = () => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setIsMicListening(false);
    setBlowAudioLevel(0);
  };

  useEffect(() => {
    return () => {
      stopMicListening();
    };
  }, []);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#080205]">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Title & Prompt */}
      <div className="absolute top-4 sm:top-6 inset-x-0 flex flex-col items-center pointer-events-none z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="text-[10px] sm:text-xs font-cinzel tracking-[0.35em] text-[#e5c158] uppercase">
            ✦ RITUEL D&apos;ANNIVERSAIRE ✦
          </span>
          <h2 className="text-xl sm:text-3xl font-cinzel font-black tracking-wide text-gold-gradient mt-0.5">
            LE GÂTEAU DE {config.honoreeName.toUpperCase()}
          </h2>
          <p className="font-playfair text-[#f1cbd2] text-xs sm:text-sm italic mt-1 drop-shadow-md">
            « Mon amour, fais un vœu. ❤️ »
          </p>
        </motion.div>
      </div>

      {/* Center Interactive Extinction Result Message */}
      <AnimatePresence>
        {!candlesLit && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute top-24 sm:top-28 inset-x-0 flex justify-center px-4 pointer-events-none z-20"
          >
            <div className="bordeaux-card rounded-2xl p-5 sm:p-6 text-center max-w-md gold-glow pointer-events-auto border-2 border-[#e5c158]">
              <div className="flex justify-center mb-2">
                <span className="w-10 h-10 rounded-full bg-[#e5c158]/20 flex items-center justify-center text-[#e5c158]">
                  <Sparkles className="w-5 h-5 text-[#e5c158]" />
                </span>
              </div>
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-gold-gradient">
                Vœu Envoyé Aux Étoiles ! ✨
              </h3>

              {/* Photo of Baguens with his Cake */}
              <div className="my-3 mx-auto w-36 h-48 sm:w-44 sm:h-56 rounded-xl overflow-hidden border-2 border-[#e5c158] shadow-xl">
                <img
                  src="/assets/aistudio/file_00000000a7cc81f58ed3bdb6d1d33d73_c3e85b97.png"
                  alt="Baguens Jérôme"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="font-playfair text-[#fcf8f2] text-sm sm:text-base leading-relaxed mt-2 italic">
                « {config.cakeWishNote} »
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Controls Dock */}
      <div className="absolute bottom-6 sm:bottom-8 inset-x-0 flex flex-col items-center px-4 z-20 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-md bordeaux-card rounded-2xl p-4 sm:p-5 text-center pointer-events-auto gold-glow"
        >
          {candlesLit ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2">
                {/* 1. Mic Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={isMicListening ? stopMicListening : startMicListening}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-cinzel text-xs font-semibold tracking-wider flex items-center justify-center gap-1.5 transition-all border ${
                    isMicListening
                      ? 'bg-[#e5c158] text-[#3f0912] border-[#fff1bd] shadow-lg'
                      : 'bg-[#2a0810] text-[#e5c158] border-[#e5c158]/40 hover:bg-[#3d0e19]'
                  }`}
                >
                  {isMicListening ? <Mic className="w-3.5 h-3.5 animate-pulse" /> : <MicOff className="w-3.5 h-3.5" />}
                  <span>{isMicListening ? 'Souffle fort dans le micro !' : 'Souffler au micro 🎙️'}</span>
                </motion.button>

                {/* 2. Manual Blow Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={extinguishCandles}
                  className="flex-1 py-2.5 px-3 rounded-xl font-cinzel font-bold text-xs tracking-wider uppercase text-white flex items-center justify-center gap-1.5 shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #9e1b32 0%, #5b0e1b 100%)',
                    border: '1px solid #e5c158',
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#e5c158]" />
                  <span>Souffler mes bougies 💨</span>
                </motion.button>
              </div>

              {/* Mic audio level feedback if active */}
              {isMicListening && (
                <div className="w-full bg-[#140409] rounded-full h-1.5 overflow-hidden border border-[#e5c158]/30">
                  <div
                    className="bg-gradient-to-r from-[#e5c158] to-[#9e1b32] h-full transition-all duration-75"
                    style={{ width: `${blowAudioLevel}%` }}
                  />
                </div>
              )}

              {micError && (
                <p className="text-[11px] text-[#f1cbd2]/80 font-sans">{micError}</p>
              )}
            </div>
          ) : (
            /* AFTER CANDLES ARE EXTINGUISHED */
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={relightCandles}
                className="w-full sm:w-auto py-2.5 px-4 rounded-xl font-cinzel text-xs font-semibold tracking-wider text-[#e5c158] bg-[#2a0810] border border-[#e5c158]/40 hover:bg-[#3d0e19] flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Rallumer 🕯️</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onNext}
                className="w-full sm:flex-1 py-3 px-5 rounded-xl font-cinzel font-bold text-xs tracking-widest uppercase text-white flex items-center justify-center gap-2 shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #9e1b32 0%, #5b0e1b 100%)',
                  border: '1.5px solid #e5c158',
                  boxShadow: '0 8px 24px rgba(158,27,50,0.6)',
                }}
              >
                <span>Visiter Notre Galerie 🖼️</span>
                <ArrowRight className="w-4 h-4 text-[#e5c158]" />
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
