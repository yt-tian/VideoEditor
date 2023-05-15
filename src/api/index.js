import request from '../utils/request'

// 获取视频接口
export const getVideos = (VideoType,keyword, sindex = 0, num = 20,) => request({
  method: 'post',
  url: '/get_videos',
  data: {
    VideoType,
    keyword,
    num,
    sindex
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
export const importMedia = (MediaID, MediaType, industryId)=> request({
  method: 'post',
  url: '/import_media_byid',
  data:{
    MediaID,
    MediaType,
    industryId
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