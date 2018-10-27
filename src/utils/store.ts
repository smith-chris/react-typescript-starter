export const applyValue = <T>(value: T, diff: T, strength: number): T => {
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

export type FluidProperty<T> = {
  value: T
  func: {
    time: number
    data: T
  }
}

export const FRAME_TIME = 1000 / 60

export const makeComputeFluidProperty = <T>(property: FluidProperty<T>) => (
  time: number,
) => {
  const { value, func } = property
  const timePassed = time - property.func.time
  if (timePassed < 0) {
    console.warn(`Time doesnt go backwards! (time=${time})`, property)
    return property.value
  }
  return applyValue(value, func.data, Math.floor(timePassed / FRAME_TIME))
}
