import axios from 'axios'
//引入qs模块,用来序列化post类型的数据
import qs from 'qs' 
// import { message } from 'antd'
import lodash from 'lodash'

/** 
 * 请求失败后的错误统一处理 
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
        // toLogin();
        break;
    // 403 token过期
    // 清除token并跳转登录页
    case 403:
        // tip('登录过期，请重新登录');
        // localStorage.removeItem('token');
        // store.commit('loginSuccess', null);
        // setTimeout(() => {
        //     toLogin();
        // }, 1000);
        break;
    // 404请求不存在
    case 404:
        // tip('请求的资源不存在'); 
        break;
    default:
        console.log(other);   
}}

//拦截请求
axios.interceptors.request.use(
  config=> {
    //这里可以做loading show处理
    return config
  },
  error => Promise.reject(error)
)

//拦截响应
axios.interceptors.response.use(
  response => {
    console.log(response,'res')
    return response.status===200?Promise.resolve(response) :Promise.reject(response)
  },
  error => {
    const {res} = error;
    if(res){
      errorHandle(res.status,res.data.message);
      return Promise.reject(res)
    }else{
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      console.log('I am here!')
    }
  }
)

/**
 * get请求拼接url¶ms
 * @param {String} url 
 * @param {Object} params 
 */
const buildParam=(url, params)=> {
  return url.replace(
    /\/:(\w+)/gm,
    index =>
      `/${index === '/:id' ? '' : index.replace(/\/:/g, '') + '/'}${
        params[`${index.replace(/\/:/g, '')}`]
      }`
  )
}

const fetch = options => {
  let { method = 'get', data, url } = options
  try {
    url = buildParam(url, data.urlParams)
  } catch (error) {
    console.log(error, 'e')
    throw new Error('请求链接参数错误!')
  }

  // delete data.urlParams
  const cloneData = lodash.cloneDeep(data)

  //配置axios请求默认值
  axios.defaults.baseURL = "http://eplusview.com:8088"

  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData
      })
    case 'delete':
      return axios.delete(url, {
        params: cloneData
      })
    case 'post':
      return axios.post(url, cloneData,{
        headers: {'Content-Type': 'application/json'},
      })
    case 'put':
      return axios.put(url, cloneData)
    case 'patch':
      return axios.patch(url, cloneData)
    case 'form':
      return axios.post(url, qs.stringify(cloneData), {
        headers: {
          Accept: 'application/json, text/javascript, */*; q=0.01',
          token: 'Basic c3VwZXJ1c2VyOjEyMzQ1Ng==',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      })
    case 'upload':
      if (options.progress) {
        return axios.post(url, data, {
          onUploadProgress: options.progressCallback
        })
      } else {
        return axios.post(url, data, {
          headers: {
            Accept: 'application/json, text/javascript, */*; q=0.01'
          }
        })
      }
    default:
      return axios(options)
  }
}

const request=(options)=>{
  return fetch(options)
    .then(response => {
      const { data } = response
      return Promise.resolve({
        ...data
      })
    })
    .catch(error => {
      const { response } = error
      let msg, statusCode
      if (response && response instanceof Object) {
        const { data, status, statusText } = response
        statusCode = response.status
        msg = data.message || statusText
        if (response.status === 401) {
          console.log('status', 401)
        } else if (status === 403) {
          console.log('接口没配置权限，自动退出系统')
        } else if ( status === 405 ) {
          console.log('禁止IP，自动退出系统')
        }
      } else {
        console.log('系统服务异常，自动退出系统')
      }
      return Promise.resolve({
        error: true,
        statusCode: statusCode,
        statusMessage: msg
      })
    })
}

export default function(Vue){
  Vue.prototype.$request = request;
}