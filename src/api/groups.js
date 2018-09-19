import request from '@/utils/request'

export function getGroups(params) {
  return request({
    url: '/groups',
    method: 'get',
    params
  })
}

export function storeGroup(data) {
  return request({
    url: '/groups',
    method: 'post',
    data
  })
}
