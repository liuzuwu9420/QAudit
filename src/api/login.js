import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/sys_mgr/sign_in',
    method: 'post',
    data
  })
}
// 登出
export const logout = () => {
  return request({
    url: '/sys_mgr/sign_out',
    method: 'post'
  })
}
// 刷新TOKEN
export const reFreshToken = () => {
  return request({
    url: '/sys_mgr/refresh_token',
    method: 'get'
  })
}
