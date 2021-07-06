import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'

import Carousel from './Carousel'
import { GenerateCarouselSlideItems } from 'app/components/GenerateCarouselSlideItems'

test('Render carousel', async () => {
  const { container } = render(<Carousel>{GenerateCarouselSlideItems(3)}</Carousel>)

  expect(container.firstChild.classList.contains('carousel')).toBe(true)
})
