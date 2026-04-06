import { Server } from '@colyseus/core';
import { WebSocketTransport } from '@colyseus/ws-transport';
import { monitor } from '@colyseus/monitor';
import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { GameRoom } from './rooms/GameRoom.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Ratchet server is up');
});

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

// Surface startup/runtime errors loudly in dev
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception in server:', err);
});
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection in server:', err);
});

const PORT = Number(process.env.PORT) || 2567;
const HOST = process.env.HOST || '0.0.0.0';

httpServer.listen(PORT, HOST, () => {
  console.log(`⚔️  Ratchet server listening on http://${HOST}:${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/health`);
  console.log(`🍺 Dwarfs and gnomes, ready for battle!`);
});
