import request from '@/utils/request'

export function getGradeDistribution(examId, classroomId) {
  return request({
    url: '/stat/grade-distribution',
    method: 'get',
    params: {
      exam_id: examId,
      classroomId: classroomId
    }
  })
}

export function getErrorQuestion(examId, classroomId) {
  return request({
    url: '/stat/error-question',
    method: 'get',
    params: {
      exam_id: examId,
      classroomId: classroomId
    }
  })
}

export function getUserGradeCurve(userId) {
  return request({
    url: '/stat/user-grade-curve',
    method: 'get',
    params: {
      user_id: userId
    }
  })
}

export function getUserGradeData(params) {
  return request({
    url: '/stat/user-grade-data',
    method: 'get',
    params
  })
}
