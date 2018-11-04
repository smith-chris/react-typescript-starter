import { stage, ticker, viewport } from 'app/app'
import { Point } from 'utils/point'
import { makeComputeFluidProperty } from 'utils/store'

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

const circleSpeed = new Point(0.5, 0.5)

const stores: Array<{
  value: {
    x: number
    y: number
  }
  func: {
    data: {
      x: number
      y: number
    }
    time: number
  }
}> = []

type P = { x: number; y: number }

const makeGetStore = (data: P, value = { x: 0, y: 0 }, time = 0) => {
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
  stores.push(storeData)
  return makeComputeFluidProperty(storeData)
}

let getStore = makeGetStore(circleSpeed)

const renderBall = (position: P) => {
  circle.position.x = position.x
  circle.position.y = position.y
}

const dispatchActions = (position: P, time: number) => {
  if (circle.getBounds().right >= viewport.width) {
    console.log('right')
    circleSpeed.x = -Math.abs(circleSpeed.x)
    getStore = makeGetStore(circleSpeed, position, time)
  }
  if (circle.getBounds().bottom >= viewport.height) {
    console.log('bottom')
    circleSpeed.y = -Math.abs(circleSpeed.y)
    getStore = makeGetStore(circleSpeed, position, time)
  }
  if (circle.getBounds().left <= 0) {
    console.log('left')
    circleSpeed.x = Math.abs(circleSpeed.x)
    getStore = makeGetStore(circleSpeed, position, time)
  }
  if (circle.getBounds().top <= 0) {
    console.log('top')
    circleSpeed.y = Math.abs(circleSpeed.y)
    getStore = makeGetStore(circleSpeed, position, time)
  }
}

ticker.add(() => {
  const store = getStore(ticker.lastTime)
  renderBall(store)
  dispatchActions(store, ticker.lastTime)
})
