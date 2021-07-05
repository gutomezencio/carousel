import React, { useCallback, useContext, useRef } from 'react'

import { CarouselContext } from '../CarouselContext'
import { getAbsoluteWidth } from 'app/utils'

import useCarouselTransition from './useCarouselTransition'
const useNextHandler = (listRefCurrent, wrapperRefCurrent) => {
  const { dispatch, state } = useContext(CarouselContext)
  const listRef = useRef(listRefCurrent)
  const wrapperRef = useRef(wrapperRefCurrent)
  const setCarouselTransition = useCarouselTransition(listRefCurrent)

  const infinityNextHandler = useCallback(() => {
    const itemWidth = getAbsoluteWidth(state.slideItemsEl[0])
    const wrapperWidth = getAbsoluteWidth(wrapperRef.current)

    const currentItemsEls = listRef.current.querySelectorAll('.carousel__item')
    const listWidth =
      itemWidth.fullWidth * currentItemsEls.length -
      itemWidth.margin -
      listRef.current.style.left.replace(/px|-/g, '')
    const currentCount = parseInt(listWidth / wrapperWidth.fullWidth)
    const translationMultiplier =
      state.currentSlide < 0 ? Math.abs(state.currentSlide) - 1 : state.currentSlide + 1

    if (currentCount === state.currentSlide + 1) {
      Array.from(state.slideItemsEl).forEach(elNode => {
        const currentEls = listRef.current.querySelectorAll('.carousel__item')

        listRef.current.insertBefore(
          elNode.cloneNode(true),
          currentEls[currentEls.length - 1].nextSibling
        )
      })
    }

    setCarouselTransition(`${state.currentSlide < 0 ? '' : '-'}${translationMultiplier * 100}`)
    dispatch({
      type: 'SET_CURRENT_SLIDE',
      payload: state.currentSlide + 1
    })
  }, [state.slideItemsEl, state.currentSlide, setCarouselTransition, dispatch])

  const nextHandler = useCallback(
    swiping => {
      if (state.config.infinity && !state.config.restartOnEnd) {
        infinityNextHandler()
      } else if (state.currentSlide < state.slideCount) {
        setCarouselTransition(`-${(state.currentSlide + 1) * 100}`)
        dispatch({
          type: 'SET_CURRENT_SLIDE',
          payload: state.currentSlide + 1
        })
      } else if (state.config.restartOnEnd) {
        setCarouselTransition(0)
        dispatch({
          type: 'SET_CURRENT_SLIDE',
          payload: 0
        })
      } else if (swiping) {
        setCarouselTransition(`-${state.currentSlide * 100}`)
      }
    },
    [
      state.config.infinity,
      state.config.restartOnEnd,
      state.currentSlide,
      state.slideCount,
      infinityNextHandler,
      setCarouselTransition,
      dispatch
    ]
  )

  return nextHandler
}

export default useNextHandler
