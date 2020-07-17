import request from '@/utils/request'

export const listTable = (params) => {
  return request({
    url: '/sys_mgr/gen/list',
    method: 'get',
    params
  })
}
// 模糊查询
export const query = (tableName) => {
  return request({
    url: `/sys_mgr/gen/query/likeList/${tableName}`,
    method: 'get'
  })
}
// 生成代码
export const downLoadZip = (tableName) => {
  return request({
    url: `/sys_mgr/gen/batchGenCode/${tableName}`,
    method: 'get',
    responseType: 'blob'
  })
}
