import request from '@/utils/request'

// 获取角色列表
export const getRoleList = () => {
  return request({
    url: '/xef/tRole',
    method: 'get'
  })
}
// 添加
export const add = (data) => {
  return request({
    url: '/xef/tRole/add',
    method: 'post',
    data
  })
}
// 编辑
export const modify = (data) => {
  return request({
    url: '/xef/tRole/modify',
    method: 'put',
    data
  })
}
// 删除
export const del = (id) => {
  return request({
    url: `/xef/tRole/delete/${id}`,
    method: 'delete'
  })
}
// 详情
export const detail = (id) => {
  return request({
    url: `/xef/tRole/query/detail/${id}`,
    method: 'get'
  })
}
// 模糊查询
export const query = (params) => {
  return request({
    url: '/xef/tRole/query/likeList',
    method: 'get',
    params
  })
}

// 导出数据
export const exportData = (params) => {
  return request({
    url: '/xef/tRole/export',
    method: 'get',
    params
  })
}
// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/xef/tRole/importTemplate',
    method: 'get'
  })
}
