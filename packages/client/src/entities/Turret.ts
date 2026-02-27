import * as THREE from 'three';
import { ToonMaterial } from '../rendering/ToonMaterial.js';
import { OutlineEffect } from '../rendering/OutlinePass.js';

/**
 * Turret — auto-defense structure built on capture nodes.
 */
export class Turret {
  public mesh: THREE.Group;
  private state: any;
  private barrelMesh: THREE.Mesh;
  private outline: OutlineEffect;

  constructor(state: any) {
    this.state = state;
    this.outline = new OutlineEffect();
    this.mesh = new THREE.Group();

    // Base
    const baseGeo = new THREE.CylinderGeometry(0.8, 1, 0.6, 8);
    const baseMat = ToonMaterial.create(0x555555);
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.3;
    base.castShadow = true;
    this.mesh.add(this.outline.createOutlined(base));

    // Rotating head
    const headGeo = new THREE.SphereGeometry(0.5, 8, 8);
    const headMat = ToonMaterial.create(0x777777);
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 0.9;
    head.castShadow = true;
    this.mesh.add(this.outline.createOutlined(head));

    // Barrel
    const barrelGeo = new THREE.CylinderGeometry(0.1, 0.12, 1.2, 6);
    const barrelMat = ToonMaterial.create(0x333333);
    this.barrelMesh = new THREE.Mesh(barrelGeo, barrelMat);
    this.barrelMesh.position.y = 0.9;
    this.barrelMesh.position.z = 0.6;
    this.barrelMesh.rotation.x = Math.PI / 2;
    this.mesh.add(this.barrelMesh);
  }

  update() {
    // Rotate toward target
    this.mesh.rotation.y = this.state.rotation;
  }
}
