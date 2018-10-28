import { stage, ticker, viewport } from 'app/app'
import { Point } from 'utils/point'

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

const circleSpeed = new Point(2, 2)

ticker.add(delta => {
  circle.position.x += circleSpeed.x * delta
  circle.position.y += circleSpeed.y * delta
  if (circle.getBounds().right >= viewport.width) {
    circleSpeed.x = -Math.abs(circleSpeed.x)
  }
  if (circle.getBounds().bottom >= viewport.height) {
    circleSpeed.y = -Math.abs(circleSpeed.y)
  }
  if (circle.getBounds().left <= 0) {
    circleSpeed.x = Math.abs(circleSpeed.x)
  }
  if (circle.getBounds().top <= 0) {
    circleSpeed.y = Math.abs(circleSpeed.y)
  }
})
