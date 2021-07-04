import React, { useState, useRef, useCallback } from 'react'

import './CarouselArea.scoped.scss'

import Carousel from 'app/components/Carousel/Carousel'

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

const GenerateItems = (quant, customSize, text) => {
  return carouselItems?.slice(0, quant)?.map((image, index) => {
    return (
      <div className="some-class" key={index}>
        <img src={`${image}/${customSize || '/300/300'}`} alt={`image-${index}`} />
        {text && (
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam dictum dolor non porta
            mollis. In tincidunt velit in tellus tristique scelerisque sed eget ligula. Nulla quam
            risus, consequat sit amet ex non, pharetra aliquet neque.
          </p>
        )}
      </div>
    )
  })
}

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
        <Carousel visibleItems={1} height={'auto'} width={'auto'}>
          {GenerateItems(9, '/500/500')}
        </Carousel>
      </div>

      {/* <div className="carousel-area__item carousel-area__item--hide-mobile">
        <h2>Custom Width</h2>
        <Carousel visibleItems={1} height={'auto'} width={'500px'}>
          {GenerateItems(9)}
        </Carousel>
      </div>

      <div className="carousel-area__item carousel-area__item--hide-desktop">
        <h2>Custom Width</h2>
        <Carousel visibleItems={1} height={'auto'} width={'80%'}>
          {GenerateItems(9)}
        </Carousel>
      </div>

      <div className="carousel-area__item carousel-area__item--hide-mobile">
        <h2>Image and Text and one Visible Slide</h2>
        <Carousel visibleItems={1} height={'400px'} width={'600px'}>
          {GenerateItems(9, null, true)}
        </Carousel>
      </div>

      <div className="carousel-area__item carousel-area__item--hide-desktop">
        <h2>Image and Text and one Visible Slide</h2>
        <Carousel visibleItems={1}>{GenerateItems(9, null, true)}</Carousel>
      </div>

      <div className="carousel-area__item">
        <h2>Simple one Visible Slide</h2>
        <Carousel visibleItems={1}>{GenerateItems(9)}</Carousel>
      </div>

      <div className="carousel-area__item">
        <h2>Without any Config</h2>
        <Carousel>{GenerateItems(9)}</Carousel>
      </div>

      <div className="carousel-area__item">
        <h2>Simple Infinity</h2>
        <Carousel infinity={true}>{GenerateItems(8)}</Carousel>
      </div>

      <div className="carousel-area__item">
        <h2>Infinity with 5 Visible Slides</h2>
        <Carousel visibleItems={5} infinity={true}>
          {GenerateItems(8)}
        </Carousel>
      </div>

      <div className="carousel-area__item">
        <h2>Infinity with less slides than available spaces for Visible Slides</h2>
        <Carousel infinity={true}>{GenerateItems(4)}</Carousel>
      </div>

      <div className="carousel-area__item">
        <h2>Restarting on end with 1 Visible Slide</h2>
        <Carousel visibleItems={1} restartOnEnd={true}>
          {GenerateItems(9)}
        </Carousel>
      </div>

      <div className="carousel-area__item">
        <h2>Simple with Restarting on end</h2>
        <Carousel restartOnEnd={true}>{GenerateItems(9)}</Carousel>
      </div>

      <div className="carousel-area__item">
        <h2>Simple with Navigation</h2>
        <Carousel restartOnEnd={true} showNavigation={true} visibleItems={2}>
          {GenerateItems(9)}
        </Carousel>
      </div>

      <div className="carousel-area__item">
        <h2>Go to Slide</h2>
        <Carousel
          restartOnEnd={true}
          ref={goToSlideExample}
          visibleItems={3}
          showCurrentNumber={true}
        >
          {GenerateItems(9)}
        </Carousel>
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
        <Carousel
          onChange={value => console.log('OUT', value)}
          visibleItems={2}
          restartOnEnd={true}
        >
          {GenerateItems(9)}
        </Carousel>
        <p>{JSON.stringify(onChangeValues)}</p>
      </div>

      <div className="carousel-area__item">
        <h2>Without actions</h2>
        <Carousel visibleItems={2} restartOnEnd={true} hideActions={true}>
          {GenerateItems(5)}
        </Carousel>
      </div>

      <div className="carousel-area__item">
        <h2>Custom Next and Prev</h2>
        <Carousel
          visibleItems={2}
          restartOnEnd={true}
          hideActions={true}
          ref={customPrevAndNextRef}
        >
          {GenerateItems(5)}
        </Carousel>
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
      </div> */}
    </div>
  )
}

export default CarouselArea
