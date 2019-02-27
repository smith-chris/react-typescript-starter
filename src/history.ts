type Input = {
  subject?: string
  action: string
  time: number
}

const history: Input[] = []
// @ts-ignore
window.kh = history
export const register = (el: Pick<Input, 'subject' | 'action'>) => {
  history.push({ ...el, time: Date.now() })
}
