import request from '@/utils/request'

// 添加
export function add(data) {
  return request({
    url: '/sys_devloper/module_mgr/add',
    method: 'post',
    data
  })
}
// 删除
export function del(id) {
  return request({
    url: `/sys_devloper/module_mgr/delete/${id}`,
    method: 'delete'
  })
}
// 编辑
export function modify(data) {
  return request({
    url: '/sys_devloper/module_mgr/modify',
    method: 'put',
    data
  })
}
// 查询
export function query(id) {
  return request({
    url: `/sys_devloper/module_mgr/query/detail/${id}`,
    method: 'get'
  })
}
// 获取
export function getModulePageList(pageNum, pageSize) {
  return request({
    url: `/sys_devloper/module_mgr/query/pageList/${pageNum}/${pageSize}`,
    method: 'get'
  })
}

export function getModuleListByRole(roleId) {
  return request({
    url: `/sys_devloper/module_mgr/query/byRole/${roleId}`,
    method: 'get'
  })
}
// 根据模块查找功能
export function getFuncOfModule(id) {
  return request({
    url: `/sys_devloper/func_mgr/query/byModuleId/${id}`,
    method: 'get'
  })
}
