import { Schema, type } from '@colyseus/schema';
import { TURRET_HEALTH } from '@ratchet/shared';

export class TurretState extends Schema {
  @type('string') id: string = '';
  @type('number') nodeId: number = 0;
  @type('string') owner: string = '';
  @type('number') health: number = TURRET_HEALTH;
  @type('number') rotation: number = 0;
  @type('string') target: string = '';
}
