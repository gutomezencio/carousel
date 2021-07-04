import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
  forwardRef,
  useImperativeHandle
} from 'react'
import PropTypes from 'prop-types'

import './Carousel.scoped.scss'

import CarouselContextProvider, { CarouselContext } from './CarouselContext'

import { getAbsoluteWidth, waitForElementWidth } from 'app/utils'

const Carousel = forwardRef(
  (
    {
      children,
      visibleItems,
      infinity = false,
      restartOnEnd = false,
      onChange = () => {},
      showCurrentNumber = false,
      showNavigation = false,
      hideActions = false,
      height,
      width,
      ...rest
    },
    ref
  ) => {
    const { dispatch, state } = useContext(CarouselContext)
    const carouselRef = useRef()
    const wrapperRef = useRef()
    const listRef = useRef()
    const componentRef = useRef()

    const applyListTranslation = useCallback(
      translationValue => {
        listRef.current.style.transform = `translate3d(${translationValue}%, 0, 0)`
      },
      [listRef]
    )

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

      applyListTranslation(`${state.currentSlide < 0 ? '' : '-'}${translationMultiplier * 100}`)
      dispatch({
        type: 'SET_CURRENT_SLIDE',
        payload: state.currentSlide + 1
      })
    }, [state.slideItemsEl, state.currentSlide, applyListTranslation, dispatch])

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

    const nextHandler = useCallback(() => {
      if (infinity && !restartOnEnd) {
        infinityNextHandler()
      } else if (state.currentSlide < state.slideCount) {
        applyListTranslation(`-${(state.currentSlide + 1) * 100}`)
        dispatch({
          type: 'SET_CURRENT_SLIDE',
          payload: state.currentSlide + 1
        })
      } else if (restartOnEnd) {
        applyListTranslation(0)
        dispatch({
          type: 'SET_CURRENT_SLIDE',
          payload: 0
        })
      } else if (state.isSwiping.active) {
        applyListTranslation(`-${state.currentSlide * 100}`)
      }
    }, [
      infinity,
      restartOnEnd,
      state.currentSlide,
      state.slideCount,
      state.isSwiping.active,
      infinityNextHandler,
      applyListTranslation,
      dispatch
    ])

    const prevHandler = useCallback(() => {
      if (state.currentSlide > 0) {
        applyListTranslation(`-${(state.currentSlide - 1) * 100}`)
        dispatch({
          type: 'SET_CURRENT_SLIDE',
          payload: state.currentSlide - 1
        })
      } else if (restartOnEnd) {
        applyListTranslation(`-${state.slideCount * 100}`)
        dispatch({
          type: 'SET_CURRENT_SLIDE',
          payload: state.slideCount
        })
      } else if (infinity) {
        infinityPrevHandler()
      } else if (state.isSwiping.active) {
        applyListTranslation('0')
      }
    }, [
      infinity,
      restartOnEnd,
      state.currentSlide,
      state.isSwiping.active,
      state.slideCount,
      applyListTranslation,
      infinityPrevHandler,
      dispatch
    ])

    const checkAndInitInfinity = useCallback(
      (infinity, count, itemsEls) => {
        if (infinity && count === 0) {
          const wrapperWidth = getAbsoluteWidth(wrapperRef.current)
          const elWidth = getAbsoluteWidth(itemsEls[0])
          const allowedQuant = wrapperWidth.fullWidth / elWidth.fullWidth

          if (allowedQuant - itemsEls.length !== 0) {
            Array.from(itemsEls).forEach(elNode => {
              const currentEls = listRef.current.querySelectorAll('.carousel__item')

              listRef.current.insertBefore(
                elNode.cloneNode(true),
                currentEls[currentEls.length - 1].nextSibling
              )
            })

            return listRef.current.querySelectorAll('.carousel__item')
          }
        }

        return itemsEls
      },
      [listRef]
    )

    const initCarouselValues = useCallback(async () => {
      console.log('HERE')
      let itemsEls = listRef.current.querySelectorAll('.carousel__item')
      const itemsLength = itemsEls.length

      if (itemsLength) {
        let count = 0
        let elWidth = getAbsoluteWidth(itemsEls[0])
        const wrapperWidth = getAbsoluteWidth(wrapperRef.current)

        if (!visibleItems) {
          if (elWidth.fullWidth === 0) {
            await waitForElementWidth(itemsEls[0])

            elWidth = getAbsoluteWidth(itemsEls[0])
          }

          let listWidth = elWidth.fullWidth * itemsLength - elWidth.margin
          count = parseInt(listWidth / wrapperWidth.fullWidth)
        } else {
          count = parseInt(itemsLength / visibleItems)
          count = itemsLength % visibleItems === 0 ? count - 1 : count
        }

        itemsEls = checkAndInitInfinity(infinity, count, itemsEls)

        dispatch({
          type: 'SET_COUNT',
          payload: count
        })
        dispatch({
          type: 'SET_ITEMS_EL',
          payload: itemsEls
        })
      }
    }, [visibleItems, checkAndInitInfinity, infinity, dispatch])

    useEffect(() => {
      if (state.childrenItems) {
        initCarouselValues()
      }
    }, [state.childrenItems, initCarouselValues, dispatch])

    const initCarouselChildrens = () => {
      if (children && carouselRef?.current) {
        if (width) {
          carouselRef.current.style.width = width
        }

        const processedItems = children.map((item, index) => {
          return React.cloneElement(item, {
            key: index,
            className: item.props.className + ' carousel__item',
            style: {
              ...item.style,
              ...(visibleItems
                ? {
                    minWidth: `${100 / visibleItems}%`,
                    marginRight: '0'
                  }
                : {}),
              ...(height ? { height } : {})
            }
          })
        })

        dispatch({
          type: 'SET_SLIDE_CHILDREN_ITEMS',
          payload: processedItems
        })
      }
    }

    useEffect(initCarouselChildrens, [dispatch, children, wrapperRef, width, visibleItems, height])

    const buttonInactive = useCallback(
      type => {
        if (!infinity && !restartOnEnd) {
          if (type === 'next') {
            return state.currentSlide === state.slideCount
          } else if (type === 'prev') {
            return state.currentSlide === 0
          }
        }

        return false
      },
      [state.currentSlide, state.slideCount, infinity, restartOnEnd]
    )

    useEffect(() => {
      const formattedCurrentSlide =
        state.currentSlide >= 0 ? state.currentSlide + 1 : state.currentSlide
      // const totalSlides = slideCount ? slideCount + 1 : 0

      dispatch({
        type: 'SET_CURRENT_SLIDE_FORMATTED',
        payload: formattedCurrentSlide
      })
    }, [state.currentSlide, state.slideCount, dispatch])

    const goToSlide = useCallback(
      slideNumber => {
        const insideNumber = slideNumber - 1

        if (!infinity && insideNumber >= 0 && insideNumber <= state.slideCount) {
          listRef.current.style.transform = `translate3d(-${insideNumber * 100}%, 0, 0)`
          dispatch({
            type: 'SET_CURRENT_SLIDE',
            payload: insideNumber
          })
        }
      },
      [infinity, state.slideCount, dispatch]
    )

    const swipeStartHandler = event => {
      event.preventDefault()

      const style = window.getComputedStyle(listRef.current)
      const matrix = new DOMMatrixReadOnly(style.transform)
      const firstX = event.screenX || event.changedTouches[0].clientX
      const currentTranslate = matrix.m41

      dispatch({
        type: 'SET_IS_SWIPING',
        payload: {
          active: true,
          firstX,
          firstY: event.changedTouches?.[0].clientY,
          currentTranslate
        }
      })

      listRef.current.style.transform = `translate3d(${currentTranslate}px, 0, 0)`
    }

    const touchEndHandler = changedTouches => {
      console.log('TOUCH END')
      const { clientX: x, clientY: y } = changedTouches
      const distanceX = Math.abs(x - state.isSwiping.firstX)
      const distanceY = Math.abs(y - state.isSwiping.firstY)

      if (distanceX > 15 && distanceY < 100) {
        if (x < state.isSwiping.firstX) {
          componentRef.current.nextHandler()
        } else if (x > state.isSwiping.firstX) {
          componentRef.current.prevHandler()
        }
      }
    }

    const swipeMoveHandler = event => {
      if (state.isSwiping.active) {
        if (!state.isSwiping.swipeClass) {
          dispatch({
            type: 'SET_IS_SWIPING',
            payload: {
              swipeClass: true
            }
          })
        }

        const eventX = event.screenX || event.changedTouches[0].clientX
        const currentX = eventX - state.isSwiping.firstX

        console.log('Y', Math.abs(event.changedTouches[0].clientY - state.isSwiping.firstY))
        console.log('X', Math.abs(event.changedTouches[0].clientX - state.isSwiping.firstX))

        if (
          !event.screenX &&
          Math.abs(event.changedTouches[0].clientY - state.isSwiping.firstY) > 150
        ) {
          console.log('NO SW')
          return false
        }

        console.log('TRANS?')

        listRef.current.style.transform = `translate3d(${
          state.isSwiping.currentTranslate + currentX
        }px, 0, 0)`
      }
    }

    const swipeEndHandler = event => {
      if (state.isSwiping.active) {
        // event.preventDefault()

        if (event.screenX) {
          if (event.screenX - state.isSwiping.firstX > 0) {
            componentRef.current.prevHandler()
          } else {
            componentRef.current.nextHandler()
          }
        } else {
          touchEndHandler(event.changedTouches[0])
        }

        dispatch({
          type: 'IS_SWIPING',
          payload: {
            active: false,
            firstX: null,
            firstY: null,
            currentTranslate: null,
            swipeClass: false
          }
        })
      }
    }

    const swipeEventListener = () => {
      const currentWrapper = wrapperRef.current
      const currentComponent = componentRef.current

      currentWrapper.addEventListener('mousedown', event => {
        currentComponent.swipeStartHandler(event)
      })
      currentWrapper.addEventListener('mousemove', event => {
        currentComponent.swipeMoveHandler(event)
      })
      currentWrapper.addEventListener('mouseup', event => {
        currentComponent.swipeEndHandler(event)
      })

      return () => {
        currentWrapper.removeEventListener('mousedown', event => {
          currentComponent.swipeStartHandler(event)
        })
        currentWrapper.removeEventListener('mousemove', event => {
          currentComponent.swipeMoveHandler(event)
        })
        currentWrapper.removeEventListener('mouseup', event => {
          currentComponent.swipeEndHandler(event)
        })
      }
    }
    const touchEventListener = () => {
      const currentWrapper = wrapperRef.current
      const currentComponent = componentRef.current

      currentWrapper.addEventListener('touchstart', event => {
        currentComponent.swipeStartHandler(event)
      })
      currentWrapper.addEventListener('touchmove', event => {
        currentComponent.swipeMoveHandler(event)
      })
      currentWrapper.addEventListener('touchend', event => {
        currentComponent.swipeEndHandler(event)
      })

      return () => {
        currentWrapper.removeEventListener('touchstart', event => {
          currentComponent.swipeStartHandler(event)
        })
        currentWrapper.removeEventListener('touchmove', event => {
          currentComponent.swipeMoveHandler(event)
        })
        currentWrapper.removeEventListener('touchend', event => {
          currentComponent.swipeEndHandler(event)
        })
      }
    }

    useEffect(swipeEventListener, [])
    useEffect(touchEventListener, [])

    useImperativeHandle(componentRef, () => ({
      prevHandler,
      nextHandler,
      swipeStartHandler,
      swipeMoveHandler,
      swipeEndHandler
    }))

    useImperativeHandle(ref, () => ({
      goToSlide,
      previous: prevHandler,
      next: nextHandler
    }))

    return (
      <div className="carousel" ref={carouselRef} {...rest}>
        <div className="carousel__wrapper" ref={wrapperRef}>
          <div
            className={`carousel__list ${
              state.isSwiping.swipeClass ? 'carousel__list--swiping' : ''
            }`}
            ref={listRef}
          >
            {state.childrenItems}
          </div>
        </div>

        {showCurrentNumber && state.slideCount && (
          <div className="carousel__number">{state.currentSlideFormatted}</div>
        )}

        {showNavigation && state.slideCount && !infinity && (
          <div className="carousel__navigation">
            {Array.from(Array(state.slideCount + 1).keys()).map((_, index) => {
              return (
                <button
                  type="button"
                  key={`navigation-${index}`}
                  onClick={() => goToSlide(index + 1)}
                  className={`carousel__navigation__number ${
                    state.currentSlide === index ? 'carousel__navigation__number--current' : ''
                  }`}
                >
                  {index + 1}
                </button>
              )
            })}
          </div>
        )}

        {!hideActions && (
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
        )}
      </div>
    )
  }
)

Carousel.displayName = 'Carousel'

Carousel.propTypes = {
  visibleItems: PropTypes.number,
  infinity: PropTypes.bool,
  restartOnEnd: PropTypes.bool,
  children: PropTypes.array.isRequired,
  height: PropTypes.string,
  width: PropTypes.string,
  onChange: PropTypes.func,
  showCurrentNumber: PropTypes.bool,
  showNavigation: PropTypes.bool,
  hideActions: PropTypes.bool
}

const CarouselWrapper = forwardRef(({ children, ...rest }, ref) => {
  return (
    <CarouselContextProvider>
      <Carousel {...rest} ref={ref}>
        {children}
      </Carousel>
    </CarouselContextProvider>
  )
})

CarouselWrapper.displayName = 'CarouselWrapper'

CarouselWrapper.propTypes = {
  children: PropTypes.node
}

export default CarouselWrapper
