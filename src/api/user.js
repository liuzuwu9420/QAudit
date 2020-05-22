import request from '@/utils/request'

// 保存
export const save = (data) => {
  return request({
    url: '/user/save',
    method: 'post',
    data
  })
}
// 删除
export const batchDelete = (data) => {
  return request({
    url: '/user/delete',
    method: 'post',
    data
  })
}
// 分页查询
export const findPage = (data) => {
  return request({
    url: '/user/findPage',
    method: 'post',
    data
  })
}
// 查询机构树
export const findDeptTree = () => {
  return request({
    url: '/dept/findTree',
    method: 'get'
  })
}
// 查询全部
export const findAll = () => {
  return request({
    url: '/role/findAll',
    method: 'get'
  })
}
// 查找用户的菜单权限标识集合
export const findPermissions = (params) => {
  return request({
    url: '/user/findPermissions',
    method: 'get',
    params
  })
}
