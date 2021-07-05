const useCarouselTransition = listRefCurrent => {
  return translationValue => {
    listRefCurrent.style.transform = `translate3d(${translationValue}%, 0, 0)`
  }
}

export default useCarouselTransition
