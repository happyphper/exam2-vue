import request from '@/utils/request'

export function getClassrooms(params) {
  return request({
    url: '/classrooms',
    method: 'get',
    params
  })
}

export function storeClassroom(data) {
  return request({
    url: '/classrooms',
    method: 'post',
    data
  })
}

export function updateClassroom(classroomId, data) {
  return request({
    url: `/classrooms/${classroomId}`,
    method: 'put',
    data
  })
}

export function deleteClassroom(classroomId) {
  return request({
    url: `/classrooms/${classroomId}`,
    method: 'delete'
  })
}
