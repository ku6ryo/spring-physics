
export class Vector3 {
  x: number
  y: number
  z: number

  constructor(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
  }

  length() {
    return Math.sqrt(this.squareLength())
  }

  squareLength() {
    return this.x * this.x + this.y * this.y + this.z * this.z
  }

  add(v: Vector3) {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z)
  }

  subtract(v: Vector3) {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z)
  }

  cross(v: Vector3) {
    return new Vector3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    )
  }

  normalize() {
    const len = this.length()
    return new Vector3(this.x / len, this.y / len, this.z / len)
  }

  rotateX(angle: number) {
    return new Vector3(
      this.x,
      this.y * Math.cos(angle) - this.z * Math.sin(angle),
      this.y * Math.sin(angle) + this.z * Math.cos(angle)
    )
  }

  rotateY(angle: number) {
    return new Vector3(
      this.x * Math.cos(angle) + this.z * Math.sin(angle),
      this.y,
      - this.x * Math.sin(angle) + this.z * Math.cos(angle)
    )
  }

  rotateZ(angle: number) {
    return new Vector3(
      this.x * Math.cos(angle) - this.y * Math.sin(angle),
      this.x * Math.sin(angle) + this.y * Math.cos(angle),
      this.z
    )
  }

  divideScalar(n: number) {
    return new Vector3(this.x / n, this.y / n, this.z / n)
  }
}