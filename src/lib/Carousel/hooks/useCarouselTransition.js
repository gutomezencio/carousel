const useCarouselTransition = listRefCurrent => {
  return (translationValue, unit = '%') => {
    listRefCurrent.style.transform = `translate3d(${translationValue}${unit}, 0, 0)`
  }
}

export default useCarouselTransition
