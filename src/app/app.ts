import { Application } from 'pixi.js'
import { palette } from './palette'
import styles from './app.css'
import 'assets/fonts/fonts'

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

const isSafari =
  /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)

export const DEBUG_MAP = false
export const DEBUG_MAP_BOUNDS = false
export const DEBUG_OFFSET = 30

const SCREEN_SIZE_FACTOR = DEBUG_MAP ? 1312 : 144

export const viewport = { width: SCREEN_SIZE_FACTOR, height: SCREEN_SIZE_FACTOR }

const App = new Application({
  ...viewport,
  backgroundColor: DEBUG_MAP_BOUNDS ? palette.pink : palette.white,
  antialias: false,
  roundPixels: true,
})
const appElement = document.querySelector('#app')
// if (DEBUG_MAP_BOUNDS && appElement) {
//   appElement.classList.add(styles.debugBounds)
// }

const getClosestMultiplier = (base: number, max: number) =>
  (max - (max % base)) / base + 1

if (!appElement) {
  console.warn('App element not found..')
} else {
  const canvasElement = App.view
  appElement.classList.add(styles.app)
  canvasElement.classList.add(styles.canvas)
  appElement.appendChild(canvasElement)

  const resize = () => {
    const width = window.innerWidth
    const height = window.innerHeight
    viewport.width = SCREEN_SIZE_FACTOR
    viewport.height = SCREEN_SIZE_FACTOR
    if (width > height) {
      viewport.width = Math.floor(SCREEN_SIZE_FACTOR * (width / height))
    } else if (height > width) {
      viewport.height = Math.floor(SCREEN_SIZE_FACTOR * (height / width))
    }
    canvasElement.style.width = `${width}px`
    canvasElement.style.height = `${height}px`

    if (isSafari) {
      // Safari doesnt support `image-rendering: pixelated` :(
      const multiplier = getClosestMultiplier(viewport.width, width)
      App.stage.scale.set(multiplier)
      App.renderer.resize(viewport.width * multiplier, viewport.height * multiplier)
    } else {
      App.renderer.resize(viewport.width, viewport.height)
    }
    if (DEBUG_MAP_BOUNDS) {
      viewport.width -= DEBUG_OFFSET * 2
      viewport.height -= DEBUG_OFFSET * 2
    }
  }
  resize()

  window.addEventListener('resize', resize)
}

export const stage = App.stage
export const ticker = App.ticker
