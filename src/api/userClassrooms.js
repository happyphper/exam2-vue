import request from '@/utils/request'

export function storeUserClassroom(userId, classroomId) {
  return request({
    url: `/users/${userId}/classrooms/${classroomId}`,
    method: 'post'
  })
}

export function deleteUserClassroom(userId, classroomId) {
  return request({
    url: `/users/${userId}/classrooms/${classroomId}`,
    method: 'delete'
  })
}
