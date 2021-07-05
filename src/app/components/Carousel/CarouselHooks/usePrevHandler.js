import React, { useCallback, useContext, useRef } from 'react'

import { CarouselContext } from '../CarouselContext'
import { getAbsoluteWidth } from 'app/utils'

const usePrevHandler = (listRefCurrent, applyListTranslation) => {
  const { dispatch, state } = useContext(CarouselContext)
  const listRef = useRef(listRefCurrent)

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

    applyListTranslation(leftMultiplier * 100)
    dispatch({
      type: 'SET_CURRENT_SLIDE',
      payload: state.currentSlide - 1
    })
  }, [state.slideItemsEl, state.currentSlide, applyListTranslation, dispatch])

  const prevHandler = useCallback(
    swiping => {
      if (state.currentSlide > 0) {
        applyListTranslation(`-${(state.currentSlide - 1) * 100}`)
        dispatch({
          type: 'SET_CURRENT_SLIDE',
          payload: state.currentSlide - 1
        })
      } else if (state.config.restartOnEnd) {
        applyListTranslation(`-${state.slideCount * 100}`)
        dispatch({
          type: 'SET_CURRENT_SLIDE',
          payload: state.slideCount
        })
      } else if (state.config.infinity) {
        infinityPrevHandler()
      } else if (swiping) {
        applyListTranslation('0')
      }
    },
    [
      state.config.infinity,
      state.config.restartOnEnd,
      state.currentSlide,
      state.slideCount,
      applyListTranslation,
      infinityPrevHandler,
      dispatch
    ]
  )

  return prevHandler
}

export default usePrevHandler
