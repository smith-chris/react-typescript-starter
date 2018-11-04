import { Graphics } from 'pixi.js'
import { PixiComponent } from '@inlet/react-pixi'

type Props = {
  x: number
  y: number
  size: number
  fill?: number
  alpha?: number
}

export const Circle = PixiComponent<Props, Graphics>('Rectangle', {
  create: () => {
    return new Graphics()
  },
  applyProps: (instance, _, newProps) => {
    const { fill = 0xfffffff, alpha = 1, x, y, size } = newProps
    instance.clear()
    instance.lineStyle(0)
    instance.beginFill(fill, alpha)
    instance.drawCircle(x + size, y + size, size)
    instance.endFill()
  },
})
