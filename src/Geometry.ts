import { Vector3 } from "./Vector3";
import { Triangle } from "./Trigangle";

export class Geometry {
  normals: Vector3[]

  constructor(public points: Vector3[], public triangles: Triangle[]) {
    this.normals = this.calculateNormals()
  }

  private calculateNormals() {
    const normals = Array(this.points.length).fill(new Vector3(0, 0, 0))
    this.triangles.forEach(t => {
      const [i0, i1, i2] = t
      const v0 = this.points[i0]
      const v1 = this.points[i1]
      const v2 = this.points[i2]
      const normal = v1.subtract(v0).cross(v2.subtract(v0))
      t.forEach(i => {
        const n = normals[i]
        normals[i] = n.add(normal)
      })
    })
    return normals.map(n => n.normalize())
  }

  rotateX(angle: number) {
    this.points = this.points.map(p => {
      const v = p.subtract(new Vector3(0, 0, 0))
      return new Vector3(
        v.x,
        v.y * Math.cos(angle) - v.z * Math.sin(angle),
        v.y * Math.sin(angle) + v.z * Math.cos(angle)
      )
    })
    this.normals = this.normals.map(p => {
      return new Vector3(
        p.x,
        p.y * Math.cos(angle) - p.z * Math.sin(angle),
        p.y * Math.sin(angle) + p.z * Math.cos(angle)
      )
    })
  }

  rotateZ(angle: number) {
    this.points = this.points.map(p => {
      const v = p.subtract(new Vector3(0, 0, 0))
      return new Vector3(
        v.x * Math.cos(angle) - v.y * Math.sin(angle),
        v.x * Math.sin(angle) + v.y * Math.cos(angle),
        v.z
      )
    })
  }
}