import request from '@/utils/request'

export function bulk(groupId, data) {
  return request({
    url: `/bulk-import-users`,
    method: 'post',
    data: {
      group_id: groupId,
      users: data
    }
  })
}

export function getUserGroups() {
  return request({
    url: `/manage-groups`,
    method: 'get'
  })
}

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
