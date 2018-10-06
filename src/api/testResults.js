import request from '@/utils/request'

export function getTestResults(testId, groupId, params) {
  return request({
    url: `/tests/${testId}/groups/${groupId}/results`,
    method: 'get',
    params
  })
}
