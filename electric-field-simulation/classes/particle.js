class Particle {
  constructor(position, charge, color, isdragging) {
    this.position = position
    this.charge = charge
    this.color = color
    this.isdragging = isdragging
    this.radius = 8
  }

  draw(ctx) {
    ctx.beginPath()
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.beginPath()
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius + 0.01,
      0,
      Math.PI * 2
    )
    ctx.strokeStyle = 'black'
    ctx.stroke()
  }
}
