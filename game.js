import * as THREE from "three";

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("game")
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Licht
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);

// 🌍 GROND (MAP)
const groundGeometry = new THREE.PlaneGeometry(50, 50);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x3cb371 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// 🙂 SPELER
const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
const playerMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.y = 1;
scene.add(player);

// 🌳 simpele boom
function createTree(x, z) {
    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 2),
        new THREE.MeshStandardMaterial({ color: 0x8b4513 })
    );

    const leaves = new THREE.Mesh(
        new THREE.SphereGeometry(1),
        new THREE.MeshStandardMaterial({ color: 0x228b22 })
    );

    trunk.position.set(x, 1, z);
    leaves.position.set(x, 3, z);

    scene.add(trunk);
    scene.add(leaves);
}

// paar bomen
createTree(5, 5);
createTree(-5, -3);
createTree(8, -6);

// 🎮 controls
const keys = {};

window.addEventListener("keydown", (e) => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", (e) => keys[e.key.toLowerCase()] = false);

// snelheid
const speed = 0.15;

// 🚶 game loop
function animate() {
    requestAnimationFrame(animate);

    // movement
    if (keys["w"]) player.position.z -= speed;
    if (keys["s"]) player.position.z += speed;
    if (keys["a"]) player.position.x -= speed;
    if (keys["d"]) player.position.x += speed;

    // camera volgt speler
    camera.position.x = player.position.x;
    camera.position.z = player.position.z + 5;
    camera.position.y = player.position.y + 5;
    camera.lookAt(player.position);

    renderer.render(scene, camera);
}

animate();

// resize
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
