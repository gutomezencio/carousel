import React from 'react'

import {
  Router,
  Route
} from 'react-router-dom'

import { createBrowserHistory } from 'history'

const history = createBrowserHistory()

import Carousel from 'app/modules/Carousel'

const App = () => {
  return (
    <Router history={ history }>
      <main className="app">
        <Route exact={ true } path="/" component={ Carousel } />
      </main>
    </Router>
  )
}

export {
  history
}
export default App
