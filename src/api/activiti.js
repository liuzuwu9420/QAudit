import request from '@/utils/request'

// 添加
export const add = (data) => {
  return request({
    url: '/sys_mgr/model/add',
    method: 'post',
    data
  })
}
// 编辑
export const modify = (data) => {
  return request({
    url: '/sys_mgr/model/modify',
    method: 'put',
    data
  })
}
// 删除
export const del = (id) => {
  return request({
    url: `/sys_mgr/model/removeModelById/${id}`,
    method: 'delete'
  })
}

// 模糊查询
export const query = (params) => {
  return request({
    url: '/sys_mgr/model/getModelPage',
    method: 'get',
    params
  })
}

export const deploy = (id) => {
  return request({
    url: `/sys_mgr/model/deploy/${id}`,
    method: 'get'
  })
}

// 导出数据
export const exportData = (id) => {
  return request({
    url: `/sys_mgr/model/exportXml/${id}`,
    method: 'get',
    responseType: 'blob'
  })
}
