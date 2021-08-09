import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import { CarouselContext } from './context/context'

import useGoToSlide from './hooks/useGoToSlide'

import './Carousel.scoped.scss'

const CarouselNavigation = ({ listRefCurrent }) => {
  const { state } = useContext(CarouselContext)
  const goToSlide = useGoToSlide(listRefCurrent)

  return (
    <div className="carousel__navigation">
      {Array.from(Array(state.slideCount + 1).keys()).map((_, index) => {
        return (
          <button
            type="button"
            key={`navigation-${index}`}
            onClick={() => goToSlide(index + 1)}
            className={`carousel__navigation__number ${
              state.currentSlide === index ? 'carousel__navigation__number--current' : ''
            }`}
          >
            {index + 1}
          </button>
        )
      })}
    </div>
  )
}

CarouselNavigation.propTypes = {
  listRefCurrent: PropTypes.object.isRequired
}

export default CarouselNavigation
