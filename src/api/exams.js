import request from '@/utils/request'

export function getExams(params) {
  return request({
    url: '/exams',
    method: 'get',
    params
  })
}

export function storeExam(data, params = { include: 'course,classrooms' }) {
  return request({
    url: '/exams',
    method: 'post',
    data,
    params
  })
}

export function updateExam(examId, data, params = { include: 'course,classrooms' }) {
  return request({
    url: `/exams/${examId}`,
    method: 'put',
    data,
    params
  })
}

export function deleteExam(examId) {
  return request({
    url: `/exams/${examId}`,
    method: 'delete'
  })
}

export function endExam(examId, data) {
  return request({
    url: `/exams/${examId}/end`,
    method: 'patch',
    data
  })
}
