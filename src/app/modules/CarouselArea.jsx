import React, { useState, useRef, useCallback, useMemo } from 'react'

// import './CarouselArea.scoped.scss'

import Carousel from 'lib/Carousel/Carousel'

import { GenerateCarouselSlideItems } from 'app/components/GenerateCarouselSlideItems'

const CarouselArea = () => {
  const [onChangeValues, setOnChangeValues] = useState('')

  const onChangeCallback = useCallback(
    values => {
      setOnChangeValues(values)
    },
    [setOnChangeValues]
  )

  const [goToSlideValue, setGoToSlideValue] = useState()
  const goToSlideExample = useRef(null)

  const customPrevAndNextRef = useRef(null)

  return (
    <div className="carousel-area">
      <div className="carousel-area__item">
        <h2>Auto Height and Width</h2>
        {useMemo(
          () => (
            <Carousel visibleItems={1} height={'auto'} width={'auto'}>
              {GenerateCarouselSlideItems(9, '/500/500')}
            </Carousel>
          ),
          []
        )}
      </div>

      <div className="carousel-area__item carousel-area__item--hide-mobile">
        <h2>Custom Width</h2>
        {useMemo(
          () => (
            <Carousel visibleItems={1} height={'auto'} width={'500px'}>
              {GenerateCarouselSlideItems(9)}
            </Carousel>
          ),
          []
        )}
      </div>

      <div className="carousel-area__item carousel-area__item--hide-desktop">
        <h2>Custom Width</h2>
        {useMemo(
          () => (
            <Carousel visibleItems={1} height={'auto'} width={'80%'}>
              {GenerateCarouselSlideItems(9)}
            </Carousel>
          ),
          []
        )}
      </div>

      <div className="carousel-area__item carousel-area__item--hide-mobile">
        <h2>Image and Text and one Visible Slide</h2>
        {useMemo(
          () => (
            <Carousel visibleItems={1} height={'400px'} width={'600px'}>
              {GenerateCarouselSlideItems(9, null, true)}
            </Carousel>
          ),
          []
        )}
      </div>

      <div className="carousel-area__item carousel-area__item--hide-desktop">
        <h2>Image and Text and one Visible Slide</h2>
        {useMemo(
          () => (
            <Carousel visibleItems={1}>{GenerateCarouselSlideItems(9, null, true)}</Carousel>
          ),
          []
        )}
      </div>

      <div className="carousel-area__item">
        <h2>Simple one Visible Slide</h2>
        {useMemo(
          () => (
            <Carousel visibleItems={1}>{GenerateCarouselSlideItems(9)}</Carousel>
          ),
          []
        )}
      </div>

      <div className="carousel-area__item">
        <h2>Without any Config</h2>
        {useMemo(
          () => (
            <Carousel>{GenerateCarouselSlideItems(9)}</Carousel>
          ),
          []
        )}
      </div>

      <div className="carousel-area__item">
        <h2>Simple Infinity</h2>
        {useMemo(
          () => (
            <Carousel infinity={true}>{GenerateCarouselSlideItems(8)}</Carousel>
          ),
          []
        )}
      </div>

      <div className="carousel-area__item">
        <h2>Infinity with 5 Visible Slides</h2>
        {useMemo(
          () => (
            <Carousel visibleItems={5} infinity={true}>
              {GenerateCarouselSlideItems(8)}
            </Carousel>
          ),
          []
        )}
      </div>

      <div className="carousel-area__item">
        <h2>Infinity with less slides than available spaces for Visible Slides</h2>
        {useMemo(
          () => (
            <Carousel infinity={true}>{GenerateCarouselSlideItems(4)}</Carousel>
          ),
          []
        )}
      </div>

      <div className="carousel-area__item">
        <h2>Restarting on end with 1 Visible Slide</h2>
        {useMemo(
          () => (
            <Carousel visibleItems={1} restartOnEnd={true}>
              {GenerateCarouselSlideItems(9)}
            </Carousel>
          ),
          []
        )}
      </div>

      <div className="carousel-area__item">
        <h2>Simple with Restarting on end</h2>
        {useMemo(
          () => (
            <Carousel restartOnEnd={true}>{GenerateCarouselSlideItems(9)}</Carousel>
          ),
          []
        )}
      </div>

      <div className="carousel-area__item">
        <h2>Simple with Navigation</h2>
        {useMemo(
          () => (
            <Carousel restartOnEnd={true} showNavigation={true} visibleItems={2}>
              {GenerateCarouselSlideItems(9)}
            </Carousel>
          ),
          []
        )}
      </div>

      <div className="carousel-area__item">
        <h2>Go to Slide</h2>
        {useMemo(
          () => (
            <Carousel
              restartOnEnd={true}
              ref={goToSlideExample}
              visibleItems={3}
              showCurrentNumber={true}
            >
              {GenerateCarouselSlideItems(9)}
            </Carousel>
          ),
          []
        )}
        <p>
          Go to slide:
          <input type="text" onChange={({ target }) => setGoToSlideValue(target.value)} />
          <button
            type="button"
            onClick={() => goToSlideExample?.current?.goToSlide(goToSlideValue)}
          >
            Go
          </button>
        </p>
      </div>

      <div className="carousel-area__item">
        <h2>Simple with On Change</h2>
        {useMemo(
          () => (
            <Carousel
              onChange={value => onChangeCallback(value)}
              visibleItems={2}
              restartOnEnd={true}
            >
              {GenerateCarouselSlideItems(9)}
            </Carousel>
          ),
          [onChangeCallback]
        )}
        <p>{JSON.stringify(onChangeValues)}</p>
      </div>

      <div className="carousel-area__item">
        <h2>Without actions</h2>
        {useMemo(
          () => (
            <Carousel visibleItems={2} restartOnEnd={true} hideActions={true}>
              {GenerateCarouselSlideItems(5)}
            </Carousel>
          ),
          []
        )}
      </div>

      <div className="carousel-area__item">
        <h2>Custom Next and Prev</h2>
        {useMemo(
          () => (
            <Carousel
              visibleItems={2}
              restartOnEnd={true}
              hideActions={true}
              ref={customPrevAndNextRef}
            >
              {GenerateCarouselSlideItems(5)}
            </Carousel>
          ),
          []
        )}
        <button
          type="button>"
          className="carousel-area__left-arrow"
          onClick={() => customPrevAndNextRef.current.previous()}
        >
          {'<'}
        </button>
        <button
          type="button>"
          className="carousel-area__right-arrow"
          onClick={() => customPrevAndNextRef.current.next()}
        >
          {'>'}
        </button>
      </div>
    </div>
  )
}

export default CarouselArea
