import * as THREE from 'three';
import { ToonMaterial } from '../rendering/ToonMaterial.js';
import { CAPTURE_RADIUS } from '@ratchet/shared';

const NEUTRAL_COLOR = 0x888888;
const PLAYER_COLORS = [0xff4444, 0x4444ff, 0x44ff44, 0xffff44];

/**
 * Capture node — a glowing platform that players fight over.
 */
export class CaptureNode {
  public mesh: THREE.Group;
  private state: any;
  private platformMesh: THREE.Mesh;
  private ringMesh: THREE.Mesh;
  private beaconMesh: THREE.Mesh;

  constructor(state: any, index: number) {
    this.state = state;
    this.mesh = new THREE.Group();

    // Platform base
    const platGeo = new THREE.CylinderGeometry(CAPTURE_RADIUS * 0.8, CAPTURE_RADIUS, 0.3, 16);
    const platMat = ToonMaterial.create(NEUTRAL_COLOR);
    this.platformMesh = new THREE.Mesh(platGeo, platMat);
    this.platformMesh.receiveShadow = true;
    this.mesh.add(this.platformMesh);

    // Capture ring (shows progress)
    const ringGeo = new THREE.RingGeometry(CAPTURE_RADIUS - 0.2, CAPTURE_RADIUS, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3,
    });
    this.ringMesh = new THREE.Mesh(ringGeo, ringMat);
    this.ringMesh.rotation.x = -Math.PI / 2;
    this.ringMesh.position.y = 0.2;
    this.mesh.add(this.ringMesh);

    // Beacon pillar (shows ownership)
    const beaconGeo = new THREE.CylinderGeometry(0.15, 0.15, 6, 8);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: NEUTRAL_COLOR,
      transparent: true,
      opacity: 0.5,
    });
    this.beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
    this.beaconMesh.position.y = 3;
    this.mesh.add(this.beaconMesh);

    // Node number label
    // TODO: floating text with node number

    this.mesh.position.set(state.x, state.y, state.z);
  }

  update() {
    const color = this.state.owner ? 0x44aaff : NEUTRAL_COLOR; // TODO: per-player colors

    (this.platformMesh.material as THREE.MeshToonMaterial).color.setHex(color);
    (this.beaconMesh.material as THREE.MeshBasicMaterial).color.setHex(color);

    // Pulse ring during capture
    if (this.state.capturingPlayer) {
      const pulse = 0.3 + Math.sin(Date.now() * 0.005) * 0.2;
      (this.ringMesh.material as THREE.MeshBasicMaterial).opacity = pulse;
    } else {
      (this.ringMesh.material as THREE.MeshBasicMaterial).opacity = 0.15;
    }
  }
}
