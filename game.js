// ===== BACKROOMS HORROR GAME - HARDCORE EDITION WITH ADMIN =====

class Game {
    constructor() {
        this.currentLevel = 0;
        this.gameState = 'menu';
        this.player = {
            x: 0,
            y: 0,
            health: 100,
            maxHealth: 100,
            energy: 100,
            maxEnergy: 100,
            sanity: 100,
            maxSanity: 100,
            inventory: [],
            lastDamageTime: 0
        };
        
        this.viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
            zoomLevel: 1
        };

        this.entities = [];
        this.objects = [];
        this.keys = {};
        this.playerElement = null;
        this.damageFlash = 0;
        this.screenShake = 0;
        this.currentLevelData = null;
        
        // Admin
        this.adminMode = false;
        this.invulnerable = false;
        this.ADMIN_CODE = '1337'; // CODE ADMIN - À CHANGER!
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showScreen('start-screen');
        window.addEventListener('resize', () => this.handleResize());
        
        // Easter egg pour afficher le login admin
        window.addEventListener('keydown', (e) => {
            if (e.key === 'F1') {
                e.preventDefault();
                this.showAdminLogin();
            }
        });
    }

    setupEventListeners() {
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('instructions-btn').addEventListener('click', () => this.showScreen('instructions-screen'));
        document.getElementById('back-btn').addEventListener('click', () => this.showScreen('start-screen'));
        
        document.getElementById('resume-btn').addEventListener('click', () => this.togglePause());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
        document.getElementById('quit-btn').addEventListener('click', () => this.quitToMenu());
        
        document.getElementById('retry-btn').addEventListener('click', () => this.restartGame());
        document.getElementById('main-menu-btn').addEventListener('click', () => this.quitToMenu());

        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.gameState === 'playing') {
                this.togglePause();
            }
        });
    }

    startGame() {
        this.gameState = 'playing';
        this.currentLevel = 0;
        this.player = {
            x: this.viewport.width / 2,
            y: this.viewport.height / 2,
            health: 100,
            maxHealth: 100,
            energy: 100,
            maxEnergy: 100,
            sanity: 100,
            maxSanity: 100,
            inventory: [],
            lastDamageTime: 0
        };
        this.entities = [];
        this.objects = [];
        this.playerElement = null;
        this.damageFlash = 0;
        this.screenShake = 0;
        
        this.showScreen('game-screen');
        this.loadLevel(this.currentLevel);
        this.gameLoop();
    }

    loadLevel(levelIndex) {
        const levels = [
            this.createLevelZero(),
            this.createLevelOne(),
            this.createLevelTwo(),
            this.createLevelThree(),
            this.createLevelFour(),
            this.createLevelFive()
        ];
        
        if (levelIndex < levels.length) {
            const level = levels[levelIndex];
            this.currentLevelData = level;
            
            this.entities = [];
            level.entities.forEach(e => {
                this.entities.push({
                    x: e.x,
                    y: e.y,
                    type: e.type,
                    hostile: e.hostile,
                    name: e.name,
                    vx: 0,
                    vy: 0,
                    searchRadius: 300,
                    chaseSpeed: 2.5,
                    patrolSpeed: 0.8,
                    lastSeenX: null,
                    lastSeenY: null,
                    state: 'patrol',
                    detectionTimer: 0,
                    movementPattern: Math.random(),
                    health: e.creatureHealth || 100,
                    maxHealth: e.creatureHealth || 100,
                    attackTimer: 0,
                    creatureType: e.creatureType || 'shadow'
                });
            });
            
            this.objects = level.objects.map(o => ({...o}));
        }
    }

    createLevelZero() {
        return {
            name: 'Level 0 - The Lobby',
            description: 'Couloir jaune infini. Fluorescents grésillants.',
            backgroundColor: '#ffd700',
            difficulty: 1,
            entities: [
                { x: 100, y: 100, type: 'entity', hostile: false, name: 'Drone', creatureType: 'drone', creatureHealth: 30 },
                { x: 500, y: 400, type: 'entity', hostile: true, name: 'Shadow Walker', creatureType: 'shadow', creatureHealth: 50 }
            ],
            objects: [
                { x: 600, y: 200, type: 'door', id: 'door1' },
                { x: 200, y: 600, type: 'item', id: 'water', name: 'Bouteille d\'eau' },
                { x: 800, y: 400, type: 'item', id: 'radio', name: 'Radio' }
            ]
        };
    }

    createLevelOne() {
        return {
            name: 'Level 1 - The Habitation Block',
            description: 'Appartements morts. Silence assourdissant.',
            backgroundColor: '#8b7355',
            difficulty: 2,
            entities: [
                { x: 200, y: 150, type: 'entity', hostile: false, name: 'Drone', creatureType: 'drone', creatureHealth: 30 },
                { x: 600, y: 300, type: 'entity', hostile: true, name: 'Watcher', creatureType: 'watcher', creatureHealth: 60 },
                { x: 400, y: 500, type: 'entity', hostile: true, name: 'Crawler', creatureType: 'crawler', creatureHealth: 40 }
            ],
            objects: [
                { x: 700, y: 200, type: 'door', id: 'door2' },
                { x: 150, y: 400, type: 'item', id: 'battery', name: 'Pile' },
                { x: 300, y: 600, type: 'item', id: 'flashlight', name: 'Lampe torche' }
            ]
        };
    }

    createLevelTwo() {
        return {
            name: 'Level 2 - The Pipes',
            description: 'Tuyauterie géante. Eau stagnante.',
            backgroundColor: '#4a4a4a',
            difficulty: 3,
            entities: [
                { x: 300, y: 200, type: 'entity', hostile: true, name: 'Water Watcher', creatureType: 'watcher', creatureHealth: 70 },
                { x: 500, y: 400, type: 'entity', hostile: true, name: 'Crawler 1', creatureType: 'crawler', creatureHealth: 45 },
                { x: 200, y: 550, type: 'entity', hostile: true, name: 'Crawler 2', creatureType: 'crawler', creatureHealth: 45 }
            ],
            objects: [
                { x: 800, y: 300, type: 'door', id: 'door3' },
                { x: 100, y: 200, type: 'item', id: 'almond_water', name: 'Eau d\'amande' }
            ]
        };
    }

    createLevelThree() {
        return {
            name: 'Level 3 - The Mirrors',
            description: 'Salles miroirs infinies. Reflets qui bougent.',
            backgroundColor: '#1a1a2e',
            difficulty: 4,
            entities: [
                { x: 300, y: 200, type: 'entity', hostile: true, name: 'Reflection', creatureType: 'reflector', creatureHealth: 80 },
                { x: 700, y: 400, type: 'entity', hostile: true, name: 'Shadow Master', creatureType: 'shadow', creatureHealth: 65 },
                { x: 400, y: 600, type: 'entity', hostile: true, name: 'Crawler 1', creatureType: 'crawler', creatureHealth: 50 },
                { x: 600, y: 150, type: 'entity', hostile: true, name: 'Crawler 2', creatureType: 'crawler', creatureHealth: 50 }
            ],
            objects: [
                { x: 750, y: 500, type: 'door', id: 'door4' },
                { x: 150, y: 300, type: 'item', id: 'battery', name: 'Pile' }
            ]
        };
    }

    createLevelFour() {
        return {
            name: 'Level 4 - The Factory',
            description: 'Usine monstrueuse. Machines qui tournent.',
            backgroundColor: '#2d2d44',
            difficulty: 5,
            entities: [
                { x: 400, y: 300, type: 'entity', hostile: true, name: 'Machine', creatureType: 'machine', creatureHealth: 100 },
                { x: 200, y: 100, type: 'entity', hostile: true, name: 'Shadow 1', creatureType: 'shadow', creatureHealth: 70 },
                { x: 800, y: 200, type: 'entity', hostile: true, name: 'Shadow 2', creatureType: 'shadow', creatureHealth: 70 },
                { x: 300, y: 500, type: 'entity', hostile: true, name: 'Crawler 1', creatureType: 'crawler', creatureHealth: 50 },
                { x: 700, y: 550, type: 'entity', hostile: true, name: 'Crawler 2', creatureType: 'crawler', creatureHealth: 50 },
                { x: 500, y: 700, type: 'entity', hostile: true, name: 'Watcher Prime', creatureType: 'watcher', creatureHealth: 80 }
            ],
            objects: [
                { x: 900, y: 400, type: 'door', id: 'door5' },
                { x: 100, y: 400, type: 'item', id: 'almond_water', name: 'Eau d\'amande' },
                { x: 500, y: 150, type: 'item', id: 'battery', name: 'Pile' }
            ]
        };
    }

    createLevelFive() {
        return {
            name: 'Level 5 - The Deep',
            description: 'Les profondeurs du vide. DERNIÈRE CHANCE.',
            backgroundColor: '#0a0a0f',
            difficulty: 6,
            entities: [
                { x: 400, y: 200, type: 'entity', hostile: true, name: 'Reflection Master', creatureType: 'reflector', creatureHealth: 120 },
                { x: 200, y: 400, type: 'entity', hostile: true, name: 'Machine Hunter', creatureType: 'machine', creatureHealth: 110 },
                { x: 800, y: 300, type: 'entity', hostile: true, name: 'Watcher Apex', creatureType: 'watcher', creatureHealth: 100 },
                { x: 100, y: 600, type: 'entity', hostile: true, name: 'Shadow King', creatureType: 'shadow', creatureHealth: 95 },
                { x: 300, y: 500, type: 'entity', hostile: true, name: 'Crawler 1', creatureType: 'crawler', creatureHealth: 55 },
                { x: 700, y: 550, type: 'entity', hostile: true, name: 'Crawler 2', creatureType: 'crawler', creatureHealth: 55 },
                { x: 500, y: 700, type: 'entity', hostile: true, name: 'Crawler 3', creatureType: 'crawler', creatureHealth: 55 }
            ],
            objects: [
                { x: 600, y: 200, type: 'door', id: 'door6', special: 'exit' },
                { x: 200, y: 200, type: 'item', id: 'almond_water', name: 'Eau d\'amande' },
                { x: 800, y: 700, type: 'item', id: 'almond_water', name: 'Eau d\'amande' }
            ]
        };
    }

    handleKeyDown(e) {
        this.keys[e.key.toLowerCase()] = true;
        if (e.key === ' ') {
            e.preventDefault();
            this.interact();
        }
        if (e.key === 'e' || e.key === 'E') {
            e.preventDefault();
            this.examine();
        }
    }

    handleKeyUp(e) {
        this.keys[e.key.toLowerCase()] = false;
    }

    handleResize() {
        this.viewport.width = window.innerWidth;
        this.viewport.height = window.innerHeight;
    }

    interact() {
        const interactRadius = 50;
        const nearbyObject = this.objects.find(obj => this.distance(this.player, obj) < interactRadius);

        if (nearbyObject) {
            if (nearbyObject.type === 'door') {
                this.enterDoor(nearbyObject);
            } else if (nearbyObject.type === 'item') {
                this.pickupItem(nearbyObject);
            }
        }
    }

    examine() {
        const examineRadius = 80;
        const nearbyEntity = this.entities.find(e => this.distance(this.player, e) < examineRadius);

        if (nearbyEntity) {
            this.showMessage(`Vous apercevez: ${nearbyEntity.name}`, 'warning');
            if (nearbyEntity.hostile) {
                this.player.sanity -= 5;
                this.showMessage('😱 C\'est hostile!', 'danger');
            }
        }
    }

    enterDoor(door) {
        if (this.currentLevel < 5) {
            this.currentLevel++;
            this.loadLevel(this.currentLevel);
            this.player.x = this.viewport.width / 2;
            this.player.y = this.viewport.height / 2;
            
            const regenFactor = 1 - (this.currentLevel * 0.1);
            this.player.health = Math.min(this.player.health + (30 * regenFactor), this.player.maxHealth);
            this.player.energy = Math.min(this.player.energy + (30 * regenFactor), this.player.maxEnergy);
            
            this.showMessage(`⚠️ ${this.currentLevelData.name}\nDifficulté: ${this.currentLevelData.difficulty}/6`, 'warning');
        } else if (door.special === 'exit') {
            this.endGame(true);
        }
    }

    pickupItem(item) {
        this.objects = this.objects.filter(o => o !== item);
        this.player.inventory.push(item);
        
        switch(item.id) {
            case 'water':
            case 'almond_water':
                this.player.health = Math.min(this.player.health + 30, this.player.maxHealth);
                this.showMessage('Vous buvez l\'eau. Légèrement rassurant.', 'warning');
                this.player.inventory.pop();
                break;
            case 'flashlight':
                this.showMessage('Lampe torche obtenue.', 'warning');
                break;
            case 'radio':
                this.showMessage('Radio obtenue. Bruit blanc apaisant.', 'warning');
                break;
            case 'battery':
                this.player.energy = Math.min(this.player.energy + 20, this.player.maxEnergy);
                this.showMessage('Pile obtenue. Énergie restaurée.', 'warning');
                this.player.inventory.pop();
                break;
        }
        
        this.updateInventoryDisplay();
    }

    distance(p1, p2) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }

    showMessage(text, type = 'normal') {
        const messageBox = document.getElementById('message-box');
        messageBox.textContent = text;
        messageBox.className = 'message-box ' + type;
        
        setTimeout(() => {
            messageBox.textContent = '';
            messageBox.className = 'message-box';
        }, 4000);
    }

    updateInventoryDisplay() {
        const itemsList = document.getElementById('items-list');
        itemsList.innerHTML = '';
        
        this.player.inventory.forEach((item, index) => {
            const slot = document.createElement('div');
            slot.className = 'item-slot';
            slot.title = item.name;
            
            const emoji = item.id === 'water' ? '💧' : 
                         item.id === 'flashlight' ? '🔦' :
                         item.id === 'radio' ? '📻' :
                         item.id === 'battery' ? '🔋' :
                         item.id === 'almond_water' ? '💧' : '?';
            
            slot.textContent = emoji;
            slot.addEventListener('click', () => this.useItem(index));
            itemsList.appendChild(slot);
        });
    }

    useItem(index) {
        const item = this.player.inventory[index];
        if (item) {
            this.pickupItem(item);
        }
    }

    updateEntities() {
        this.entities.forEach(entity => {
            const distToPlayer = this.distance(this.player, entity);
            const creatureType = entity.creatureType || 'shadow';
            
            if (entity.hostile) {
                if (creatureType === 'shadow') {
                    const canSee = distToPlayer < entity.searchRadius;
                    if (canSee && distToPlayer < 250) {
                        entity.state = 'chase';
                        entity.lastSeenX = this.player.x;
                        entity.lastSeenY = this.player.y;
                    } else if (entity.lastSeenX !== null && distToPlayer > 350) {
                        entity.state = 'hunt';
                    } else if (!canSee) {
                        entity.state = 'patrol';
                    }

                    if (entity.state === 'chase') {
                        const dx = this.player.x - entity.x;
                        const dy = this.player.y - entity.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance > 30) {
                            const speed = entity.chaseSpeed * 1.3 * (this.currentLevelData.difficulty || 1);
                            entity.x += (dx / distance) * speed;
                            entity.y += (dy / distance) * speed;
                        }
                    } else if (entity.state === 'hunt' && entity.lastSeenX !== null) {
                        const dx = entity.lastSeenX - entity.x;
                        const dy = entity.lastSeenY - entity.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance > 10) {
                            const speed = entity.chaseSpeed * 0.8;
                            entity.x += (dx / distance) * speed;
                            entity.y += (dy / distance) * speed;
                        } else {
                            entity.state = 'patrol';
                            entity.lastSeenX = null;
                            entity.lastSeenY = null;
                        }
                    } else if (entity.state === 'patrol') {
                        entity.detectionTimer++;
                        if (entity.detectionTimer > 60) {
                            entity.movementPattern = Math.random();
                            entity.detectionTimer = 0;
                        }
                        entity.x += Math.sin(entity.detectionTimer * 0.05 + entity.movementPattern * 10) * entity.patrolSpeed * 1.2;
                        entity.y += Math.cos(entity.detectionTimer * 0.05 + entity.movementPattern * 10) * entity.patrolSpeed * 1.2;
                    }
                }

                else if (creatureType === 'watcher') {
                    const detectionRange = 450;
                    const canSee = distToPlayer < detectionRange;
                    if (canSee) {
                        entity.state = 'chase';
                        entity.lastSeenX = this.player.x;
                        entity.lastSeenY = this.player.y;
                    } else if (entity.lastSeenX !== null) {
                        entity.state = 'hunt';
                    } else {
                        entity.state = 'patrol';
                    }

                    if (entity.state === 'chase') {
                        const dx = this.player.x - entity.x;
                        const dy = this.player.y - entity.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance > 50) {
                            const speed = entity.chaseSpeed * 0.7 * (this.currentLevelData.difficulty || 1);
                            entity.x += (dx / distance) * speed;
                            entity.y += (dy / distance) * speed;
                        }
                    } else if (entity.state === 'hunt') {
                        const dx = entity.lastSeenX - entity.x;
                        const dy = entity.lastSeenY - entity.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance > 10) {
                            const speed = entity.chaseSpeed * 0.5;
                            entity.x += (dx / distance) * speed;
                            entity.y += (dy / distance) * speed;
                        } else {
                            entity.state = 'patrol';
                            entity.lastSeenX = null;
                            entity.lastSeenY = null;
                        }
                    } else {
                        entity.detectionTimer++;
                        if (entity.detectionTimer > 120) {
                            entity.movementPattern = Math.random();
                            entity.detectionTimer = 0;
                        }
                        entity.x += Math.sin(entity.detectionTimer * 0.02) * entity.patrolSpeed * 0.5;
                        entity.y += Math.cos(entity.detectionTimer * 0.02) * entity.patrolSpeed * 0.5;
                    }
                }

                else if (creatureType === 'crawler') {
                    const canSee = distToPlayer < 200;
                    if (canSee) {
                        entity.state = 'chase';
                    } else {
                        entity.state = 'patrol';
                    }

                    if (entity.state === 'chase') {
                        const dx = this.player.x - entity.x;
                        const dy = this.player.y - entity.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance > 15) {
                            const speed = entity.chaseSpeed * 1.5 * (this.currentLevelData.difficulty || 1);
                            entity.x += (dx / distance) * speed;
                            entity.y += (dy / distance) * speed;
                        }
                    } else {
                        entity.detectionTimer++;
                        entity.x += (Math.random() - 0.5) * 2;
                        entity.y += (Math.random() - 0.5) * 2;
                    }
                }

                else if (creatureType === 'reflector') {
                    const canSee = distToPlayer < 500;
                    if (canSee) {
                        entity.state = 'chase';
                        const dx = this.player.x - entity.x;
                        const dy = this.player.y - entity.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance > 20) {
                            const speed = entity.chaseSpeed * 1.2 * (this.currentLevelData.difficulty || 1);
                            entity.x += (dx / distance) * speed;
                            entity.y += (dy / distance) * speed;
                        }
                    } else {
                        entity.state = 'patrol';
                        entity.x += Math.sin(entity.detectionTimer * 0.03) * entity.patrolSpeed;
                        entity.y += Math.cos(entity.detectionTimer * 0.03) * entity.patrolSpeed;
                        entity.detectionTimer++;
                    }
                }

                else if (creatureType === 'machine') {
                    const detectionRange = 350;
                    const canSee = distToPlayer < detectionRange;
                    if (canSee) {
                        entity.state = 'chase';
                        entity.attackTimer++;
                        if (entity.attackTimer % 30 === 0) {
                            if (!this.invulnerable) {
                                this.takeDamage(8);
                            }
                            this.screenShake = 10;
                        }
                        const centerX = entity.x;
                        const centerY = entity.y;
                        const angle = entity.attackTimer * 0.05;
                        const radius = 100;
                        entity.x = centerX + Math.cos(angle) * radius;
                        entity.y = centerY + Math.sin(angle) * radius;
                    } else {
                        entity.state = 'patrol';
                        entity.attackTimer = 0;
                    }
                }

                else if (creatureType === 'drone') {
                    if (Math.random() < 0.02) {
                        entity.vx = (Math.random() - 0.5) * 2;
                        entity.vy = (Math.random() - 0.5) * 2;
                    }
                    entity.x += (entity.vx || 0);
                    entity.y += (entity.vy || 0);
                }
            } else {
                if (Math.random() < 0.02) {
                    entity.vx = (Math.random() - 0.5) * 2;
                    entity.vy = (Math.random() - 0.5) * 2;
                }
                entity.x += (entity.vx || 0);
                entity.y += (entity.vy || 0);
            }

            entity.x = Math.max(0, Math.min(entity.x, this.viewport.width));
            entity.y = Math.max(0, Math.min(entity.y, this.viewport.height));
        });
    }

    updateStats() {
        this.player.energy -= 0.1;
        this.player.sanity -= 0.05;
        
        if (this.player.energy < 0) {
            this.player.energy = 0;
            this.player.health -= 0.2;
        }
        
        this.entities.forEach(entity => {
            if (entity.hostile) {
                const dist = this.distance(this.player, entity);
                const creatureType = entity.creatureType || 'shadow';
                
                let fearRange = 200;
                if (creatureType === 'watcher') fearRange = 300;
                if (creatureType === 'reflector') fearRange = 350;
                if (creatureType === 'machine') fearRange = 250;
                
                if (dist < fearRange) {
                    const fearFactor = 1 - (dist / fearRange);
                    this.player.sanity -= 0.2 * fearFactor;
                }
                
                if (dist < 50 && !this.invulnerable) {
                    const now = Date.now();
                    if (now - this.player.lastDamageTime > 500) {
                        let damageAmount = 15;
                        if (creatureType === 'reflector') damageAmount = 25;
                        if (creatureType === 'machine') damageAmount = 12;
                        if (creatureType === 'crawler') damageAmount = 8;
                        
                        this.takeDamage(damageAmount);
                        this.player.lastDamageTime = now;
                    }
                }
            }
        });

        this.player.health = Math.max(0, Math.min(this.player.health, this.player.maxHealth));
        this.player.energy = Math.max(0, Math.min(this.player.energy, this.player.maxEnergy));
        this.player.sanity = Math.max(0, Math.min(this.player.sanity, this.player.maxSanity));

        if (this.player.health <= 0 && !this.invulnerable) {
            this.endGame(false, 'Vous avez été déchiqueté...');
        }
        if (this.player.sanity <= 0 && !this.invulnerable) {
            this.endGame(false, 'Votre esprit a crié dans le vide...');
        }
    }

    takeDamage(amount) {
        this.player.health -= amount;
        this.damageFlash = 0.8;
        this.screenShake = 15;
        
        const healthBar = document.getElementById('health-bar');
        healthBar.classList.add('damage-pulse');
        setTimeout(() => healthBar.classList.remove('damage-pulse'), 300);
        
        this.showMessage('💥 DÉGÂTS! ' + amount + ' HP perdus!', 'danger');
    }

    updateHUD() {
        if (!this.currentLevelData) return;
        
        document.getElementById('health-bar').style.width = (this.player.health / this.player.maxHealth * 100) + '%';
        document.getElementById('health-text').textContent = Math.floor(this.player.health) + '/' + this.player.maxHealth;
        
        document.getElementById('energy-bar').style.width = (this.player.energy / this.player.maxEnergy * 100) + '%';
        document.getElementById('energy-text').textContent = Math.floor(this.player.energy) + '/' + this.player.maxEnergy;
        
        document.getElementById('sanity-bar').style.width = (this.player.sanity / this.player.maxSanity * 100) + '%';
        document.getElementById('sanity-text').textContent = Math.floor(this.player.sanity) + '/' + this.player.maxSanity;

        if (this.player.sanity < 30) {
            document.getElementById('sanity-bar').parentElement.style.animation = 'shake 0.3s infinite';
        } else {
            document.getElementById('sanity-bar').parentElement.style.animation = 'none';
        }

        if (this.player.health < 30) {
            document.getElementById('health-bar').classList.add('danger');
        } else {
            document.getElementById('health-bar').classList.remove('danger');
        }

        document.getElementById('room-name').textContent = this.currentLevelData.name;
        document.getElementById('room-description').textContent = this.currentLevelData.description;
    }

    movePlayer() {
        const speed = 5;
        if (this.keys['arrowup'] || this.keys['w']) this.player.y -= speed;
        if (this.keys['arrowdown'] || this.keys['s']) this.player.y += speed;
        if (this.keys['arrowleft'] || this.keys['a']) this.player.x -= speed;
        if (this.keys['arrowright'] || this.keys['d']) this.player.x += speed;

        this.player.x = Math.max(20, Math.min(this.player.x, this.viewport.width - 20));
        this.player.y = Math.max(20, Math.min(this.player.y, this.viewport.height - 20));

        if (this.keys['w'] || this.keys['a'] || this.keys['s'] || this.keys['d'] || 
            this.keys['arrowup'] || this.keys['arrowleft'] || this.keys['arrowdown'] || this.keys['arrowright']) {
            this.player.energy -= 0.05;
        }
    }

    render() {
        const viewport = document.getElementById('viewport');
        
        let filters = [];

        if (this.damageFlash > 0) {
            const flashColor = this.damageFlash > 0.5 ? '#ff0000' : '#ff6666';
            viewport.style.backgroundColor = flashColor;
            viewport.style.opacity = this.damageFlash * 0.5;
            this.damageFlash -= 0.08;
        } else {
            viewport.style.opacity = 1;
            viewport.style.backgroundColor = this.currentLevelData.backgroundColor + '30';
        }

        if (this.screenShake > 0) {
            const shakeX = (Math.random() - 0.5) * this.screenShake;
            const shakeY = (Math.random() - 0.5) * this.screenShake;
            viewport.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
            this.screenShake -= 0.5;
        } else {
            viewport.style.transform = 'none';
        }

        if (this.player.sanity < 50) {
            const distortion = (50 - this.player.sanity) / 50;
            filters.push(`grayscale(${distortion * 50}%)`);
            filters.push(`brightness(${1 - distortion * 0.15})`);
            if (this.player.sanity < 30) {
                filters.push(`drop-shadow(0 0 40px rgba(255, 0, 0, ${distortion * 0.3}))`);
            }
        }

        if (this.player.health < 40) {
            const healthFactor = 1 - (this.player.health / 40);
            viewport.style.boxShadow = `inset 0 0 60px rgba(255, 0, 0, ${healthFactor * 0.4})`;
        } else if (this.player.energy < 30) {
            const energyFactor = 1 - (this.player.energy / 30);
            viewport.style.boxShadow = `inset 0 0 40px rgba(0, 150, 255, ${energyFactor * 0.3})`;
        } else {
            viewport.style.boxShadow = 'none';
        }

        if (filters.length > 0) {
            viewport.style.filter = filters.join(' ');
        } else {
            viewport.style.filter = 'none';
        }

        if (!this.playerElement) {
            this.playerElement = document.createElement('div');
            this.playerElement.id = 'player';
            this.playerElement.className = 'player';
            viewport.appendChild(this.playerElement);
        }
        
        this.playerElement.style.left = (this.player.x - 15) + 'px';
        this.playerElement.style.top = (this.player.y - 15) + 'px';

        const existingEntities = viewport.querySelectorAll('.entity');
        existingEntities.forEach(el => el.remove());
        
        this.entities.forEach((entity) => {
            const el = document.createElement('div');
            const creatureType = entity.creatureType || 'shadow';
            
            el.className = 'entity ' + creatureType;
            
            if (entity.hostile && entity.state) {
                el.classList.add(entity.state);
            }
            
            el.style.left = (entity.x - 20) + 'px';
            el.style.top = (entity.y - 20) + 'px';
            el.title = entity.name;
            viewport.appendChild(el);
        });

        const existingObjects = viewport.querySelectorAll('.door, .item');
        existingObjects.forEach(el => el.remove());

        this.objects.forEach(obj => {
            const el = document.createElement('div');
            el.className = obj.type;
            el.style.left = (obj.x - 25) + 'px';
            el.style.top = (obj.y - (obj.type === 'door' ? 40 : 10)) + 'px';
            el.title = obj.name || obj.id;
            viewport.appendChild(el);
        });
    }

    gameLoop() {
        if (this.gameState === 'playing') {
            this.movePlayer();
            this.updateEntities();
            this.updateStats();
            this.updateHUD();
            this.render();
            this.updateAdminPanel();
            
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    togglePause() {
        const pauseMenu = document.getElementById('pause-menu');
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            pauseMenu.classList.remove('hidden');
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            pauseMenu.classList.add('hidden');
            this.gameLoop();
        }
    }

    endGame(won, message = '') {
        this.gameState = 'gameOver';
        const screen = document.getElementById('game-over-screen');
        const title = document.getElementById('game-over-title');
        const msg = document.getElementById('game-over-message');
        
        if (won) {
            title.textContent = '🎉 VOUS AVEZ SURVÉCU! 🎉';
            title.style.color = '#00ff00';
            msg.textContent = `Vous avez traversé les ${this.currentLevel + 1} niveaux!\nMais pour combien de temps?`;
        } else {
            title.textContent = '💀 GAME OVER 💀';
            title.style.color = '#ff0000';
            msg.textContent = message || 'Vous avez échoué...';
        }
        
        this.showScreen('game-over-screen');
    }

    restartGame() {
        this.startGame();
    }

    quitToMenu() {
        this.gameState = 'menu';
        this.showScreen('start-screen');
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');

        if (screenId === 'game-screen') {
            document.getElementById('pause-menu').classList.add('hidden');
        }
    }

    // ========== ADMIN FUNCTIONS ==========
    showAdminLogin() {
        document.getElementById('admin-login-screen').classList.add('active');
        document.getElementById('admin-code-input').focus();
    }

    checkAdminCode() {
        const input = document.getElementById('admin-code-input');
        if (input.value === this.ADMIN_CODE) {
            this.adminMode = true;
            document.getElementById('admin-login-screen').classList.remove('active');
            document.getElementById('admin-toggle').classList.remove('hide');
            this.showMessage('✅ Mode Admin activé!', 'warning');
            input.value = '';
        } else {
            document.getElementById('admin-error').textContent = '❌ Code incorrect!';
            setTimeout(() => {
                document.getElementById('admin-error').textContent = '';
            }, 3000);
        }
    }

    toggleAdminPanel() {
        if (this.adminMode) {
            document.getElementById('admin-panel').classList.toggle('active');
        }
    }

    updateAdminPanel() {
        if (!this.adminMode) return;
        document.getElementById('admin-status').textContent = this.gameState;
        document.getElementById('admin-level').textContent = this.currentLevel;
        document.getElementById('admin-creatures').textContent = this.entities.filter(e => e.hostile).length;
    }

    adminSetInvulnerable() {
        this.invulnerable = !this.invulnerable;
        const btn = event.target;
        btn.textContent = 'God Mode: ' + (this.invulnerable ? 'ON' : 'OFF');
        this.showMessage('God Mode: ' + (this.invulnerable ? 'ACTIVÉ ✅' : 'DÉSACTIVÉ ❌'), 'warning');
    }

    adminAddHealth(amount) {
        this.player.health = Math.min(this.player.health + amount, this.player.maxHealth);
        this.showMessage(`+${amount} HP`, 'warning');
    }

    adminAddEnergy(amount) {
        this.player.energy = Math.min(this.player.energy + amount, this.player.maxEnergy);
        this.showMessage(`+${amount} Energy`, 'warning');
    }

    adminAddSanity(amount) {
        this.player.sanity = Math.min(this.player.sanity + amount, this.player.maxSanity);
        this.showMessage(`+${amount} Sanity`, 'warning');
    }

    adminKillAllEnemies() {
        this.entities = this.entities.filter(e => !e.hostile);
        this.showMessage('Tous les monstres éliminés!', 'warning');
    }

    adminNextLevel() {
        if (this.currentLevel < 5) {
            this.currentLevel++;
            this.loadLevel(this.currentLevel);
            this.player.x = this.viewport.width / 2;
            this.player.y = this.viewport.height / 2;
            this.showMessage(`Level ${this.currentLevel} chargé!`, 'warning');
        }
    }

    adminPrevLevel() {
        if (this.currentLevel > 0) {
            this.currentLevel--;
            this.loadLevel(this.currentLevel);
            this.player.x = this.viewport.width / 2;
            this.player.y = this.viewport.height / 2;
            this.showMessage(`Level ${this.currentLevel} chargé!`, 'warning');
        }
    }

    adminGoToLevel(level) {
        this.currentLevel = level;
        this.loadLevel(this.currentLevel);
        this.player.x = this.viewport.width / 2;
        this.player.y = this.viewport.height / 2;
        this.showMessage(`Level ${this.currentLevel} chargé!`, 'warning');
    }

    adminSpawnMonster(type) {
        const newMonster = {
            x: Math.random() * this.viewport.width,
            y: Math.random() * this.viewport.height,
            type: 'entity',
            hostile: true,
            name: type.toUpperCase(),
            vx: 0,
            vy: 0,
            searchRadius: 300,
            chaseSpeed: 2.5,
            patrolSpeed: 0.8,
            lastSeenX: null,
            lastSeenY: null,
            state: 'patrol',
            detectionTimer: 0,
            movementPattern: Math.random(),
            health: 50,
            maxHealth: 50,
            attackTimer: 0,
            creatureType: type
        };
        this.entities.push(newMonster);
        this.showMessage(`🚨 ${type} spawn!`, 'danger');
    }

    adminShowStats() {
        console.log('=== PLAYER STATS ===');
        console.log('HP:', this.player.health + '/' + this.player.maxHealth);
        console.log('Energy:', this.player.energy + '/' + this.player.maxEnergy);
        console.log('Sanity:', this.player.sanity + '/' + this.player.maxSanity);
        console.log('Level:', this.currentLevel);
        console.log('Position:', this.player.x, this.player.y);
    }

    adminShowEntities() {
        console.log('=== ENTITIES ===');
        this.entities.forEach((e, i) => {
            console.log(i + '.', e.name, '-', e.creatureType, '-', e.state, '- HP:', e.health);
        });
    }

    adminClearConsole() {
        console.clear();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
