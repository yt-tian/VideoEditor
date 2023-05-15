
export const getAssetsImgs = (imgPath) => {
  return new URL(`../assets/images/${imgPath}`, import.meta.url).href;
};

