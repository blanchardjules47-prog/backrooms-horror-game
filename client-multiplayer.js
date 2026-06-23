// ========================================
// SYSTÈME MULTIJOUEUR POUR JEU WEB
// À ajouter à votre HTML: <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
// ========================================

class MultiplayerManager {
  constructor(serverURL = 'http://localhost:3000') {
    this.socket = io(serverURL);
    this.roomId = null;
    this.playerId = null;
    this.players = {};
    this.localPlayer = null;

    this.setupEventListeners();
  }

  // Initialiser la connexion
  connect(roomId, playerName) {
    this.roomId = roomId;
    
    const playerData = {
      name: playerName,
      position: { x: 0, y: 0, z: 0 },
      health: 100,
      room: 'spawn'
    };

    this.socket.emit('join-room', roomId, playerData);
    console.log(`✅ Connecté à la salle: ${roomId}`);
  }

  // Configuration des événements Socket.io
  setupEventListeners() {
    // Joueur s'est connecté
    this.socket.on('connect', () => {
      this.playerId = this.socket.id;
      console.log(`🎮 Connecté au serveur: ${this.playerId}`);
    });

    // Charger les joueurs existants
    this.socket.on('load-players', (playersList) => {
      playersList.forEach(player => {
        if (player.id !== this.playerId) {
          this.players[player.id] = player;
          this.spawnRemotePlayer(player);
        }
      });
    });

    // Un nouveau joueur a rejoint
    this.socket.on('player-joined', (data) => {
      console.log(`👤 ${data.playerData.name} a rejoint le jeu!`);
      this.players[data.playerId] = data.playerData;
      this.spawnRemotePlayer(data.playerData);
    });

    // Position d'un autre joueur mise à jour
    this.socket.on('player-moved', (data) => {
      if (this.players[data.playerId]) {
        this.players[data.playerId].position = data.position;
        this.updateRemotePlayerPosition(data.playerId, data.position);
      }
    });

    // Un joueur a changé de zone
    this.socket.on('player-room-changed', (data) => {
      if (this.players[data.playerId]) {
        this.players[data.playerId].room = data.newRoom;
        console.log(`👤 Joueur ${data.playerId} est maintenant en: ${data.newRoom}`);
      }
    });

    // Un joueur a pris des dégâts
    this.socket.on('player-damaged', (data) => {
      if (this.players[data.playerId]) {
        this.players[data.playerId].health = data.health;
        this.updateRemotePlayerHealth(data.playerId, data.health);
      }
    });

    // Un joueur est mort
    this.socket.on('player-dead', (data) => {
      console.log(`💀 Joueur ${data.playerId} est mort!`);
      this.removeRemotePlayer(data.playerId);
    });

    // Un joueur s'est déconnecté
    this.socket.on('player-left', (data) => {
      console.log(`👋 Un joueur s'est déconnecté`);
      this.removeRemotePlayer(data.playerId);
      delete this.players[data.playerId];
    });

    // Message de chat
    this.socket.on('chat-message', (data) => {
      this.onChatMessage(data.playerName, data.message);
    });
  }

  // === MÉTHODES À APPELER DEPUIS VOTRE JEU ===

  // Envoyer la position du joueur local (appeler dans la boucle de jeu)
  updatePosition(position) {
    if (this.roomId) {
      this.socket.emit('update-position', this.roomId, position);
    }
  }

  // Changer de zone
  changeRoom(newRoomName) {
    if (this.roomId) {
      this.socket.emit('change-room', this.roomId, newRoomName);
    }
  }

  // Prendre des dégâts (synchronisé)
  takeDamage(damage) {
    if (this.roomId) {
      this.socket.emit('take-damage', this.roomId, damage);
    }
  }

  // Envoyer un message de chat
  sendMessage(message) {
    if (this.roomId) {
      this.socket.emit('send-message', this.roomId, message);
    }
  }

  // === FONCTIONS DE RENDU (À ADAPTER À VOTRE JEU) ===

  spawnRemotePlayer(player) {
    console.log(`Spawn joueur distant: ${player.name} (${player.id})`);
    // À adapter: créer un objet 3D/2D pour représenter ce joueur
    // Exemple si vous utilisez Three.js:
    // const geometry = new THREE.BoxGeometry(1, 2, 1);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);
  }

  updateRemotePlayerPosition(playerId, position) {
    // À adapter: mettre à jour la position du mesh 3D du joueur
    // mesh.position.set(position.x, position.y, position.z);
  }

  updateRemotePlayerHealth(playerId, health) {
    console.log(`❤️ Santé du joueur ${playerId}: ${health}`);
    // À adapter: afficher la barre de santé
  }

  removeRemotePlayer(playerId) {
    console.log(`Suppression du joueur: ${playerId}`);
    // À adapter: supprimer le mesh 3D du joueur
  }

  onChatMessage(playerName, message) {
    console.log(`💬 ${playerName}: ${message}`);
    // À adapter: afficher le message dans le chat du jeu
  }
}

// === EXEMPLE D'UTILISATION ===
/*
const multiplayer = new MultiplayerManager('http://localhost:3000');

// Se connecter
multiplayer.connect('backrooms-001', 'NomDuJoueur');

// Dans la boucle de jeu (animation frame):
function gameLoop() {
  // Votre logique de jeu...
  
  // Envoyer la position du joueur chaque frame
  multiplayer.updatePosition({
    x: joueur.position.x,
    y: joueur.position.y,
    z: joueur.position.z
  });

  requestAnimationFrame(gameLoop);
}

// Quand le joueur prend des dégâts:
multiplayer.takeDamage(10);

// Quand le joueur change de zone:
multiplayer.changeRoom('level_2');

// Pour le chat:
multiplayer.sendMessage('Attention monstre!');
*/
