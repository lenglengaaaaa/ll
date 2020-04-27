import axios from 'axios'
//引入qs模块,用来序列化post类型的数据
import qs from 'qs' 
import router from '../router'
import store from '../store'
import lodash from 'lodash'
import { message } from 'element-ui'

/** 
 * 提示函数 
 */
const tip = msg => {    
  message({
    type:'error',
    message:msg,
    // duration: 1000, 
  });
}

/** 
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 * 请求已发出，但是不在2xx的范围
 */
const toLogin = () => {
  router.replace({
      path: '/login',        
      query: { redirect: router.currentRoute.fullPath }
  });
}

/** 
 * 请求失败后的错误统一处理 
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
        toLogin();
        break;
    // 403 token过期
    // 清除token并跳转登录页
    case 403:
        tip('登录过期，请重新登录');
        store.dispatch('user/resetToken').then(()=>{
          setTimeout(() => {
              toLogin();
          });
        })
        break;
    // 404请求不存在
    case 404:
        tip('请求的资源不存在'); 
        break;
    default:
        console.log(other);   
}}



//拦截请求
axios.interceptors.request.use(
  config=> {
    // 这里可以做loading show处理
    // 登录流程控制中，根据本地是否存在token判断用户的登录情况        
    // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token        
    // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码        
    // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。   
    const token = store.state.user.token;        
    token && (config.headers['jtoken'] = token);    

    return config
  },
  error => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

//拦截响应
axios.interceptors.response.use(
  response => {
    if(response.status===200){
      if(response.data.code === 11000005){
        tip(response.data.meassage);
        store.dispatch('user/resetToken').then(()=>{
          setTimeout(() => {
              toLogin();
          }, 2000);
        })
      }else{
        return Promise.resolve(response);
      }
    }else{
      Promise.reject(response)
    }
    // return response.status===200?Promise.resolve(response) :Promise.reject(response)
  },
  error => {
    const {res} = error;
    if(res){
      // 请求已发出，但是不在2xx的范围
      errorHandle(res.status,res.data.message);
      return Promise.reject(res)
    }else{
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      tip('服务器无法响应,请联系管理员');
      // store.dispatch('user/resetToken').then(()=>{
      //   setTimeout(() => {
      //       toLogin();
      //   }, 1000);
      // })
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
  let { method = 'get', data={}, url } = options
  try {
    url = buildParam(url, data.urlParams)
  } catch (error) {
    console.log(error, 'e')
    throw new Error('请求链接参数错误!')
  }

  // delete data.urlParams
  const cloneData = lodash.cloneDeep(data)

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

export const request=(options)=>{
  return fetch(options)
    .then(response => {
      const { data } = response
      return Promise.resolve({
        ...data
      })
    })
    .catch(error => {
      console.log(error,'error')
    })
}

export default function(Vue){
  Vue.prototype.$request = request;
}