import * as THREE from 'three';

/**
 * Simple outline effect using inverted-hull technique.
 * Creates a slightly larger back-face mesh with a solid dark color
 * behind each character for that cel-shaded outline look.
 */
export class OutlineEffect {
  private outlineMaterial: THREE.MeshBasicMaterial;

  constructor(thickness = 0.04, color = 0x000000) {
    this.outlineMaterial = new THREE.MeshBasicMaterial({
      color,
      side: THREE.BackSide,
    });
  }

  /**
   * Create an outline mesh for the given object.
   * Returns a group containing the original + outline.
   */
  createOutlined(mesh: THREE.Mesh, thickness = 0.04): THREE.Group {
    const group = new THREE.Group();

    // Clone geometry for outline
    const outlineGeo = mesh.geometry.clone();
    const outlineMesh = new THREE.Mesh(outlineGeo, this.outlineMaterial);
    outlineMesh.scale.multiplyScalar(1 + thickness);
    outlineMesh.renderOrder = -1;

    group.add(outlineMesh);
    group.add(mesh);

    return group;
  }
}
