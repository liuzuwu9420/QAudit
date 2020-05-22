import request from '@/utils/request'

// 角色授权
export function changeFuncAuth(data) {
  return request({
    url: '/sys_mgr/auth_mgr/modify',
    method: 'put',
    data
  })
}

// 查询权限列表
export function pageListByRole(roleId) {
  return request({
    url: `/sys_mgr/auth_mgr/query/pageList/byRole/${roleId}`,
    method: 'get'
  })
}

// 重置所有权限
export function resetAllModuleRoleAuth() {
  return request({
    url: '/sys_mgr/auth_mgr/resetAllModuleRoleAuth',
    method: 'put'
  })
}
