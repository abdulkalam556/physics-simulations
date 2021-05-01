const nav = document.querySelector('.nav')
const contributeEl = document.querySelector('.contribute')
const menuToggleEl = document.querySelector('ul.menu')
const menuListEl = document.querySelector('ul.menu-list')

window.addEventListener('scroll', () => {
  fixNav()
  contributeAnimation()
})

function fixNav() {
  if (window.scrollY > nav.offsetHeight + 150) {
    nav.classList.add('active')
  } else {
    nav.classList.remove('active')
  }
}

function contributeAnimation() {
  const triggerBottom = 595
  const contributeElTop = contributeEl.getBoundingClientRect().top

  if (contributeElTop < triggerBottom) {
    contributeEl.classList.add('animate')
  } else {
    contributeEl.classList.remove('animate')
  }
}

menuToggleEl.addEventListener('click', () => maintainNav())

if (window.innerWidth <= 750) {
  maintainNav()
}

function maintainNav() {
  menuListEl.classList.toggle('hide')
  if (menuListEl.classList.contains('hide')) {
    menuToggleEl.innerHTML = `
    <li><i class="fas fa-bars"></i></li>
    `
  } else {
    menuToggleEl.innerHTML = `
    <li><i class="fas fa-times"></i></li>
    `
  }
}
