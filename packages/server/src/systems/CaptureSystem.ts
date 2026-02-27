import { GameState } from '../rooms/GameState.js';
import { CAPTURE_RADIUS, CAPTURE_TIME } from '@ratchet/shared';

export class CaptureSystem {
  constructor(private state: GameState) {}

  update(deltaMs: number) {
    this.state.nodes.forEach((node) => {
      // Find players near this node
      const nearbyPlayers: string[] = [];

      this.state.players.forEach((player) => {
        if (player.isDead) return;
        const dx = player.x - node.x;
        const dz = player.z - node.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist <= CAPTURE_RADIUS) {
          nearbyPlayers.push(player.id);
        }
      });

      // No one nearby — decay progress
      if (nearbyPlayers.length === 0) {
        node.capturingPlayer = '';
        node.captureProgress = Math.max(0, node.captureProgress - deltaMs / CAPTURE_TIME);
        return;
      }

      // Contested — multiple players, no capture progress
      if (nearbyPlayers.length > 1) {
        node.capturingPlayer = '';
        return;
      }

      // Single player capturing
      const playerId = nearbyPlayers[0];

      // Already owns this node
      if (node.owner === playerId) return;

      // Different player was capturing — reset
      if (node.capturingPlayer && node.capturingPlayer !== playerId) {
        node.captureProgress = 0;
      }

      node.capturingPlayer = playerId;
      node.captureProgress += deltaMs / CAPTURE_TIME;

      // Captured!
      if (node.captureProgress >= 1) {
        node.owner = playerId;
        node.captureProgress = 0;
        node.capturingPlayer = '';
      }
    });
  }
}
