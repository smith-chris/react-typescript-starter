import { Sprite } from 'pixi.js'

import { stage, app } from 'app/app'
import bunnyImage from 'assets/bunny.png'
import { frameTimes, isPlaying, stop, snapshots } from 'history'
import { onKey, handlePress } from 'utils'
import './controls'

const bunny = Sprite.fromImage(bunnyImage.src)
bunny.anchor.set(0.5, 1)
bunny.y = app.screen.height
bunny.x = app.screen.width / 2
stage.addChild(bunny)

let state = {
  bunnyPosition: {
    x: app.screen.width / 2,
    y: app.screen.height,
  },
}

const initialState = state

const render = (s: typeof state) => {
  bunny.x = s.bunnyPosition.x
}

onKey('right', () => {
  state = {
    ...state,
    bunnyPosition: {
      ...state.bunnyPosition,
      x: state.bunnyPosition.x + 1,
    },
  }
  if (isPlaying) {
    render(state)
  }
})

onKey('left', () => {
  state = {
    ...state,
    bunnyPosition: {
      ...state.bunnyPosition,
      x: state.bunnyPosition.x - 1,
    },
  }
  if (isPlaying) {
    render(state)
  }
})

const onResize = () => {
  bunny.y = app.screen.height
}

window.addEventListener('resize', onResize)
onResize()

const slider = document.querySelector<HTMLInputElement>('.slider')
if (slider) {
  slider.addEventListener('input', () => {
    if (isPlaying()) {
      stop()
      slider.max = String(frameTimes.length)
      console.warn('Pause the ticker')
    }
    const frameIndex = Number(slider.value) - 1
    // Replay the game uptil this index
    state = initialState
    let currentSnapushotIndex = 0
    for (let i = 1; i < frameIndex; i++) {
      const currentSnapshot = snapshots[currentSnapushotIndex]
      if (!currentSnapshot) {
        break
      }
      if (currentSnapshot.frameIndex === i) {
        currentSnapshot.inputs.forEach(({ subject, action }) => {
          if (subject && action === 'press') {
            handlePress(subject)()
          }
        })
        currentSnapushotIndex++
      }
    }
    render(state)
  })
}

for (let i = 1; i < 10; i++) {
  setTimeout(() => {
    handlePress('left')()
  }, i * 50)
}

for (let i = 1; i < 10; i++) {
  setTimeout(() => {
    handlePress('right')()
  }, 11 * 50 + i * 50)
}
