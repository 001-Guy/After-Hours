// Character Controller - Manages player state and abilities
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class CharacterController {
    constructor(scene, physicsWorld, charData, materials) {
        this.scene = scene;
        this.physicsWorld = physicsWorld;
        this.charData = charData;
        this.materials = materials;
        
        this.mesh = null;
        this.body = null;
        this.state = {
            health: charData.stats.health,
            energy: 100,
            maxHealth: charData.stats.health,
            grounded: false
        };
        
        this.abilityCooldowns = [0, 0, 0, 0];
        
        this.create();
    }

    create() {
        // Create visual mesh
        const bodyGeo = new THREE.CapsuleGeometry(0.4, 1.2, 4, 8);
        const bodyMat = new THREE.MeshStandardMaterial({ color: this.charData.color });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.8;
        body.castShadow = true;

        const headGeo = new THREE.SphereGeometry(0.35, 8, 8);
        const headMat = new THREE.MeshStandardMaterial({ color: 0xffccaa });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 1.6;
        head.castShadow = true;

        const hairGeo = new THREE.BoxGeometry(0.5, 0.2, 0.5);
        const hairMat = new THREE.MeshStandardMaterial({ color: this.charData.hair });
        const hair = new THREE.Mesh(hairGeo, hairMat);
        hair.position.y = 1.75;
        hair.scale.set(1.2, 1, 1.2);

        const eyeGeo = new THREE.SphereGeometry(0.08, 4, 4);
        const eyeMat = new THREE.MeshBasicMaterial({ color: this.charData.eyes });
        const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
        eyeL.position.set(-0.15, 1.65, 0.3);
        const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
        eyeR.position.set(0.15, 1.65, 0.3);

        const auraGeo = new THREE.SphereGeometry(1.5, 8, 8);
        const auraMat = new THREE.MeshBasicMaterial({ 
            color: this.charData.color, 
            transparent: true, 
            opacity: 0.1, 
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
        });
        const aura = new THREE.Mesh(auraGeo, auraMat);
        aura.name = "aura";

        this.mesh = new THREE.Group();
        this.mesh.add(body, head, hair, eyeL, eyeR, aura);
        this.scene.add(this.mesh);

        // Create physics body
        const shape = new CANNON.Sphere(0.5);
        this.body = new CANNON.Body({ mass: 70, material: this.materials.player });
        this.body.addShape(shape, new CANNON.Vec3(0, 0.8, 0));
        this.body.position.set(0, 5, 0);
        this.body.linearDamping = 0.9;
        this.body.angularDamping = 1.0;
        this.body.fixedRotation = true;
        this.physicsWorld.addBody(this.body);
    }

    update(deltaTime, input, camera) {
        if (!this.mesh || !this.body) return;

        const speed = this.charData.stats.speed;
        const moveDir = new THREE.Vector3(0, 0, 0);

        const camDir = new THREE.Vector3();
        camera.getWorldDirection(camDir);
        camDir.y = 0;
        camDir.normalize();
        const camRight = new THREE.Vector3().crossVectors(camDir, new THREE.Vector3(0, 1, 0));

        if (input.isKeyDown('KeyW') || input.isKeyDown('ArrowUp')) moveDir.add(camDir);
        if (input.isKeyDown('KeyS') || input.isKeyDown('ArrowDown')) moveDir.sub(camDir);
        if (input.isKeyDown('KeyA') || input.isKeyDown('ArrowLeft')) moveDir.sub(camRight);
        if (input.isKeyDown('KeyD') || input.isKeyDown('ArrowRight')) moveDir.add(camRight);

        if (moveDir.length() > 0) {
            moveDir.normalize();
            const sprint = input.isKeyDown('ShiftLeft') ? 1.5 : 1.0;
            this.body.velocity.x = moveDir.x * speed * sprint;
            this.body.velocity.z = moveDir.z * speed * sprint;
            
            const angle = Math.atan2(moveDir.x, moveDir.z);
            this.mesh.rotation.y = angle;
        } else {
            this.body.velocity.x *= 0.8;
            this.body.velocity.z *= 0.8;
        }

        if ((input.isKeyDown('Space')) && this.state.grounded) {
            this.body.velocity.y = this.charData.stats.jump;
            this.state.grounded = false;
        }

        this.mesh.position.copy(this.body.position);
        this.mesh.position.y -= 0.8;

        const time = performance.now() / 1000;
        if (moveDir.length() > 0.1) {
            this.mesh.position.y += Math.sin(time * 15) * 0.05;
        }

        if (this.state.energy < 100) this.state.energy += 0.1;

        if (this.body.position.y < 1.5 && this.body.velocity.y < 1) {
            this.state.grounded = true;
            this.body.position.y = 1.5;
            this.body.velocity.y = 0;
        }
    }

    triggerAbility(index, targetManager) {
        const now = Date.now();
        if (now < this.abilityCooldowns[index]) return false;
        if (this.state.energy < 20) return false;

        this.state.energy -= 20;
        this.abilityCooldowns[index] = now + 5000;

        const abilityName = this.charData.abilities[index];
        return { success: true, name: abilityName, index };
    }

    destroy() {
        if (this.mesh) {
            this.scene.remove(this.mesh);
            this.mesh.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        }
        if (this.body) {
            this.physicsWorld.removeBody(this.body);
        }
    }
}
