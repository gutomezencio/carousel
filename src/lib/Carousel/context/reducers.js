import * as types from './types'

const reducers = (state, action) => {
  switch (action.type) {
    case types.SET_COUNT: {
      return {
        ...state,
        slideCount: action.payload
      }
    }
    case types.SET_CURRENT_SLIDE: {
      return {
        ...state,
        currentSlide: action.payload
      }
    }
    case types.SET_ITEMS_EL: {
      return {
        ...state,
        slideItemsEl: action.payload
      }
    }
    case types.SET_SLIDE_CHILDREN_ITEMS: {
      return {
        ...state,
        childrenItems: action.payload
      }
    }
    case types.SET_CURRENT_SLIDE_FORMATTED: {
      return {
        ...state,
        currentSlideFormatted: action.payload
      }
    }
    case types.SET_CONFIG: {
      return {
        ...state,
        config: {
          ...state.config,
          ...action.payload
        }
      }
    }
  }

  return {
    ...state
  }
}

export default reducers
