import request from '@/utils/request'

export function reset(data) {
  return request({
    url: '/password/reset',
    method: 'patch',
    data
  })
}
