import request from '@/utils/request'

export function getCourses(params) {
  return request({
    url: `/courses`,
    method: 'get',
    params
  })
}

export function storeCourse(data) {
  if (data.parent_id === 0) {
    delete data.parent_id
  }
  return request({
    url: `/courses`,
    method: 'post',
    data
  })
}

export function updateCourse(courseId, data) {
  return request({
    url: `/courses/${courseId}`,
    method: 'put',
    data
  })
}

export function deleteCourse(course) {
  return request({
    url: `/courses/${course}`,
    method: 'delete'
  })
}
