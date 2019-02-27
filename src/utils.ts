import keyboardjs from 'keyboardjs'
import { register } from 'history'

type Callback = () => void

type Handler = {
  onPress: Callback[]
  onRelease: Callback[]
}

const handlers: Record<string, Handler> = {}

export const handlePress = (keyName: string) => () => {
  const handler = handlers[keyName]
  if (handler) {
    register({ subject: keyName, action: 'press' })
    handler.onPress.forEach(f => f())
  } else {
    console.warn('No handler for ' + keyName)
  }
}

export const handleRelease = (keyName: string) => () => {
  const handler = handlers[keyName]
  if (handler) {
    handler.onRelease.forEach(f => f())
  } else {
    console.warn('No handler for ' + keyName)
  }
}

const registerKey = (keyName: string) => {
  keyboardjs.bind(keyName, handlePress(keyName), handleRelease(keyName))
}

const getHandler = (keyName: string): Handler => {
  let handler = handlers[keyName]
  if (!handler) {
    handler = handlers[keyName] = { onPress: [], onRelease: [] }
    registerKey(keyName)
  }
  return handler
}

export const onKey = (keyName: string, onPress: Callback, onRelease?: Callback) => {
  const handler = getHandler(keyName)
  handler.onPress.push(onPress)
  if (onRelease) {
    handler.onRelease.push(onRelease)
  }
}
