import request from '@/utils/request'

/**
 * @description: 查询审核计划
 * @param {Object} 查询参数
 */
export const getAuditPlan = (params) => {
  return request({
    url: '/audit_mgr/plan_mgr/query/likeList',
    method: 'get',
    params
  })
}
