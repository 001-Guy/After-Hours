// Physics World - Cannon-es wrapper
import * as CANNON from 'cannon-es';

export class PhysicsWorld {
    constructor() {
        this.world = new CANNON.World();
        this.world.gravity.set(0, -20, 0);
        this.world.broadphase = new CANNON.SAPBroadphase(this.world);
        
        this.groundMat = new CANNON.Material();
        this.playerMat = new CANNON.Material();
        this.vehicleMat = new CANNON.Material();

        const playerGroundContact = new CANNON.ContactMaterial(this.playerMat, this.groundMat, { 
            friction: 0.0, 
            restitution: 0.0 
        });
        this.world.addContactMaterial(playerGroundContact);
    }

    getWorld() {
        return this.world;
    }

    getMaterials() {
        return {
            ground: this.groundMat,
            player: this.playerMat,
            vehicle: this.vehicleMat
        };
    }

    step(deltaTime) {
        this.world.step(1/60, deltaTime, 3);
    }
}
