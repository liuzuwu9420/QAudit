import request from '@/utils/request'

/**
 * @description: 查询检查单
 * @param {Object} 查询参数
 */
export const getCheckList = (params) => {
  return request({
    url: '/audit_mgr/check_mgr/query/likeList',
    method: 'get',
    params
  })
}

/**
 * @description: 根据itemPath查询子级检查单
 * @param {Object} 查询参数
 */
export const getItemCheckList = (params) => {
  return request({
    url: '/audit_mgr/check_mgr/queryContent/likeList',
    method: 'get',
    params
  })
}

/**
 * @description: 获取检查单查询条件
 */
export const getcheckSearch = () => {
  return request({
    url: '/audit_mgr/check_mgr/query/checkSearch',
    method: 'get'
  })
}
