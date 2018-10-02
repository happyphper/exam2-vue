import request from '@/utils/request'

export function getTestQuestions(testId) {
  return request({
    url: `/tests/${testId}/questions`,
    method: 'get'
  })
}

export function storeTestQuestion(testId, question_id, score) {
  return request({
    url: `/tests/${testId}/questions`,
    method: 'post',
    data: { question_id, score }
  })
}
export function deleteTestQuestion(testId, questionId) {
  return request({
    url: `/tests/${testId}/questions/${questionId}`,
    method: 'delete'
  })
}
