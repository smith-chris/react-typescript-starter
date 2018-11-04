import R from 'pixi.js/lib/core/math/shapes/Rectangle.js'

export class Point {
  constructor(x, y) {
    this.x = x
    if (!y && y !== 0) {
      this.y = x
    } else {
      this.y = y
    }
  }
}
export const Rectangle = R

Point.ZERO = new Point(0)
