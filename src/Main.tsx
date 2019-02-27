import { Sprite } from 'pixi.js'

import { stage, app, ticker } from 'app/app'
import bunnyImage from 'assets/bunny.png'
import { onKey } from 'utils'
import './controls'
import { frameTimes } from 'history'

const bunny = Sprite.fromImage(bunnyImage.src)
bunny.anchor.set(0.5, 1)
bunny.y = app.screen.height
bunny.x = app.screen.width / 2
stage.addChild(bunny)

onKey('right', () => {
  bunny.x += 1
})

onKey('left', () => {
  bunny.x -= 1
})

const onResize = () => {
  bunny.y = app.screen.height
}

window.addEventListener('resize', onResize)
onResize()

// tslint:disable-next-line
const show = (data: any) => JSON.stringify(data, null, 2)

let isPlaying = true
const slider = document.querySelector('.slider') as HTMLInputElement | null
if (slider) {
  slider.addEventListener('input', () => {
    if (isPlaying) {
      isPlaying = false
      slider.max = String(frameTimes.length)
      ticker.stop()
      console.warn('Pause the ticker')
    }
    const frameIndex = Number(slider.value) - 1
    // Replay the game uptil this index
  })
}
