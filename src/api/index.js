import request from '../utils/request'

// 获取视频接口
/*
IsHighVideo: true 表示高清视频，720P以上
SizeType: 0:默认，1：横版，2：竖板
SortType: 1：点赞数排序 2：时间
VideoType:渠道类型
keyword：关键字
num：一次数量
sindex：从第几条开始爬取
*/
export const getVideos = (IsHighVideo,SizeType,SortType,VideoType,keyword,DateLimit, sindex = 0, num = 20) => request({
  method: 'post',
  url: '/get_videos',
  data: {
    IsHighVideo,
    SizeType,
    SortType,
    VideoType,
    keyword,
    num,
    sindex,
    DateLimit
  }
});
// 获取抖音视频接口
export const getVideoList = (keyword, num = 20,sindex = 0) => request({
  method: 'post',
  url: '/get_video_douyin',
  data: {
    keyword,
    num,
    sindex
  }
});
// 获取抖音爬虫视频接口
export const generateVideoList = (keyword, num = 20,sindex = 0) => request({
  method: 'post',
  url: '/generate_video_douyin',
  data: {
    keyword,
    num,
    sindex
  }
});

// 获取快手视频接口
export const getKuaishouVideoList = (keyword, num = 20,sindex = 0) => request({
  method: 'post',
  url: '/get_video_kuaishou',
  data: {
    keyword,
    num,
    sindex
  }
});

//获取行业分类接口
export const getIndustryLsit = ()=> request({
  method: 'get',
  url: '/get_industry',
})

// 上传爬取素材库接口
export const importMedia = (MediaID, MediaPath, MediaType)=> request({
  method: 'post',
  url: '/import_media_byid',
  data:{
    MediaID,
    MediaPath,
    MediaType
  }
})

// 上传本地文件素材库接口
export const importMediaFile = (MediaType, industryId, file)=> request({
  method: 'put',
  url: '/import_media_byfile',
  data:{
    MediaType,
    industryId,
    file
  }
})

// 获取素材库视频接口
export const getMediaList = ()=> request({
  method: 'get',
  url: '/get_media',

})

// 删除素材库内容接口
export const deleteMedia = (MediaID)=> request({
  method: 'post',
  url: '/delete_media',
  data:{
    MediaID
  }

})

// 删除文件夹接口
export const deleteMediaFolder = (MediaPath,MediaType)=> request({
  method: 'post',
  url: '/delete_media_folder',
  data:{
    MediaPath,
    MediaType
  }

})

// 下载
export const downloadMedia = (url)=>{
  console.log('url',url)
  //let mediaUrl = window.URL.createObjectURL(url)
  let mediaUrl = url + '?response-content-type=application/octet-stream'
  let link = document.createElement('a');
  link.style.display = 'none';
  link.href = mediaUrl;
  //link.href = window.URL.createObjectURL(url);
  //let timestamp = new Date().getTime()
  link.setAttribute("download","aaa.mp4")
  link.target = "_blank"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link);
  //link.remove()
}