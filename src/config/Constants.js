// Game Constants and Configuration
export const CONFIG = {
    renderDistance: 150,
    citySize: 400,
    buildingCount: 150,
    npcCount: 40,
    carCount: 20,
    colors: {
        sky: 0x87CEEB,
        ground: 0x2a2a2a,
        building: [0x8899aa, 0xaa8899, 0x99aa88, 0xddddcc],
        window: 0xadd8e6,
        playerHighlight: 0xffff00
    }
};

// Character Data - Anime Protagonists
export const CHARACTERS = [
    {
        id: 'gojo', name: 'Gojo Satoru', color: 0x1a1a2e, hair: 0xffffff, eyes: 0x00ffff, 
        stats: { speed: 12, jump: 15, health: 100 },
        abilities: ['Infinity', 'Red', 'Blue', 'Hollow Purple'],
        desc: "Limitless Cursed Energy"
    },
    {
        id: 'goku', name: 'Son Goku', color: 0xff6600, hair: 0x000000, eyes: 0x000000,
        stats: { speed: 14, jump: 18, health: 120 },
        abilities: ['Kamehameha', 'Instant Transmission', 'Spirit Bomb', 'Super Saiyan'],
        desc: "Saiyan Warrior"
    },
    {
        id: 'naruto', name: 'Naruto Uzumaki', color: 0xff8800, hair: 0xffcc00, eyes: 0x0066ff,
        stats: { speed: 13, jump: 16, health: 110 },
        abilities: ['Rasengan', 'Shadow Clone', 'Sage Mode', 'Kurama Mode'],
        desc: "Hokage Candidate"
    },
    {
        id: 'luffy', name: 'Monkey D. Luffy', color: 0xcc0000, hair: 0x000000, eyes: 0x000000,
        stats: { speed: 11, jump: 14, health: 130 },
        abilities: ['Gomu Gomu Pistol', 'Gear 2', 'Gear 4', 'Conqueror Haki'],
        desc: "Pirate King"
    },
    {
        id: 'ichigo', name: 'Ichigo Kurosaki', color: 0x000000, hair: 0xff6600, eyes: 0x000000,
        stats: { speed: 13, jump: 15, health: 105 },
        abilities: ['Getsuga Tensho', 'Flash Step', 'Bankai', 'Final Getsuga'],
        desc: "Substitute Soul Reaper"
    },
    {
        id: 'allmight', name: 'All Might', color: 0xffff00, hair: 0xeebb00, eyes: 0x00aaff,
        stats: { speed: 10, jump: 20, health: 150 },
        abilities: ['Detroit Smash', 'Texas Smash', 'Carolina Smash', 'United States'],
        desc: "Symbol of Peace"
    }
];
