import { Sprite } from 'pixi.js'

import { stage, ticker, viewport } from 'app/app'
import bunnyImage from 'assets/bunny.png'

const bunny = Sprite.fromImage(bunnyImage.src)
bunny.anchor.set(0.5)
bunny.x = viewport.width / 2
bunny.y = viewport.height / 2

stage.addChild(bunny)

ticker.add(delta => {
  bunny.rotation += 0.1 * delta
})
