import React from 'react'
import { hot } from 'react-hot-loader'

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'


import Carousel from 'app/modules/Carousel'

import 'app/styles/default.scss'

const App = () => {
  return (
    <Router>
      <main className="app">
        <Route exact={ true } path="/" component={ Carousel } />
      </main>
    </Router>
  )
}

export default hot(module)(App)
