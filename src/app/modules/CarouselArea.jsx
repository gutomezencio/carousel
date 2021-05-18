import React, { useState, useRef } from 'react'

import './CarouselArea.scoped.scss'

import Carousel from 'app/components/Carousel/Carousel'

const CarouselArea = () => {
  const carouselItems = [
    'https://picsum.photos/id/111',
    'https://picsum.photos/id/122',
    'https://picsum.photos/id/133',
    'https://picsum.photos/id/144',
    'https://picsum.photos/id/155',
    'https://picsum.photos/id/166',
    'https://picsum.photos/id/177',
    'https://picsum.photos/id/188',
    'https://picsum.photos/id/199'
  ]

  const generateItems = (quant, customSize) => {
    return carouselItems?.slice(0, quant)?.map((image, index) => {
      return (
        <div className="some-class" key={index}>
          <img
            src={`${image}/${customSize || '/300/300'}`}
            alt={`image-${index}`}
          />
        </div>
      )
    })
  }

  const [onChangeValues, setOnChangeValues] = useState('')

  const onChangeCallback = values => {
    setOnChangeValues(values)
  }

  const [goToSlideValue, setGoToSlideValue] = useState()
  const goToSlideExample = useRef(null)

  return (
    <div className="carousel-area">
      <div className="carousel-area__item">
        <h2>Custom Width</h2>
        <Carousel visilbleItems={1} height={'auto'} width={'500px'}>
          {generateItems(9)}
        </Carousel>
      </div>

      <div className="carousel-area__item">
        <h2>Auto Height and Width</h2>
        <Carousel visilbleItems={1} height={'auto'} width={'auto'}>
          {generateItems(9, '/500/500')}
        </Carousel>
      </div>

      <div className="carousel-area__item">
        <h2>Simple one Visible Slide</h2>
        <Carousel visilbleItems={1}>{generateItems(9)}</Carousel>
      </div>

      <div className="carousel-area__item">
        <h2>Without any Config</h2>
        <Carousel>{generateItems(9)}</Carousel>
      </div>

      <div className="carousel-area__item">
        <h2>Simple Infinity</h2>
        <Carousel infinity={true}>{generateItems(8)}</Carousel>
      </div>

      <div className="carousel-area__item">
        <h2>Infinity with 5 Visible Slides</h2>
        <Carousel visilbleItems={5} infinity={true}>
          {generateItems(8)}
        </Carousel>
      </div>

      <div className="carousel-area__item">
        <h2>
          Infinity with less slides than available spaces for Visible Slides
        </h2>
        <Carousel infinity={true}>{generateItems(4)}</Carousel>
      </div>

      <div className="carousel-area__item">
        <h2>Restarting on end with 1 Visible Slide</h2>
        <Carousel visilbleItems={1} restartOnEnd={true}>
          {generateItems(9)}
        </Carousel>
      </div>

      <div className="carousel-area__item">
        <h2>Simple with Restarting on end</h2>
        <Carousel restartOnEnd={true}>{generateItems(9)}</Carousel>
      </div>

      <div className="carousel-area__item">
        <h2>Simple with Navigation</h2>
        <Carousel restartOnEnd={true} showNavigation={true} visilbleItems={2}>
          {generateItems(9)}
        </Carousel>
      </div>

      <div className="carousel-area__item">
        <h2>Go to Slide</h2>
        <Carousel
          restartOnEnd={true}
          ref={goToSlideExample}
          visilbleItems={3}
          showCurrentNumber={true}
        >
          {generateItems(9)}
        </Carousel>
        <p>
          Go to slide:
          <input
            type="text"
            onChange={({ target }) => setGoToSlideValue(target.value)}
          />
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
        <Carousel
          onChange={onChangeCallback}
          visilbleItems={2}
          restartOnEnd={true}
        >
          {generateItems(9)}
        </Carousel>
        <p>{JSON.stringify(onChangeValues)}</p>
      </div>

      <div className="carousel-area__item">
        <h2>Without actions</h2>
        <Carousel visilbleItems={2} restartOnEnd={true} hideActions={true}>
          {generateItems(5)}
        </Carousel>
      </div>
    </div>
  )
}

export default CarouselArea
