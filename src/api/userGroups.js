import request from '@/utils/request'

export function storeUserGroup(userId, groupId) {
  return request({
    url: `/users/${userId}/groups/${groupId}`,
    method: 'post'
  })
}

export function deleteUserGroup(userId, groupId) {
  return request({
    url: `/users/${userId}/groups/${groupId}`,
    method: 'delete'
  })
}
