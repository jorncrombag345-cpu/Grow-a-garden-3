import * as THREE from "three";

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// CAMERA
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("game"),
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

// LIGHT
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);

// 🌍 GROUND
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: 0x3cb371 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// 🧍 PLAYER (capsule look)
const player = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.5, 1, 4, 8),
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
player.position.y = 1;
scene.add(player);

// 🌳 tree
function tree(x, z) {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 2),
    new THREE.MeshStandardMaterial({ color: 0x8b5a2b })
  );
  trunk.position.set(x, 1, z);

  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(1),
    new THREE.MeshStandardMaterial({ color: 0x228b22 })
  );
  leaves.position.set(x, 3, z);

  scene.add(trunk, leaves);
}

tree(5, 5);
tree(-6, -4);

// 🎮 INPUT
const keys = {};
window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

// 🖱️ MOUSE CAMERA (Roblox feel)
let yaw = 0;
let pitch = 0;

document.body.addEventListener("mousemove", (e) => {
  if (document.pointerLockElement === document.body) {
    yaw -= e.movementX * 0.002;
    pitch -= e.movementY * 0.002;
    pitch = Math.max(-1.2, Math.min(1.2, pitch));
  }
});

document.body.addEventListener("click", () => {
  document.body.requestPointerLock();
});

// SPEED
const speed = 0.12;

// LOOP
function animate() {
  requestAnimationFrame(animate);

  // direction camera
  const forward = new THREE.Vector3(
    Math.sin(yaw),
    0,
    Math.cos(yaw)
  );

  const right = new THREE.Vector3(
    Math.cos(yaw),
    0,
    -Math.sin(yaw)
  );

  // movement (camera based like Roblox)
  if (keys["w"]) player.position.addScaledVector(forward, -speed);
  if (keys["s"]) player.position.addScaledVector(forward, speed);
  if (keys["a"]) player.position.addScaledVector(right, -speed);
  if (keys["d"]) player.position.addScaledVector(right, speed);

  // camera follow (3rd person)
  const camOffset = new THREE.Vector3(0, 2, 6);
  camOffset.applyAxisAngle(new THREE.Vector3(0,1,0), yaw);

  camera.position.copy(player.position).add(camOffset);
  camera.lookAt(player.position.x, player.position.y + 1, player.position.z);

  renderer.render(scene, camera);
}

animate();

// resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
