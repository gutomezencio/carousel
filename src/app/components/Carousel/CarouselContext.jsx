import React, { createContext, useReducer } from 'react'
import PropTypes from 'prop-types'

import carouselState from './state'

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_COUNT': {
      return {
        ...state,
        slideCount: action.payload
      }
    }
    case 'SET_CURRENT_SLIDE': {
      return {
        ...state,
        currentSlide: action.payload
      }
    }
    case 'SET_ITEMS_EL': {
      return {
        ...state,
        slideItemsEl: action.payload
      }
    }
    case 'SET_SLIDE_CHILDREN_ITEMS': {
      return {
        ...state,
        childrenItems: action.payload
      }
    }
    case 'SET_CURRENT_SLIDE_FORMATTED': {
      return {
        ...state,
        currentSlideFormatted: action.payload
      }
    }
  }

  return {
    ...state
  }
}

export const CarouselContext = createContext()

const CarouselContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, carouselState)

  return <CarouselContext.Provider value={{ state, dispatch }}>{children}</CarouselContext.Provider>
}

CarouselContextProvider.propTypes = {
  children: PropTypes.node
}

export default CarouselContextProvider
