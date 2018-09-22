import request from '@/utils/request'

export function getTests(params) {
  return request({
    url: '/tests',
    method: 'get',
    params
  })
}

export function storeTest(data) {
  return request({
    url: '/tests',
    method: 'post',
    data
  })
}

export function updateTest(testId, data) {
  return request({
    url: `/tests/${testId}`,
    method: 'put',
    data
  })
}

export function deleteTest(testId) {
  return request({
    url: `/tests/${testId}`,
    method: 'delete'
  })
}
