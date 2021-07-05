import React, { useCallback, useContext, useRef } from 'react'

import { CarouselContext } from '../CarouselContext'
import { getAbsoluteWidth } from 'app/utils'

import useCarouselTransition from './useCarouselTransition'

const usePrevHandler = listRefCurrent => {
  const { dispatch, state } = useContext(CarouselContext)
  const listRef = useRef(listRefCurrent)
  const setCarouselTransition = useCarouselTransition(listRefCurrent)

  const infinityPrevHandler = useCallback(() => {
    const itemWidth = getAbsoluteWidth(state.slideItemsEl[0])
    const cloneQuant = state.slideItemsEl.length
    const leftMultiplier = state.currentSlide ? Math.abs(state.currentSlide) + 1 : 1

    listRef.current.style.left = `-${
      (itemWidth.fullWidth + itemWidth.margin) * leftMultiplier * cloneQuant
    }px`

    Array.from(state.slideItemsEl)
      .reverse()
      .forEach(elNode => {
        listRef.current.insertBefore(
          elNode.cloneNode(true),
          listRef.current.querySelectorAll('.carousel__item')[0]
        )
      })

    setCarouselTransition(leftMultiplier * 100)
    dispatch({
      type: 'SET_CURRENT_SLIDE',
      payload: state.currentSlide - 1
    })
  }, [state.slideItemsEl, state.currentSlide, setCarouselTransition, dispatch])

  const prevHandler = useCallback(
    swiping => {
      if (state.currentSlide > 0) {
        setCarouselTransition(`-${(state.currentSlide - 1) * 100}`)
        dispatch({
          type: 'SET_CURRENT_SLIDE',
          payload: state.currentSlide - 1
        })
      } else if (state.config.restartOnEnd) {
        setCarouselTransition(`-${state.slideCount * 100}`)
        dispatch({
          type: 'SET_CURRENT_SLIDE',
          payload: state.slideCount
        })
      } else if (state.config.infinity) {
        infinityPrevHandler()
      } else if (swiping) {
        setCarouselTransition('0')
      }
    },
    [
      state.config.infinity,
      state.config.restartOnEnd,
      state.currentSlide,
      state.slideCount,
      setCarouselTransition,
      infinityPrevHandler,
      dispatch
    ]
  )

  return prevHandler
}

export default usePrevHandler
