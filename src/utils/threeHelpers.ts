import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * Detect software WebGL from GPU renderer string (SwiftShader, llvmpipe, WARP)
 */
export const checkIsSoftwareGl = (): boolean => {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
};

/**
 * Create standard luxury materials with procedural textures
 */
export const createLuxuryMaterials = (isSoftwareGl: boolean) => {
  // 1. Polished Champagne Gold
  const goldMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#e5c158'),
    metalness: 0.9,
    roughness: 0.18,
  });

  // 2. Rich Bordeaux Velvet
  const bordeauxMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#670d1c'),
    roughness: 0.85,
    metalness: 0.1,
  });

  // 3. Cream Marble / White Fondant
  const creamMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#faf5ec'),
    roughness: 0.35,
    metalness: 0.05,
  });

  // 4. Rose Gold
  const roseGoldMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#d98c9e'),
    metalness: 0.85,
    roughness: 0.22,
  });

  // 5. Crystal / Glass
  const crystalMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#ffffff'),
    metalness: 0.0,
    roughness: 0.08,
    transmission: isSoftwareGl ? 0 : 0.9,
    transparent: true,
    opacity: isSoftwareGl ? 0.4 : 1.0,
    ior: 1.52,
  });

  return {
    gold: goldMaterial,
    bordeaux: bordeauxMaterial,
    cream: creamMaterial,
    roseGold: roseGoldMaterial,
    crystal: crystalMaterial,
  };
};

/**
 * Setup standard luxury lighting rig with warm key light, cool hemisphere fill, and RoomEnvironment
 */
export const setupLuxuryLighting = (scene: THREE.Scene, renderer: THREE.WebGLRenderer) => {
  // 1. Environment reflection
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
  pmremGenerator.dispose();

  // 2. Warm Key Light
  const keyLight = new THREE.DirectionalLight('#fff1bd', 2.2);
  keyLight.position.set(5, 10, 7);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.bias = -0.0005;
  scene.add(keyLight);

  // 3. Cool fill HemisphereLight
  const hemiLight = new THREE.HemisphereLight('#fce4ec', '#14060d', 1.0);
  scene.add(hemiLight);

  // 4. Subtle golden ambient light for luxury warmth
  const ambientLight = new THREE.AmbientLight('#ffeedd', 0.5);
  scene.add(ambientLight);

  // 5. Fog matching night sky
  scene.fog = new THREE.FogExp2('#080205', 0.035);

  return { keyLight, hemiLight, ambientLight };
};

/**
 * Create a procedural 3D balloon with realistic knot and string
 */
export const createBalloon = (color: string, radius = 0.5): THREE.Group => {
  const group = new THREE.Group();

  // Balloon body (squashed sphere)
  const geo = new THREE.SphereGeometry(radius, 24, 24);
  geo.scale(1, 1.25, 1);
  const mat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    metalness: color.includes('e5c') || color.includes('ffd') ? 0.8 : 0.2,
    roughness: 0.25,
  });
  const body = new THREE.Mesh(geo, mat);
  body.castShadow = true;
  group.add(body);

  // Balloon knot
  const knotGeo = new THREE.ConeGeometry(radius * 0.15, radius * 0.2, 12);
  knotGeo.rotateX(Math.PI);
  const knot = new THREE.Mesh(knotGeo, mat);
  knot.position.y = -radius * 1.2;
  group.add(knot);

  // Hanging ribbon string
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -radius * 1.25, 0),
    new THREE.Vector3(0.04, -radius * 1.7, 0.02),
    new THREE.Vector3(-0.03, -radius * 2.2, -0.02),
    new THREE.Vector3(0.02, -radius * 2.7, 0.01),
  ]);
  const stringGeo = new THREE.TubeGeometry(curve, 16, 0.008, 6, false);
  const stringMat = new THREE.MeshBasicMaterial({ color: 0xfff0c2 });
  const stringMesh = new THREE.Mesh(stringGeo, stringMat);
  group.add(stringMesh);

  return group;
};

/**
 * Create procedural flame texture for candles
 */
export const createFlameTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(64, 180, 5, 64, 140, 60);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.2, 'rgba(255, 220, 100, 0.95)');
  grad.addColorStop(0.5, 'rgba(255, 120, 30, 0.8)');
  grad.addColorStop(0.8, 'rgba(200, 30, 10, 0.4)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(64, 40);
  ctx.bezierCurveTo(90, 110, 100, 160, 85, 200);
  ctx.bezierCurveTo(75, 230, 53, 230, 43, 200);
  ctx.bezierCurveTo(28, 160, 38, 110, 64, 40);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};
