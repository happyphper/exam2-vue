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

export function updateQuestion(questionId, data) {
  return request({
    url: `/questions/${questionId}`,
    method: 'put',
    data
  })
}

export function deleteQuestion(questionId) {
  return request({
    url: `/questions/${questionId}`,
    method: 'delete'
  })
}
