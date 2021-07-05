import React, { useContext, useCallback } from 'react'

import { CarouselContext } from '../CarouselContext'

import useCarouselTransition from './useCarouselTransition'
const useGoToSlide = listRefCurrent => {
  const { dispatch, state } = useContext(CarouselContext)
  const setCarouselTransition = useCarouselTransition(listRefCurrent)

  const goToSlide = useCallback(
    slideNumber => {
      const insideNumber = slideNumber - 1

      if (!state.config.infinity && insideNumber >= 0 && insideNumber <= state.slideCount) {
        setCarouselTransition(`-${insideNumber * 100}`)
        dispatch({
          type: 'SET_CURRENT_SLIDE',
          payload: insideNumber
        })
      }
    },
    [state.config.infinity, state.slideCount, setCarouselTransition, dispatch]
  )

  return goToSlide
}

export default useGoToSlide