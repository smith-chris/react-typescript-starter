import React, { Component, ReactChild, ReactType, ComponentType } from 'react'
import { ticker } from 'app/app'
import { makeComputeFluidProperty } from './store'
import { Point } from './point'

const getStoreData = (data: Point, value = Point.ZERO, time = 0) => {
  return {
    value,
    func: {
      data,
      time,
    },
  }
}

let storeData = getStoreData(Point.ZERO)

const makeGetStore = (data: Point, value = Point.ZERO, time = 0) => {
  storeData = getStoreData(data, value, time)
  console.info(JSON.stringify(storeData, null, 2))
  return makeComputeFluidProperty(storeData)
}

let getStore = makeGetStore(new Point(0.5))

// tslint:disable-next-line
const subscribers: [Subscriber<any>, Selector<any>][] = []

let store = getStore(0)
type Store = typeof store

// Main and the only game loop
ticker.add(() => {
  store = getStore(ticker.lastTime)
  for (const sub of subscribers) {
    const [subscriber, selector] = sub
    subscriber(selector(store))
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
    const newStoreData = {
      value: store,
      func: {
        data: newFuncData,
        time: ticker.lastTime,
      },
    }
    console.info(JSON.stringify(newStoreData, null, 2))
    storeData = newStoreData
    getStore = makeComputeFluidProperty(newStoreData)
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
