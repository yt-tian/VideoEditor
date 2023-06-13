export const sleep = (delay = 200) =>
  new Promise((resolve) => {
    setTimeout(resolve, delay)
  })

export const getAssetsImgs = (imgPath) => {
  return new URL(`../assets/images/${imgPath}`, import.meta.url).href
}