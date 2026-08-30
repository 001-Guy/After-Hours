// After Hours - Main Game Controller
import * as THREE from 'three';
import { CONFIG, CHARACTERS } from './config/Constants.js';
import { InputManager } from './engine/InputManager.js';
import { PhysicsWorld } from './engine/PhysicsWorld.js';
import { CharacterController } from './characters/CharacterController.js';
import { CityGenerator } from './world/CityGenerator.js';
import { NPCManager } from './world/NPCManager.js';
import { VehicleManager } from './world/VehicleManager.js';
import { UIManager } from './ui/UIManager.js';
import { Minimap } from './ui/Minimap.js';

class Game {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = null;
        
        this.input = null;
        this.physics = null;
        this.player = null;
        this.city = null;
        this.npcs = null;
        this.vehicles = null;
        this.ui = null;
        this.minimap = null;
        
        this.isDriving = false;
        this.currentVehicle = null;
        this.wantedLevel = 0;
        
        this.init();
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(CONFIG.colors.sky);
        this.scene.fog = new THREE.Fog(CONFIG.colors.sky, 50, CONFIG.renderDistance);

        // Camera
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 10, 20);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: false, 
            powerPreference: "low-power" 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('canvas-container').appendChild(this.renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(100, 200, 100);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        dirLight.shadow.camera.near = 0.5;
        dirLight.shadow.camera.far = 500;
        dirLight.shadow.camera.left = -100;
        dirLight.shadow.camera.right = 100;
        dirLight.shadow.camera.top = 100;
        dirLight.shadow.camera.bottom = -100;
        this.scene.add(dirLight);

        // Systems
        this.physics = new PhysicsWorld();
        this.input = new InputManager();
        
        // World Generation
        this.city = new CityGenerator(this.scene, this.physics.getWorld());
        this.city.generate();
        
        this.npcs = new NPCManager(this.scene, this.physics);
        this.npcs.createNPCs();
        
        this.vehicles = new VehicleManager(this.scene, this.physics);
        this.vehicles.createVehicles();

        // Player
        this.createPlayer(0);

        // UI
        this.ui = new UIManager();
        this.minimap = new Minimap();

        // Event Listeners
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('mousedown', (e) => this.onMouseDown(e));

        // Hide loading screen
        setTimeout(() => {
            const loading = document.getElementById('loading');
            if (loading) {
                loading.style.opacity = 0;
                setTimeout(() => loading.remove(), 1000);
            }
        }, 1000);

        this.clock = new THREE.Clock();
        this.animate();
    }

    createPlayer(charIndex) {
        if (this.player) {
            this.player.destroy();
        }

        const charData = CHARACTERS[charIndex];
        const materials = this.physics.getMaterials();
        
        this.player = new CharacterController(this.scene, this.physics.getWorld(), charData, materials);
        this.ui.setCharacterIndex(charIndex);
        this.ui.showMessage(`Switched to ${charData.name}`);
    }

    onKeyDown(e) {
        // Character switch
        if (e.code === 'Tab') {
            e.preventDefault();
            const next = (this.ui.getCharacterIndex() + 1) % CHARACTERS.length;
            this.createPlayer(next);
        }

        // Abilities
        if (e.key >= '1' && e.key <= '4') {
            this.triggerAbility(parseInt(e.key) - 1);
        }

        // Vehicle entry
        if (e.code === 'KeyE') {
            this.tryEnterVehicle();
        }
    }

    onMouseDown(e) {
        if (this.isDriving) return;
        
        if (e.button === 0) {
            this.performAttack();
        } else if (e.button === 2) {
            this.performDash();
        }
    }

    tryEnterVehicle() {
        if (this.isDriving && this.currentVehicle) {
            // Exit vehicle
            this.isDriving = false;
            this.player.body.position.copy(this.currentVehicle.body.position);
            this.player.body.position.x += 3;
            this.player.body.velocity.set(0, 0, 0);
            this.scene.add(this.player.mesh);
            this.currentVehicle.occupied = false;
            this.currentVehicle = null;
        } else {
            // Enter nearest vehicle
            const vehicle = this.vehicles.findNearestVehicle(this.player.body.position);
            if (vehicle) {
                this.isDriving = true;
                this.currentVehicle = vehicle;
                vehicle.occupied = true;
                this.scene.remove(this.player.mesh);
                this.ui.showMessage("Vehicle Entered");
            }
        }
    }

    performAttack() {
        const pos = this.player.mesh.position.clone();
        const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
        direction.y = 0;
        direction.normalize();

        // Visual effect
        const punchGeo = new THREE.SphereGeometry(0.5, 4, 4);
        const punchMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const punch = new THREE.Mesh(punchGeo, punchMat);
        punch.position.copy(pos);
        punch.position.y += 1;
        this.scene.add(punch);
        
        let speed = 20;
        const animatePunch = () => {
            punch.position.addScaledVector(direction, speed * 0.016);
            speed *= 0.9;
            if(speed < 1) this.scene.remove(punch);
            else requestAnimationFrame(animatePunch);
        };
        animatePunch();

        // Hit detection
        const npcList = this.npcs.getNPCs();
        npcList.forEach(npc => {
            if (npc.mesh.position.distanceTo(pos) < 4) {
                const pushDir = npc.mesh.position.clone().sub(pos).normalize();
                npc.body.velocity.x += pushDir.x * 10;
                npc.body.velocity.z += pushDir.z * 10;
                this.increaseWantedLevel(0.1);
            }
        });
    }

    performDash() {
        if (this.player.state.energy < 10) return;
        this.player.state.energy -= 10;
        
        const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
        dir.y = 0;
        dir.normalize();
        
        this.player.body.velocity.x += dir.x * 15;
        this.player.body.velocity.z += dir.z * 15;
        
        const aura = this.player.mesh.children.find(c => c.name === "aura");
        if(aura) {
            aura.scale.set(1.5, 1.5, 1.5);
            setTimeout(() => aura.scale.set(1,1,1), 200);
        }
    }

    triggerAbility(index) {
        const result = this.player.triggerAbility(index);
        if (!result) {
            const now = Date.now();
            if (now < this.player.abilityCooldowns[index]) {
                this.ui.showMessage("Ability on Cooldown!");
            } else if (this.player.state.energy < 20) {
                this.ui.showMessage("Not enough Energy!");
            }
            return;
        }

        this.ui.showMessage(`${CHARACTERS[this.ui.getCharacterIndex()].name} used ${result.name}!`);

        // Ability effect
        const pos = this.player.mesh.position.clone();
        const charData = CHARACTERS[this.ui.getCharacterIndex()];
        
        if (index === 0) {
            const expGeo = new THREE.SphereGeometry(1, 8, 8);
            const expMat = new THREE.MeshBasicMaterial({ 
                color: charData.color, 
                transparent: true, 
                opacity: 0.8 
            });
            const exp = new THREE.Mesh(expGeo, expMat);
            exp.position.copy(pos);
            this.scene.add(exp);
            
            let s = 1;
            const anim = () => {
                s += 0.5;
                exp.scale.set(s,s,s);
                exp.material.opacity -= 0.05;
                if(exp.material.opacity <= 0) this.scene.remove(exp);
                else requestAnimationFrame(anim);
            };
            anim();

            const npcList = this.npcs.getNPCs();
            npcList.forEach(n => {
                if(n.mesh.position.distanceTo(pos) < 10) {
                    const dir = n.mesh.position.clone().sub(pos).normalize();
                    n.body.velocity.addScaledVector(dir, 20);
                }
            });
            this.increaseWantedLevel(0.5);
        }
    }

    increaseWantedLevel(amount) {
        this.wantedLevel = Math.min(5, this.wantedLevel + amount);
        this.ui.updateWantedLevel(this.wantedLevel);
        
        if (this.wantedLevel > 0 && Math.random() < 0.01) {
            this.npcs.spawnPolice();
            this.ui.showMessage("Police are searching for you!");
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const dt = Math.min(this.clock.getDelta(), 0.1);
        const time = this.clock.getElapsedTime();

        // Physics step
        this.physics.step(dt);

        if (!this.isDriving) {
            // Update player
            this.player.update(dt, this.input, this.camera);

            // Camera follow
            const targetPos = this.player.mesh.position.clone();
            targetPos.y += 3;
            const mousePos = this.input.getMousePosition();
            const offset = new THREE.Vector3(0, 2, -8);
            offset.applyAxisAngle(new THREE.Vector3(1,0,0), mousePos.y * 0.5);
            offset.applyAxisAngle(new THREE.Vector3(0,1,0), -mousePos.x * 2);
            
            this.camera.position.lerp(targetPos.clone().add(offset), 0.1);
            this.camera.lookAt(targetPos);
        } else {
            // Driving
            this.vehicles.update(dt, this.input);
            
            const carPos = this.currentVehicle.mesh.position.clone();
            const carDir = new THREE.Vector3(0, 0, 1).applyQuaternion(this.currentVehicle.mesh.quaternion);
            this.camera.position.copy(carPos).add(new THREE.Vector3(0, 5, -10).applyQuaternion(this.currentVehicle.mesh.quaternion));
            this.camera.lookAt(carPos);
        }

        // Update NPCs
        const playerPos = this.isDriving ? 
            this.currentVehicle.body.position : 
            this.player.body.position;
        this.npcs.update(dt, new THREE.Vector3(playerPos.x, 0, playerPos.z));

        // Update UI
        const charData = CHARACTERS[this.ui.getCharacterIndex()];
        this.ui.updateHUD(charData, this.player.state);
        this.ui.updateCooldowns(this.player.abilityCooldowns);
        
        // Update minimap
        this.minimap.render(
            new THREE.Vector3(playerPos.x, 0, playerPos.z),
            this.npcs.getNPCs(),
            this.vehicles.getVehicles()
        );

        // Render
        this.renderer.render(this.scene, this.camera);
    }
}

// Start game when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    new Game();
});
