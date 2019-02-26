import { Sprite } from 'pixi.js'

import { stage, app } from 'app/app'
import bunnyImage from 'assets/bunny.png'
import { repeatKey } from 'utils'

const bunny = Sprite.fromImage(bunnyImage.src)
bunny.anchor.set(0.5, 1)
bunny.y = app.screen.height
bunny.x = app.screen.width / 2
stage.addChild(bunny)

repeatKey('right', () => {
  bunny.x += 1
})

repeatKey('left', () => {
  bunny.x -= 1
})
const onResize = () => {
  bunny.y = app.screen.height
}

window.addEventListener('resize', onResize)
onResize()
