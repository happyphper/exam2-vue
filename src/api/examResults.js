import request from '@/utils/request'

export function getExamResults(params) {
  return request({
    url: '/exam-results',
    method: 'get',
    params
  })
}
