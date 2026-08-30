// UI Manager - Handles all UI elements
import { CHARACTERS } from '../config/Constants.js';

export class UIManager {
    constructor() {
        this.currentCharIndex = 0;
        this.wantedLevel = 0;
        this.money = 0;
        this.abilityCooldowns = [0, 0, 0, 0];
        
        this.init();
    }

    init() {
        this.createCharacterSwitcher();
        this.createAbilityBar();
    }

    createCharacterSwitcher() {
        const container = document.getElementById('character-switcher');
        if (!container) return;
        
        container.innerHTML = '';
        CHARACTERS.forEach((c, i) => {
            const div = document.createElement('div');
            div.className = 'char-icon';
            div.style.backgroundColor = '#' + c.color.toString(16).padStart(6, '0');
            div.title = c.name;
            if(i === 0) div.classList.add('active');
            container.appendChild(div);
        });
    }

    createAbilityBar() {
        this.updateAbilityBar();
    }

    updateAbilityBar() {
        const container = document.getElementById('ability-bar');
        if (!container) return;
        
        const data = CHARACTERS[this.currentCharIndex];
        container.innerHTML = '';
        
        data.abilities.forEach((ab, i) => {
            const slot = document.createElement('div');
            slot.className = 'ability-slot';
            slot.innerHTML = `
                <span>${i+1}</span>
                <div class="ability-cd" id="cd-${i}"></div>
                <div class="key-hint">${i+1}</div>
            `;
            slot.title = ab;
            slot.style.color = '#' + data.color.toString(16).padStart(6, '0');
            container.appendChild(slot);
        });
    }

    updateHUD(charData, playerState) {
        const nameEl = document.getElementById('char-name');
        const healthEl = document.getElementById('health-bar');
        const energyEl = document.getElementById('energy-bar');
        const moneyEl = document.getElementById('money');
        
        if (nameEl) nameEl.innerText = charData.name;
        if (healthEl) healthEl.style.width = (playerState.health / playerState.maxHealth * 100) + '%';
        if (energyEl) energyEl.style.width = playerState.energy + '%';
        if (moneyEl) moneyEl.innerText = this.money;
        
        // Update character icons
        const icons = document.querySelectorAll('.char-icon');
        icons.forEach((icon, i) => {
            if(i === this.currentCharIndex) icon.classList.add('active');
            else icon.classList.remove('active');
        });
    }

    updateWantedLevel(level) {
        this.wantedLevel = level;
        const stars = document.querySelectorAll('.star');
        stars.forEach((s, i) => {
            if (i < Math.floor(this.wantedLevel)) s.classList.add('active');
            else s.classList.remove('active');
        });
    }

    updateCooldowns(cooldowns) {
        const now = Date.now();
        cooldowns.forEach((cd, i) => {
            const el = document.getElementById(`cd-${i}`);
            if(el) {
                const remaining = Math.max(0, cd - now);
                const pct = (remaining / 5000) * 100;
                el.style.height = pct + '%';
            }
        });
    }

    showMessage(text) {
        const el = document.getElementById('message-area');
        if (!el) return;
        
        el.innerText = text;
        el.style.opacity = 1;
        el.style.top = "30%";
        
        setTimeout(() => {
            el.style.opacity = 0;
            el.style.top = "25%";
        }, 2000);
    }

    setCharacterIndex(index) {
        this.currentCharIndex = index;
        this.updateAbilityBar();
    }

    addMoney(amount) {
        this.money += amount;
    }

    getCharacterIndex() {
        return this.currentCharIndex;
    }
}
