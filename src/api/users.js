import request from '@/utils/request'

export function getUsers(params) {
  return request({
    url: '/users',
    method: 'get',
    params
  })
}

export function storeUser(data) {
  return request({
    url: '/users',
    method: 'post',
    data
  })
}

export function updateUser(userId, data) {
  return request({
    url: `/users/${userId}`,
    method: 'put',
    data
  })
}

export function deleteUser(userId) {
  return request({
    url: `/users/${userId}`,
    method: 'delete'
  })
}

export function bulk(classroomId, data) {
  return request({
    url: `/bulk-import-users`,
    method: 'post',
    data: {
      classroom_id: classroomId,
      users: data
    }
  })
}
