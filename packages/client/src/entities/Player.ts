import * as THREE from 'three';
import { ToonMaterial } from '../rendering/ToonMaterial.js';
import { OutlineEffect } from '../rendering/OutlinePass.js';

const DWARF_COLOR = 0xcc8844;
const GNOME_COLOR = 0x44aa66;
const LOCAL_HIGHLIGHT = 0xffd700;

/**
 * Player entity — a chunky dwarf or gnome rendered with cel-shading.
 * Placeholder geometry: capsule body + sphere head + cone hat (gnome).
 */
export class Player {
  public mesh: THREE.Group;
  private state: any; // Colyseus PlayerState
  private isLocal: boolean;
  private outline: OutlineEffect;

  constructor(state: any, isLocal: boolean) {
    this.state = state;
    this.isLocal = isLocal;
    this.outline = new OutlineEffect();

    const baseColor = state.race === 'gnome' ? GNOME_COLOR : DWARF_COLOR;
    this.mesh = new THREE.Group();

    // Body (squat capsule shape — using cylinder + spheres)
    const bodyGeo = new THREE.CylinderGeometry(0.6, 0.7, 1.2, 8);
    const bodyMat = ToonMaterial.createCharacter(baseColor);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.8;
    body.castShadow = true;

    // Head
    const headGeo = new THREE.SphereGeometry(0.45, 8, 8);
    const headMat = ToonMaterial.createCharacter(0xffccaa); // skin
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.9;
    head.castShadow = true;

    this.mesh.add(this.outline.createOutlined(body));
    this.mesh.add(this.outline.createOutlined(head));

    // Gnome pointy hat
    if (state.race === 'gnome') {
      const hatGeo = new THREE.ConeGeometry(0.4, 0.8, 8);
      const hatMat = ToonMaterial.create(0xdd3333);
      const hat = new THREE.Mesh(hatGeo, hatMat);
      hat.position.y = 2.6;
      hat.castShadow = true;
      this.mesh.add(this.outline.createOutlined(hat));
    }

    // Dwarf beard
    if (state.race === 'dwarf') {
      const beardGeo = new THREE.ConeGeometry(0.35, 0.6, 6);
      const beardMat = ToonMaterial.create(0x8B4513);
      const beard = new THREE.Mesh(beardGeo, beardMat);
      beard.position.y = 1.3;
      beard.position.z = 0.3;
      beard.rotation.x = Math.PI;
      this.mesh.add(beard);
    }

    // Name label (local player gets gold color)
    // TODO: Add sprite text label above head

    // Set initial position
    this.mesh.position.set(state.x, state.y, state.z);
  }

  update() {
    // Lerp to server position
    this.mesh.position.x += (this.state.x - this.mesh.position.x) * 0.2;
    this.mesh.position.y += (this.state.y - this.mesh.position.y) * 0.2;
    this.mesh.position.z += (this.state.z - this.mesh.position.z) * 0.2;
    this.mesh.rotation.y = this.state.rotation;

    // Hide if dead
    this.mesh.visible = !this.state.isDead;
  }

  get health(): number { return this.state.health; }
  get shield(): number { return this.state.shield; }
  get score(): number { return this.state.score; }
  get lives(): number { return this.state.lives; }
  get hasBase(): boolean { return this.state.hasBase; }
  get hasBarrel(): boolean { return this.state.hasBarrel; }
  get hasPowerCell(): boolean { return this.state.hasPowerCell; }
  get hasTargetingModule(): boolean { return this.state.hasTargetingModule; }
}
