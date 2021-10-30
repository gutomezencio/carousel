import React from 'react'
import Carousel from './Carousel'

import { GenerateCarouselSlideItems } from 'app/components/GenerateCarouselSlideItems'

export default {
  component: Carousel,
  title: 'Components/Carousel'
}

const Template = args => <Carousel {...args} />

export const AutoHeightWidth = Template.bind({})

AutoHeightWidth.args = {
  visibleItems: 1,
  height: 'auto',
  width: 'auto',
  children: GenerateCarouselSlideItems(9, '/500/500')
}
