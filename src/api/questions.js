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

export function bulk(course_id, questions) {
  return request({
    url: '/bulk-import-questions',
    method: 'post',
    data: {
      course_id,
      questions
    }
  })
}

export function updateQuestion(questionId, data, params = null) {
  return request({
    url: `/questions/${questionId}`,
    method: 'put',
    data,
    params
  })
}

export function deleteQuestion(questionId) {
  return request({
    url: `/questions/${questionId}`,
    method: 'delete'
  })
}
