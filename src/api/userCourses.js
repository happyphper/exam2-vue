import request from '@/utils/request'

export function getUserCourses() {
  return request({
    url: `/manage-courses`,
    method: 'get'
  })
}
