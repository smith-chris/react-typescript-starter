import { stage } from 'app/app'

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
