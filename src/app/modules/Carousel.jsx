import React, { useEffect, useRef, useState } from 'react'

import './Carousel.scoped.scss'

const Carousel = () => {
  const wrapperRef = useRef()
  const listRef = useRef()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slideCount, setSlideCount] = useState(0)

  let wrapperWidth = null
  let listWidth = null

  const prevHandler = event => {
    if (currentSlide > 0) {
      const slideTranslate = (currentSlide - 1) * 100
      listRef.current.style.transform = `translate3d(-${slideTranslate}%, 0, 0)`

      setCurrentSlide(currentSlide - 1)
    }
  }

  const nextHandler = event => {
    if (currentSlide < slideCount) {
      const slideTranslate = (currentSlide + 1) * 100
      listRef.current.style.transform = `translate3d(-${slideTranslate}%, 0, 0)`

      setCurrentSlide(currentSlide + 1)
    }
  }

  const getAbsoluteWidth = (el) => {
    const currentStyles = getComputedStyle(el),
        currentMargin = parseInt(currentStyles['margin-right'].replace('px', '')),
        elementValues = el.getBoundingClientRect();

    return {
      fullWidth: elementValues.width,
      margin: currentMargin,
    };
  }

  useEffect(() => {
    if (wrapperRef?.current) {
      wrapperWidth = getAbsoluteWidth(wrapperRef.current)
    }

    if (listRef?.current) {
      const itemsEls = listRef.current.querySelectorAll('.carousel__item')
      const elWidth = getAbsoluteWidth(itemsEls[0])

      setSlideCount(parseInt((elWidth.fullWidth * itemsEls.length - elWidth.margin) / wrapperWidth.fullWidth))
      listWidth = elWidth.fullWidth * itemsEls.length - elWidth.margin
    }
  }, [wrapperRef, listRef]);

  return (
    <div className="carousel">
      <div className="carousel__wrapper" ref={wrapperRef}>
        <div className="carousel__list" ref={listRef}>
          <div className="carousel__item">
            <img src="https://picsum.photos/200/300" alt="Some image" />
          </div>

          <div className="carousel__item">
            <img src="https://picsum.photos/200/300" alt="Some image" />
          </div>

          <div className="carousel__item">
            <img src="https://picsum.photos/200/300" alt="Some image" />
          </div>

          <div className="carousel__item">
            <img src="https://picsum.photos/200/300" alt="Some image" />
          </div>

          <div className="carousel__item">
            <img src="https://picsum.photos/200/300" alt="Some image" />
          </div>

          <div className="carousel__item">
            <img src="https://picsum.photos/200/300" alt="Some image" />
          </div>

          <div className="carousel__item">
            <img src="https://picsum.photos/200/300" alt="Some image" />
          </div>

          <div className="carousel__item">
            <img src="https://picsum.photos/200/300" alt="Some image" />
          </div>
        </div>
      </div>

      <div className="carousel__actions">
        <button
          type="button"
          onClick={prevHandler}
          className={`carousel__actions__button ${
            currentSlide === 0 ? 'carousel__actions__button--inactive' : ''
          }`}
        >
          Prev
        </button>
        <button
          type="button"
          onClick={nextHandler}
          className={`carousel__actions__button ${
            currentSlide === slideCount ? 'carousel__actions__button--inactive' : ''
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Carousel
