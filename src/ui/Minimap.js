// Minimap - Real-time minimap rendering
import { CONFIG } from '../config/Constants.js';

export class Minimap {
    constructor() {
        this.canvas = document.getElementById('minimap-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.scale = 150 / CONFIG.citySize;
        this.centerX = 75;
        this.centerY = 75;
    }

    render(playerPosition, npcs, vehicles) {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, 150, 150);
        
        // Background
        this.ctx.fillStyle = '#222';
        this.ctx.fillRect(0, 0, 150, 150);

        const px = this.centerX + playerPosition.x * this.scale;
        const pz = this.centerY + playerPosition.z * this.scale;

        // Draw Player
        this.ctx.fillStyle = '#0f0';
        this.ctx.beginPath();
        this.ctx.arc(px, pz, 4, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw Police
        this.ctx.fillStyle = '#f00';
        if (npcs) {
            npcs.forEach(npc => {
                if (npc.type === 'police') {
                    const nx = this.centerX + npc.body.position.x * this.scale;
                    const nz = this.centerY + npc.body.position.z * this.scale;
                    this.ctx.fillRect(nx - 2, nz - 2, 4, 4);
                }
            });
        }

        // Draw Vehicles
        this.ctx.fillStyle = '#ff0';
        if (vehicles) {
            vehicles.forEach(v => {
                const vx = this.centerX + v.body.position.x * this.scale;
                const vz = this.centerY + v.body.position.z * this.scale;
                this.ctx.fillRect(vx - 3, vz - 3, 6, 6);
            });
        }
    }
}
