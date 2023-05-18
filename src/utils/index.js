export const sleep = (delay = 200) =>
  new Promise((resolve) => {
    setTimeout(resolve, delay)
  })

export const getAssetsImgs = (imgPath) => {
  return new URL(`../assets/images/${imgPath}`, import.meta.url).href
}

export function getVideoFirstFrame(videoUrl, videoWidth, videoHeight) {
  const video = document.createElement('video') // 创建video
  video.setAttribute('crossOrigin', 'anonymous') // 处理跨域
  video.setAttribute('src', videoUrl) // 给video添加属性
  video.setAttribute('width', videoWidth)
  video.setAttribute('height', videoHeight)
  video.setAttribute('preload', 'auto') // 当页面加载后载入整个音频
  return new Promise((resolve, reject) => {
    video.addEventListener('loadeddata', function () {
      // 当前帧数据加载完成，下一帧数据未记载事件
      const canvas = document.createElement('canvas')
      canvas.width = video.width
      canvas.height = video.height
      const ctx = canvas.getContext('2d') // 二维绘图
      ctx.drawImage(video, 0, 0, video.width, video.height) // 绘制canvas
      const dataURL = canvas.toDataURL('image/jpeg') // 转换为base64
      resolve(dataURL)
    });
    video.addEventListener('error', (err) => {
      reject(err);
    })
  })
}
