class Vector {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  divideByScalar(d) {
    return new Vector(this.x / d, this.y / d)
  }
  multiplyByScalar(m) {
    return new Vector(this.x * m, this.y * m)
  }
  addScaled(v, m) {
    return this.add(v.multiplyByScalar(m))
  }
  add(v) {
    return new Vector(this.x + v.x, this.y + v.y)
  }
  subtract(v) {
    return new Vector(this.x - v.x, this.y - v.y)
  }
  length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
  }
  lengthSquared() {
    return Math.pow(this.x, 2) + Math.pow(this.y, 2)
  }
}
