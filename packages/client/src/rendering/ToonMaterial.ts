import * as THREE from 'three';

/**
 * Cel-shaded toon material with configurable color.
 * Uses Three.js MeshToonMaterial with a 3-step gradient for that
 * clean Shell Shockers / Wind Waker look.
 */
export class ToonMaterial {
  private static gradientMap: THREE.DataTexture | null = null;

  static getGradientMap(): THREE.DataTexture {
    if (this.gradientMap) return this.gradientMap;

    // 4-step toon gradient: shadow, mid-shadow, mid-light, highlight
    const colors = new Uint8Array([40, 80, 160, 255]);
    const texture = new THREE.DataTexture(colors, colors.length, 1, THREE.RedFormat);
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.needsUpdate = true;

    this.gradientMap = texture;
    return texture;
  }

  static create(color: number | string): THREE.MeshToonMaterial {
    return new THREE.MeshToonMaterial({
      color: new THREE.Color(color),
      gradientMap: this.getGradientMap(),
    });
  }

  // Outlined version for characters (use with OutlinePass)
  static createCharacter(color: number | string): THREE.MeshToonMaterial {
    const mat = this.create(color);
    mat.userData.outline = true;
    return mat;
  }
}
