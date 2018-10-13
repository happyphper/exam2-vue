import request from '@/utils/request'

export function getAdminUsers(params) {
  return request({
    url: '/admin-users',
    method: 'get',
    params
  })
}

export function storeAdminUser(data) {
  return request({
    url: '/admin-users',
    method: 'post',
    data
  })
}

export function updateAdminUser(userId, data) {
  return request({
    url: `/admin-users/${userId}`,
    method: 'put',
    data
  })
}

export function deleteAdminUser(userId) {
  return request({
    url: `/admin-users/${userId}`,
    method: 'delete'
  })
}
