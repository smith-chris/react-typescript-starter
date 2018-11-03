import { stage, ticker, viewport } from 'app/app'
import { Point } from 'utils/point'
import { makeComputeFluidProperty, FRAME_TIME } from 'utils/store'

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

const circleSpeed = new Point(1, 1)

const makeGetStore = (data: Point, value = { x: 0, y: 0 }, time = 0) => {
  const storeData = {
    value,
    func: {
      data: {
        x: data.x,
        y: data.y,
      },
      time,
    },
  }
  console.log('make store', storeData)
  return makeComputeFluidProperty(storeData)
}

let getStore = makeGetStore(circleSpeed)

let gameTime = 0

ticker.add(delta => {
  const store = getStore(gameTime * FRAME_TIME)
  console.log(store, gameTime * FRAME_TIME)
  circle.position.x = store.x
  circle.position.y = store.y
  if (circle.getBounds().right >= viewport.width) {
    console.log('right')
    circleSpeed.x = -Math.abs(circleSpeed.x)
    getStore = makeGetStore(circleSpeed, store, gameTime * FRAME_TIME)
  }
  if (circle.getBounds().bottom >= viewport.height) {
    console.log('bottom')
    circleSpeed.y = -Math.abs(circleSpeed.y)
    getStore = makeGetStore(circleSpeed, store, gameTime * FRAME_TIME)
  }
  if (circle.getBounds().left <= 0) {
    console.log('left')
    circleSpeed.x = Math.abs(circleSpeed.x)
    getStore = makeGetStore(circleSpeed, store, gameTime * FRAME_TIME)
  }
  if (circle.getBounds().top <= 0) {
    console.log('top')
    circleSpeed.y = Math.abs(circleSpeed.y)
    getStore = makeGetStore(circleSpeed, store, gameTime * FRAME_TIME)
  }
  gameTime += delta
})
