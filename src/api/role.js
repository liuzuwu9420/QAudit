import request from '@/utils/request'

// 获取角色列表
export const getRoleList = () => {
  return request({
    url: '/sys_mgr/role_mgr/query/allList',
    method: 'get'
  })
}
// 添加
export const add = (data) => {
  return request({
    url: '/sys_mgr/role_mgr/add',
    method: 'post',
    data
  })
}
// 编辑
export const modify = (data) => {
  return request({
    url: '/sys_mgr/role_mgr/modify',
    method: 'put',
    data
  })
}
// 删除
export const del = (id) => {
  return request({
    url: `/sys_mgr/role_mgr/delete/${id}`,
    method: 'delete'
  })
}
// 详情
export const detail = (id) => {
  return request({
    url: `/sys_mgr/role_mgr/query/detail/${id}`,
    method: 'get'
  })
}
// 模糊查询
export const query = (id) => {
  return request({
    url: `/sys_mgr/role_mgr/query/likeList/${id}`,
    method: 'get'
  })
}
