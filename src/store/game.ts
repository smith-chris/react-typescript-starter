import { ActionCreator, ActionsUnion } from 'utils/redux'
import { assertNever } from 'utils/other'

export type GameState = {
  count: number
}

const initialState: GameState = {
  count: 0,
}

export const gameActions = {
  increment: ActionCreator('Increment'),
  decrement: ActionCreator('Decrement'),
}

export type GameAction = ActionsUnion<typeof gameActions>

export const gameReducer = (
  state: GameState = initialState,
  action: GameAction,
): GameState => {
  switch (action.type) {
    case 'Increment': {
      return {
        count: state.count + 1,
      }
    }
    case 'Decrement':
      return {
        count: state.count - 1,
      }
    default: {
      return assertNever(action, { state })
    }
  }
}
