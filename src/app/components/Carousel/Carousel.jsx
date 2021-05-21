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

    const prevHandler = useCallback(
      event => {
        if (currentSlide > 0) {
          const slideTranslate = (currentSlide - 1) * 100
          listRef.current.style.transform = `translate3d(-${slideTranslate}%, 0, 0)`

          setCurrentSlide(currentSlide - 1)
        } else if (infinity && !restartOnEnd) {
          const itemWidth = getAbsoluteWidth(slideItemsEl[0])
          const cloneQuant = slideItemsEl.length
          const leftMultiplier = currentSlide ? Math.abs(currentSlide) + 1 : 1

          listRef.current.style.left = `-${
            (itemWidth.fullWidth + itemWidth.margin) *
            leftMultiplier *
            cloneQuant
          }px`

          Array.from(slideItemsEl)
            .reverse()
            .forEach(elNode => {
              listRef.current.insertBefore(
                elNode.cloneNode(true),
                listRef.current.querySelectorAll('.carousel__item')[0]
              )
            })

          listRef.current.style.transform = `translate3d(${
            leftMultiplier * 100
          }%, 0, 0)`
          setCurrentSlide(currentSlide - 1)
        } else if (restartOnEnd) {
          const slideTranslate = slideCount * 100

          listRef.current.style.transform = `translate3d(-${slideTranslate}%, 0, 0)`
          setCurrentSlide(slideCount)
        }
      },
      [currentSlide, slideCount, listRef, slideItemsEl]
    )

    const nextHandler = useCallback(
      event => {
        if (infinity && !restartOnEnd) {
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
              const currentEls =
                listRef.current.querySelectorAll('.carousel__item')

              listRef.current.insertBefore(
                elNode.cloneNode(true),
                currentEls[currentEls.length - 1].nextSibling
              )
            })
          }

          listRef.current.style.transform = `translate3d(${
            currentSlide < 0 ? '' : '-'
          }${translationMultiplier * 100}%, 0, 0)`

          setCurrentSlide(currentSlide + 1)
        } else if (currentSlide < slideCount) {
          const slideTranslate = (currentSlide + 1) * 100

          listRef.current.style.transform = `translate3d(-${slideTranslate}%, 0, 0)`
          setCurrentSlide(currentSlide + 1)
        } else if (restartOnEnd) {
          listRef.current.style.transform = `translate3d(0, 0, 0)`

          setCurrentSlide(0)
        }
      },
      [currentSlide, slideCount, slideItemsEl, wrapperRef, listRef]
    )

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

    const waitForElementWidth = async () => {
      let resizeObserver = null

      await new Promise(resolve => {
        let itemsEls = listRef.current.querySelectorAll('.carousel__item')

        resizeObserver = new ResizeObserver(entries => {
          for (const entry of entries) {
            const { width } = entry.contentRect

            if (width) {
              resizeObserver.unobserve(itemsEls[0])
              return resolve('rendered!')
            }
          }
        })
        resizeObserver.observe(itemsEls[0])
      })
    }

    useEffect(async () => {
      let itemsEls = listRef.current.querySelectorAll('.carousel__item')

      if (childrenItems && itemsEls.length) {
        let wrapperWidth = null
        let listWidth = null
        let elWidth = null

        if (wrapperRef?.current) {
          wrapperWidth = getAbsoluteWidth(wrapperRef.current)
        }

        if (listRef?.current) {
          let count = 0
          elWidth = getAbsoluteWidth(itemsEls[0])

          if (!visilbleItems) {
            if (elWidth.fullWidth === 0) {
              await waitForElementWidth()

              elWidth = getAbsoluteWidth(itemsEls[0])
            }

            listWidth = elWidth.fullWidth * itemsEls.length - elWidth.margin
            count = parseInt(listWidth / wrapperWidth.fullWidth)
          } else {
            count = parseInt(itemsEls.length / visilbleItems)
            count = itemsEls.length % visilbleItems === 0 ? count - 1 : count
          }

          if (infinity && count === 0) {
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

              itemsEls = listRef.current.querySelectorAll('.carousel__item')
            }
          }

          setSlideCount(count)
          setSlideItemsEl(itemsEls)
        }
      }
    }, [wrapperRef, listRef, visilbleItems, childrenItems])

    useEffect(() => {
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
    }, [children, wrapperRef, setChildrenItems])

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
    }, [currentSlide, slideCount])

    useEffect(() => {
      if (wrapperRef.current) {
        let positions = {
          x: null,
          y: null
        }

        const startEventHandler = ({ changedTouches }) => {
          const { clientX: x, clientY: y } = changedTouches[0]

          positions = {
            x,
            y
          }
        }

        const endEventHandler = ({ changedTouches }) => {
          const { clientX: x, clientY: y } = changedTouches[0]
          const distanceX = Math.abs(x - positions.x)
          const distanceY = Math.abs(y - positions.y)

          if (distanceX > 15 && distanceY < 100) {
            if (x < positions.x) {
              componentRef.current.nextHandler()
            } else if (x > positions.x) {
              componentRef.current.prevHandler()
            }
          }
        }

        wrapperRef.current.addEventListener('touchstart', startEventHandler)
        wrapperRef.current.addEventListener('touchend', endEventHandler)

        return () => {
          wrapperRef.current.removeEventListener(
            'touchstart',
            startEventHandler
          )
          wrapperRef.current.removeEventListener('touchend', endEventHandler)
        }
      }
    }, [])

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

    useImperativeHandle(componentRef, () => ({
      prevHandler,
      nextHandler
    }))

    useImperativeHandle(ref, () => ({
      goToSlide,
      previous: prevHandler,
      next: nextHandler
    }))

    return (
      <div className="carousel" ref={carouselRef} {...rest}>
        <div className="carousel__wrapper" ref={wrapperRef}>
          <div className="carousel__list" ref={listRef}>
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
              onClick={prevHandler}
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
              onClick={nextHandler}
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
