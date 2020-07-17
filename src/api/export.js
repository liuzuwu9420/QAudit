import request from '@/utils/request'

export const exportData = (fileName) => {
  return request({
    url: '/common/download?fileName=' + encodeURI(fileName) + '&delete=' + true,
    method: 'get',
    responseType: 'blob'
  })
}
