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

    const [currentSlide, setCurrentSlide] = useState(0)
    const [slideCount, setSlideCount] = useState(null)
    const [slideItemsEl, setSlideItemsEl] = useState(null)
    const [childrenItems, setChildrenItems] = useState(null)
    const [currentSlideFormatted, setCurrentSlideFormatted] = useState(null)
    const [isSwiping, setIsSwiping] = useState({
      active: false,
      firstX: null,
      firstY: null,
      currentTranslate: null,
      swipeClass: false
    })

    const applyListTranslation = useCallback(
      translationValue => {
        listRef.current.style.transform = `translate3d(${translationValue}%, 0, 0)`
      },
      [listRef]
    )

    console.log('CONTEXT STATE', state)
    console.log('COMPONENT STATE', {
      currentSlide,
      slideCount,
      slideItemsEl,
      childrenItems,
      currentSlideFormatted,
      isSwiping
    })

    const infinityNextHandler = useCallback(() => {
      const itemWidth = getAbsoluteWidth(slideItemsEl[0])
      const wrapperWidth = getAbsoluteWidth(wrapperRef.current)

      const currentItemsEls = listRef.current.querySelectorAll('.carousel__item')
      const listWidth =
        itemWidth.fullWidth * currentItemsEls.length -
        itemWidth.margin -
        listRef.current.style.left.replace(/px|-/g, '')
      const currentCount = parseInt(listWidth / wrapperWidth.fullWidth)
      const translationMultiplier = currentSlide < 0 ? Math.abs(currentSlide) - 1 : currentSlide + 1

      if (currentCount === currentSlide + 1) {
        Array.from(slideItemsEl).forEach(elNode => {
          const currentEls = listRef.current.querySelectorAll('.carousel__item')

          listRef.current.insertBefore(
            elNode.cloneNode(true),
            currentEls[currentEls.length - 1].nextSibling
          )
        })
      }

      applyListTranslation(`${currentSlide < 0 ? '' : '-'}${translationMultiplier * 100}`)
      setCurrentSlide(currentSlide + 1)
      dispatch({
        type: 'SET_CURRENT_SLIDE',
        payload: currentSlide + 1
      })
    }, [slideItemsEl, currentSlide, applyListTranslation, dispatch])

    const infinityPrevHandler = useCallback(() => {
      const itemWidth = getAbsoluteWidth(slideItemsEl[0])
      const cloneQuant = slideItemsEl.length
      const leftMultiplier = currentSlide ? Math.abs(currentSlide) + 1 : 1

      listRef.current.style.left = `-${
        (itemWidth.fullWidth + itemWidth.margin) * leftMultiplier * cloneQuant
      }px`

      Array.from(slideItemsEl)
        .reverse()
        .forEach(elNode => {
          listRef.current.insertBefore(
            elNode.cloneNode(true),
            listRef.current.querySelectorAll('.carousel__item')[0]
          )
        })

      applyListTranslation(leftMultiplier * 100)
      setCurrentSlide(currentSlide - 1)
      dispatch({
        type: 'SET_CURRENT_SLIDE',
        payload: currentSlide - 1
      })
    }, [slideItemsEl, currentSlide, applyListTranslation, dispatch])

    const nextHandler = useCallback(() => {
      if (infinity && !restartOnEnd) {
        infinityNextHandler()
      } else if (currentSlide < slideCount) {
        applyListTranslation(`-${(currentSlide + 1) * 100}`)
        setCurrentSlide(currentSlide + 1)
        dispatch({
          type: 'SET_CURRENT_SLIDE',
          payload: currentSlide + 1
        })
      } else if (restartOnEnd) {
        applyListTranslation(0)
        setCurrentSlide(0)
        dispatch({
          type: 'SET_CURRENT_SLIDE',
          payload: 0
        })
      } else if (isSwiping.active) {
        applyListTranslation(`-${currentSlide * 100}`)
      }
    }, [
      infinity,
      restartOnEnd,
      currentSlide,
      slideCount,
      isSwiping.active,
      infinityNextHandler,
      applyListTranslation,
      dispatch
    ])

    const prevHandler = useCallback(() => {
      if (currentSlide > 0) {
        applyListTranslation(`-${(currentSlide - 1) * 100}`)
        setCurrentSlide(currentSlide - 1)
        dispatch({
          type: 'SET_CURRENT_SLIDE',
          payload: currentSlide - 1
        })
      } else if (restartOnEnd) {
        applyListTranslation(`-${slideCount * 100}`)
        setCurrentSlide(slideCount)
        dispatch({
          type: 'SET_CURRENT_SLIDE',
          payload: slideCount
        })
      } else if (infinity) {
        infinityPrevHandler()
      } else if (isSwiping.active) {
        console.log('PREV!')
        applyListTranslation('0')
      }
    }, [
      currentSlide,
      restartOnEnd,
      infinity,
      isSwiping.active,
      applyListTranslation,
      slideCount,
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

        setSlideCount(count)
        setSlideItemsEl(itemsEls)
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
      if (childrenItems) {
        initCarouselValues()
      }
    }, [childrenItems, initCarouselValues, dispatch])

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

        setChildrenItems(processedItems)
        dispatch({
          type: 'SET_SLIDE_CHILDREN_ITEMS',
          payload: processedItems
        })
      }
    }

    useEffect(initCarouselChildrens, [
      dispatch,
      children,
      wrapperRef,
      setChildrenItems,
      width,
      visibleItems,
      height
    ])

    const buttonInactive = useCallback(
      type => {
        if (!infinity && !restartOnEnd) {
          if (type === 'next') {
            return currentSlide === slideCount
          } else if (type === 'prev') {
            return currentSlide === 0
          }
        }

        return false
      },
      [currentSlide, slideCount, infinity, restartOnEnd]
    )

    useEffect(() => {
      const formattedCurrentSlide = currentSlide >= 0 ? currentSlide + 1 : currentSlide
      // const totalSlides = slideCount ? slideCount + 1 : 0

      setCurrentSlideFormatted(formattedCurrentSlide)
      dispatch({
        type: 'SET_CURRENT_SLIDE_FORMATTED',
        payload: formattedCurrentSlide
      })
    }, [currentSlide, slideCount, dispatch])

    const goToSlide = useCallback(
      slideNumber => {
        const insideNumber = slideNumber - 1

        if (!infinity && insideNumber >= 0 && insideNumber <= slideCount) {
          listRef.current.style.transform = `translate3d(-${insideNumber * 100}%, 0, 0)`
          setCurrentSlide(insideNumber)
          dispatch({
            type: 'SET_CURRENT_SLIDE',
            payload: insideNumber
          })
        }
      },
      [infinity, slideCount, dispatch]
    )

    const swipeStartHandler = event => {
      event.preventDefault()

      const style = window.getComputedStyle(listRef.current)
      const matrix = new DOMMatrixReadOnly(style.transform)
      const firstX = event.screenX || event.changedTouches[0].clientX
      const currentTranslate = matrix.m41

      setIsSwiping({
        active: true,
        firstX,
        firstY: event.changedTouches?.[0].clientY,
        currentTranslate
      })

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
      const distanceX = Math.abs(x - isSwiping.firstX)
      const distanceY = Math.abs(y - isSwiping.firstY)

      if (distanceX > 15 && distanceY < 100) {
        if (x < isSwiping.firstX) {
          componentRef.current.nextHandler()
        } else if (x > isSwiping.firstX) {
          componentRef.current.prevHandler()
        }
      }
    }

    const swipeMoveHandler = event => {
      if (isSwiping.active) {
        if (!isSwiping.swipeClass) {
          setIsSwiping(lastState => ({
            ...lastState,
            swipeClass: true
          }))

          dispatch({
            type: 'SET_IS_SWIPING',
            payload: {
              swipeClass: true
            }
          })
        }

        const eventX = event.screenX || event.changedTouches[0].clientX
        const currentX = eventX - isSwiping.firstX

        console.log('Y', Math.abs(event.changedTouches[0].clientY - isSwiping.firstY))
        console.log('X', Math.abs(event.changedTouches[0].clientX - isSwiping.firstX))

        if (!event.screenX && Math.abs(event.changedTouches[0].clientY - isSwiping.firstY) > 150) {
          console.log('NO SW')
          return false
        }

        console.log('TRANS?')

        listRef.current.style.transform = `translate3d(${
          isSwiping.currentTranslate + currentX
        }px, 0, 0)`
      }
    }

    const swipeEndHandler = event => {
      if (isSwiping.active) {
        // event.preventDefault()

        if (event.screenX) {
          if (event.screenX - isSwiping.firstX > 0) {
            componentRef.current.prevHandler()
          } else {
            componentRef.current.nextHandler()
          }
        } else {
          touchEndHandler(event.changedTouches[0])
        }

        setIsSwiping({
          active: false,
          firstX: null,
          firstY: null,
          currentTranslate: null,
          swipeClass: false
        })

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
            className={`carousel__list ${isSwiping.swipeClass ? 'carousel__list--swiping' : ''}`}
            ref={listRef}
          >
            {childrenItems}
          </div>
        </div>

        {showCurrentNumber && slideCount && (
          <div className="carousel__number">{currentSlideFormatted}</div>
        )}

        {showNavigation && slideCount && !infinity && (
          <div className="carousel__navigation">
            {Array.from(Array(slideCount + 1).keys()).map((_, index) => {
              return (
                <button
                  type="button"
                  key={`navigation-${index}`}
                  onClick={() => goToSlide(index + 1)}
                  className={`carousel__navigation__number ${
                    currentSlide === index ? 'carousel__navigation__number--current' : ''
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
