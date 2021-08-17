import React, { useReducer } from 'react'
import PropTypes from 'prop-types'

import carouselState from './state'
import reducers from './reducers'

import { CarouselContext } from './context'

const CarouselContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducers, carouselState)

  // prettier-ignore
  return (
    <CarouselContext.Provider value={{ state, dispatch }}>
      {children}
    </CarouselContext.Provider>
  )
}

CarouselContextProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export default CarouselContextProvider
