// Character Factory - Creates anime character models
import * as THREE from 'three';

export class CharacterFactory {
    static createCharacterMesh(charData) {
        const group = new THREE.Group();

        // Body
        const bodyGeo = new THREE.CapsuleGeometry(0.4, 1.2, 4, 8);
        const bodyMat = new THREE.MeshStandardMaterial({ color: charData.color });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.8;
        body.castShadow = true;
        group.add(body);

        // Head
        const headGeo = new THREE.SphereGeometry(0.35, 8, 8);
        const headMat = new THREE.MeshStandardMaterial({ color: 0xffccaa });
        const head = new THREE.Mesh(headGeo, headMat);
        head.position.y = 1.6;
        head.castShadow = true;
        group.add(head);

        // Hair
        const hairGeo = new THREE.BoxGeometry(0.5, 0.2, 0.5);
        const hairMat = new THREE.MeshStandardMaterial({ color: charData.hair });
        const hair = new THREE.Mesh(hairGeo, hairMat);
        hair.position.y = 1.75;
        hair.scale.set(1.2, 1, 1.2);
        group.add(hair);

        // Eyes (Glowing)
        const eyeGeo = new THREE.SphereGeometry(0.08, 4, 4);
        const eyeMat = new THREE.MeshBasicMaterial({ color: charData.eyes });
        const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
        eyeL.position.set(-0.15, 1.65, 0.3);
        const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
        eyeR.position.set(0.15, 1.65, 0.3);
        group.add(eyeL);
        group.add(eyeR);

        // Aura Effect
        const auraGeo = new THREE.SphereGeometry(1.5, 8, 8);
        const auraMat = new THREE.MeshBasicMaterial({ 
            color: charData.color, 
            transparent: true, 
            opacity: 0.1, 
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
        });
        const aura = new THREE.Mesh(auraGeo, auraMat);
        aura.name = "aura";
        group.add(aura);

        return group;
    }

    static createCharacterBody(charData, materials) {
        const shape = new CANNON.Sphere(0.5);
        const body = new CANNON.Body({ mass: 70, material: materials.player });
        body.addShape(shape, new CANNON.Vec3(0, 0.8, 0));
        body.position.set(0, 5, 0);
        body.linearDamping = 0.9;
        body.angularDamping = 1.0;
        body.fixedRotation = true;
        
        return body;
    }
}
