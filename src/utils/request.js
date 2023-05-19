
import axios from 'axios'

import { ElMessage  } from 'element-plus';
const service = axios.create({
  // 公共接口
  baseURL: '/api/v1',
  timeout: 3 * 1000
})
service.interceptors.request.use(config => {
   config.data = JSON.stringify(config.data); 
   config.headers = {
     'Content-Type':'application/x-www-form-urlencoded' 
   }
   const token = sessionStorage.getItem('Authorization');
   if(token){
      config.headers.token= token; 
    }
  return config
}, error => {
  Promise.reject(error)
})

// 3.响应拦截器
service.interceptors.response.use(response => {
  return response
}, error => {
  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        error.message = '错误请求'
        break;
      case 401:
        error.message = '未授权，请重新登录'
        break;
      case 403:
        error.message = '拒绝访问'
        break;
      case 404:
        error.message = '请求错误,未找到该资源'
        break;
      case 405:
        error.message = '请求方法未允许'
        break;
      case 408:
        error.message = '请求超时'
        break;
      case 500:
        error.message = '服务器端出错'
        break;
      case 501:
        error.message = '网络未实现'
        break;
      case 502:
        error.message = '网络错误'
        break;
      case 503:
        error.message = '服务不可用'
        break;
      case 504:
        error.message = '网络超时'
        break;
      case 505:
        error.message = 'http版本不支持该请求'
        break;
      default:
        error.message = `连接错误${error.response.status}`
    }
  } else {
    if (JSON.stringify(error).includes('timeout')) {
      ElMessage .error('服务器响应超时，请刷新当前页')
    }
    error.message = '连接服务器失败'
  }

  ElMessage .error(error.message) 
  return Promise.resolve(error.response)
})
//4.导出axios实例
export default service
