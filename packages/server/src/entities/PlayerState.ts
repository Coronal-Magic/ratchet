import { Schema, type } from '@colyseus/schema';
import { MAX_HEALTH } from '@ratchet/shared';

export class PlayerState extends Schema {
  @type('string') id: string = '';
  @type('string') name: string = '';
  @type('string') race: string = 'dwarf';
  @type('string') variant: string = 'miner';

  // Position
  @type('number') x: number = 0;
  @type('number') y: number = 0;
  @type('number') z: number = 0;
  @type('number') vy: number = 0; // vertical velocity
  @type('number') rotation: number = 0;

  // Stats
  @type('number') health: number = MAX_HEALTH;
  @type('number') shield: number = 0;
  @type('number') lives: number = 3;
  @type('number') score: number = 0;

  // State
  @type('string') weapon: string = 'pickaxe';
  @type('boolean') isDead: boolean = false;
  @type('boolean') ready: boolean = false;

  // Turret parts collected
  @type('boolean') hasBase: boolean = false;
  @type('boolean') hasBarrel: boolean = false;
  @type('boolean') hasPowerCell: boolean = false;
  @type('boolean') hasTargetingModule: boolean = false;

}
