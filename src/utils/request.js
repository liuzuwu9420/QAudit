import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (getToken('Token')) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers.Authorization = store.getters.token
    }
    config.retry = 2
    config.retryDelay = 1000
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (response.config.responseType === 'blob') {
      return response
    }
    return res
  }, (error) => {
    // return Promise.reject(error)

    var config = error.config
    // If config does not exist or the retry option is not set, reject
    if (!config || !config.retry) {
      Message({
        message: `${error.message} 请刷新重试！`,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(error)
    }

    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0

    // Check if we've maxed out the total number of retries
    if (config.__retryCount >= config.retry) {
      Message({
        message: `${error.message} 请刷新重试！`,
        type: 'error',
        duration: 3 * 1000
      })
      // Reject with the error
      return Promise.reject(error)
    }

    Message({
      message: '连接失败，重新请求中...',
      type: 'info',
      duration: 3 * 1000
    })
    // Increase the retry count
    config.__retryCount += 1

    // Create new promise to handle exponential backoff
    var backoff = new Promise(function(resolve) {
      setTimeout(function() {
        resolve()
      }, config.retryDelay || 1)
    })

    // Return the promise in which recalls axios to retry the request
    return backoff.then(function() {
      return service(config)
    })
  }
)
export default service
