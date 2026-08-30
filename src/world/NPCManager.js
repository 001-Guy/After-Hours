// NPC Manager - Handles civilian and police AI
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { CONFIG } from '../config/Constants.js';

export class NPCManager {
    constructor(scene, physicsWorld) {
        this.scene = scene;
        this.physicsWorld = physicsWorld;
        this.npcs = [];
    }

    createNPCs() {
        const geo = new THREE.CapsuleGeometry(0.5, 1.8, 4, 8);
        
        for(let i = 0; i < CONFIG.npcCount; i++) {
            const mat = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
            const mesh = new THREE.Mesh(geo, mat);
            
            const x = (Math.random() - 0.5) * CONFIG.citySize;
            const z = (Math.random() - 0.5) * CONFIG.citySize;
            
            mesh.position.set(x, 2, z);
            mesh.castShadow = true;
            this.scene.add(mesh);

            const body = new CANNON.Body({ mass: 60, material: this.physicsWorld.getMaterials().player });
            body.addShape(new CANNON.Sphere(0.5), new CANNON.Vec3(0, 0.9, 0));
            body.position.set(x, 2, z);
            body.linearDamping = 0.9;
            body.angularDamping = 0.9;
            this.physicsWorld.addBody(body);

            this.npcs.push({ 
                mesh, 
                body, 
                type: 'civilian', 
                state: 'wander', 
                timer: Math.random() * 3 
            });
        }
    }

    update(deltaTime, playerPosition) {
        this.npcs.forEach(npc => {
            npc.mesh.position.copy(npc.body.position);
            
            if (npc.type === 'police') {
                const dir = playerPosition.clone().sub(npc.body.position);
                dir.y = 0;
                const dist = dir.length();
                if (dist > 2) {
                    dir.normalize();
                    npc.body.velocity.x = dir.x * 6;
                    npc.body.velocity.z = dir.z * 6;
                    npc.mesh.lookAt(playerPosition.x, npc.mesh.position.y, playerPosition.z);
                }
            } else {
                npc.timer -= deltaTime;
                if (npc.timer <= 0) {
                    npc.timer = 2 + Math.random() * 3;
                    const angle = Math.random() * Math.PI * 2;
                    npc.body.velocity.x = Math.cos(angle) * 2;
                    npc.body.velocity.z = Math.sin(angle) * 2;
                }
                npc.mesh.lookAt(
                    npc.body.position.x + npc.body.velocity.x, 
                    npc.mesh.position.y, 
                    npc.body.position.z + npc.body.velocity.z
                );
            }
        });
    }

    spawnPolice() {
        let spawned = 0;
        this.npcs.forEach(npc => {
            if (npc.type === 'civilian' && Math.random() > 0.7 && spawned < 3) {
                npc.type = 'police';
                npc.mesh.material.color.setHex(0x0000ff);
                spawned++;
            }
        });
        return spawned > 0;
    }

    getNPCs() {
        return this.npcs;
    }
}
