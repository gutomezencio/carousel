import React from 'react'

import Carousel from 'app/components/Carousel/Carousel'

const CarouselArea = () => {
  const carouselItems = [
    'https://picsum.photos/id/111/300/300',
    'https://picsum.photos/id/122/300/300',
    'https://picsum.photos/id/133/300/300',
    'https://picsum.photos/id/144/300/300',
    'https://picsum.photos/id/155/300/300',
    'https://picsum.photos/id/166/300/300',
    'https://picsum.photos/id/177/300/300',
    'https://picsum.photos/id/188/300/300',
    'https://picsum.photos/id/199/300/300'
  ]

  const generateItems = quant => {
    return carouselItems?.slice(0, quant)?.map((image, index) => {
      return (
        <div className="some-class" key={index}>
          <img src={image} alt={`image-${index}`} />
        </div>
      )
    })
  }
  return (
    <div className="carousel-area">
      <div className="carousel-area__item">
        <Carousel>{generateItems(9)}</Carousel>
      </div>

      <div className="carousel-area__item">
        <Carousel infinity={true}>{generateItems(4)}</Carousel>
      </div>

      <div className="carousel-area__item">
        <Carousel visilbleItems={5} infinity={true}>
          {generateItems(8)}
        </Carousel>
      </div>

      <div className="carousel-area__item">
        <Carousel infinity={true}>{generateItems(8)}</Carousel>
      </div>

      <div className="carousel-area__item">
        <Carousel visilbleItems={1} restartOnEnd={true}>
          {generateItems(9)}
        </Carousel>
      </div>

      <div className="carousel-area__item">
        <Carousel visilbleItems={2} infinity={true}>
          {generateItems(5)}
        </Carousel>
      </div>

      <div className="carousel-area__item">
        <Carousel visilbleItems={1} restartOnEnd={true}>
          {generateItems(9)}
        </Carousel>
      </div>
    </div>
  )
}

export default CarouselArea
