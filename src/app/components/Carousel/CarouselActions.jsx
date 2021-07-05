import React, { useImperativeHandle, useContext, useCallback, useEffect, forwardRef } from 'react'
import PropTypes from 'prop-types'

import { CarouselContext } from './CarouselContext'

import useNextHandler from './CarouselHooks/useNextHandler'
import usePrevHandler from './CarouselHooks/usePrevHandler'

import './Carousel.scoped.scss'

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
      update: function (newState) {
        this.state = {
          ...this.state,
          ...newState
        }
      }
    }

    const nextHandler = useNextHandler(listRefCurrent, wrapperRefCurrent)
    const prevHandler = usePrevHandler(listRefCurrent)

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
      event.preventDefault()

      const style = window.getComputedStyle(listRefCurrent)
      const matrix = new DOMMatrixReadOnly(style.transform)
      const firstX = event.screenX || event.changedTouches[0].clientX
      const currentTranslate = matrix.m41

      swipingControl.update({
        active: true,
        firstX,
        firstY: event.changedTouches?.[0].clientY,
        currentTranslate
      })

      listRefCurrent.style.transform = `translate3d(${currentTranslate}px, 0, 0)`
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

        // console.log('Y', Math.abs(event.changedTouches[0].clientY - swipingControl.state.firstY))
        // console.log('X', Math.abs(event.changedTouches[0].clientX - swipingControl.state.firstX))

        if (
          !event.screenX &&
          Math.abs(event.changedTouches[0].clientY - swipingControl.state.firstY) > 150
        ) {
          console.log('NO SW')
          return false
        }

        listRefCurrent.style.transform = `translate3d(${
          swipingControl.state.currentTranslate + currentX
        }px, 0, 0)`
      }
    }

    const swipeEndHandler = event => {
      if (swipingControl.state.active) {
        if (event.screenX) {
          if (event.screenX - swipingControl.state.firstX > 0) {
            ref.current.prevHandler(true)
          } else {
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
          >
            Prev
          </button>

          <button
            type="button"
            onClick={event => nextHandler(event)}
            className={`carousel__actions__button ${
              buttonInactive('next') ? 'carousel__actions__button--inactive' : ''
            }`}
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
  listRefCurrent: PropTypes.object,
  wrapperRefCurrent: PropTypes.object,
  toggleSwipingClass: PropTypes.func
}

export default CarouselActions
