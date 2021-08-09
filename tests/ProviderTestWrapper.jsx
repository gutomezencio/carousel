import React, { useReducer } from 'react'
import p from 'prop-types'

import reducers from '../src/app/components/Carousel/context/reducers'
import carouselState from '../src/app/components/Carousel/context/state'
import { CarouselContext } from '../src/app/components/Carousel/context/context'

const ProviderTestWrapper = ({ children, currentState }) => {
  const [state, dispatch] = useReducer(reducers, { ...carouselState, ...currentState })

  return <CarouselContext.Provider value={{ state, dispatch }}>{children}</CarouselContext.Provider>
}

ProviderTestWrapper.propTypes = {
  children: p.node.isRequired,
  currentState: p.object.isRequired
}

export default ProviderTestWrapper
