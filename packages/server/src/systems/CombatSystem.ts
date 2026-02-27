import { GameState } from '../rooms/GameState.js';
import { WEAPONS, MAX_HEALTH, HEALTH_REGEN_RATE, HEALTH_REGEN_DELAY, RESPAWN_DELAY } from '@ratchet/shared';
import type { ShootMessage } from '@ratchet/shared';

export class CombatSystem {
  private lastDamageTime = new Map<string, number>();
  private respawnTimers = new Map<string, number>();

  constructor(private state: GameState) {}

  handleShoot(shooterId: string, msg: ShootMessage) {
    const shooter = this.state.players.get(shooterId);
    if (!shooter) return;

    const weapon = WEAPONS[shooter.weapon];
    if (!weapon) return;

    // Simple raycast-style hit detection
    // Check all other players for hits
    this.state.players.forEach((target, targetId) => {
      if (targetId === shooterId || target.isDead) return;

      // Direction from shooter to target
      const dx = target.x - shooter.x;
      const dy = target.y - shooter.y;
      const dz = target.z - shooter.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist > weapon.range) return;

      // Simple dot product check for aim direction
      const ndx = dx / dist;
      const ndy = dy / dist;
      const ndz = dz / dist;
      const dot = ndx * msg.dirX + ndy * msg.dirY + ndz * msg.dirZ;

      // Hit if aiming roughly at target (accounting for spread)
      const hitThreshold = Math.cos(weapon.spread + 0.3); // generous hitbox
      if (dot > hitThreshold) {
        this.applyDamage(targetId, weapon.damage, shooterId);
      }
    });
  }

  applyDamage(targetId: string, damage: number, attackerId: string) {
    const target = this.state.players.get(targetId);
    if (!target || target.isDead) return;

    this.lastDamageTime.set(targetId, Date.now());

    // Shield absorbs first
    if (target.shield > 0) {
      const shieldDmg = Math.min(target.shield, damage);
      target.shield -= shieldDmg;
      damage -= shieldDmg;
    }

    target.health -= damage;

    if (target.health <= 0) {
      target.health = 0;
      target.isDead = true;
      target.lives--;

      if (target.lives > 0) {
        // Queue respawn
        this.respawnTimers.set(targetId, RESPAWN_DELAY);
      }

      // Award score to attacker
      const attacker = this.state.players.get(attackerId);
      if (attacker) attacker.score += 100;
    }
  }

  update(deltaMs: number) {
    const now = Date.now();

    this.state.players.forEach((player, id) => {
      // Health regeneration
      if (!player.isDead && player.health < MAX_HEALTH) {
        const lastHit = this.lastDamageTime.get(id) || 0;
        if (now - lastHit > HEALTH_REGEN_DELAY) {
          player.health = Math.min(MAX_HEALTH, player.health + HEALTH_REGEN_RATE * (deltaMs / 1000));
        }
      }
    });

    // Respawn timers
    this.respawnTimers.forEach((timeLeft, playerId) => {
      const remaining = timeLeft - deltaMs;
      if (remaining <= 0) {
        this.respawnTimers.delete(playerId);
        const player = this.state.players.get(playerId);
        if (player && player.lives > 0) {
          player.isDead = false;
          player.health = MAX_HEALTH;
          player.shield = 0;
          player.x = (Math.random() - 0.5) * 40;
          player.z = (Math.random() - 0.5) * 40;
          player.y = 1;
        }
      } else {
        this.respawnTimers.set(playerId, remaining);
      }
    });
  }
}
