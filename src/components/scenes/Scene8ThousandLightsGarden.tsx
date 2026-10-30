import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'motion/react';
import { Sparkles, Heart, ArrowRight } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';
import { PartyConfig } from '../../types/party';
import { checkIsSoftwareGl, setupLuxuryLighting } from '../../utils/threeHelpers';

interface Scene8Props {
  config: PartyConfig;
  onNext: () => void;
}

export const Scene8ThousandLightsGarden: React.FC<Scene8Props> = ({ config, onNext }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [reachedHeart, setReachedHeart] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = checkIsSoftwareGl();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#040103');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 16);

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

    setupLuxuryLighting(scene, renderer);

    // --- PROCEDURAL NIGHT GARDEN ---
    // 1. Lush Garden Grass Ground
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x07150c,
      roughness: 0.9,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(35, 45), grassMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.z = 5;
    ground.receiveShadow = true;
    scene.add(ground);

    // 2. Romantic Winding Path of Stone & Rose Petals
    const pathMat = new THREE.MeshStandardMaterial({
      color: 0x1a080d,
      roughness: 0.7,
      metalness: 0.15,
    });
    const pathGeo = new THREE.PlaneGeometry(2.4, 28);
    const path = new THREE.Mesh(pathGeo, pathMat);
    path.rotation.x = -Math.PI / 2;
    path.position.set(0, 0.015, 4);
    path.receiveShadow = true;
    scene.add(path);

    // Scattered Rose Petals along the garden path
    const petalGeo = new THREE.CircleGeometry(0.08, 6);
    petalGeo.rotateX(-Math.PI / 2);
    const petalMatRed = new THREE.MeshStandardMaterial({ color: 0x9e1b32, roughness: 0.8 });
    const petalMatWhite = new THREE.MeshStandardMaterial({ color: 0xfcf8f2, roughness: 0.8 });

    for (let p = 0; p < 120; p++) {
      const isRed = Math.random() > 0.3;
      const petal = new THREE.Mesh(petalGeo, isRed ? petalMatRed : petalMatWhite);
      const px = (Math.random() - 0.5) * 2.1;
      const pz = -8 + Math.random() * 24;
      petal.position.set(px, 0.025, pz);
      petal.rotation.y = Math.random() * Math.PI * 2;
      scene.add(petal);
    }

    // 3. Illuminated Floral Arches along the garden path
    const archDistances = [12, 6, 0, -4];
    const archMat = new THREE.MeshStandardMaterial({ color: 0x2d121c, roughness: 0.6 });
    const fairyMat = new THREE.MeshBasicMaterial({ color: 0xffe285 });

    archDistances.forEach((zPos) => {
      const arch = new THREE.Group();
      arch.position.set(0, 0, zPos);

      // Arch tube structure
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-1.8, 0, 0),
        new THREE.Vector3(0, 3.8, 0),
        new THREE.Vector3(1.8, 0, 0)
      );
      const tubeGeo = new THREE.TubeGeometry(curve, 24, 0.08, 8, false);
      const tube = new THREE.Mesh(tubeGeo, archMat);
      arch.add(tube);

      // Fairy lights attached to arch
      for (let f = 0; f < 14; f++) {
        const point = curve.getPoint(f / 13);
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), fairyMat);
        bulb.position.copy(point);
        arch.add(bulb);
      }

      scene.add(arch);
    });

    // 4. Ground Candles & Lanterns
    const lanternLights: THREE.PointLight[] = [];
    for (let lz = 14; lz >= -6; lz -= 3) {
      [-1.4, 1.4].forEach((lx) => {
        const lanternMat = new THREE.MeshStandardMaterial({ color: 0xe5c158, metalness: 0.8, roughness: 0.2 });
        const lantern = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.45, 0.2), lanternMat);
        lantern.position.set(lx, 0.22, lz);
        scene.add(lantern);

        const pointLight = new THREE.PointLight(0xffaa44, 0.7, 4);
        pointLight.position.set(lx, 0.35, lz);
        scene.add(pointLight);
        lanternLights.push(pointLight);
      });
    }

    // 5. Grand Glowing Heart Installation at the End of the Garden
    const heartGroup = new THREE.Group();
    heartGroup.position.set(0, 2.2, -8);

    // 3D Extruded Neon Heart Shape
    const heartShape = new THREE.Shape();
    const x0 = 0, y0 = 0;
    heartShape.moveTo(x0, y0 + 0.6);
    heartShape.bezierCurveTo(x0, y0 + 1.2, x0 - 1.4, y0 + 1.8, x0 - 1.4, y0 + 0.6);
    heartShape.bezierCurveTo(x0 - 1.4, y0 - 0.2, x0, y0 - 1.0, x0, y0 - 1.4);
    heartShape.bezierCurveTo(x0, y0 - 1.0, x0 + 1.4, y0 - 0.2, x0 + 1.4, y0 + 0.6);
    heartShape.bezierCurveTo(x0 + 1.4, y0 + 1.8, x0, y0 + 1.2, x0, y0 + 0.6);

    const heartExtrudeSettings = {
      depth: 0.15,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    };
    const heartGeo = new THREE.ExtrudeGeometry(heartShape, heartExtrudeSettings);
    const heartMat = new THREE.MeshStandardMaterial({
      color: 0xff2255,
      emissive: 0xff1144,
      emissiveIntensity: 0.8,
      metalness: 0.5,
      roughness: 0.2,
    });
    const heartMesh = new THREE.Mesh(heartGeo, heartMat);
    heartMesh.scale.set(1.4, 1.4, 1.4);
    heartMesh.rotation.z = Math.PI;
    heartMesh.position.y = 0.5;
    heartGroup.add(heartMesh);

    // Radiant Point Light at the heart center
    const heartLight = new THREE.PointLight(0xff2266, 4.0, 12);
    heartLight.position.set(0, 0.4, 0.2);
    heartGroup.add(heartLight);

    scene.add(heartGroup);

    // 6. Camera Glide along the Path towards the Heart
    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth camera advance towards the heart
      if (camera.position.z > -2.5) {
        camera.position.z -= delta * 1.5;
      } else {
        if (!reachedHeart) {
          setReachedHeart(true);
        }
      }

      // Heart breathing pulse
      const pulse = 1 + Math.sin(elapsed * 2.8) * 0.06;
      heartGroup.scale.set(pulse, pulse, pulse);

      // Flickering ground lanterns
      lanternLights.forEach((light, i) => {
        light.intensity = 0.65 + Math.sin(elapsed * 8 + i * 1.2) * 0.2;
      });

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
      renderer.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-[#040103]">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Banner */}
      <div className="absolute top-4 sm:top-6 inset-x-0 flex flex-col items-center pointer-events-none z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="text-[10px] sm:text-xs font-cinzel tracking-[0.35em] text-[#e5c158] uppercase">
            ✦ PROMENADE FÉERIQUE ✦
          </span>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-cinzel font-black tracking-wide text-gold-gradient mt-0.5">
            LE JARDIN DES MILLE LUMIÈRES
          </h2>
          <p className="font-playfair text-[#f1cbd2] text-xs sm:text-sm italic mt-1 drop-shadow">
            Suis le chemin bordé de pétales et de lanternes...
          </p>
        </motion.div>
      </div>

      {/* Floating Luminous Heart Label Banner overlaying 3D Heart */}
      <div className="absolute top-1/3 inset-x-0 flex flex-col items-center pointer-events-none z-10 px-4">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2.2 }}
          className="text-center bg-[#520917]/70 backdrop-blur-sm px-6 py-2.5 rounded-full border-2 border-[#e5c158] gold-glow"
        >
          <span className="text-xl sm:text-3xl font-cinzel font-black text-rose-gold-gradient tracking-widest drop-shadow-[0_0_15px_#ff3366]">
            {config.honoreeName.toUpperCase()} ❤️
          </span>
        </motion.div>
      </div>

      {/* Bottom CTA Card */}
      <div className="absolute bottom-6 sm:bottom-10 inset-x-0 flex justify-center px-4 z-20 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-sm bordeaux-card rounded-2xl p-4 text-center pointer-events-auto gold-glow"
        >
          <p className="font-playfair text-[#fcf8f2] text-xs sm:text-sm mb-3">
            Au bout de la nuit magique, un dernier secret t&apos;attend...
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
            className="w-full py-3 px-6 rounded-xl font-cinzel font-bold text-xs sm:text-sm tracking-widest uppercase text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #c41e3a 0%, #7d1224 100%)',
              border: '1.5px solid #e5c158',
              boxShadow: '0 8px 25px rgba(196,30,58,0.7)',
            }}
          >
            <Sparkles className="w-4 h-4 text-[#e5c158]" />
            <span>Découvrir mon dernier secret</span>
            <ArrowRight className="w-4 h-4 text-[#e5c158]" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};
