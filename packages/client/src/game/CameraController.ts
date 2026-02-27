import * as THREE from 'three';

export class CameraController {
  private target?: THREE.Object3D;
  private offset = new THREE.Vector3(0, 6, 10);
  private rotationX = 0;
  private rotationY = 0;
  private sensitivity = 0.002;

  constructor(private camera: THREE.PerspectiveCamera) {
    window.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement) {
        this.rotationY -= e.movementX * this.sensitivity;
        this.rotationX -= e.movementY * this.sensitivity;
        this.rotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 4, this.rotationX));
      }
    });
  }

  setTarget(obj: THREE.Object3D) {
    this.target = obj;
  }

  update() {
    if (!this.target) return;

    // Calculate camera position based on rotation
    const distance = this.offset.length();
    const camX = Math.sin(this.rotationY) * Math.cos(this.rotationX) * distance;
    const camY = Math.sin(this.rotationX) * distance + 4;
    const camZ = Math.cos(this.rotationY) * Math.cos(this.rotationX) * distance;

    this.camera.position.set(
      this.target.position.x + camX,
      this.target.position.y + camY,
      this.target.position.z + camZ,
    );

    this.camera.lookAt(
      this.target.position.x,
      this.target.position.y + 2,
      this.target.position.z,
    );
  }

  getAimDirection(): THREE.Vector3 {
    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    return dir;
  }
}
