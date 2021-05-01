const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight

const buttons = document.querySelectorAll('.ripple')
const sampleParticle = document.querySelector('.sample-particle')
const rangeInput = document.querySelector('.range-input input')
const rangeValue = document.querySelector('.range-input .value div')
const deleteBtn = document.querySelector('.delete')

const canvasBgColor = '#D2D2D2'
const canvasGridColor = '#C0C0C0'
const grainColor = '#6e6e6e'
const arrowHeadColor = '#4f4f4f'

const step = parseFloat(rangeInput.step)

let random = []
let particles = []
let gridSize = 10
let dragOk = false
let dragIndex
let charge = 0
let chargeSign = 1
let maxCharge = parseFloat(rangeInput.max)
let minCharge = parseFloat(rangeInput.min)
let k = 1
let arrow = 'arrow'

function Init() {
  random = []
  particles = []
  gridSize = 10
  dragOk = false
  charge = 0
  chargeSign = 1
  maxCharge = parseFloat(rangeInput.max)
  minCharge = parseFloat(rangeInput.min)
  k = 1
  setChargeVal()
  arrow = 'arrow'
  genarateRandomPositions()

  buttons.forEach((btn) => {
    btn.classList = ''
  })
}

function animate() {
  requestAnimationFrame(animate)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  setUpCanvas()
  particles.forEach((p) => p.draw(ctx))
  drawStrokes()
}

// canvas setup
function setUpCanvas() {
  // setting background of canvas
  ctx.fillStyle = canvasBgColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // draw grid lines
  drawGrid()
}

// drawing the grid lines
function drawGrid() {
  for (let i = 0; i < canvas.width; i += gridSize) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i, canvas.height)
    ctx.strokeStyle = canvasGridColor
    ctx.stroke()
  }

  for (let i = 0; i < canvas.height + gridSize; i += gridSize) {
    ctx.beginPath()
    ctx.moveTo(0, i)
    ctx.lineTo(canvas.width, i)
    ctx.strokeStyle = canvasGridColor
    ctx.stroke()
  }
}

function calcIntensity(r, q) {
  return r.multiplyByScalar((k * q) / Math.pow(r.length(), 3))
}

function calcForces() {
  for (let i = 0; i < grains.length; i++) {
    for (let j = 0; j < grains[i].length; j++) {
      let result = new Vector(0, 0)
      const position = new Vector(
        i * (canvas.width / gridSize),
        j * (canvas.height / gridSize)
      )
      particles.forEach((p) => {
        const r = position.subtract(p.position)
        result = result.add(calcIntensity(r, p.charge))
      })
      result = result.normal()
      grains[i][j] = result
      // console.log(typeof grains[i][j])
    }
  }
}

function drawStrokes() {
  if (arrow === 'arrow') {
    k = 1
    drawArrows()
  } else {
    k = 5
    drawGrains()
  }
}

function genarateRandomPositions() {
  for (let i = 0; i < 50000; i++) {
    random.push(
      new Vector(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 10
      )
    )
  }
}

function drawGrains() {
  for (let i = 0; i < 50000; i++) {
    let result = new Vector(0, 0)
    particles.forEach((p) => {
      const r = random[i].subtract(p.position)
      result = result.add(calcIntensity(r, p.charge))
    })
    result = result.normal()
    result = result.multiplyByScalar(random[i].value)
    const x = random[i].x + result.x
    const y = random[i].y + result.y

    ctx.beginPath()
    ctx.moveTo(random[i].x, random[i].y)
    ctx.lineTo(x, y)
    ctx.strokeStyle = grainColor
    ctx.stroke()
  }
}

function drawArrows() {
  const mul = 3
  for (let i = 0; i < canvas.width; i += mul * gridSize) {
    for (let j = 0; j < canvas.height; j += mul * gridSize) {
      let result = new Vector(0, 0)
      const position = new Vector(i, j)
      particles.forEach((p) => {
        const r = position.subtract(p.position)
        result = result.add(calcIntensity(r, p.charge))
      })
      result = result.normal()
      result = result.multiplyByScalar(2 * gridSize)
      const x = i + result.x
      const y = j + result.y
      canvas_arrow(i, j, x, y)
    }
  }
}

function canvas_arrow(fromx, fromy, tox, toy) {
  var headlen = gridSize // length of head in pixels
  var dx = tox - fromx
  var dy = toy - fromy
  var angle = Math.atan2(dy, dx)
  ctx.moveTo(fromx, fromy)
  ctx.lineTo(tox, toy)
  ctx.lineTo(
    tox - headlen * Math.cos(angle - Math.PI / 6),
    toy - headlen * Math.sin(angle - Math.PI / 6)
  )
  ctx.moveTo(tox, toy)
  ctx.lineTo(
    tox - headlen * Math.cos(angle + Math.PI / 6),
    toy - headlen * Math.sin(angle + Math.PI / 6)
  )
  ctx.strokeStyle = arrowHeadColor
  ctx.stroke()
}

canvas.addEventListener('mousedown', (event) => {
  particles.forEach((p, index) => {
    if (
      p.position.distance(new Vector(event.offsetX, event.offsetY)) < p.radius
    ) {
      p.isdragging = true
      dragOk = true
      dragIndex = index
      p.radius += 4
      return
    }
  })
  console.log('mousedown', dragOk, dragIndex)
})

canvas.addEventListener('mouseup', (event) => {
  if (dragOk) {
    dragOk = false
    particles[dragIndex].position.x = event.offsetX
    particles[dragIndex].position.y = event.offsetY
    particles[dragIndex].isdragging = false
    particles[dragIndex].radius -= 4
  } else {
    particles.push(
      new Particle(
        new Vector(event.offsetX, event.offsetY),
        charge * chargeSign,
        getColor(charge),
        false
      )
    )
  }
})

canvas.addEventListener('mousemove', (event) => {
  if (dragOk) {
    particles[dragIndex].position = new Vector(event.offsetX, event.offsetY)
  }
})

// change sign of charge and canvas markup style
buttons.forEach((button) => {
  button.addEventListener('click', function (e) {
    if (button.id === 'sign') {
      button.classList.toggle('negitive')
      if (button.classList.contains('negitive')) {
        button.innerText = "- 'Ve"
        chargeSign = -1
      } else {
        button.innerText = "+ 'Ve"
        chargeSign = 1
      }
      sampleParticle.style.backgroundColor = `${getColor(charge)}`
    } else if (button.id === 'arrow-style') {
      button.classList.toggle('sparse')

      if (button.classList.contains('sparse')) {
        button.innerHTML = `
        <i class="fas fa-ellipsis-h"></i> grains
        `

        arrow = 'grains'
      } else {
        button.innerHTML = `
        <i class="fas fa-arrow-right"></i> Arrow
        `
        arrow = 'arrow'
      }
    }

    const xInside = e.offsetX
    const yInside = e.offsetY

    const circle = document.createElement('span')
    circle.classList.add('circle')
    circle.style.top = yInside + 'px'
    circle.style.left = xInside + 'px'

    this.appendChild(circle)

    setTimeout(() => circle.remove(), 500)
  })
})

// resets the entire screen
deleteBtn.addEventListener('click', () => {
  particles = []
  Init()
})

for (let i = minCharge; i <= maxCharge; i += step) {
  rangeValue.innerHTML += '<div>' + i + '</div>'
}
// charge value
rangeInput.addEventListener('input', () => setChargeVal())

function setChargeVal() {
  let top = (parseFloat(rangeInput.value) / step) * -40
  rangeValue.style.marginTop = top + 'px'
  charge = rangeInput.value
  sampleParticle.style.backgroundColor = `${getColor(charge)}`
}

// gives color based on  charge
function getColor(charge) {
  if (charge > 0 && chargeSign === -1) {
    return hslToHex(0, rangeMatch(charge, 1, maxCharge, 58, 100), 50, 1)
  } else if (charge > 0 && chargeSign === 1) {
    return hslToHex(241, rangeMatch(charge, 1, maxCharge, 36, 78), 50, 1)
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
