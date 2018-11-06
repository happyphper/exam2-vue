import request from '@/utils/request'

export function getExamQuestions(examId) {
  return request({
    url: `/exams/${examId}/questions`,
    method: 'get'
  })
}

export function storeExamQuestion(examId, question_id, score) {
  return request({
    url: `/exams/${examId}/questions`,
    method: 'post',
    data: { question_id, score }
  })
}
export function deleteExamQuestion(examId, questionId) {
  return request({
    url: `/exams/${examId}/questions/${questionId}`,
    method: 'delete'
  })
}
