import keyboardjs from 'keyboardjs'
import { register } from 'history'

export const onKey = (keyName: string, onPress: () => void, onRelease?: () => void) => {
  keyboardjs.bind(
    keyName,
    () => {
      register({ subject: keyName, action: 'press' })
      onPress()
    },
    () => {
      if (typeof onRelease === 'function') {
        register({ subject: keyName, action: 'release' })
        onRelease()
      }
    },
  )
}
