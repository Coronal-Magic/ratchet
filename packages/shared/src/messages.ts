// ── Client → Server Messages ──

export interface MoveMessage {
  x: number;
  z: number;
  jump: boolean;
}

export interface ShootMessage {
  dirX: number;
  dirY: number;
  dirZ: number;
}

export interface InteractMessage {
  targetType: 'node' | 'crate' | 'turret_build';
  targetId: string | number;
}

export interface DodgeMessage {
  dirX: number;
  dirZ: number;
}

// ── Server → Client Messages ──

export interface HitConfirmMessage {
  targetId: string;
  damage: number;
  killed: boolean;
}

export interface KillFeedMessage {
  killerId: string;
  victimId: string;
  weapon: string;
}

export interface GameOverMessage {
  winnerId: string;
  scores: Record<string, number>;
  mode: string;
}

export interface TurretBuiltMessage {
  turretId: string;
  nodeId: number;
  ownerId: string;
}

export interface CrateOpenedMessage {
  crateId: string;
  playerId: string;
  item: string;
}

// ── Message Type Registry ──

export const MSG = {
  // Client → Server
  MOVE: 'move',
  SHOOT: 'shoot',
  INTERACT: 'interact',
  DODGE: 'dodge',
  SELECT_CHARACTER: 'select_character',
  READY: 'ready',

  // Server → Client
  HIT_CONFIRM: 'hit_confirm',
  KILL_FEED: 'kill_feed',
  GAME_OVER: 'game_over',
  TURRET_BUILT: 'turret_built',
  CRATE_OPENED: 'crate_opened',
  COUNTDOWN: 'countdown',
  MATCH_START: 'match_start',
} as const;
