import * as THREE from 'three';
import { ToonMaterial } from '../rendering/ToonMaterial.js';

/**
 * Loot crate — breakable box with goodies inside.
 */
export class Crate {
  public mesh: THREE.Group;
  private state: any;
  private boxMesh: THREE.Mesh;

  constructor(state: any) {
    this.state = state;
    this.mesh = new THREE.Group();

    // Wooden crate look
    const boxGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const boxMat = ToonMaterial.create(0xc4883c);
    this.boxMesh = new THREE.Mesh(boxGeo, boxMat);
    this.boxMesh.position.y = 0.6;
    this.boxMesh.castShadow = true;
    this.mesh.add(this.boxMesh);

    // Metal bands
    const bandGeo = new THREE.BoxGeometry(1.3, 0.1, 1.3);
    const bandMat = ToonMaterial.create(0x666666);
    const band1 = new THREE.Mesh(bandGeo, bandMat);
    band1.position.y = 0.4;
    const band2 = new THREE.Mesh(bandGeo, bandMat);
    band2.position.y = 0.8;
    this.mesh.add(band1, band2);

    // Question mark on top (mystery!)
    // TODO: sprite or text mesh

    this.mesh.position.set(state.x, state.y, state.z);
  }

  update() {
    // Hide when opened, show when respawned
    this.mesh.visible = !this.state.isOpen;

    // Gentle bob animation when available
    if (!this.state.isOpen) {
      this.boxMesh.position.y = 0.6 + Math.sin(Date.now() * 0.003) * 0.1;
      this.boxMesh.rotation.y += 0.01;
    }
  }
}
