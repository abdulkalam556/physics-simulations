class Vector {
  constructor(x, y, value) {
    this.x = x
    this.y = y
    if (typeof value === 'undefined') value = 0
    this.value = value
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
  normal() {
    return this.divideByScalar(this.length())
  }
  distance(v) {
    return this.subtract(v).length()
  }
}
