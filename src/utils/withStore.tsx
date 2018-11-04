import React, { Component, ComponentType } from 'react'
import { ticker } from 'app/app'
import { makeComputeFluidProperty } from './store'
import { Point } from './point'
import { shallowDiff } from './other'

// tslint:disable-next-line
const show = (data: any) => JSON.stringify(data, null, 2)

let isPlaying = true
const slider = document.querySelector('.slider') as HTMLInputElement | null
if (slider) {
  let lastTime = 0
  slider.addEventListener('input', () => {
    if (isPlaying) {
      isPlaying = false
      lastTime = ticker.lastTime
      console.warn('Stop the ticker')
    }
    const progress = Number(slider.value) / Number(slider.max)
    const time = lastTime * progress
    updateSubs(time)
  })
}

const getStoreData = (data: Point, value = Point.ZERO, time = 0) => {
  return {
    value,
    func: {
      data,
      time,
    },
  }
}

let storeData = getStoreData(Point.ZERO, Point.ZERO, ticker.lastTime)

const makeGetStore = (data: Point, value = Point.ZERO, time = 0) => {
  storeData = getStoreData(data, value, time)
  console.log('makeGetStore', show(storeData))
  // console.info(show(storeData))
  return makeComputeFluidProperty(storeData)
}

console.info('Initial store!')
let getStore = makeGetStore(new Point(0.1))

// tslint:disable-next-line
const subscribers: [Subscriber<any>, Selector<any>][] = []

let store = getStore(0)
type Store = typeof store

const updateSubs = (ms: number) => {
  store = getStore(ms)
  for (const sub of subscribers) {
    const [subscriber, selector] = sub
    subscriber(selector(store))
  }
}

// Main and the only game loop
let firstRender = true
ticker.add(() => {
  if (isPlaying) {
    if (firstRender) {
      firstRender = false
      console.info('First render!')
    }
    updateSubs(ticker.lastTime)
  }
})

export enum Side {
  TOP,
  RIGHT,
  BOTTOM,
  LEFT,
}

export const actions = {
  bounce: (side: Side) => {
    const newFuncData = { ...storeData.func.data }
    switch (side) {
      case Side.TOP:
        newFuncData.y = Math.abs(newFuncData.y)
        break
      case Side.RIGHT:
        newFuncData.x = -Math.abs(newFuncData.x)
        break
      case Side.BOTTOM:
        newFuncData.y = -Math.abs(newFuncData.y)
        break
      case Side.LEFT:
        newFuncData.x = Math.abs(newFuncData.x)
        break
      default:
        break
    }
    if (shallowDiff(newFuncData, storeData.func.data)) {
      getStore = makeGetStore(newFuncData, store, ticker.lastTime)
    }
  },
}

type Selector<T> = (state: Store) => T
type Subscriber<T> = (newSlice: T) => void

export const withStore = <T extends {}>(selector: Selector<T>) => (
  RenderComponent: ComponentType<T>,
) => {
  return class extends Component {
    state = selector(store)
    componentDidMount() {
      subscribers.push([
        slice => {
          this.setState(slice)
        },
        selector,
      ])
    }
    render() {
      return <RenderComponent {...this.state} />
    }
  }
}
