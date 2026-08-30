// Vehicle Manager - Handles vehicle spawning and physics
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { CONFIG } from '../config/Constants.js';

export class VehicleManager {
    constructor(scene, physicsWorld) {
        this.scene = scene;
        this.physicsWorld = physicsWorld;
        this.vehicles = [];
    }

    createVehicles() {
        const carGeo = new THREE.BoxGeometry(2, 1, 4);
        const carColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xffffff, 0x000000];

        for(let i = 0; i < CONFIG.carCount; i++) {
            const color = carColors[Math.floor(Math.random() * carColors.length)];
            const mat = new THREE.MeshStandardMaterial({ 
                color: color, 
                roughness: 0.4, 
                metalness: 0.6 
            });
            const mesh = new THREE.Mesh(carGeo, mat);
            
            const x = (Math.random() - 0.5) * CONFIG.citySize;
            const z = (Math.random() - 0.5) * CONFIG.citySize;
            
            if (Math.abs(x) < 15 && Math.abs(z) < 15) continue;

            mesh.position.set(x, 1, z);
            mesh.rotation.y = Math.random() * Math.PI * 2;
            mesh.castShadow = true;
            this.scene.add(mesh);

            const body = new CANNON.Body({ 
                mass: 1500, 
                material: this.physicsWorld.getMaterials().vehicle 
            });
            body.addShape(new CANNON.Box(new CANNON.Vec3(1, 0.5, 2)));
            body.position.set(x, 1, z);
            body.angularDamping = 0.5;
            body.linearDamping = 0.1;
            this.physicsWorld.addBody(body);

            this.vehicles.push({ 
                mesh, 
                body, 
                occupied: false,
                maxSpeed: 100 + Math.random() * 100
            });
        }
    }

    update(deltaTime, input) {
        this.vehicles.forEach(vehicle => {
            if (vehicle.occupied) {
                const force = 800;
                
                if (input.isKeyDown('KeyW')) {
                    const localForce = new CANNON.Vec3(0, 0, -force);
                    vehicle.body.quaternion.vmult(localForce, localForce);
                    vehicle.body.applyForce(localForce, vehicle.body.position);
                }
                if (input.isKeyDown('KeyS')) {
                    const localForce = new CANNON.Vec3(0, 0, force/2);
                    vehicle.body.quaternion.vmult(localForce, localForce);
                    vehicle.body.applyForce(localForce, vehicle.body.position);
                }
                if (input.isKeyDown('KeyA')) {
                    vehicle.body.angularVelocity.y += 0.05;
                }
                if (input.isKeyDown('KeyD')) {
                    vehicle.body.angularVelocity.y -= 0.05;
                }
            }

            vehicle.mesh.position.copy(vehicle.body.position);
            vehicle.mesh.quaternion.copy(vehicle.body.quaternion);
        });
    }

    findNearestVehicle(position, maxDistance = 5) {
        let closest = null;
        let minDist = maxDistance;
        
        this.vehicles.forEach(v => {
            if (!v.occupied) {
                const dist = position.distanceTo(v.body.position);
                if (dist < minDist) {
                    minDist = dist;
                    closest = v;
                }
            }
        });
        
        return closest;
    }

    getVehicles() {
        return this.vehicles;
    }
}
