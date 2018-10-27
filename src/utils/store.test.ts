import { store } from './store'

type FluidProperty<T> = {
  value: T
  func: {
    time: number
    data: T
  }
}

const applyValue = <T>(value: T, diff: T, strength: number): T => {
  if (typeof value === 'number' && typeof diff === 'number') {
    // @ts-ignore
    return value + diff * strength
  } else if (typeof value === 'object') {
    // @ts-ignore
    value = { ...value }
    for (const key in value) {
      if (diff[key]) {
        value[key] = applyValue(value[key], diff[key], strength)
      }
    }
  }
  return value
}

describe('applyValue', () => {
  it('manipulate all keys', () => {
    const position = { x: 1, y: 2 }
    const positionCopy = { ...position }
    const data = { x: 2, y: 1 }
    const output = { x: 13.5, y: 8.25 }
    expect(applyValue(position, data, 6.25)).toEqual(output)
    expect(position).toEqual(positionCopy)
  })
  it('manipulate some keys', () => {
    const position = { x: 1, y: 2 }
    const positionCopy = { ...position }
    const data = { x: 2 }
    const output = { x: 13.5, y: 2 }
    expect(applyValue(position, data, 6.25)).toEqual(output)
    expect(position).toEqual(positionCopy)
  })
  it('deep manipulation', () => {
    const position = { a: 1, b: { ba: 0, bb: -13 } }
    const positionCopy = { ...position }
    const data = { a: 2, b: { ba: 1 } }
    const output = { a: 13.5, b: { ba: 6.25, bb: -13 } }
    expect(applyValue(position, data, 6.25)).toEqual(output)
    expect(position).toEqual(positionCopy)
  })
  it('is pure', () => {
    const position = { x: 1, y: 2 }
    const positionCopy = { ...position }
    const data = { x: 2, y: 1 }
    const output = { x: 13.5, y: 8.25 }
    expect(applyValue(position, data, 6.25)).toEqual(output)
    expect(position).toEqual(positionCopy)
  })
})

const FRAME_TIME = 1000 / 60

const makeComputeFluidProperty = <T>(property: FluidProperty<T>) => (time: number) => {
  const { value, func } = property
  const timePassed = time - property.func.time
  if (timePassed < 0) {
    console.warn(`Time doesnt go backwards! (time=${time})`, property)
    return property.value
  }
  return applyValue(value, func.data, Math.floor(timePassed / FRAME_TIME))
}

const expectPosition = (state: { x: number; y: number }, x: number, y: number) => {
  expect(state).toEqual({ x, y })
}

describe('store', () => {
  const computeFluidPropert = makeComputeFluidProperty({
    value: {
      x: 10,
      y: 0,
    },
    func: {
      data: {
        x: 1,
        y: 1,
      },
      time: 220,
    },
  })
  it('1st hit', () => {
    expectPosition(computeFluidPropert(220), 10, 0)
  })
  it('2nd hit', () => {
    expectPosition(computeFluidPropert(220 + 20 * FRAME_TIME), 30, 20)
  })
})
