import React from 'react'

export const carouselItems = [
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
export const GenerateCarouselSlideItems = (quant, customSize, text) => {
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
