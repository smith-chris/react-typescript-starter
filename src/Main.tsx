import { stage, viewport } from 'app/app'
import { withStore, actions, Side } from 'utils/withStore'

const makeCircle = (circleSize: number) => {
  const result = new PIXI.Graphics()
  result.lineStyle(0)
  result.beginFill(0xffffff, 1)
  result.drawCircle(circleSize, circleSize, circleSize)
  result.endFill()
  return result
}

const circle = makeCircle(20)

stage.addChild(circle)

withStore(store => store)(position => {
  circle.position.x = position.x
  circle.position.y = position.y

  if (circle.getBounds().top <= 0) {
    actions.bounce(Side.TOP)
  }
  if (circle.getBounds().right >= viewport.width) {
    actions.bounce(Side.RIGHT)
  }
  if (circle.getBounds().bottom >= viewport.height) {
    actions.bounce(Side.BOTTOM)
  }
  if (circle.getBounds().left <= 0) {
    actions.bounce(Side.LEFT)
  }
})
