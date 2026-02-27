export class InputManager {
  private keys = new Set<string>();
  private mouseDown = false;

  constructor() {
    window.addEventListener('keydown', (e) => this.keys.add(e.code));
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    window.addEventListener('mousedown', (e) => { if (e.button === 0) this.mouseDown = true; });
    window.addEventListener('mouseup', (e) => { if (e.button === 0) this.mouseDown = false; });
  }

  getMovement(): { x: number; z: number; jump: boolean } {
    let x = 0;
    let z = 0;
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) z -= 1;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) z += 1;
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) x -= 1;
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) x += 1;

    // Normalize diagonal movement
    if (x !== 0 && z !== 0) {
      const len = Math.sqrt(x * x + z * z);
      x /= len;
      z /= len;
    }

    return { x, z, jump: this.keys.has('Space') };
  }

  isShooting(): boolean {
    return this.mouseDown;
  }

  isInteracting(): boolean {
    return this.keys.has('KeyE');
  }
}
