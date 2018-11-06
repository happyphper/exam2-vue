import request from '@/utils/request'

export function getGradeDistribution(testId, classroomId) {
  return request({
    url: '/stat/grade-distribution',
    method: 'get',
    params: {
      test_id: testId,
      classroomId: classroomId
    }
  })
}

export function getErrorQuestion(testId, classroomId) {
  return request({
    url: '/stat/error-question',
    method: 'get',
    params: {
      test_id: testId,
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
