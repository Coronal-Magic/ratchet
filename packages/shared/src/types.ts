// ── Character Types ──

export type Race = 'dwarf' | 'gnome';

export type DwarfVariant = 'miner' | 'blacksmith' | 'berserker';
export type GnomeVariant = 'tinkerer' | 'alchemist' | 'scout';
export type CharacterVariant = DwarfVariant | GnomeVariant;

export interface CharacterSelection {
  race: Race;
  variant: CharacterVariant;
  name: string;
}

// ── Weapons ──

export type WeaponId = 'pickaxe' | 'blunderbuss' | 'crossbow' | 'bomb_toss' | 'wrench_launcher';

export interface WeaponDef {
  id: WeaponId;
  name: string;
  damage: number;
  range: number;
  fireRate: number; // shots per second
  projectileSpeed: number; // 0 = melee/hitscan
  spread: number; // radians
  aoe: number; // 0 = no area damage
}

// ── Items ──

export type ItemId = 'speed_boots' | 'shield_potion' | 'damage_buff' | 'health_pack' | 'invisibility_cloak';

export interface ItemDef {
  id: ItemId;
  name: string;
  duration: number; // seconds, 0 = instant
  value: number;
}

// ── Turret Parts ──

export type TurretPartId = 'base' | 'barrel' | 'power_cell' | 'targeting_module';

export interface TurretParts {
  base: boolean;
  barrel: boolean;
  power_cell: boolean;
  targeting_module: boolean;
}

// ── Game State ──

export type GameMode = 'node_control' | 'last_standing';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface PlayerData {
  id: string;
  character: CharacterSelection;
  position: Vec3;
  rotation: number; // y-axis rotation
  health: number;
  shield: number;
  lives: number;
  score: number;
  weapon: WeaponId;
  turretParts: TurretParts;
  items: ItemId[];
  isDead: boolean;
}

export interface CaptureNodeData {
  id: number;
  position: Vec3;
  owner: string | null; // player id
  captureProgress: number; // 0-1
  capturingPlayer: string | null;
  hasTurret: boolean;
}

export interface TurretData {
  id: string;
  nodeId: number;
  owner: string;
  health: number;
  rotation: number;
  target: string | null;
}

export interface CrateData {
  id: string;
  position: Vec3;
  isOpen: boolean;
  respawnAt: number; // timestamp
}
