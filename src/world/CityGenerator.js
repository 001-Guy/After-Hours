// City Generator - Procedural city creation
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { CONFIG } from '../config/Constants.js';

export class CityGenerator {
    constructor(scene, physicsWorld) {
        this.scene = scene;
        this.physicsWorld = physicsWorld;
        this.buildings = [];
    }

    generate() {
        this.createGround();
        this.createBuildings();
        this.createRoads();
    }

    createGround() {
        const geo = new THREE.PlaneGeometry(CONFIG.citySize * 2, CONFIG.citySize * 2);
        const mat = new THREE.MeshStandardMaterial({ 
            color: CONFIG.colors.ground, 
            roughness: 0.8,
            metalness: 0.2
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = -Math.PI / 2;
        mesh.receiveShadow = true;
        this.scene.add(mesh);

        const groundBody = new CANNON.Body({ mass: 0 });
        groundBody.addShape(new CANNON.Plane());
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        this.physicsWorld.addBody(groundBody);
    }

    createBuildings() {
        const boxGeo = new THREE.BoxGeometry(1, 1, 1);
        
        for (let i = 0; i < CONFIG.buildingCount; i++) {
            const w = 10 + Math.random() * 20;
            const d = 10 + Math.random() * 20;
            const h = 20 + Math.random() * 60;
            
            const x = (Math.random() - 0.5) * CONFIG.citySize;
            const z = (Math.random() - 0.5) * CONFIG.citySize;

            if (Math.abs(x) < 30 && Math.abs(z) < 30) continue;

            const color = CONFIG.colors.building[Math.floor(Math.random() * CONFIG.colors.building.length)];
            const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.7 });
            
            const mesh = new THREE.Mesh(boxGeo, mat);
            mesh.position.set(x, h/2, z);
            mesh.scale.set(w, h, d);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            
            this.scene.add(mesh);
            this.buildings.push({ mesh, w, h, d, x, z });

            const body = new CANNON.Body({ mass: 0 });
            body.addShape(new CANNON.Box(new CANNON.Vec3(w/2, h/2, d/2)));
            body.position.set(x, h/2, z);
            this.physicsWorld.addBody(body);
        }
    }

    createRoads() {
        const roadMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
        const roadGeo = new THREE.PlaneGeometry(CONFIG.citySize, 20);
        
        const roadH = new THREE.Mesh(roadGeo, roadMat);
        roadH.rotation.x = -Math.PI/2;
        roadH.position.y = 0.05;
        this.scene.add(roadH);

        const roadV = new THREE.Mesh(roadGeo, roadMat);
        roadV.rotation.x = -Math.PI/2;
        roadV.rotation.z = Math.PI/2;
        roadV.position.y = 0.05;
        this.scene.add(roadV);
    }

    getBuildings() {
        return this.buildings;
    }
}
