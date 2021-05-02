class Particle {
  constructor(position, mass, charge, color, fixed, radius) {
    if (typeof radius === 'undefined') radius = mass
    this.fixed = fixed
    this.position = position
    this.radius = radius
    this.mass = mass
    this.charge = charge
    this.color = color
    this.velocity = new Vector(0, 0)
    this.accelaration = new Vector(0, 0)
    this.force = new Vector(0, 0)
  }

  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.fill()

    if (this.fixed) {
      ctx.beginPath()
      ctx.arc(this.position.x, this.position.y, 2, 0, Math.PI * 2)
      ctx.fillStyle = 'black'
      ctx.fill()
    }
  }

  update(ctx, dt, calcForces, index) {
    this.draw(ctx)
    this.force = calcForces(index)
    this.accelaration = this.force.divideByScalar(this.mass)
    this.velocity = this.velocity.addScaled(this.accelaration, dt)
    this.position = this.position.addScaled(this.velocity, dt)
  }

  recycle() {
    /*
      when particles are too close then force goes to infinity to avoid that scenario we increase force by some const times here
    */
    const acc = 1.1
    this.force = this.force.multiplyByScalar(acc)
  }

  copy() {
    return new Particle(
      this.position,
      this.mass,
      this.charge,
      this.color,
      this.fixed,
      this.radius
    )
  }
}
