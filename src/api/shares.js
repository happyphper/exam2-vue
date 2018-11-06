import request from '@/utils/request'

export function getShares(params = { include: 'share_user' }) {
  return request({
    url: `/shares`,
    method: 'get',
    params
  })
}

export function storeShare(data, params = { include: 'share_user' }) {
  return request({
    url: `/shares`,
    method: 'post',
    data,
    params
  })
}
export function deleteShare(share_id) {
  return request({
    url: `/shares/${share_id}`,
    method: 'delete'
  })
}
