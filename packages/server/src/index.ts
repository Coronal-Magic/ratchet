import { Server } from '@colyseus/core';
import { WebSocketTransport } from '@colyseus/ws-transport';
import express from 'express';
import { createServer } from 'http';
import { GameRoom } from './rooms/GameRoom.js';

const app = express();
const httpServer = createServer(app);

const gameServer = new Server({
  transport: new WebSocketTransport({ server: httpServer }),
});

// Register game room
gameServer.define('game', GameRoom);

const PORT = Number(process.env.PORT) || 2567;

httpServer.listen(PORT, () => {
  console.log(`⚔️  Ratchet server listening on ws://localhost:${PORT}`);
  console.log(`🍺 Dwarfs and gnomes, ready for battle!`);
});
