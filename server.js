const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Stockage des salons de jeu (rooms)
const rooms = {};

// Quand un joueur se connecte
io.on('connection', (socket) => {
  console.log(`Joueur connecté: ${socket.id}`);

  // Rejoindre une salle
  socket.on('join-room', (roomId, playerData) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: {},
        monsters: [],
        items: []
      };
    }

    // Ajouter le joueur à la salle
    rooms[roomId].players[socket.id] = {
      id: socket.id,
      name: playerData.name,
      position: playerData.position || { x: 0, y: 0, z: 0 },
      health: playerData.health || 100,
      room: playerData.room || 'spawn'
    };

    // Notifier les autres joueurs
    socket.to(roomId).emit('player-joined', {
      playerId: socket.id,
      playerData: rooms[roomId].players[socket.id]
    });

    // Envoyer au nouveau joueur tous les joueurs existants
    socket.emit('load-players', Object.values(rooms[roomId].players));

    console.log(`Salle ${roomId}: ${Object.keys(rooms[roomId].players).length} joueur(s)`);
  });

  // Synchroniser la position du joueur
  socket.on('update-position', (roomId, position) => {
    if (rooms[roomId] && rooms[roomId].players[socket.id]) {
      rooms[roomId].players[socket.id].position = position;
      
      // Broadcaster à tous les joueurs de la salle
      io.to(roomId).emit('player-moved', {
        playerId: socket.id,
        position: position
      });
    }
  });

  // Changer de room (zone)
  socket.on('change-room', (roomId, newRoom) => {
    if (rooms[roomId] && rooms[roomId].players[socket.id]) {
      rooms[roomId].players[socket.id].room = newRoom;
      
      io.to(roomId).emit('player-room-changed', {
        playerId: socket.id,
        newRoom: newRoom
      });
    }
  });

  // Synchroniser les dégâts aux joueurs
  socket.on('take-damage', (roomId, damage) => {
    if (rooms[roomId] && rooms[roomId].players[socket.id]) {
      rooms[roomId].players[socket.id].health -= damage;
      
      io.to(roomId).emit('player-damaged', {
        playerId: socket.id,
        health: rooms[roomId].players[socket.id].health
      });

      // Si mort
      if (rooms[roomId].players[socket.id].health <= 0) {
        io.to(roomId).emit('player-dead', { playerId: socket.id });
      }
    }
  });

  // Chat du jeu
  socket.on('send-message', (roomId, message) => {
    if (rooms[roomId]) {
      io.to(roomId).emit('chat-message', {
        playerId: socket.id,
        playerName: rooms[roomId].players[socket.id].name,
        message: message,
        timestamp: new Date()
      });
    }
  });

  // Quand un joueur se déconnecte
  socket.on('disconnect', () => {
    console.log(`Joueur déconnecté: ${socket.id}`);

    // Supprimer de toutes les salons
    for (let roomId in rooms) {
      if (rooms[roomId].players[socket.id]) {
        delete rooms[roomId].players[socket.id];

        // Notifier les autres
        io.to(roomId).emit('player-left', { playerId: socket.id });

        // Supprimer la salle si vide
        if (Object.keys(rooms[roomId].players).length === 0) {
          delete rooms[roomId];
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🎮 Serveur de jeu lancé sur le port ${PORT}`);
});
