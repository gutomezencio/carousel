import React, { useReducer } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import CarouselContextProvider from './context/provider'
import CarouselActions from './CarouselActions'

import reducers from './context/reducers'
import carouselState from './context/state'
import { CarouselContext } from './context/context'

let listRefCurrent
let wrapperRefCurrent
let toggleSwipingClass = jest.fn()

const ProviderTestWrapper = ({ children, currentState }) => {
  const [state, dispatch] = useReducer(reducers, { ...carouselState, ...currentState })

  return <CarouselContext.Provider value={{ state, dispatch }}>{children}</CarouselContext.Provider>
}
describe('<CarouselActions />', () => {
  beforeEach(() => {
    listRefCurrent = document.createElement('div')
    wrapperRefCurrent = document.createElement('div')

    document.body.appendChild(listRefCurrent)
    document.body.appendChild(wrapperRefCurrent)
  })

  afterEach(() => {
    document.body.removeChild(listRefCurrent)
    document.body.removeChild(wrapperRefCurrent)
  })

  it('Should render CarouselAction component', () => {
    render(
      <CarouselContextProvider>
        <CarouselActions
          listRefCurrent={listRefCurrent}
          wrapperRefCurrent={wrapperRefCurrent}
          toggleSwipingClass={toggleSwipingClass}
        />
      </CarouselContextProvider>
    )
    expect(screen.getByRole('button', { name: 'Prev' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()
  })

  it('Should render prev button disabled at start', () => {
    render(
      <CarouselContextProvider>
        <CarouselActions
          listRefCurrent={listRefCurrent}
          wrapperRefCurrent={wrapperRefCurrent}
          toggleSwipingClass={toggleSwipingClass}
        />
      </CarouselContextProvider>
    )
    expect(screen.getByRole('button', { name: 'Prev' })).toBeDisabled()
  })

  it('Should render disable Next button at last slide', async () => {
    const slideCount = 3

    render(
      <ProviderTestWrapper currentState={{ slideCount }}>
        <CarouselActions
          listRefCurrent={listRefCurrent}
          wrapperRefCurrent={wrapperRefCurrent}
          toggleSwipingClass={toggleSwipingClass}
        />
      </ProviderTestWrapper>
    )

    let buttonNext = screen.getByRole('button', { name: 'Next' })

    Array.from(Array(slideCount).keys()).forEach(() => {
      userEvent.click(buttonNext)
    })

    expect(buttonNext).toBeDisabled()
  })

  it('Should render Next and Prev buttons enabled when has `restartOnEnd`', () => {
    render(
      <ProviderTestWrapper currentState={{ slideCount: 10, config: { restartOnEnd: true } }}>
        <CarouselActions
          listRefCurrent={listRefCurrent}
          wrapperRefCurrent={wrapperRefCurrent}
          toggleSwipingClass={toggleSwipingClass}
        />
      </ProviderTestWrapper>
    )
    expect(screen.getByRole('button', { name: 'Prev' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled()
  })

  it('Should keep Next and Prev buttons enabled even on end when has `restartOnEnd`', () => {
    const slideCount = 10

    render(
      <ProviderTestWrapper currentState={{ slideCount, config: { restartOnEnd: true } }}>
        <CarouselActions
          listRefCurrent={listRefCurrent}
          wrapperRefCurrent={wrapperRefCurrent}
          toggleSwipingClass={toggleSwipingClass}
        />
      </ProviderTestWrapper>
    )

    let buttonNext = screen.getByRole('button', { name: 'Next' })

    Array.from(Array(slideCount).keys()).forEach(() => {
      userEvent.click(buttonNext)
    })

    expect(screen.getByRole('button', { name: 'Prev' })).toBeEnabled()
    expect(buttonNext).toBeEnabled()
  })
})
