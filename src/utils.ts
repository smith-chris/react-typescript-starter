import keyboardjs from 'keyboardjs'

export const repeatKey = (keyName: string, onRepeat: () => void) => {
  keyboardjs.bind(keyName, onRepeat, onRepeat)
}

export const handleKey: typeof keyboardjs.bind = (keyName, onPress, onRelease) => {
  keyboardjs.bind(
    'up',
    (...args) => {
      const [e] = args
      if (e) {
        e.preventRepeat()
      }
      onPress(...args)
    },
    onRelease,
  )
}
