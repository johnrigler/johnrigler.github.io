class NPC {
  constructor(maze, scene, startX, startZ, color = 0xff00ff) {
    this.maze = maze;
    this.scene = scene;
    this.x = startX + 0.5;
    this.z = startZ + 0.5;
    this.rot = Math.random() * Math.PI*2;

    const geo = new THREE.CylinderGeometry(0.3,0.3,1.5,8);
    const mat = new THREE.MeshPhongMaterial({ color });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(this.x, 0.75, this.z);
    scene.add(this.mesh);

    this.speed = 0.03;
  }

  isBlocked(x, z) {
    const gridX = Math.floor(x+0.5);
    const gridZ = Math.floor(z+0.5);
    const row = this.maze[gridZ];
    if (!row) return true;
    const ch = row[gridX];
    return !ch || ch === "M";
  }

  step() {
    // Attempt to move forward
    const dx = Math.sin(this.rot) * this.speed;
    const dz = Math.cos(this.rot) * this.speed;
    const newX = this.x + dx;
    const newZ = this.z + dz;

    if (!this.isBlocked(newX, newZ)) {
      // move forward normally
      this.x = newX;
      this.z = newZ;
    } else {
      // collision: move a tiny bit forward (0.2*speed) and rotate randomly
      const microDx = dx*0.2;
      const microDz = dz*0.2;
      const microX = this.x + microDx;
      const microZ = this.z + microDz;
      if (!this.isBlocked(microX, microZ)) {
        this.x = microX;
        this.z = microZ;
      }
      // rotate slightly, random small angle
      this.rot += (Math.random()-0.5)*Math.PI/2;
    }

    this.mesh.position.set(this.x, 0.75, this.z);
    this.mesh.rotation.y = this.rot;
  }
}

// global helpers
window.NPCs = [];
window.stepNPCs = function() {
  for (const npc of window.NPCs) npc.step();
};

