import request from '@/utils/request'

export function getQuestions(params) {
  return request({
    url: '/questions',
    method: 'get',
    params
  })
}

export function storeQuestion(data) {
  return request({
    url: '/questions',
    method: 'post',
    data
  })
}
