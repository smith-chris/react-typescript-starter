import React from 'react'
import { render } from '@inlet/react-pixi'
import { Provider } from 'react-redux'

import { stage } from 'app/app'
import { store } from 'store/store'
import { Game } from 'components/Game'

render(
  <Provider store={store}>
    <Game />
  </Provider>,
  stage,
)
