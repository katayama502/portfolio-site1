// Basic Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Fog for depth
scene.fog = new THREE.FogExp2(0x000000, 0.002);

// Particles System (Stars / Data points)
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 20; // Spread out
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x00f0ff,
    transparent: true,
    opacity: 0.8,
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Central Geometry (The "Brain/Core")
const geometry = new THREE.IcosahedronGeometry(1.5, 0); // Low poly look
const material = new THREE.MeshBasicMaterial({
    color: 0xff004c,
    wireframe: true,
    transparent: true,
    opacity: 0.3
});
const coreMesh = new THREE.Mesh(geometry, material);
scene.add(coreMesh);

// Secondary geometric layer
const geometry2 = new THREE.IcosahedronGeometry(2.5, 1);
const material2 = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    wireframe: true,
    transparent: true,
    opacity: 0.1
});
const outerMesh = new THREE.Mesh(geometry2, material2);
scene.add(outerMesh);


// Positioning
camera.position.z = 5;

// Mouse Interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// Scroll Interaction
let scrollPercent = 0;
document.addEventListener('scroll', () => {
    scrollPercent =
        (document.documentElement.scrollTop || document.body.scrollTop) /
        ((document.documentElement.scrollHeight || document.body.scrollHeight) - document.documentElement.clientHeight);
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    // Rotate Particles
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = mouseY * 0.0001;

    // Rotate Core Objects
    coreMesh.rotation.x += 0.005;
    coreMesh.rotation.y += 0.005;

    outerMesh.rotation.x -= 0.002;
    outerMesh.rotation.y -= 0.002;

    // React to Scroll
    // Move camera forward based on scroll
    // camera.position.z = 5 - (scrollPercent * 3); 

    // Or spin the whole group faster based on scroll
    scene.rotation.y += 0.001 + (scrollPercent * 0.05);

    // Mouse Parallax
    coreMesh.rotation.y += 0.05 * (targetX - coreMesh.rotation.y);
    coreMesh.rotation.x += 0.05 * (targetY - coreMesh.rotation.x);

    renderer.render(scene, camera);
}

animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
