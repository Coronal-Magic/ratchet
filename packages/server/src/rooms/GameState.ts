import { Schema, MapSchema, ArraySchema, type } from '@colyseus/schema';
import { PlayerState } from '../entities/PlayerState.js';
import { NodeState } from '../entities/NodeState.js';
import { TurretState } from '../entities/TurretState.js';
import type { GameMode } from '@ratchet/shared';

export class CrateState extends Schema {
  @type('string') id: string = '';
  @type('number') x: number = 0;
  @type('number') y: number = 0;
  @type('number') z: number = 0;
  @type('boolean') isOpen: boolean = false;
  @type('number') respawnAt: number = 0;
}

export class GameState extends Schema {
  @type('string') phase: string = 'lobby'; // lobby | countdown | playing | gameover
  @type('string') mode: GameMode = 'node_control';
  @type('number') timeRemaining: number = 0;
  @type('number') countdown: number = 0;

  @type({ map: PlayerState }) players = new MapSchema<PlayerState>();
  @type([NodeState]) nodes = new ArraySchema<NodeState>();
  @type({ map: TurretState }) turrets = new MapSchema<TurretState>();
  @type({ map: CrateState }) crates = new MapSchema<CrateState>();

  @type('string') winnerId: string = '';
}
