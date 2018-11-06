import request from '@/utils/request'

export function getTests(params) {
  return request({
    url: '/tests',
    method: 'get',
    params
  })
}

export function storeTest(data, params = { include: 'course,classrooms' }) {
  return request({
    url: '/tests',
    method: 'post',
    data,
    params
  })
}

export function updateTest(testId, data, params = { include: 'course,classrooms' }) {
  return request({
    url: `/tests/${testId}`,
    method: 'put',
    data,
    params
  })
}

export function deleteTest(testId) {
  return request({
    url: `/tests/${testId}`,
    method: 'delete'
  })
}

export function endTest(testId, data) {
  return request({
    url: `/tests/${testId}/end`,
    method: 'patch',
    data
  })
}
