
export class Vector2 {
  x: number
  y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  squareLength() {
    return this.x * this.x + this.y * this.y
  }

  length() {
    return Math.sqrt(this.squareLength())
  }

  normalize() {
    const l = this.length()
    return new Vector2(this.x / l, this.y / l)
  }

  dot(v: Vector2) {
    return this.x * v.x + this.y * v.y
  }
}