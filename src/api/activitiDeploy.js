import request from '@/utils/request'

// 添加
export const add = (data) => {
  return request({
    url: '/sys_mgr/model/add',
    method: 'post',
    data
  })
}
// 删除
export const del = (id) => {
  return request({
    url: `/process/remove/${id}`,
    method: 'delete'
  })
}

// 模糊查询
export const query = (params) => {
  return request({
    url: '/process/getProcessPage',
    method: 'get',
    params
  })
}

export const covertToModel = (id) => {
  return request({
    url: `/process/covertToModel/${id}`,
    method: 'get'
  })
}
