import { GameState, CrateState } from '../rooms/GameState.js';
import { TurretState } from '../entities/TurretState.js';
import {
  CRATE_RESPAWN_TIME,
  NUM_CRATE_SPAWNS,
  TURRET_HEALTH,
  ITEMS,
  WEAPONS,
  MAX_HEALTH,
} from '@ratchet/shared';
import type { ItemId, WeaponId, TurretPartId } from '@ratchet/shared';

const CRATE_POSITIONS = [
  { x: -15, y: 0, z: -25 }, { x: 15, y: 0, z: -25 },
  { x: -25, y: 0, z: -5 },  { x: 25, y: 0, z: -5 },
  { x: -10, y: 3, z: 0 },   { x: 10, y: 3, z: 0 },
  { x: -25, y: 0, z: 10 },  { x: 25, y: 0, z: 10 },
  { x: -15, y: 0, z: 25 },  { x: 15, y: 0, z: 25 },
  { x: 0, y: 0, z: -15 },   { x: 0, y: 0, z: 20 },
];

const TURRET_PARTS: TurretPartId[] = ['base', 'barrel', 'power_cell', 'targeting_module'];
const LOOTABLE_WEAPONS: WeaponId[] = ['blunderbuss', 'crossbow', 'bomb_toss', 'wrench_launcher'];
const LOOTABLE_ITEMS: ItemId[] = ['speed_boots', 'shield_potion', 'damage_buff', 'health_pack', 'invisibility_cloak'];

export class LootSystem {
  constructor(private state: GameState) {}

  spawnInitialCrates() {
    CRATE_POSITIONS.forEach((pos, i) => {
      const crate = new CrateState();
      crate.id = `crate_${i}`;
      crate.x = pos.x;
      crate.y = pos.y;
      crate.z = pos.z;
      crate.isOpen = false;
      this.state.crates.set(crate.id, crate);
    });
  }

  openCrate(playerId: string, crateId: string) {
    const crate = this.state.crates.get(crateId);
    const player = this.state.players.get(playerId);
    if (!crate || !player || crate.isOpen) return;

    // Check distance
    const dx = player.x - crate.x;
    const dz = player.z - crate.z;
    if (Math.sqrt(dx * dx + dz * dz) > 3) return;

    crate.isOpen = true;
    crate.respawnAt = Date.now() + CRATE_RESPAWN_TIME;

    // Random loot: 40% weapon, 30% item, 30% turret part
    const roll = Math.random();

    if (roll < 0.4) {
      // Weapon
      const weapon = LOOTABLE_WEAPONS[Math.floor(Math.random() * LOOTABLE_WEAPONS.length)];
      player.weapon = weapon;
    } else if (roll < 0.7) {
      // Item — apply immediately
      const itemId = LOOTABLE_ITEMS[Math.floor(Math.random() * LOOTABLE_ITEMS.length)];
      this.applyItem(playerId, itemId);
    } else {
      // Turret part — give one they don't have
      const missing = TURRET_PARTS.filter((part) => {
        if (part === 'base') return !player.hasBase;
        if (part === 'barrel') return !player.hasBarrel;
        if (part === 'power_cell') return !player.hasPowerCell;
        if (part === 'targeting_module') return !player.hasTargetingModule;
        return false;
      });
      if (missing.length > 0) {
        const part = missing[Math.floor(Math.random() * missing.length)];
        if (part === 'base') player.hasBase = true;
        if (part === 'barrel') player.hasBarrel = true;
        if (part === 'power_cell') player.hasPowerCell = true;
        if (part === 'targeting_module') player.hasTargetingModule = true;
      } else {
        // Already has all parts, give an item instead
        const itemId = LOOTABLE_ITEMS[Math.floor(Math.random() * LOOTABLE_ITEMS.length)];
        this.applyItem(playerId, itemId);
      }
    }
  }

  private applyItem(playerId: string, itemId: ItemId) {
    const player = this.state.players.get(playerId);
    if (!player) return;

    switch (itemId) {
      case 'health_pack':
        player.health = Math.min(MAX_HEALTH, player.health + 50);
        break;
      case 'shield_potion':
        player.shield += 50;
        break;
      // Speed boots, damage buff, invisibility handled client-side with timers
    }
  }

  buildTurret(playerId: string, nodeId: number) {
    const player = this.state.players.get(playerId);
    if (!player || !(player.hasBase && player.hasBarrel && player.hasPowerCell && player.hasTargetingModule)) return;

    const node = this.state.nodes[nodeId];
    if (!node || node.owner !== playerId || node.hasTurret) return;

    // Build turret
    const turret = new TurretState();
    turret.id = `turret_${nodeId}_${Date.now()}`;
    turret.nodeId = nodeId;
    turret.owner = playerId;
    turret.health = TURRET_HEALTH;

    this.state.turrets.set(turret.id, turret);
    node.hasTurret = true;

    // Consume parts
    player.hasBase = false;
    player.hasBarrel = false;
    player.hasPowerCell = false;
    player.hasTargetingModule = false;
  }

  update(deltaMs: number) {
    const now = Date.now();

    // Respawn crates
    this.state.crates.forEach((crate) => {
      if (crate.isOpen && crate.respawnAt <= now) {
        crate.isOpen = false;
        crate.respawnAt = 0;
      }
    });
  }
}
