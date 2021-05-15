import React, { useEffect, useRef, useState, useCallback } from 'react'
import PropTypes from 'prop-types'

import './Carousel.scoped.scss'

const Carousel = ({ visilbleItems, infinity }) => {
  const wrapperRef = useRef()
  const listRef = useRef()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slideCount, setSlideCount] = useState(0)
  const [slideItemsEl, setSlideItemsEl] = useState(null)

  const prevHandler = event => {
    if (currentSlide > 0) {
      const slideTranslate = (currentSlide - 1) * 100
      listRef.current.style.transform = `translate3d(-${slideTranslate}%, 0, 0)`

      setCurrentSlide(currentSlide - 1)
    } else if (infinity) {
      if (!visilbleItems) {
        const itemWidth = getAbsoluteWidth(slideItemsEl[0])
        const cloneQuant = slideItemsEl.length
        const leftMultiplier = currentSlide ? Math.abs(currentSlide) + 1 : 1

        listRef.current.style.left = `-${((itemWidth.fullWidth + itemWidth.margin) * leftMultiplier) * cloneQuant}px`;

        Array.from(slideItemsEl)
          .reverse()
          .forEach(elNode => {
            listRef.current.insertBefore(
              elNode.cloneNode(true),
              listRef.current.querySelectorAll('.carousel__item')[0]
            );
          });

        listRef.current.style.transform = `translate3d(${leftMultiplier * 100}%, 0, 0)`
        setCurrentSlide(currentSlide - 1);
      } else {
        const slideTranslate = slideCount * 100
        listRef.current.style.transform = `translate3d(-${slideTranslate}%, 0, 0)`

        setCurrentSlide(slideCount)
      }
    }
  }

  const nextHandler = event => {
    if (infinity) {
      if (!visilbleItems) {
        const itemWidth = getAbsoluteWidth(slideItemsEl[0])
        const wrapperWidth = getAbsoluteWidth(wrapperRef.current)
        const currentItemsEls = listRef.current.querySelectorAll('.carousel__item')
        const listWidth = ((itemWidth.fullWidth * currentItemsEls.length) - itemWidth.margin) - listRef.current.style.left.replace(/px|-/g, '')
        const currentCount = parseInt(listWidth / wrapperWidth.fullWidth)
        const translationMultiplier = currentSlide < 0 ? Math.abs(currentSlide) - 1 : currentSlide + 1

        if (currentCount === currentSlide + 1) {
          Array.from(slideItemsEl)
            .forEach(elNode => {
              const currentEls = listRef.current.querySelectorAll('.carousel__item')

              listRef.current.insertBefore(
                elNode.cloneNode(true),
                currentEls[currentEls.length - 1].nextSibling
              )
            })
        }
        listRef.current.style.transform = `translate3d(${currentSlide < 0 ? '' : '-'}${translationMultiplier * 100}%, 0, 0)`
        setCurrentSlide(currentSlide + 1)
      } else {
        listRef.current.style.transform = `translate3d(0, 0, 0)`

        setCurrentSlide(0)
      }
    } else if (currentSlide < slideCount) {
      const slideTranslate = (currentSlide + 1) * 100
      listRef.current.style.transform = `translate3d(-${slideTranslate}%, 0, 0)`

      setCurrentSlide(currentSlide + 1)
    }
  }

  const getAbsoluteWidth = (el) => {
    const margin = parseInt(getComputedStyle(el)['margin-right'].replace('px', ''))
    const elementValues = el.getBoundingClientRect()

    return {
      fullWidth: elementValues.width,
      margin,
    };
  }

  useEffect(() => {
    let wrapperWidth = null
    let listWidth = null

    if (wrapperRef?.current) {
      wrapperWidth = getAbsoluteWidth(wrapperRef.current)
    }

    if (listRef?.current) {
      const itemsEls = listRef.current.querySelectorAll('.carousel__item')
      let count = 0;

      if (!visilbleItems) {
        const elWidth = getAbsoluteWidth(itemsEls[0])

        listWidth = elWidth.fullWidth * itemsEls.length - elWidth.margin;
        count = parseInt(listWidth / wrapperWidth.fullWidth)
      } else {
        count = parseInt(itemsEls.length / visilbleItems)
        count = visilbleItems === 1 ? count - 1 : count
      }

      setSlideCount(count);
      setSlideItemsEl(itemsEls);
    }
  }, [wrapperRef, listRef]);

  useEffect(() => {
    if (visilbleItems) {
      listRef.current.querySelectorAll('.carousel__item').forEach((item) => {
        item.style.minWidth = `${100 / visilbleItems}%`
        item.style.marginRight = '0'
      })
    }
  }, [visilbleItems])

  const buttonInactive = useCallback((type) => {
    if(!infinity) {
      if (type === 'next') {
        return currentSlide === slideCount
      } else if (type === 'prev') {
        return currentSlide === 0
      }
    }

    return false
  }, [currentSlide, slideCount, infinity])

  return (
    <div className="carousel">
      <div className="carousel__wrapper" ref={wrapperRef}>
        <div className="carousel__list" ref={listRef}>
          <div className="carousel__item">
            <img src="https://picsum.photos/id/11/200/300" alt="Some image" />
          </div>

          <div className="carousel__item">
            <img src="https://picsum.photos/id/22/200/300" alt="Some image" />
          </div>

          <div className="carousel__item">
            <img src="https://picsum.photos/id/33/200/300" alt="Some image" />
          </div>

          <div className="carousel__item">
            <img src="https://picsum.photos/id/44/200/300" alt="Some image" />
          </div>

          <div className="carousel__item">
            <img src="https://picsum.photos/id/55/200/300" alt="Some image" />
          </div>

          <div className="carousel__item">
            <img src="https://picsum.photos/id/66/200/300" alt="Some image" />
          </div>

          <div className="carousel__item">
            <img src="https://picsum.photos/id/77/200/300" alt="Some image" />
          </div>

          <div className="carousel__item">
            <img src="https://picsum.photos/id/88/200/300" alt="Some image" />
          </div>
        </div>
      </div>

      <div className="carousel__number">{currentSlide + 1}</div>

      <div className="carousel__actions">
        <button
          type="button"
          onClick={prevHandler}
          className={`carousel__actions__button ${
            buttonInactive("prev")
              ? "carousel__actions__button--inactive"
              : ""
          }`}
        >
          Prev
        </button>
        <button
          type="button"
          onClick={nextHandler}
          className={`carousel__actions__button ${
            buttonInactive("next")
              ? "carousel__actions__button--inactive"
              : ""
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

Carousel.propTypes = {
  visilbleItems: PropTypes.number,
  infinity: PropTypes.bool
};

export default Carousel
