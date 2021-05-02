const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight

const massEl = document.getElementById('mass')
const chargeEl = document.getElementById('charge')
const fixedEl = document.getElementById('fixed')
const clearFixedEl = document.getElementById('clear-fixed')
const restEl = document.getElementById('rest')
const gravityEl = document.getElementById('gravity')
const undoEl = document.getElementById('undo')
const pauseEl = document.getElementById('pause')
const resetEl = document.getElementById('reset')

const maxCharge = chargeEl.getAttribute('max')
const minCharge = chargeEl.getAttribute('min')
const k = 1
const GRAVITY = 0.85

let mass = 8
let charge = 100
let fixed = false
let gravity = false
let isPaused = false
let particles = []
let animationId
let t0
let dt = 0

function Init() {
  mass = 8
  charge = 100
  fixed = false
  gravity = false
  isPaused = false
  particles = []
  t0 = new Date().getTime()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  chargeEl.value = charge
  massEl.value = mass
}

function electricForce(k, q1, q2, r) {
  return r.multiplyByScalar((k * q1 * q2) / (r.lengthSquared() * r.length()))
}

function calcForces(index) {
  let result = new Vector(0, 0)
  const object = particles[index]
  if (object.fixed === true) return result
  particles.forEach((p, i) => {
    if (i !== index) {
      const r = object.position.subtract(p.position)
      if (r.length() > p.radius + object.radius) {
        const force = electricForce(k, p.charge, object.charge, r)
        result = result.add(force)
      } else {
        p.recycle()
      }
    }
  })

  if (gravity) {
    result = result.add(new Vector(0, mass * GRAVITY))
  }

  return result
}

function animate() {
  animationId = requestAnimationFrame(animate)
  dt = 0.01 * (new Date().getTime() - t0)
  t0 = new Date().getTime()
  if (!isPaused) {
    ctx.fillStyle = 'rgba(0, 0,0, 0.1)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    updateSampleParticle()

    particles.forEach((p, index) => {
      p.update(ctx, dt, calcForces, index)

      if (
        p.position.x - p.radius <= 0 ||
        p.position.x + p.radius >= canvas.width
      ) {
        p.velocity.x *= -1
      }
      if (
        p.position.y - p.radius <= 0 ||
        p.position.y + p.radius >= canvas.height
      ) {
        p.velocity.y *= -1
      }
    })
  }
}

// function updates the sample particle shown
function updateSampleParticle() {
  //since mass is proportinal to radius
  const radius = mass
  const position = new Vector(canvas.width - radius, radius)
  ctx.beginPath()
  ctx.arc(position.x, position.y, radius, 0, Math.PI * 2)
  ctx.fillStyle = getColor(charge)
  ctx.fill()

  if (fixed) {
    ctx.beginPath()
    ctx.arc(position.x, position.y, 2, 0, Math.PI * 2)
    ctx.fillStyle = 'black'
    ctx.fill()
  }
}

// adding charge particles to the system
canvas.addEventListener('click', (event) => {
  const position = new Vector(event.offsetX, event.offsetY)
  const color = getColor(charge)
  particles.push(new Particle(position, mass, charge, color, fixed))
  //console.log(particles)
})

// updating mass
massEl.addEventListener('input', (event) => {
  mass = +event.target.value
})

// updating charge
chargeEl.addEventListener('input', (event) => {
  charge = +event.target.value
})

// adding fixed particlesI
fixedEl.addEventListener('click', () => {
  fixed = !fixed
  console.log(fixed)
  fixedEl.classList.toggle('active')
})

// clear fixed particles
clearFixedEl.addEventListener('click', () => {
  particles = particles.filter((p) => !p.fixed)
  setTimeout(() => clearFixedEl.classList.toggle('active'), 500)
  clearFixedEl.classList.toggle('active')
})

// rests every particle
restEl.addEventListener('click', () => {
  particles.forEach((p) => (p.velocity = new Vector(0, 0)))
  setTimeout(() => restEl.classList.toggle('active'), 500)
  restEl.classList.toggle('active')
})

// adding grivty to the system
gravityEl.addEventListener('click', () => {
  gravity = !gravity
  gravityEl.classList.toggle('active')
})

// removes the last particle created particle
undoEl.addEventListener('click', () => {
  particles.pop()
  setTimeout(() => undoEl.classList.toggle('active'), 500)
  undoEl.classList.toggle('active')
})

// pauses the animation Frame
pauseEl.addEventListener('click', () => {
  isPaused = !isPaused

  if (isPaused) {
    pauseEl.innerHTML = `
    <div class="icon"><i class="fas fa-play"></i></div>
    <div class="text">Play</div>`
  } else {
    pauseEl.innerHTML = `
    <div class="icon"><i class="fas fa-pause"></i></div>
    <div class="text">Pause</div>`
  }

  pauseEl.classList.toggle('active')
})

// resets the entire canvas and every other property
resetEl.addEventListener('click', () => Init())

// gives color based on  charge
function getColor(charge) {
  if (charge > 0) {
    return hslToHex(rangeMatch(charge, 1, maxCharge, 30, 0), 100, 50, 1)
  } else if (charge < 0) {
    return hslToHex(rangeMatch(charge, -1, minCharge, 187, 217), 100, 50, 1)
  } else {
    return 'white'
  }
}

// matches values of one range to other
function rangeMatch(X1, minX1, maxX1, minX2, maxX2) {
  return minX2 + ((X1 - minX1) / (maxX1 - minX1)) * (maxX2 - minX2)
}

// converts hsl valued color to hex valued color
function hslToHex(h, s, l) {
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0') // convert to Hex and prefix "0" if needed
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

Init()
animate()
