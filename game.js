import * as THREE from "three";

/* =========================
   SCENE
========================= */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

/* =========================
   CAMERA
========================= */
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

/* =========================
   RENDERER
========================= */
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("game"),
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

/* =========================
   LIGHT
========================= */
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(10, 20, 10);
scene.add(sun);

/* =========================
   GROUND
========================= */
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ color: 0x3cb371 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

/* =========================
   PLAYER (3D character)
========================= */
const player = new THREE.Group();

// body
const body = new THREE.Mesh(
  new THREE.BoxGeometry(0.6, 0.8, 0.3),
  new THREE.MeshStandardMaterial({ color: 0x2f80ed })
);
body.position.y = 1;
player.add(body);

// head
const head = new THREE.Mesh(
  new THREE.SphereGeometry(0.25),
  new THREE.MeshStandardMaterial({ color: 0xffcc99 })
);
head.position.y = 1.6;
player.add(head);

// legs
const legGeo = new THREE.BoxGeometry(0.2, 0.5, 0.2);
const legMat = new THREE.MeshStandardMaterial({ color: 0x222 });

const leg1 = new THREE.Mesh(legGeo, legMat);
const leg2 = new THREE.Mesh(legGeo, legMat);

leg1.position.set(-0.15, 0.5, 0);
leg2.position.set(0.15, 0.5, 0);

player.add(leg1);
player.add(leg2);

scene.add(player);

/* =========================
   TREES
========================= */
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

  scene.add(trunk);
  scene.add(leaves);
}

// random trees
for (let i = 0; i < 15; i++) {
  tree(
    (Math.random() - 0.5) * 100,
    (Math.random() - 0.5) * 100
  );
}

/* =========================
   INPUT (PC)
========================= */
const keys = {};

window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

/* =========================
   MOUSE CAMERA (Roblox style)
========================= */
let yaw = 0;

document.addEventListener("mousemove", (e) => {
  if (document.pointerLockElement === document.body) {
    yaw -= e.movementX * 0.002;
  }
});

document.body.addEventListener("click", () => {
  document.body.requestPointerLock();
});

/* =========================
   MOBILE JOYSTICK
========================= */
let moveX = 0;
let moveY = 0;

const joystick = document.getElementById("joystick");

joystick.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  const rect = joystick.getBoundingClientRect();

  moveX = (t.clientX - (rect.left + rect.width / 2)) / 50;
  moveY = (t.clientY - (rect.top + rect.height / 2)) / 50;
});

joystick.addEventListener("touchend", () => {
  moveX = 0;
  moveY = 0;
});

/* =========================
   MOVEMENT
========================= */
const speed = 0.12;

/* =========================
   LOOP
========================= */
function animate() {
  requestAnimationFrame(animate);

  const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
  const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));

  // PC movement
  if (keys["w"]) player.position.addScaledVector(forward, -speed);
  if (keys["s"]) player.position.addScaledVector(forward, speed);
  if (keys["a"]) player.position.addScaledVector(right, -speed);
  if (keys["d"]) player.position.addScaledVector(right, speed);

  // Mobile movement
  player.position.x += moveX * speed;
  player.position.z += moveY * speed;

  // camera follow (Roblox third person)
  const offset = new THREE.Vector3(0, 2, 5);
  offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);

  camera.position.copy(player.position).add(offset);
  camera.lookAt(player.position.x, player.position.y + 1, player.position.z);

  renderer.render(scene, camera);
}

animate();

/* =========================
   RESIZE
========================= */
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
