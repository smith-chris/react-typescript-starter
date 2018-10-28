import React from 'react'
import { Rect } from './Rect'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { gameActions } from 'store/game'

const withStore = connect(
  (state: StoreState) => state.game,
  (dispatch: Dispatch) => {
    return bindActionCreators({ ...gameActions }, dispatch)
  },
)

export const Game = withStore(({ increment }) => {
  return (
    <>
      <Rect x={0} y={0} width={100} height={100} />
    </>
  )
})