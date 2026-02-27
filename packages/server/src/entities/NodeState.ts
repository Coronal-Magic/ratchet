import { Schema, type } from '@colyseus/schema';

export class NodeState extends Schema {
  @type('number') id: number = 0;
  @type('number') x: number = 0;
  @type('number') y: number = 0;
  @type('number') z: number = 0;
  @type('string') owner: string = '';
  @type('number') captureProgress: number = 0; // 0-1
  @type('string') capturingPlayer: string = '';
  @type('boolean') hasTurret: boolean = false;
}
