import type { Player } from '../entities/Player.js';
import { MAX_HEALTH } from '@ratchet/shared';

export class HUD {
  private healthFill: HTMLElement;
  private shieldFill: HTMLElement;
  private scoreDisplay: HTMLElement;
  private turretParts: {
    base: HTMLElement;
    barrel: HTMLElement;
    cell: HTMLElement;
    target: HTMLElement;
  };

  constructor() {
    this.healthFill = document.getElementById('health-fill')!;
    this.shieldFill = document.getElementById('shield-fill')!;
    this.scoreDisplay = document.getElementById('score-display')!;
    this.turretParts = {
      base: document.getElementById('tp-base')!,
      barrel: document.getElementById('tp-barrel')!,
      cell: document.getElementById('tp-cell')!,
      target: document.getElementById('tp-target')!,
    };
  }

  update(player: Player) {
    // Health bar
    const healthPct = (player.health / MAX_HEALTH) * 100;
    this.healthFill.style.width = `${healthPct}%`;

    // Shield bar
    const shieldPct = Math.min(player.shield, 50) * 2; // 50 max = 100%
    this.shieldFill.style.width = `${shieldPct}%`;

    // Score
    this.scoreDisplay.textContent = `Score: ${Math.floor(player.score)} | ❤️ ${player.lives}`;

    // Turret parts
    this.turretParts.base.classList.toggle('collected', player.hasBase);
    this.turretParts.barrel.classList.toggle('collected', player.hasBarrel);
    this.turretParts.cell.classList.toggle('collected', player.hasPowerCell);
    this.turretParts.target.classList.toggle('collected', player.hasTargetingModule);
  }
}
