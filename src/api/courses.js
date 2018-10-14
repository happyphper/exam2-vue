import request from '@/utils/request'

export function getCourses(params) {
  return request({
    url: `/courses`,
    method: 'get',
    params
  })
}

export function storeCourse(data, params = { include: 'user' }) {
  if (data.parent_id === 0) {
    delete data.parent_id
  }
  return request({
    url: `/courses`,
    method: 'post',
    data,
    params
  })
}

export function updateCourse(courseId, data, params = { include: 'user' }) {
  return request({
    url: `/courses/${courseId}`,
    method: 'put',
    data,
    params
  })
}

export function deleteCourse(course) {
  return request({
    url: `/courses/${course}`,
    method: 'delete'
  })
}
