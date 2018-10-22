import request from '@/utils/request'

export function getTeachers(params) {
  return request({
    url: '/teachers',
    method: 'get',
    params
  })
}

export function storeTeacher(data) {
  return request({
    url: '/teachers',
    method: 'post',
    data
  })
}

export function updateTeacher(userId, data) {
  return request({
    url: `/teachers/${userId}`,
    method: 'put',
    data
  })
}

export function deleteTeacher(userId) {
  return request({
    url: `/teachers/${userId}`,
    method: 'delete'
  })
}
