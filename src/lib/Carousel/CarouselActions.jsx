import React, { useImperativeHandle, useContext, useCallback, useEffect, forwardRef } from 'react'
import PropTypes from 'prop-types'

import { CarouselContext } from './context/context'

import useNextHandler from './hooks/useNextHandler'
import usePrevHandler from './hooks/usePrevHandler'

import useCarouselTransition from './hooks/useCarouselTransition'

import './CarouselActions.scss'

const CarouselActions = forwardRef(
  ({ listRefCurrent, wrapperRefCurrent, toggleSwipingClass }, ref) => {
    const { state } = useContext(CarouselContext)
    const swipingControl = {
      state: {
        active: false,
        firstX: null,
        firstY: null,
        currentTranslate: null,
        swipeClass: false
      },
      update(newState) {
        this.state = {
          ...this.state,
          ...newState
        }
      }
    }

    const nextHandler = useNextHandler(listRefCurrent, wrapperRefCurrent)
    const prevHandler = usePrevHandler(listRefCurrent)
    const setCarouselTransition = useCarouselTransition(listRefCurrent)

    const buttonInactive = useCallback(
      type => {
        if (!state.config.infinity && !state.config.restartOnEnd) {
          if (type === 'next') {
            return state.currentSlide === state.slideCount
          } else if (type === 'prev') {
            return state.currentSlide === 0
          }
        }

        return false
      },
      [state.currentSlide, state.slideCount, state.config.infinity, state.config.restartOnEnd]
    )

    const swipeStartHandler = event => {
      const matrix = new DOMMatrixReadOnly(window.getComputedStyle(listRefCurrent).transform)
      const firstX = event.screenX || event.changedTouches[0].clientX
      const firstY = event.screenY || event.changedTouches[0].clientY
      const currentTranslate = matrix.m41

      swipingControl.update({
        active: true,
        firstX,
        firstY,
        currentTranslate
      })

      setCarouselTransition(currentTranslate, 'px')
    }

    const touchEndHandler = changedTouches => {
      const { clientX: x, clientY: y } = changedTouches
      const distanceX = Math.abs(x - swipingControl.state.firstX)
      const distanceY = Math.abs(y - swipingControl.state.firstY)

      if (distanceX > 15 && distanceY < 100) {
        if (x < swipingControl.state.firstX) {
          ref.current.nextHandler(true)
        } else if (x > swipingControl.state.firstX) {
          ref.current.prevHandler(true)
        }
      }
    }

    const swipeMoveHandler = event => {
      if (swipingControl.state.active) {
        toggleSwipingClass(true)

        const eventX = event.screenX || event.changedTouches[0].clientX
        const currentX = eventX - swipingControl.state.firstX

        if (
          !event.screenX &&
          Math.abs(event.changedTouches[0].clientY - swipingControl.state.firstY) > 150
        ) {
          swipingControl.update({
            active: false,
            firstX: null,
            firstY: null,
            currentTranslate: null
          })

          toggleSwipingClass(false)
          return false
        }

        setCarouselTransition(swipingControl.state.currentTranslate + currentX, 'px')
      }
    }

    const swipeEndHandler = event => {
      if (swipingControl.state.active) {
        if (event.screenX) {
          const xDiff = event.screenX - swipingControl.state.firstX

          if (xDiff > 0) {
            ref.current.prevHandler(true)
          } else if (xDiff < 0) {
            ref.current.nextHandler(true)
          }
        } else {
          touchEndHandler(event.changedTouches[0])
        }

        swipingControl.update({
          active: false,
          firstX: null,
          firstY: null,
          currentTranslate: null
        })

        toggleSwipingClass(false)
      }
    }

    const swipeEventListener = () => {
      wrapperRefCurrent.addEventListener('mousedown', swipeStartHandler)
      wrapperRefCurrent.addEventListener('mousemove', swipeMoveHandler)
      wrapperRefCurrent.addEventListener('mouseup', swipeEndHandler)

      return () => {
        wrapperRefCurrent.removeEventListener('mousedown', swipeStartHandler)
        wrapperRefCurrent.removeEventListener('mousemove', swipeMoveHandler)
        wrapperRefCurrent.removeEventListener('mouseup', swipeEndHandler)
      }
    }
    const touchEventListener = () => {
      wrapperRefCurrent.addEventListener('touchstart', swipeStartHandler)
      wrapperRefCurrent.addEventListener('touchmove', swipeMoveHandler)
      wrapperRefCurrent.addEventListener('touchend', swipeEndHandler)

      return () => {
        wrapperRefCurrent.removeEventListener('touchstart', swipeStartHandler)
        wrapperRefCurrent.removeEventListener('touchmove', swipeMoveHandler)
        wrapperRefCurrent.removeEventListener('touchend', swipeEndHandler)
      }
    }

    useEffect(swipeEventListener, [])
    useEffect(touchEventListener, [])

    useImperativeHandle(ref, () => ({
      prevHandler,
      nextHandler
    }))

    return (
      !state.config.hideActions && (
        <div className="carousel__actions">
          <button
            type="button"
            onClick={event => prevHandler(event)}
            className={`carousel__actions__button ${
              buttonInactive('prev') ? 'carousel__actions__button--inactive' : ''
            }`}
            disabled={buttonInactive('prev')}
          >
            Prev
          </button>

          <button
            type="button"
            onClick={event => nextHandler(event)}
            className={`carousel__actions__button ${
              buttonInactive('next') ? 'carousel__actions__button--inactive' : ''
            }`}
            disabled={buttonInactive('next')}
          >
            Next
          </button>
        </div>
      )
    )
  }
)

CarouselActions.displayName = 'CarouselActions'

CarouselActions.propTypes = {
  listRefCurrent: PropTypes.object.isRequired,
  wrapperRefCurrent: PropTypes.object.isRequired,
  toggleSwipingClass: PropTypes.func.isRequired
}

export default CarouselActions
