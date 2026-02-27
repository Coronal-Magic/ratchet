import type { WeaponDef, ItemDef, GameMode } from './types.js';

// ── Player ──

export const MAX_HEALTH = 100;
export const MAX_SHIELD = 50;
export const HEALTH_REGEN_RATE = 5; // HP per second
export const HEALTH_REGEN_DELAY = 5000; // ms out of combat before regen
export const MOVE_SPEED = 8; // units per second
export const JUMP_FORCE = 10;
export const DODGE_ROLL_SPEED = 15;
export const DODGE_ROLL_COOLDOWN = 2000; // ms

// ── Match ──

export const MAX_PLAYERS = 4;
export const NODE_CONTROL_DURATION = 5 * 60 * 1000; // 5 minutes
export const POINTS_PER_NODE_PER_SECOND = 1;
export const LAST_STANDING_LIVES = 3;
export const RESPAWN_DELAY = 3000; // ms

// ── Capture Nodes ──

export const NUM_NODES = 5;
export const CAPTURE_RADIUS = 4; // units
export const CAPTURE_TIME = 3000; // ms to capture

// ── Crates ──

export const CRATE_RESPAWN_TIME = 30000; // ms
export const NUM_CRATE_SPAWNS = 12;

// ── Turrets ──

export const TURRET_HEALTH = 200;
export const TURRET_DAMAGE = 15;
export const TURRET_FIRE_RATE = 2; // shots per second
export const TURRET_RANGE = 20; // units
export const TURRET_PART_RESPAWN = 60000; // ms
export const TURRET_OVERRIDE_DELAY = 10000; // ms after node capture

// ── Weapons ──

export const WEAPONS: Record<string, WeaponDef> = {
  pickaxe: {
    id: 'pickaxe',
    name: 'Pickaxe',
    damage: 25,
    range: 2.5,
    fireRate: 2,
    projectileSpeed: 0,
    spread: 0,
    aoe: 0,
  },
  blunderbuss: {
    id: 'blunderbuss',
    name: 'Blunderbuss',
    damage: 40,
    range: 10,
    fireRate: 0.8,
    projectileSpeed: 30,
    spread: 0.3,
    aoe: 0,
  },
  crossbow: {
    id: 'crossbow',
    name: 'Crossbow',
    damage: 35,
    range: 50,
    fireRate: 0.6,
    projectileSpeed: 60,
    spread: 0.02,
    aoe: 0,
  },
  bomb_toss: {
    id: 'bomb_toss',
    name: 'Bomb Toss',
    damage: 50,
    range: 25,
    fireRate: 0.5,
    projectileSpeed: 20,
    spread: 0,
    aoe: 5,
  },
  wrench_launcher: {
    id: 'wrench_launcher',
    name: 'Wrench Launcher',
    damage: 20,
    range: 30,
    fireRate: 4,
    projectileSpeed: 40,
    spread: 0.05,
    aoe: 0,
  },
};

// ── Items ──

export const ITEMS: Record<string, ItemDef> = {
  speed_boots: { id: 'speed_boots', name: 'Speed Boots', duration: 15, value: 0.3 },
  shield_potion: { id: 'shield_potion', name: 'Shield Potion', duration: 0, value: 50 },
  damage_buff: { id: 'damage_buff', name: 'Damage Buff', duration: 20, value: 0.25 },
  health_pack: { id: 'health_pack', name: 'Health Pack', duration: 0, value: 50 },
  invisibility_cloak: { id: 'invisibility_cloak', name: 'Invisibility Cloak', duration: 8, value: 1 },
};
