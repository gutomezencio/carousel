import React, { useEffect, useRef, useState, useCallback } from 'react'
import PropTypes from 'prop-types'

import './Carousel.scoped.scss'

const Carousel = ({ children, visilbleItems, infinity, restartOnEnd }) => {
  const wrapperRef = useRef()
  const listRef = useRef()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slideCount, setSlideCount] = useState(0)
  const [slideItemsEl, setSlideItemsEl] = useState(null)
  const [childrenItems, setChildrenItems] = useState(null)

  const prevHandler = event => {
    if (currentSlide > 0) {
      const slideTranslate = (currentSlide - 1) * 100
      listRef.current.style.transform = `translate3d(-${slideTranslate}%, 0, 0)`

      setCurrentSlide(currentSlide - 1)
    } else if (infinity && !restartOnEnd) {
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

      listRef.current.style.transform = `translate3d(${
        leftMultiplier * 100
      }%, 0, 0)`
      setCurrentSlide(currentSlide - 1)
    } else if (restartOnEnd) {
      const slideTranslate = slideCount * 100

      listRef.current.style.transform = `translate3d(-${slideTranslate}%, 0, 0)`
      setCurrentSlide(slideCount)
    }
  }

  const nextHandler = event => {
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

      console.log('COUNT', currentCount)

      if (currentCount === currentSlide + 1) {
        Array.from(slideItemsEl).forEach(elNode => {
          const currentEls = listRef.current.querySelectorAll('.carousel__item')

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
  }

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

  useEffect(() => {
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

        if (!visilbleItems) {
          elWidth = getAbsoluteWidth(itemsEls[0])
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
    if (children) {
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
              : {})
          }
        })
      })

      setChildrenItems(processedItems)
    }
  }, [children, setChildrenItems])

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

  return (
    <div className="carousel">
      <div className="carousel__wrapper" ref={wrapperRef}>
        <div className="carousel__list" ref={listRef}>
          {childrenItems}
        </div>
      </div>

      <div className="carousel__number">{currentSlide + 1}</div>

      <div className="carousel__actions">
        <button
          type="button"
          onClick={prevHandler}
          className={`carousel__actions__button ${
            buttonInactive('prev') ? 'carousel__actions__button--inactive' : ''
          }`}
        >
          Prev
        </button>
        <button
          type="button"
          onClick={nextHandler}
          className={`carousel__actions__button ${
            buttonInactive('next') ? 'carousel__actions__button--inactive' : ''
          }`}
        >
          Next
        </button>
      </div>
    </div>
  )
}

Carousel.propTypes = {
  visilbleItems: PropTypes.number,
  infinity: PropTypes.bool,
  restartOnEnd: PropTypes.bool,
  children: PropTypes.array
}

export default Carousel
