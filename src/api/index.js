import request from '../utils/request'
import SparkMD5 from 'spark-md5'
import axios from 'axios';
import { ElMessage } from 'element-plus'
// import { saveAs } from 'file-saver';

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
  // let link = document.createElement('a');
  // link.style.display = 'none';
  // link.href = url;
  // link.setAttribute("download","aaa.mp4")
  // link.target = "_blank"
  // document.body.appendChild(link)
  // link.click()
  // document.body.removeChild(link);
  
  //let url = this.viewUrl + item.Path + '?download=1';
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.style.height = 0;
  iframe.src = url;
  // iframe.setAttribute("name", item.FileName);
  // let name = item.FileName;
  // link.download = name;
  //link.setAttribute('download',name)
  document.body.appendChild(iframe);
  console.log('iframe',iframe)
  setTimeout(() => { 
      iframe.remove() //无奈之举，iframe 没有onload事件，只能放在setTimeout里清除了，时间稍微大一点，免得文件太大还没有下载完
  }, 50000)
}

// 文件分片上传
export const uploadBySplit = async (file,mediaType,mediaPath) => {
  // let fileRaw = file.raw;
  console.log('uploadBySplit',file)
  // console.log('fileRaw',fileRaw)
  let eachSize = 1*1024*1024;//每块文件大小1mb
  // let progress = 0;//上传进度
  // let currentChunk = 0;//当前块
  let totalChunks = Math.ceil(file.size / eachSize);;//总块数

  //获取文件md5
  let md5 = await getFileMd5(file);
  console.log('md5',md5);
  if(!md5){
    ElMessage.warning('md5为空，请重试');
    return;
  }
  
  //文件分块
  const fileChunks = await splitFile(file,eachSize,totalChunks);
  console.log('fileChunks',fileChunks)

  //上传
  await saveFileChunk(fileChunks, md5, file.name, file.size, mediaType, mediaPath)

  // let percent = 0;
  // setInterval(() => {
  //   if(percent !== 100){
  //     axios({
  //       url:'/api/v1/upload/progress',
  //       method:'get',
  //       params:{'fileName':file.name},
  //       headers: {token: sessionStorage.getItem('Authorization')}
  //     }).then((res) => {
  //       console.log('progress',res.data)
  //       if(res.data.code != 200){
  //         console.log('upload/progress',res.data)
  //         return;
  //       }
        
  //       percent = res.data.data.percent;
        
  //     })
  //   }
  // },2000)
  
}

// 文件分块,利用Array.prototype.slice方法
export function splitFile(file, eachSize, chunks) {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        // const fileChunk = [];
        // for (let chunk = 1; chunk <= chunks; chunk++) {
        //   fileChunk.push(file.slice(chunk, chunk + eachSize));
        //   // if(chunk===chunks){
        //   //   fileChunk.push(file.slice((chunk-1) * eachSize, file.size))
        //   // }
        //   // fileChunk.push(file.slice((chunk-1) * eachSize, (chunk-1)*eachSize + eachSize))
        //   chunk += eachSize;
        // }
        // resolve(fileChunk);

        const fileChunk = [];
        for (let chunk = 0; chunks > 0; chunks--) {
          fileChunk.push(file.slice(chunk, chunk + eachSize));
          chunk += eachSize;
        }
        resolve(fileChunk);
      }, 0);
    } catch (e) {
      console.error(e);
      reject(new Error("文件切块发生错误"));
    }
  });
}

// 获取文件的唯一MD5标识码
export function getFileMd5(file) {
  return new Promise((resolve) => {
    const fileReader = new FileReader()
    const spark = new SparkMD5.ArrayBuffer()
    fileReader.readAsArrayBuffer(file)
    fileReader.onload = e => {
      spark.append(e.target.result)
      let md5 = spark.end()
      resolve(md5)
    }
  })
}

// 保存文件片段到后台
const saveFileChunk = async (chunkList, fileMd5, fileName, totalFileSize, mediaType, mediaPath) => {
  for(let i = 1; i <= chunkList.length; i++) {
    console.log('saveFileChunk',chunkList[i-1]);
    let formData = new FormData()
    // formData.append('fileName', fileName) // 文件的名称
    // formData.append('totalFileSize', totalFileSize) // 当前片段的索引
    // formData.append('totalChunk', chunkList.length) // 切片的文件分片大小 (就是以多少字节进行分片的，这里是5M)
    // formData.append('md5Value', fileMd5) // 共有多少分片
    // formData.append('currentChunk', i) // 当前分片的文件流
    // formData.append('currentChunkSize', chunkList[i].size) // 整个文件的MD5唯一标识码，不是分片
    // formData.append('MediaType', mediaType),
    // formData.append('MediaPath', mediaPath)
    formData.append('file', chunkList[i-1]) // 当前分片的文件流

    let form = {
      'fileName':fileName,
      'totalFileSize':totalFileSize,
      'totalChunk':chunkList.length,
      'md5Value':fileMd5,
      'currentChunk':i,
      'currentChunkSize':chunkList[i-1].size,
      'MediaType':mediaType,
      'MediaPath':mediaPath
    }
    //const data = await saveFile(formData)
    // if(data && data.success) {
    //   console.log('保存成功')
    // }
    axios({
      url: '/api/v1/upload/chunk',
      method: 'POST',
      // timeout: 60000,
      params: form,
      data: formData,
      headers: {token: sessionStorage.getItem('Authorization'),'Content-Type': 'multipart/form-data'}
    })
    .then((res) => {
      console.log('chunk',res.data)
      if(res.data.code != 200){
        ElMessage.error(res.data.msg);
      }
    })
  }
}