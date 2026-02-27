import { Room, Client } from '@colyseus/core';
import { GameState } from './GameState.js';
import { PlayerState } from '../entities/PlayerState.js';
import { NodeState } from '../entities/NodeState.js';
import { CaptureSystem } from '../systems/CaptureSystem.js';
import { CombatSystem } from '../systems/CombatSystem.js';
import { LootSystem } from '../systems/LootSystem.js';
import {
  MAX_PLAYERS,
  NUM_NODES,
  NODE_CONTROL_DURATION,
  POINTS_PER_NODE_PER_SECOND,
  LAST_STANDING_LIVES,
} from '@ratchet/shared';
import { MSG } from '@ratchet/shared';
import type { MoveMessage, ShootMessage, InteractMessage, GameMode } from '@ratchet/shared';

// Node positions on the map
const NODE_POSITIONS = [
  { x: 0, y: 2, z: -30 },   // Node 0 - North mine entrance
  { x: -20, y: 0, z: -15 }, // Node 1 - North-west tunnel
  { x: 0, y: 5, z: 0 },     // Node 2 - Center platform (elevated)
  { x: 20, y: 0, z: 15 },   // Node 3 - South-east field
  { x: -10, y: 0, z: 30 },  // Node 4 - South mushroom grove
];

export class GameRoom extends Room<GameState> {
  private captureSystem!: CaptureSystem;
  private combatSystem!: CombatSystem;
  private lootSystem!: LootSystem;
  private tickInterval?: ReturnType<typeof setInterval>;

  onCreate(options: { mode?: GameMode }) {
    this.maxClients = MAX_PLAYERS;
    this.setState(new GameState());
    this.state.mode = options.mode || 'node_control';

    // Initialize capture nodes
    for (let i = 0; i < NUM_NODES; i++) {
      const node = new NodeState();
      node.id = i;
      node.x = NODE_POSITIONS[i].x;
      node.y = NODE_POSITIONS[i].y;
      node.z = NODE_POSITIONS[i].z;
      this.state.nodes.push(node);
    }

    // Initialize systems
    this.captureSystem = new CaptureSystem(this.state);
    this.combatSystem = new CombatSystem(this.state);
    this.lootSystem = new LootSystem(this.state);

    // Register message handlers
    this.onMessage(MSG.MOVE, (client, msg: MoveMessage) => {
      const player = this.state.players.get(client.sessionId);
      if (!player || player.isDead) return;
      player.x += msg.x * 0.5;
      player.z += msg.z * 0.5;
      if (msg.jump) player.vy = 10;
    });

    this.onMessage(MSG.SHOOT, (client, msg: ShootMessage) => {
      const player = this.state.players.get(client.sessionId);
      if (!player || player.isDead) return;
      this.combatSystem.handleShoot(client.sessionId, msg);
    });

    this.onMessage(MSG.INTERACT, (client, msg: InteractMessage) => {
      const player = this.state.players.get(client.sessionId);
      if (!player || player.isDead) return;

      if (msg.targetType === 'crate') {
        this.lootSystem.openCrate(client.sessionId, String(msg.targetId));
      } else if (msg.targetType === 'turret_build') {
        this.lootSystem.buildTurret(client.sessionId, Number(msg.targetId));
      }
    });

    this.onMessage(MSG.READY, (client) => {
      const player = this.state.players.get(client.sessionId);
      if (player) player.ready = true;
      this.checkAllReady();
    });

    console.log(`🏟️  Game room created [${this.state.mode}]`);
  }

  onJoin(client: Client, options: { name?: string; race?: string; variant?: string }) {
    const player = new PlayerState();
    player.id = client.sessionId;
    player.name = options.name || `Player ${this.state.players.size + 1}`;
    player.race = (options.race as 'dwarf' | 'gnome') || 'dwarf';
    player.variant = options.variant || 'miner';
    player.lives = LAST_STANDING_LIVES;

    // Spawn at random position
    player.x = (Math.random() - 0.5) * 40;
    player.z = (Math.random() - 0.5) * 40;
    player.y = 1;

    this.state.players.set(client.sessionId, player);
    console.log(`🧙 ${player.name} (${player.race}) joined!`);
  }

  onLeave(client: Client) {
    const player = this.state.players.get(client.sessionId);
    if (player) {
      console.log(`👋 ${player.name} left`);
    }
    this.state.players.delete(client.sessionId);
  }

  private checkAllReady() {
    if (this.state.phase !== 'lobby') return;
    if (this.state.players.size < 2) return;

    let allReady = true;
    this.state.players.forEach((p) => {
      if (!p.ready) allReady = false;
    });

    if (allReady) this.startCountdown();
  }

  private startCountdown() {
    this.state.phase = 'countdown';
    this.state.countdown = 3;

    const countdownInterval = setInterval(() => {
      this.state.countdown--;
      if (this.state.countdown <= 0) {
        clearInterval(countdownInterval);
        this.startMatch();
      }
    }, 1000);
  }

  private startMatch() {
    this.state.phase = 'playing';
    this.state.timeRemaining = NODE_CONTROL_DURATION;

    // Spawn crates
    this.lootSystem.spawnInitialCrates();

    // Game tick at 20 Hz
    this.tickInterval = setInterval(() => this.tick(50), 50);
    console.log('⚔️  Match started!');
  }

  private tick(deltaMs: number) {
    if (this.state.phase !== 'playing') return;

    // Update systems
    this.captureSystem.update(deltaMs);
    this.combatSystem.update(deltaMs);
    this.lootSystem.update(deltaMs);

    // Score: points per node per second
    if (this.state.mode === 'node_control') {
      this.state.timeRemaining -= deltaMs;

      this.state.nodes.forEach((node) => {
        if (node.owner) {
          const player = this.state.players.get(node.owner);
          if (player) {
            player.score += POINTS_PER_NODE_PER_SECOND * (deltaMs / 1000);
          }
        }
      });

      if (this.state.timeRemaining <= 0) {
        this.endMatch();
      }
    }

    // Last standing: check alive count
    if (this.state.mode === 'last_standing') {
      let alive = 0;
      let lastAlive = '';
      this.state.players.forEach((p) => {
        if (p.lives > 0) {
          alive++;
          lastAlive = p.id;
        }
      });
      if (alive <= 1 && this.state.players.size >= 2) {
        this.state.winnerId = lastAlive;
        this.endMatch();
      }
    }
  }

  private endMatch() {
    this.state.phase = 'gameover';
    if (this.tickInterval) clearInterval(this.tickInterval);

    // Determine winner for node control
    if (this.state.mode === 'node_control' && !this.state.winnerId) {
      let topScore = -1;
      this.state.players.forEach((p) => {
        if (p.score > topScore) {
          topScore = p.score;
          this.state.winnerId = p.id;
        }
      });
    }

    const scores: Record<string, number> = {};
    this.state.players.forEach((p) => {
      scores[p.id] = p.score;
    });

    this.broadcast(MSG.GAME_OVER, {
      winnerId: this.state.winnerId,
      scores,
      mode: this.state.mode,
    });

    console.log(`🏆 Match over! Winner: ${this.state.winnerId}`);
  }

  onDispose() {
    if (this.tickInterval) clearInterval(this.tickInterval);
    console.log('🗑️  Room disposed');
  }
}
