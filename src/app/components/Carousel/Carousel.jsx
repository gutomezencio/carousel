import React, {
  useEffect,
  useRef,
  useCallback,
  useContext,
  useState,
  forwardRef,
  useImperativeHandle
} from 'react'
import PropTypes from 'prop-types'

import CarouselContextProvider, { CarouselContext } from './CarouselContext'

import CarouselActions from './CarouselActions'
import CarouselNavigation from './CarouselNavigation'

import { getAbsoluteWidth, waitForElementWidth } from 'app/utils'

import './Carousel.scoped.scss'

const CarouselContent = forwardRef(
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
    const actionRef = useRef()

    const [swipingClass, setSwipingClass] = useState(false)

    const applyListTranslation = useCallback(
      translationValue => {
        listRef.current.style.transform = `translate3d(${translationValue}%, 0, 0)`
      },
      [listRef]
    )

    const toggleSwipingClass = toggle => {
      setSwipingClass(toggle)
    }

    const goToSlide = useCallback(
      slideNumber => {
        const insideNumber = slideNumber - 1

        if (!infinity && insideNumber >= 0 && insideNumber <= state.slideCount) {
          applyListTranslation(`-${insideNumber * 100}`)
          dispatch({
            type: 'SET_CURRENT_SLIDE',
            payload: insideNumber
          })
        }
      },
      [infinity, state.slideCount, applyListTranslation, dispatch]
    )

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
      let itemsEls = listRef.current.querySelectorAll('.carousel__item')
      const itemsLength = itemsEls.length
      const wrapperWidth = getAbsoluteWidth(wrapperRef.current)
      let count = 0
      let elWidth = getAbsoluteWidth(itemsEls[0])

      if (elWidth.fullWidth === 0) {
        await waitForElementWidth(itemsEls[0])

        elWidth = getAbsoluteWidth(itemsEls[0])
      }

      let listWidth = elWidth.fullWidth * itemsLength - elWidth.margin
      count = parseInt(listWidth / wrapperWidth.fullWidth)

      if (visibleItems) {
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

    useEffect(() => {
      const formattedCurrentSlide =
        state.currentSlide >= 0 ? state.currentSlide + 1 : state.currentSlide
      // const totalSlides = slideCount ? slideCount + 1 : 0

      dispatch({
        type: 'SET_CURRENT_SLIDE_FORMATTED',
        payload: formattedCurrentSlide
      })
    }, [state.currentSlide, state.slideCount, dispatch])

    useEffect(() => {
      dispatch({
        type: 'SET_CONFIG',
        payload: {
          infinity,
          restartOnEnd,
          showCurrentNumber,
          showNavigation,
          hideActions,
          visibleItems,
          height,
          width
        }
      })
    }, [
      infinity,
      restartOnEnd,
      showCurrentNumber,
      showNavigation,
      hideActions,
      visibleItems,
      height,
      width,
      dispatch
    ])

    useImperativeHandle(ref, () => ({
      goToSlide,
      previous: () => actionRef.current.prevHandler(),
      next: () => actionRef.current.nextHandler()
    }))

    return (
      <div className="carousel" ref={carouselRef} {...rest}>
        <div className="carousel__wrapper" ref={wrapperRef}>
          <div
            className={`carousel__list ${swipingClass ? 'carousel__list--swiping' : ''}`}
            ref={listRef}
          >
            {state.childrenItems}
          </div>
        </div>

        {showCurrentNumber && state.slideCount && (
          <div className="carousel__number">{state.currentSlideFormatted}</div>
        )}

        {showNavigation && state.slideCount && !infinity && (
          <CarouselNavigation goToSlide={goToSlide} />
        )}

        {wrapperRef.current && listRef.current && (
          <CarouselActions
            applyListTranslation={applyListTranslation}
            toggleSwipingClass={toggleSwipingClass}
            listRefCurrent={listRef.current}
            wrapperRefCurrent={wrapperRef.current}
            componentRef={ref}
            ref={actionRef}
          />
        )}
      </div>
    )
  }
)

CarouselContent.displayName = 'CarouselContent'

CarouselContent.propTypes = {
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

const Carousel = forwardRef(({ children, ...rest }, ref) => {
  return (
    <CarouselContextProvider>
      <CarouselContent {...rest} ref={ref}>
        {children}
      </CarouselContent>
    </CarouselContextProvider>
  )
})

Carousel.displayName = 'Carousel'

Carousel.propTypes = {
  children: PropTypes.node
}

export default Carousel
