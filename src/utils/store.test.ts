import { applyValue, makeComputeFluidProperty, FRAME_TIME } from './store'

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

const expectPosition = (state: { x: number; y: number }, x: number, y: number) => {
  expect(state).toEqual({ x, y })
}

describe('store', () => {
  const computeFluidProperty = makeComputeFluidProperty({
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
    expectPosition(computeFluidProperty(220), 10, 0)
  })
  it('2nd hit', () => {
    expectPosition(computeFluidProperty(220 + 20 * FRAME_TIME), 30, 20)
  })
  it('makes real world walues', () => {
    const startTime = 0
    const getStore = makeComputeFluidProperty({
      value: {
        x: 10,
        y: 0,
      },
      func: {
        data: {
          x: 1.5,
          y: 1.3,
        },
        time: startTime * FRAME_TIME,
      },
    })
    const results = []
    for (let s = startTime; s < 20 + startTime; s++) {
      results.push(getStore(s * FRAME_TIME).x)
    }
    expect(results).toEqual([
      10,
      11.5,
      13,
      14.5,
      16,
      17.5,
      19,
      20.5,
      22,
      23.5,
      25,
      26.5,
      28,
      29.5,
      31,
      32.5,
      34,
      35.5,
      37,
      38.5,
    ])
  })
})
