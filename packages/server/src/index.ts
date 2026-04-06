import { Server } from '@colyseus/core';
import { WebSocketTransport } from '@colyseus/ws-transport';
import { monitor } from '@colyseus/monitor';
import express from 'express';
import { createServer } from 'http';
import { GameRoom } from './rooms/GameRoom.js';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'ratchet-server' });
});

const httpServer = createServer(app);

const gameServer = new Server({
  transport: new WebSocketTransport({ server: httpServer }),
});

// Register game room
gameServer.define('game', GameRoom);

// Optional Colyseus monitor for debugging
app.use('/colyseus', monitor());

const PORT = Number(process.env.PORT) || 2567;

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`⚔️  Ratchet server listening on http://localhost:${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/health`);
  console.log(`🍺 Dwarfs and gnomes, ready for battle!`);
});
