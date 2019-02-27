import { app } from 'app/app'

type Input = {
  subject?: string
  action: string
}

type Snapshot = {
  frameIndex: number
  inputs: Input[]
}

export const frameTimes: number[] = []
const snapshots: Snapshot[] = []
// @ts-ignore
window.ss = snapshots

app.ticker.add(delta => {
  frameTimes.push(delta)
})

const getCurrentSnapshot = (): Snapshot => {
  const currentFrameIndex = Math.max(frameTimes.length - 1, 0)
  const lastSnapshot = snapshots[snapshots.length - 1]
  if (lastSnapshot && lastSnapshot.frameIndex === currentFrameIndex) {
    return lastSnapshot
  }
  const newSnapshot = { frameIndex: currentFrameIndex, inputs: [] }
  snapshots.push(newSnapshot)
  return newSnapshot
}

export const register = (input: Input) => {
  getCurrentSnapshot().inputs.push(input)
}
