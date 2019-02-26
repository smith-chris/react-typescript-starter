import { Sprite } from 'pixi.js'

import { stage, ticker, app } from 'app/app'
import bunnyImage from 'assets/bunny.png'

const bunny = Sprite.fromImage(bunnyImage.src)
bunny.anchor.set(0.5)

stage.addChild(bunny)

const onResize = () => {
  bunny.x = app.screen.width / 2
  bunny.y = app.screen.height / 2
}

window.addEventListener('resize', onResize)
onResize()

ticker.add(delta => {
  bunny.rotation += 0.1 * delta
})
