// After Hours - Main Game Controller
import * as THREE from 'three';
import { VehicleConfig } from './config/VehicleConfig.js';
import { VehicleManager } from './world/VehicleManager.js';
import { CharacterFactory } from './characters/CharacterFactory.js';
import { InputManager } from './engine/InputManager.js';
import { UIManager } from './ui/UIManager.js';

// --- Game State ---
const state = {
    scene: null,
    camera: null,
    renderer: null,
    clock: new THREE.Clock(),
    input: null,
    vehicleManager: null,
    characterFactory: null,
    uiManager: null,
    player: null,
    isDriving: false,
    currentVehicle: null
};

// --- Initialization ---
function init() {
    // 1. Scene Setup
    state.scene = new THREE.Scene();
    state.scene.background = new THREE.Color(0x87CEEB);
    state.scene.fog = new THREE.Fog(0x87CEEB, 20, 100);

    // 2. Camera
    state.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    state.camera.position.set(0, 5, 10);

    // 3. Renderer
    state.renderer = new THREE.WebGLRenderer({ antialias: true });
    state.renderer.setSize(window.innerWidth, window.innerHeight);
    state.renderer.shadowMap.enabled = true;
    document.body.appendChild(state.renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    state.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(50, 100, 50);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    state.scene.add(dirLight);

    // 5. Ground
    const groundGeo = new THREE.PlaneGeometry(200, 200);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    state.scene.add(ground);

    // 6. Initialize Systems
    state.input = new InputManager();
    state.uiManager = new UIManager();
    state.characterFactory = new CharacterFactory(state.scene);
    state.vehicleManager = new VehicleManager(state.scene, VehicleConfig);

    // 7. Create Player (Placeholder)
    state.player = state.characterFactory.createHero('goku'); // Default to Goku
    
    // 8. Spawn Some Vehicles
    state.vehicleManager.spawnVehicle('sedan', new THREE.Vector3(5, 0, 5));
    state.vehicleManager.spawnVehicle('taxi', new THREE.Vector3(-5, 0, 5));
    state.vehicleManager.spawnVehicle('police', new THREE.Vector3(10, 0, -5));
    state.vehicleManager.spawnVehicle('bus', new THREE.Vector3(-10, 0, -10));

    // 9. Event Listeners
    window.addEventListener('resize', onWindowResize);
    state.input.initListeners();

    // 10. Hide Loading Screen
    const loader = document.getElementById('loading');
    if(loader) loader.style.display = 'none';

    // Start Loop
    animate();
}

function onWindowResize() {
    state.camera.aspect = window.innerWidth / window.innerHeight;
    state.camera.updateProjectionMatrix();
    state.renderer.setSize(window.innerWidth, window.innerHeight);
}

function handleInput() {
    if (!state.player) return;

    if (state.isDriving && state.currentVehicle) {
        // Driving Controls
        const speed = 0.5;
        const turnSpeed = 0.04;
        
        if (state.input.keys['w'] || state.input.keys['ArrowUp']) {
            state.vehicleManager.applyForce(state.currentVehicle, speed);
        }
        if (state.input.keys['s'] || state.input.keys['ArrowDown']) {
            state.vehicleManager.applyForce(state.currentVehicle, -speed/2);
        }
        if (state.input.keys['a'] || state.input.keys['ArrowLeft']) {
            state.vehicleManager.steer(state.currentVehicle, turnSpeed);
        }
        if (state.input.keys['d'] || state.input.keys['ArrowRight']) {
            state.vehicleManager.steer(state.currentVehicle, -turnSpeed);
        }

        // Exit Vehicle
        if (state.input.keys['e']) {
            state.vehicleManager.exitVehicle(state.currentVehicle, state.player);
            state.isDriving = false;
            state.currentVehicle = null;
            state.input.keys['e'] = false; // Reset key
        }
    } else {
        // Walking Controls (Simple Placeholder)
        const moveSpeed = 0.1;
        if (state.input.keys['w'] || state.input.keys['ArrowUp']) state.player.position.z -= moveSpeed;
        if (state.input.keys['s'] || state.input.keys['ArrowDown']) state.player.position.z += moveSpeed;
        if (state.input.keys['a'] || state.input.keys['ArrowLeft']) state.player.position.x -= moveSpeed;
        if (state.input.keys['d'] || state.input.keys['ArrowRight']) state.player.position.x += moveSpeed;

        // Enter Vehicle
        if (state.input.keys['e']) {
            const closest = state.vehicleManager.findClosestVehicle(state.player.position, 3);
            if (closest) {
                state.vehicleManager.enterVehicle(closest, state.player);
                state.isDriving = true;
                state.currentVehicle = closest;
                state.input.keys['e'] = false; // Reset key
            }
        }
    }
}

function updateCamera() {
    if (state.isDriving && state.currentVehicle) {
        const offset = new THREE.Vector3(0, 5, -10);
        offset.applyMatrix4(state.currentVehicle.mesh.matrixWorld);
        state.camera.position.lerp(offset, 0.1);
        state.camera.lookAt(state.currentVehicle.mesh.position);
    } else if (state.player) {
        const offset = new THREE.Vector3(0, 3, 6);
        const targetPos = state.player.position.clone().add(offset);
        state.camera.position.lerp(targetPos, 0.1);
        state.camera.lookAt(state.player.position);
    }
}

function animate() {
    requestAnimationFrame(animate);

    const delta = state.clock.getDelta();

    handleInput();
    state.vehicleManager.update(delta);
    updateCamera();

    state.renderer.render(state.scene, state.camera);
}

// Boot
init();
