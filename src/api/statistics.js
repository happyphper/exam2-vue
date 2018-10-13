import request from '@/utils/request'

export function getGradeDistribution(testId, groupId) {
  return request({
    url: '/stat/grade-distribution',
    method: 'get',
    params: {
      test_id: testId,
      groupId: groupId
    }
  })
}

export function getErrorQuestion(testId, groupId) {
  return request({
    url: '/stat/error-question',
    method: 'get',
    params: {
      test_id: testId,
      groupId: groupId
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
