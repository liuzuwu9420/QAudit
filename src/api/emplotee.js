import request from '@/utils/request'

// 添加
export const add = (data) => {
  return request({
    url: '/sys_mgr/staff_mgr/add',
    method: 'post',
    data
  })
}
// 删除
export const del = (id) => {
  return request({
    url: `/sys_mgr/staff_mgr/delete/${id}`,
    method: 'delete'
  })
}
// 编辑
export const modify = (data) => {
  return request({
    url: '/sys_mgr/staff_mgr/modify',
    method: 'put',
    data
  })
}
// 搜索
export const detail = (id) => {
  return request({
    url: `/sys_mgr/staff_mgr/query/detail/${id}`,
    method: 'get'
  })
}
// 根据用户名查询用户个人信息
export const findEmployByUserName = (userName) => {
  return request({
    url: `/sys_mgr/staff_mgr/query/byUserName/${userName}`,
    method: 'get'
  })
}
// 模糊查询
export const queryLikeList = (userName) => {
  return request({
    url: `/sys_mgr/staff_mgr/query/likeList/${userName}`,
    method: 'get'
  })
}
