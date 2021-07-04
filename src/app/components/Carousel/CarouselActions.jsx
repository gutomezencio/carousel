import React, {
  useImperativeHandle,
  useContext,
  useCallback,
  useEffect,
  useRef,
  forwardRef
} from 'react'
import PropTypes from 'prop-types'

import { CarouselContext } from './CarouselContext'
import { getAbsoluteWidth } from 'app/utils'

import './Carousel.scoped.scss'

const CarouselActions = forwardRef(
  ({ applyListTranslation, listRefCurrent, wrapperRefCurrent, toggleSwipingClass }, ref) => {
    const { dispatch, state } = useContext(CarouselContext)
    const instanceRef = useRef()
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

    const infinityNextHandler = useCallback(() => {
      const itemWidth = getAbsoluteWidth(state.slideItemsEl[0])
      const wrapperWidth = getAbsoluteWidth(wrapperRefCurrent)

      const currentItemsEls = listRefCurrent.querySelectorAll('.carousel__item')
      const listWidth =
        itemWidth.fullWidth * currentItemsEls.length -
        itemWidth.margin -
        listRefCurrent.style.left.replace(/px|-/g, '')
      const currentCount = parseInt(listWidth / wrapperWidth.fullWidth)
      const translationMultiplier =
        state.currentSlide < 0 ? Math.abs(state.currentSlide) - 1 : state.currentSlide + 1

      if (currentCount === state.currentSlide + 1) {
        Array.from(state.slideItemsEl).forEach(elNode => {
          const currentEls = listRefCurrent.querySelectorAll('.carousel__item')

          listRefCurrent.insertBefore(
            elNode.cloneNode(true),
            currentEls[currentEls.length - 1].nextSibling
          )
        })
      }

      applyListTranslation(`${state.currentSlide < 0 ? '' : '-'}${translationMultiplier * 100}`)
      dispatch({
        type: 'SET_CURRENT_SLIDE',
        payload: state.currentSlide + 1
      })
    }, [
      state.slideItemsEl,
      state.currentSlide,
      wrapperRefCurrent,
      listRefCurrent,
      applyListTranslation,
      dispatch
    ])

    const infinityPrevHandler = useCallback(() => {
      const itemWidth = getAbsoluteWidth(state.slideItemsEl[0])
      const cloneQuant = state.slideItemsEl.length
      const leftMultiplier = state.currentSlide ? Math.abs(state.currentSlide) + 1 : 1

      listRefCurrent.style.left = `-${
        (itemWidth.fullWidth + itemWidth.margin) * leftMultiplier * cloneQuant
      }px`

      Array.from(state.slideItemsEl)
        .reverse()
        .forEach(elNode => {
          listRefCurrent.insertBefore(
            elNode.cloneNode(true),
            listRefCurrent.querySelectorAll('.carousel__item')[0]
          )
        })

      applyListTranslation(leftMultiplier * 100)
      dispatch({
        type: 'SET_CURRENT_SLIDE',
        payload: state.currentSlide - 1
      })
    }, [state.slideItemsEl, state.currentSlide, listRefCurrent, applyListTranslation, dispatch])

    const nextHandler = useCallback(
      swiping => {
        if (state.config.infinity && !state.config.restartOnEnd) {
          infinityNextHandler()
        } else if (state.currentSlide < state.slideCount) {
          applyListTranslation(`-${(state.currentSlide + 1) * 100}`)
          dispatch({
            type: 'SET_CURRENT_SLIDE',
            payload: state.currentSlide + 1
          })
        } else if (state.config.restartOnEnd) {
          applyListTranslation(0)
          dispatch({
            type: 'SET_CURRENT_SLIDE',
            payload: 0
          })
        } else if (swiping) {
          applyListTranslation(`-${state.currentSlide * 100}`)
        }
      },
      [
        state.config.infinity,
        state.config.restartOnEnd,
        state.currentSlide,
        state.slideCount,
        infinityNextHandler,
        applyListTranslation,
        dispatch
      ]
    )

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
          instanceRef.current.nextHandler(true)
        } else if (x > swipingControl.state.firstX) {
          instanceRef.current.prevHandler(true)
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
            instanceRef.current.prevHandler(true)
          } else {
            instanceRef.current.nextHandler(true)
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

    useImperativeHandle(instanceRef, () => ({
      prevHandler,
      nextHandler
    }))

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
  infinity: PropTypes.bool,
  restartOnEnd: PropTypes.bool,
  applyListTranslation: PropTypes.func,
  listRefCurrent: PropTypes.object,
  carouselRef: PropTypes.object,
  wrapperRefCurrent: PropTypes.object,
  componentRef: PropTypes.object,
  toggleSwipingClass: PropTypes.func
}

export default CarouselActions
