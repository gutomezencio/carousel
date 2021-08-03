import React from 'react'
import { render, screen } from '@testing-library/react'

import Carousel from './Carousel'
import { GenerateCarouselSlideItems } from 'app/components/GenerateCarouselSlideItems'

describe('<Carousel />', () => {
  it('Should render the Carousel component', () => {
    const { container } = render(<Carousel>{GenerateCarouselSlideItems(3)}</Carousel>)

    expect(container.firstChild).toHaveClass('carousel')
  })

  it('Should init and render the Carousel slides childrens', () => {
    render(<Carousel>{GenerateCarouselSlideItems(3)}</Carousel>)

    expect(screen.getAllByRole('img', { name: /image-/i })).toHaveLength(3)
  })
})
