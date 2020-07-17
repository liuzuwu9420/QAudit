import request from '@/utils/request'

/**
 * @description: 查询审核任务
 * @param {Object} 查询参数
 */
export const getAuditTask = (params) => {
  return request({
    url: '/audit_mgr/task_mgr/query/likeList',
    method: 'get',
    params
  })
}
