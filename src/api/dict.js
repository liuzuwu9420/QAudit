import request from '@/utils/request'

// 删除
export const del = (id) => {
  return request({
    url: `/sys_mgr/sys_dic/delete/${id}`,
    method: 'delete'
  })
}
// 添加
export const add = (data) => {
  return request({
    url: '/sys_mgr/sys_dic/add',
    method: 'post',
    data
  })
}
// 编辑
export const modify = (data) => {
  return request({
    url: '/sys_mgr/sys_dic/modify',
    method: 'put',
    data
  })
}
// 查询
export const detail = (id) => {
  return request({
    url: `/sys_mgr/sys_dic/query/detail/${id}`,
    method: 'get'
  })
}
// 模糊查询
export const query = (params) => {
  return request({
    url: '/sys_mgr/sys_dic/query/likeList',
    method: 'get',
    params
  })
}
