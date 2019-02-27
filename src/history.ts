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
export const snapshots: Snapshot[] = []
// @ts-ignore
window.ss = snapshots

let _isPlaying = true
export const stop = () => {
  _isPlaying = false
}
export const isPlaying = () => _isPlaying
export const start = () => {
  _isPlaying = true
}
app.ticker.add(delta => {
  if (_isPlaying) {
    frameTimes.push(delta)
  }
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
