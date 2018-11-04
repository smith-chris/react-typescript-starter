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
  let lastSnapshotIndex = -1
  slider.addEventListener('input', () => {
    if (isPlaying) {
      isPlaying = false
      lastTime = ticker.lastTime
      console.warn('Pause the ticker')
    }
    const progress = Number(slider.value) / Number(slider.max)
    const time = lastTime * progress
    const snapshotIndex = findSnapshotIndex(time)
    if (snapshotIndex !== lastSnapshotIndex) {
      lastSnapshotIndex = snapshotIndex
      const [, actionName, newStore] = snapshots[snapshotIndex]
      console.info(`Action ${snapshotIndex + 1} ${actionName}:  ${show(newStore)}`)
      getStore = makeComputeFluidProperty(newStore)
    }
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

const snapshots: [number, string, typeof storeData][] = []

const makeGetStore = (
  data: Point,
  value = Point.ZERO,
  time = 0,
  actionName = 'None',
) => {
  storeData = getStoreData(data, value, time)
  snapshots.push([time, actionName, storeData])
  return makeComputeFluidProperty(storeData)
}
// @ts-ignore
window.__snapshots = snapshots
// @ts-ignore
window.__showSnapshots = () => show(snapshots)

const findSnapshotIndex = (timeMS: number) => {
  let minIndex = 0
  let maxIndex = snapshots.length - 1
  let lastCorrectIndex = 0

  while (minIndex <= maxIndex) {
    // tslint:disable-next-line
    const currentIndex = ((minIndex + maxIndex) / 2) | 0
    const [currentTimeMS] = snapshots[currentIndex]

    if (currentTimeMS < timeMS) {
      lastCorrectIndex = currentIndex
      minIndex = currentIndex + 1
    } else if (currentTimeMS > timeMS) {
      maxIndex = currentIndex - 1
    } else {
      return currentIndex
    }
  }

  return lastCorrectIndex
}

console.info('Initial store!')
let getStore = makeGetStore(new Point(2), Point.ZERO, 0, 'Setup')

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
  TOP = 'TOP',
  RIGHT = 'RIGHT',
  BOTTOM = 'BOTTOM',
  LEFT = 'LEFT',
}

export const actions = {
  bounce: (side: Side) => {
    if (!isPlaying) {
      return
    }
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
      getStore = makeGetStore(newFuncData, store, ticker.lastTime, `Bounce ${side}`)
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
