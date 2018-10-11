import axios from 'axios'
import { Notification } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// respone拦截器
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.log('err' + error) // for debug
    if (error.response.status === 401) {
      Notification({
        title: '身份验证失效',
        message: '正在跳转登录页，请重新登录',
        type: 'error',
        duration: 1000
      })
      store.dispatch('FedLogOut').then(() => {
        location.reload()// 为了重新实例化vue-router对象 避免bug
      })
    } else if (error.response.status === 422) {
      const messages = [...Object.values(error.response.data.errors)]
      messages.forEach((item, index) => {
        Notification({
          title: '参数错误',
          message: item.join(''),
          type: 'error',
          offset: 80 * index
        })
      })
      return Promise.reject(error)
    }
    Notification({
      title: '404 Not Found',
      message: error.response.data.message,
      type: 'error',
      duration: 3000
    })
    return Promise.reject(error)
  }
)

export default service
