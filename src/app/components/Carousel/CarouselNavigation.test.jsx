import React from 'react'
import { render, screen } from '@testing-library/react'

import ProviderTestWrapper from 'tests/ProviderTestWrapper'

import CarouselNavigation from './CarouselNavigation'
import userEvent from '@testing-library/user-event'

let listRefCurrent

describe('<CarouselNavigation/>', () => {
  beforeEach(() => {
    listRefCurrent = document.createElement('div')

    document.body.appendChild(listRefCurrent)
  })

  afterEach(() => {
    document.body.removeChild(listRefCurrent)
  })
  it('Should render CarouselNavigation component', () => {
    const { container } = render(
      <ProviderTestWrapper currentState={{}}>
        <CarouselNavigation listRefCurrent={listRefCurrent} />
      </ProviderTestWrapper>
    )

    expect(container.firstChild).toHaveClass('carousel__navigation')
  })
  it('Should go to slide when navigation is clicked', () => {
    const slideCount = 5

    render(
      <ProviderTestWrapper currentState={{ slideCount }}>
        <CarouselNavigation listRefCurrent={listRefCurrent} />
      </ProviderTestWrapper>
    )

    let goToFourthSlide = screen.getByRole('button', { name: '4' })

    userEvent.click(goToFourthSlide)

    expect(goToFourthSlide).toHaveClass('carousel__navigation__number--current')
  })
})
