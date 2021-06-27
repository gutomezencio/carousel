import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle
} from 'react'
import PropTypes from 'prop-types'

import './Carousel.scoped.scss'

const Carousel = forwardRef(
  (
    {
      children,
      visilbleItems,
      infinity,
      restartOnEnd,
      height,
      width,
      onChange,
      showCurrentNumber,
      showNavigation,
      hideActions,
      ...rest
    },
    ref
  ) => {
    const carouselRef = useRef()
    const wrapperRef = useRef()
    const listRef = useRef()
    const componentRef = useRef()

    const [currentSlide, setCurrentSlide] = useState(0)
    const [slideCount, setSlideCount] = useState(null)
    const [slideItemsEl, setSlideItemsEl] = useState(null)
    const [childrenItems, setChildrenItems] = useState(null)
    const [currentSlideFormated, setCurrentSlideFormated] = useState()
    const [mobilePositions, setMobilePositions] = useState({})
    const [isSwiping, setIsSwiping] = useState({
      active: false,
      firstX: null,
      firstY: null,
      currentTranslate: null,
      swipeClass: false
    })

    const setListTranslation = useCallback(
      translationValue => {
        listRef.current.style.transform = `translate3d(${translationValue}%, 0, 0)`
      },
      [listRef]
    )

    const infinityNextHandler = useCallback(() => {
      const itemWidth = getAbsoluteWidth(slideItemsEl[0])
      const wrapperWidth = getAbsoluteWidth(wrapperRef.current)

      const currentItemsEls =
        listRef.current.querySelectorAll('.carousel__item')
      const listWidth =
        itemWidth.fullWidth * currentItemsEls.length -
        itemWidth.margin -
        listRef.current.style.left.replace(/px|-/g, '')
      const currentCount = parseInt(listWidth / wrapperWidth.fullWidth)
      const translationMultiplier =
        currentSlide < 0 ? Math.abs(currentSlide) - 1 : currentSlide + 1

      if (currentCount === currentSlide + 1) {
        Array.from(slideItemsEl).forEach(elNode => {
          const currentEls = listRef.current.querySelectorAll('.carousel__item')

          listRef.current.insertBefore(
            elNode.cloneNode(true),
            currentEls[currentEls.length - 1].nextSibling
          )
        })
      }

      setListTranslation(
        `${currentSlide < 0 ? '' : '-'}${translationMultiplier * 100}`
      )
      setCurrentSlide(currentSlide + 1)
    }, [wrapperRef, listRef, currentSlide, slideItemsEl])

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

      setListTranslation(leftMultiplier * 100)
      setCurrentSlide(currentSlide - 1)
    }, [wrapperRef, listRef, currentSlide, slideItemsEl])

    const nextHandler = useCallback(() => {
      if (infinity && !restartOnEnd) {
        infinityNextHandler()
      } else if (currentSlide < slideCount) {
        setListTranslation(`-${(currentSlide + 1) * 100}`)
        setCurrentSlide(currentSlide + 1)
      } else if (restartOnEnd) {
        setListTranslation(0)
        setCurrentSlide(0)
      } else if (isSwiping.active) {
        setListTranslation(`-${currentSlide * 100}`)
      }
    }, [
      currentSlide,
      slideCount,
      isSwiping,
      setCurrentSlide,
      infinityNextHandler
    ])

    const prevHandler = useCallback(() => {
      if (currentSlide > 0) {
        setListTranslation(`-${(currentSlide - 1) * 100}`)
        setCurrentSlide(currentSlide - 1)
      } else if (restartOnEnd) {
        setListTranslation(`-${slideCount * 100}`)
        setCurrentSlide(slideCount)
      } else if (infinity) {
        infinityPrevHandler()
      } else if (isSwiping.active) {
        console.log('PREV!')
        setListTranslation('0')
      }
    }, [
      currentSlide,
      slideCount,
      isSwiping,
      setCurrentSlide,
      infinityPrevHandler
    ])

    const getAbsoluteWidth = el => {
      const margin = parseInt(
        getComputedStyle(el)['margin-right'].replace('px', '')
      )
      const elementValues = el.getBoundingClientRect()

      return {
        fullWidth: elementValues.width,
        margin
      }
    }

    const waitForElementWidth = async itemEl => {
      let resizeObserver = null

      await new Promise(resolve => {
        resizeObserver = new ResizeObserver(entries => {
          for (const entry of entries) {
            const { width } = entry.contentRect

            if (width) {
              resizeObserver.unobserve(itemEl)
              return resolve('rendered!')
            }
          }
        })
        resizeObserver.observe(itemEl)
      })
    }

    const checkAndInitInfinity = useCallback(
      (infinity, count, itemsEls) => {
        if (infinity && count === 0) {
          const wrapperWidth = getAbsoluteWidth(wrapperRef.current)
          const elWidth = getAbsoluteWidth(itemsEls[0])
          const alowedQuant = wrapperWidth.fullWidth / elWidth.fullWidth

          if (alowedQuant - itemsEls.length !== 0) {
            Array.from(itemsEls).forEach(elNode => {
              const currentEls =
                listRef.current.querySelectorAll('.carousel__item')

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

    const initCarouselValues = async () => {
      let itemsEls = listRef.current.querySelectorAll('.carousel__item')
      const itemsLength = itemsEls.length

      if (childrenItems && itemsLength) {
        let count = 0
        let elWidth = getAbsoluteWidth(itemsEls[0])
        const wrapperWidth = getAbsoluteWidth(wrapperRef.current)

        if (!visilbleItems) {
          if (elWidth.fullWidth === 0) {
            await waitForElementWidth(itemsEls[0])

            elWidth = getAbsoluteWidth(itemsEls[0])
          }

          let listWidth = elWidth.fullWidth * itemsLength - elWidth.margin
          count = parseInt(listWidth / wrapperWidth.fullWidth)
        } else {
          count = parseInt(itemsLength / visilbleItems)
          count = itemsLength % visilbleItems === 0 ? count - 1 : count
        }

        itemsEls = checkAndInitInfinity(infinity, count, itemsEls)

        setSlideCount(count)
        setSlideItemsEl(itemsEls)
      }
    }

    useEffect(initCarouselValues, [
      wrapperRef,
      listRef,
      visilbleItems,
      childrenItems
    ])

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
              ...(visilbleItems
                ? {
                    minWidth: `${100 / visilbleItems}%`,
                    marginRight: '0'
                  }
                : {}),
              ...(height ? { height } : {})
            }
          })
        })

        setChildrenItems(processedItems)
      }
    }

    useEffect(initCarouselChildrens, [children, wrapperRef, setChildrenItems])

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

    const onChangeHandler = () => {
      if (slideCount) {
        const formated = currentSlide >= 0 ? currentSlide + 1 : currentSlide

        setCurrentSlideFormated(formated)

        if (onChange) {
          onChange({
            currentSlide: formated,
            totalSlides: slideCount + 1
          })
        }
      }
    }

    useEffect(onChangeHandler, [currentSlide, slideCount])

    const goToSlide = useCallback(
      slideNumber => {
        const insideNumber = slideNumber - 1

        if (!infinity && insideNumber >= 0 && insideNumber <= slideCount) {
          listRef.current.style.transform = `translate3d(-${
            insideNumber * 100
          }%, 0, 0)`
          setCurrentSlide(insideNumber)
        }
      },
      [infinity, slideCount, currentSlide]
    )

    const swipeStartHandler = event => {
      // event.preventDefault()

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

      // listRef.current.style.transform = `translate3d(${currentTranslate}px, 0, 0)`
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
        }

        const eventX = event.screenX || event.changedTouches[0].clientX
        const currentX = eventX - isSwiping.firstX

        console.log(
          'Y',
          Math.abs(event.changedTouches[0].clientY - isSwiping.firstY)
        )
        console.log(
          'X',
          Math.abs(event.changedTouches[0].clientX - isSwiping.firstX)
        )

        if (
          !event.screenX &&
          Math.abs(event.changedTouches[0].clientY - isSwiping.firstY) > 150
        ) {
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
      }
    }

    const swipeEventListener = () => {
      wrapperRef.current.addEventListener('mousedown', event => {
        componentRef.current.swipeStartHandler(event)
      })
      wrapperRef.current.addEventListener('mousemove', event => {
        componentRef.current.swipeMoveHandler(event)
      })
      wrapperRef.current.addEventListener('mouseup', event => {
        componentRef.current.swipeEndHandler(event)
      })

      return () => {
        wrapperRef.current.removeEventListener('mousedown', event => {
          componentRef.current.swipeStartHandler(event)
        })
        wrapperRef.current.removeEventListener('mousemove', event => {
          componentRef.current.swipeMoveHandler(event)
        })
        wrapperRef.current.removeEventListener('mouseup', event => {
          componentRef.current.swipeEndHandler(event)
        })
      }
    }
    const touchEventListener = () => {
      wrapperRef.current.addEventListener('touchstart', event => {
        componentRef.current.swipeStartHandler(event)
      })
      wrapperRef.current.addEventListener('touchmove', event => {
        componentRef.current.swipeMoveHandler(event)
      })
      wrapperRef.current.addEventListener('touchend', event => {
        componentRef.current.swipeEndHandler(event)
      })

      return () => {
        wrapperRef.current.removeEventListener('touchstart', event => {
          componentRef.current.swipeStartHandler(event)
        })
        wrapperRef.current.removeEventListener('touchmove', event => {
          componentRef.current.swipeMoveHandler(event)
        })
        wrapperRef.current.removeEventListener('touchend', event => {
          componentRef.current.swipeEndHandler(event)
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
              isSwiping.swipeClass ? 'carousel__list--swipping' : ''
            }`}
            ref={listRef}
          >
            {childrenItems}
          </div>
        </div>

        {showCurrentNumber && (
          <div className="carousel__number">{currentSlideFormated}</div>
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
                    currentSlide === index
                      ? 'carousel__navigation__number--current'
                      : ''
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
                buttonInactive('prev')
                  ? 'carousel__actions__button--inactive'
                  : ''
              }`}
            >
              Prev
            </button>
            <button
              type="button"
              onClick={event => nextHandler(event)}
              className={`carousel__actions__button ${
                buttonInactive('next')
                  ? 'carousel__actions__button--inactive'
                  : ''
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
  visilbleItems: PropTypes.number,
  infinity: PropTypes.bool,
  restartOnEnd: PropTypes.bool,
  children: PropTypes.array,
  height: PropTypes.string,
  width: PropTypes.string,
  onChange: PropTypes.func,
  showCurrentNumber: PropTypes.bool,
  showNavigation: PropTypes.bool,
  hideActions: PropTypes.bool
}

export default Carousel
