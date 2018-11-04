import React from 'react'
import { withStore, actions, Side } from 'utils/withStore'
import { viewport } from 'app/app'
import { Rectangle } from 'utils/point'
import { Circle } from './Circle'

export const Game = withStore(store => store)(position => {
  const bounds = new Rectangle(position.x, position.y, 60, 60)
  if (bounds.top <= 0) {
    actions.bounce(Side.TOP)
  }
  if (bounds.right >= viewport.width) {
    actions.bounce(Side.RIGHT)
  }
  if (bounds.bottom >= viewport.height) {
    actions.bounce(Side.BOTTOM)
  }
  if (bounds.left <= 0) {
    actions.bounce(Side.LEFT)
  }
  return <Circle x={position.x} y={position.y} size={30} />
})
