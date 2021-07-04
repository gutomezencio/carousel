export const getAbsoluteWidth = el => {
  const margin = parseInt(getComputedStyle(el)['margin-right'].replace('px', ''))
  const elementValues = el.getBoundingClientRect()

  return {
    fullWidth: elementValues.width,
    margin
  }
}

export const waitForElementWidth = async itemEl => {
  let resizeObserver = null

  await new Promise(resolve => {
    resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width } = entry.contentRect

        if (width) {
          resizeObserver.unobserve(itemEl)
          return resolve('rendered!')
        }
      }
    })
    resizeObserver.observe(itemEl)
  })
}
