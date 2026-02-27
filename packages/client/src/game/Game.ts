import { SceneManager } from '../rendering/SceneManager.js';
import { CameraController } from './CameraController.js';
import { InputManager } from './InputManager.js';
import { NetworkManager } from '../network/NetworkManager.js';
import { Player } from '../entities/Player.js';
import { CaptureNode } from '../entities/CaptureNode.js';
import { Crate } from '../entities/Crate.js';
import { HUD } from '../ui/HUD.js';
import { MSG } from '@ratchet/shared';

export class Game {
  private scene: SceneManager;
  private camera: CameraController;
  private input: InputManager;
  private network: NetworkManager;
  private hud: HUD;

  private localPlayer?: Player;
  private players = new Map<string, Player>();
  private nodes: CaptureNode[] = [];
  private crates = new Map<string, Crate>();
  private running = false;

  constructor() {
    this.scene = new SceneManager();
    this.camera = new CameraController(this.scene.camera);
    this.input = new InputManager();
    this.network = new NetworkManager();
    this.hud = new HUD();
  }

  async connect(opts: { name: string; race: string; variant: string; mode: string }) {
    const room = await this.network.joinOrCreate('game', {
      name: opts.name,
      race: opts.race,
      variant: opts.variant,
      mode: opts.mode,
    });

    // Listen for state changes
    room.state.players.onAdd((playerState: any, sessionId: string) => {
      const player = new Player(playerState, sessionId === room.sessionId);
      this.scene.add(player.mesh);
      this.players.set(sessionId, player);

      if (sessionId === room.sessionId) {
        this.localPlayer = player;
        this.camera.setTarget(player.mesh);
      }
    });

    room.state.players.onRemove((_: any, sessionId: string) => {
      const player = this.players.get(sessionId);
      if (player) {
        this.scene.remove(player.mesh);
        this.players.delete(sessionId);
      }
    });

    room.state.nodes.onAdd((nodeState: any, index: number) => {
      const node = new CaptureNode(nodeState, index);
      this.scene.add(node.mesh);
      this.nodes.push(node);
    });

    room.state.crates.onAdd((crateState: any, crateId: string) => {
      const crate = new Crate(crateState);
      this.scene.add(crate.mesh);
      this.crates.set(crateId, crate);
    });

    room.state.crates.onRemove((_: any, crateId: string) => {
      const crate = this.crates.get(crateId);
      if (crate) {
        this.scene.remove(crate.mesh);
        this.crates.delete(crateId);
      }
    });

    // Send ready
    room.send(MSG.READY);

    // Lock pointer for FPS-style controls
    document.addEventListener('click', () => {
      this.scene.renderer.domElement.requestPointerLock();
    });
  }

  start() {
    this.running = true;
    this.loop();
  }

  private loop = () => {
    if (!this.running) return;
    requestAnimationFrame(this.loop);

    // Send input to server
    if (this.localPlayer && this.network.room) {
      const move = this.input.getMovement();
      if (move.x !== 0 || move.z !== 0 || move.jump) {
        this.network.room.send(MSG.MOVE, move);
      }

      if (this.input.isShooting()) {
        const dir = this.camera.getAimDirection();
        this.network.room.send(MSG.SHOOT, { dirX: dir.x, dirY: dir.y, dirZ: dir.z });
      }
    }

    // Update entities from network state
    this.players.forEach((player) => player.update());
    this.nodes.forEach((node) => node.update());
    this.crates.forEach((crate) => crate.update());

    // Update camera
    this.camera.update();

    // Update HUD
    if (this.localPlayer) {
      this.hud.update(this.localPlayer);
    }

    // Render
    this.scene.render();
  };
}
