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

export function updateGroup(groupId, data) {
  return request({
    url: `/groups/${groupId}`,
    method: 'put',
    data
  })
}

export function deleteGroup(groupId) {
  return request({
    url: `/groups/${groupId}`,
    method: 'delete'
  })
}
