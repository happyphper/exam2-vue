import request from '@/utils/request'

export function getTestResults(params) {
  return request({
    url: '/test-results',
    method: 'get',
    params
  })
}
