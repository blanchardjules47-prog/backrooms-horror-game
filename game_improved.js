// ===== BACKROOMS HORROR GAME - VERSION AMÉLIORÉE =====

class Game {
    constructor() {
        this.currentLevel = 0;
        this.gameState = 'menu'; // menu, playing, paused, gameOver
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
        this.damageFlash = 0; // Pour l'effet de flash
        this.screenShake = 0; // Pour le screen shake
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showScreen('start-screen');
        window.addEventListener('resize', () => this.handleResize());
    }

    setupEventListeners() {
        // Menu buttons
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('instructions-btn').addEventListener('click', () => this.showScreen('instructions-screen'));
        document.getElementById('back-btn').addEventListener('click', () => this.showScreen('start-screen'));
        
        // Pause menu
        document.getElementById('resume-btn').addEventListener('click', () => this.togglePause());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
        document.getElementById('quit-btn').addEventListener('click', () => this.quitToMenu());
        
        // Game Over
        document.getElementById('retry-btn').addEventListener('click', () => this.restartGame());
        document.getElementById('main-menu-btn').addEventListener('click', () => this.quitToMenu());

        // Keyboard
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));

        // Escape for pause
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
            this.createLevelTwo()
        ];
        
        if (levelIndex < levels.length) {
            const level = levels[levelIndex];
            this.currentLevelData = level;
            // Copier les entités avec des propriétés d'IA améliorées
            this.entities = level.entities.map(e => ({
                ...e,
                vx: 0,
                vy: 0,
                searchRadius: 300, // Distance de détection
                chaseSpeed: 2.5,
                patrolSpeed: 0.8,
                lastSeenX: null,
                lastSeenY: null,
                state: 'patrol', // patrol, chase, hunt
                detectionTimer: 0,
                movementPattern: Math.random() // Pour la patrouille
            }));
            this.objects = level.objects.map(o => ({...o}));
        }
    }

    createLevelZero() {
        return {
            name: 'Level 0 - The Lobby',
            description: 'Un couloir jaune infini. Des fluorescents qui grésillent. L\'air sent le moisi.',
            backgroundColor: '#ffd700',
            difficulty: 1,
            entities: [
                { x: 100, y: 100, type: 'entity', hostile: false, name: 'Drone' },
                { x: 500, y: 400, type: 'entity', hostile: true, name: 'Figure sombre' }
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
            description: 'Appartements abandonnés. Silence oppressant. Des bruits de pas résonnent.',
            backgroundColor: '#8b7355',
            difficulty: 2,
            entities: [
                { x: 200, y: 150, type: 'entity', hostile: false, name: 'Entité neutre' },
                { x: 600, y: 300, type: 'entity', hostile: true, name: 'Guetteur' },
                { x: 400, y: 500, type: 'entity', hostile: true, name: 'Créature sans forme' }
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
            description: 'Tuyauterie géante. Humidité intense. Eau qui s\'écoule. Bruits métalliques.',
            backgroundColor: '#4a4a4a',
            difficulty: 3,
            entities: [
                { x: 300, y: 200, type: 'entity', hostile: true, name: 'Guetteur Aquatique' },
                { x: 500, y: 400, type: 'entity', hostile: true, name: 'Créature des profondeurs' },
                { x: 200, y: 550, type: 'entity', hostile: true, name: 'Mutant de niveau 2' }
            ],
            objects: [
                { x: 800, y: 300, type: 'door', id: 'door3', special: 'exit' },
                { x: 100, y: 200, type: 'item', id: 'almond_water', name: 'Eau d\'amande' }
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
        // Interagir avec les objets à proximité
        const interactRadius = 50;
        const nearbyObject = this.objects.find(obj => 
            this.distance(this.player, obj) < interactRadius
        );

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
        const nearbyEntity = this.entities.find(e => 
            this.distance(this.player, e) < examineRadius
        );

        if (nearbyEntity) {
            this.showMessage(`Vous apercevez: ${nearbyEntity.name}`, 'warning');
            if (nearbyEntity.hostile) {
                this.player.sanity -= 5;
                this.showMessage('😱 C\'est hostile!', 'danger');
            }
        }
    }

    enterDoor(door) {
        if (this.currentLevel < 2) {
            this.currentLevel++;
            this.loadLevel(this.currentLevel);
            this.player.x = this.viewport.width / 2;
            this.player.y = this.viewport.height / 2;
            
            // Légère régénération mais pas complète
            this.player.health = Math.min(this.player.health + 30, this.player.maxHealth);
            this.player.energy = Math.min(this.player.energy + 30, this.player.maxEnergy);
            
            this.showMessage(`Vous entrez dans ${this.currentLevelData.name}`, 'warning');
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
                this.showMessage('Vous buvez l\'eau. Vous vous sentez mieux.', 'warning');
                this.player.inventory.pop();
                break;
            case 'flashlight':
                this.showMessage('Lampe torche obtenue. Éclairage amélioré.', 'warning');
                break;
            case 'radio':
                this.showMessage('Radio obtenue. Vous entendez du bruit blanc...', 'warning');
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
        }, 3000);
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
            this.pickupItem(item); // Simule utilisation
        }
    }

    // ========== IA AMÉLIORÉE DES ENTITÉS ==========
    updateEntities() {
        this.entities.forEach(entity => {
            const distToPlayer = this.distance(this.player, entity);
            
            if (entity.hostile) {
                // Vérifier si le joueur est visible
                const canSee = distToPlayer < entity.searchRadius;
                
                // Changer l'état de l'entité
                if (canSee && distToPlayer < 250) {
                    entity.state = 'chase';
                    entity.lastSeenX = this.player.x;
                    entity.lastSeenY = this.player.y;
                } else if (entity.lastSeenX !== null && distToPlayer > 350) {
                    entity.state = 'hunt'; // Cherche le joueur dernièrement vu
                } else if (!canSee) {
                    entity.state = 'patrol';
                }

                // === COMPORTEMENT: CHASE ===
                if (entity.state === 'chase') {
                    const dx = this.player.x - entity.x;
                    const dy = this.player.y - entity.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance > 30) { // S'arrête pas trop près
                        const speed = entity.chaseSpeed * (this.currentLevelData.difficulty || 1);
                        entity.x += (dx / distance) * speed;
                        entity.y += (dy / distance) * speed;
                        
                        // Plus elle chasse, plus elle est intelligente
                        if (Math.random() < 0.05) {
                            // Prédiction - essaie d'anticiper les mouvements
                            const playerVelX = (this.keys['arrowright'] || this.keys['d']) ? 5 : 
                                              (this.keys['arrowleft'] || this.keys['a']) ? -5 : 0;
                            const playerVelY = (this.keys['arrowdown'] || this.keys['s']) ? 5 : 
                                              (this.keys['arrowup'] || this.keys['w']) ? -5 : 0;
                            
                            entity.x += playerVelX * 0.3;
                            entity.y += playerVelY * 0.3;
                        }
                    }
                }

                // === COMPORTEMENT: HUNT ===
                else if (entity.state === 'hunt' && entity.lastSeenX !== null) {
                    const dx = entity.lastSeenX - entity.x;
                    const dy = entity.lastSeenY - entity.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance > 10) {
                        const speed = entity.chaseSpeed * 0.6;
                        entity.x += (dx / distance) * speed;
                        entity.y += (dy / distance) * speed;
                    } else {
                        // Arrivée au dernier emplacement connu, reprendre la patrouille
                        entity.state = 'patrol';
                        entity.lastSeenX = null;
                        entity.lastSeenY = null;
                    }
                }

                // === COMPORTEMENT: PATROL ===
                else if (entity.state === 'patrol') {
                    // Patrouille plus intelligente
                    entity.detectionTimer++;
                    
                    if (entity.detectionTimer > 60) {
                        entity.movementPattern = Math.random();
                        entity.detectionTimer = 0;
                    }
                    
                    // Mouvement sinusoïdal pour plus de réalisme
                    entity.x += Math.sin(entity.detectionTimer * 0.05 + entity.movementPattern * 10) * entity.patrolSpeed;
                    entity.y += Math.cos(entity.detectionTimer * 0.05 + entity.movementPattern * 10) * entity.patrolSpeed;
                }

            } else {
                // === ENTITÉS AMICALES: PATROUILLE NEUTRE ===
                if (Math.random() < 0.02) {
                    entity.vx = (Math.random() - 0.5) * 2;
                    entity.vy = (Math.random() - 0.5) * 2;
                }
                entity.x += (entity.vx || 0);
                entity.y += (entity.vy || 0);
            }

            // Limites du viewport
            entity.x = Math.max(0, Math.min(entity.x, this.viewport.width));
            entity.y = Math.max(0, Math.min(entity.y, this.viewport.height));
        });
    }

    updateStats() {
        // Dégénération naturelle
        this.player.energy -= 0.1;
        this.player.sanity -= 0.05;
        
        if (this.player.energy < 0) {
            this.player.energy = 0;
            this.player.health -= 0.2;
        }
        
        // Proximité avec entités hostiles
        this.entities.forEach(entity => {
            if (entity.hostile) {
                const dist = this.distance(this.player, entity);
                
                // Peur: plus proche = plus de perte de sanité
                if (dist < 200) {
                    const fearFactor = 1 - (dist / 200);
                    this.player.sanity -= 0.2 * fearFactor;
                }
                
                // Dégâts: très proche = dégâts
                if (dist < 50) {
                    const now = Date.now();
                    if (now - this.player.lastDamageTime > 500) { // Délai entre les dégâts
                        this.takeDamage(15);
                        this.player.lastDamageTime = now;
                    }
                }
            }
        });

        // Limite les stats
        this.player.health = Math.max(0, Math.min(this.player.health, this.player.maxHealth));
        this.player.energy = Math.max(0, Math.min(this.player.energy, this.player.maxEnergy));
        this.player.sanity = Math.max(0, Math.min(this.player.sanity, this.player.maxSanity));

        if (this.player.health <= 0) {
            this.endGame(false, 'Vous avez été attrapé...');
        }
        if (this.player.sanity <= 0) {
            this.endGame(false, 'Votre esprit a cédé à la folie des Backrooms...');
        }
    }

    // ========== FEEDBACK VISUEL ==========
    takeDamage(amount) {
        this.player.health -= amount;
        this.damageFlash = 0.8; // Intensité du flash (0-1)
        this.screenShake = 15; // Force du tremblement
        
        // Animation du bar de santé
        const healthBar = document.getElementById('health-bar');
        healthBar.classList.add('damage-pulse');
        setTimeout(() => healthBar.classList.remove('damage-pulse'), 300);
        
        this.showMessage('💥 VOUS AVEZ PRIS DES DÉGÂTS!', 'danger');
    }

    updateHUD() {
        document.getElementById('health-bar').style.width = (this.player.health / this.player.maxHealth * 100) + '%';
        document.getElementById('health-text').textContent = Math.floor(this.player.health) + '/' + this.player.maxHealth;
        
        document.getElementById('energy-bar').style.width = (this.player.energy / this.player.maxEnergy * 100) + '%';
        document.getElementById('energy-text').textContent = Math.floor(this.player.energy) + '/' + this.player.maxEnergy;
        
        document.getElementById('sanity-bar').style.width = (this.player.sanity / this.player.maxSanity * 100) + '%';
        document.getElementById('sanity-text').textContent = Math.floor(this.player.sanity) + '/' + this.player.maxSanity;

        // Danger visuel si sanité basse
        if (this.player.sanity < 30) {
            document.getElementById('sanity-bar').parentElement.style.animation = 'shake 0.3s infinite';
        } else {
            document.getElementById('sanity-bar').parentElement.style.animation = 'none';
        }

        // Santé critique
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

        // Limites du viewport
        this.player.x = Math.max(20, Math.min(this.player.x, this.viewport.width - 20));
        this.player.y = Math.max(20, Math.min(this.player.y, this.viewport.height - 20));

        if (this.keys['w'] || this.keys['a'] || this.keys['s'] || this.keys['d'] || 
            this.keys['arrowup'] || this.keys['arrowleft'] || this.keys['arrowdown'] || this.keys['arrowright']) {
            this.player.energy -= 0.05;
        }
    }

    render() {
        const viewport = document.getElementById('viewport');
        
        // === EFFETS VISUELS DE FEEDBACK ===
        let filters = [];

        // 1. Flash de dégâts (blanc/rouge)
        if (this.damageFlash > 0) {
            const flashColor = this.damageFlash > 0.5 ? '#ff0000' : '#ff6666';
            viewport.style.backgroundColor = flashColor;
            viewport.style.opacity = this.damageFlash * 0.5;
            this.damageFlash -= 0.08;
        } else {
            viewport.style.opacity = 1;
            viewport.style.backgroundColor = this.currentLevelData.backgroundColor + '30';
        }

        // 2. Screen Shake (tremblements de caméra)
        if (this.screenShake > 0) {
            const shakeX = (Math.random() - 0.5) * this.screenShake;
            const shakeY = (Math.random() - 0.5) * this.screenShake;
            viewport.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
            this.screenShake -= 0.5;
        } else {
            viewport.style.transform = 'none';
        }

        // 3. Effets de sanité basse
        if (this.player.sanity < 50) {
            const distortion = (50 - this.player.sanity) / 50;
            filters.push(`grayscale(${distortion * 50}%)`);
            filters.push(`brightness(${1 - distortion * 0.15})`);
            
            // Vignette d'horreur
            if (this.player.sanity < 30) {
                filters.push(`drop-shadow(0 0 40px rgba(255, 0, 0, ${distortion * 0.3}))`);
            }
        }

        // 4. Vignette d'avertissement selon la santé
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

        // Créer ou récupérer l'élément du joueur
        if (!this.playerElement) {
            this.playerElement = document.createElement('div');
            this.playerElement.id = 'player';
            this.playerElement.className = 'player';
            viewport.appendChild(this.playerElement);
        }
        
        // Mettre à jour la position du joueur
        this.playerElement.style.left = (this.player.x - 15) + 'px';
        this.playerElement.style.top = (this.player.y - 15) + 'px';

        // Afficher les entités
        const existingEntities = viewport.querySelectorAll('.entity');
        existingEntities.forEach(el => el.remove());
        
        this.entities.forEach((entity, index) => {
            const el = document.createElement('div');
            const isHostile = entity.hostile;
            const state = entity.state || 'neutral';
            
            el.className = 'entity' + (isHostile ? ' hostile' : ' friendly');
            
            // Ajouter une classe pour l'état de l'IA
            if (isHostile) {
                el.classList.add(state); // patrol, chase, hunt
            }
            
            el.style.left = entity.x - 20 + 'px';
            el.style.top = entity.y - 20 + 'px';
            el.title = entity.name + (isHostile ? ` [${state}]` : '');
            viewport.appendChild(el);
        });

        // Afficher les objets
        const existingObjects = viewport.querySelectorAll('.door, .item');
        existingObjects.forEach(el => el.remove());

        this.objects.forEach(obj => {
            const el = document.createElement('div');
            el.className = obj.type;
            el.style.left = obj.x - 25 + 'px';
            el.style.top = obj.y - (obj.type === 'door' ? 40 : 10) + 'px';
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
            msg.textContent = 'Vous avez échappé aux Backrooms et retrouvé la réalité... pour combien de temps?';
        } else {
            title.textContent = '💀 GAME OVER 💀';
            title.style.color = '#ff0000';
            msg.textContent = message || 'Vous avez échoué à échapper aux Backrooms...';
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
}

// Démarrer le jeu au chargement
window.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
