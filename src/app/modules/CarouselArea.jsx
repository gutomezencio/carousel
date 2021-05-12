import React from 'react'

import Carousel from 'app/components/Carousel/Carousel'

const CarouselArea = () => {
  return (
    <div className="carousel-area">
      <div className="carousel-area__item">
        <Carousel />
      </div>

      <div className="carousel-area__item">
        <Carousel visilbleItems={1} />
      </div>
    </div>
  )
}

export default CarouselArea
