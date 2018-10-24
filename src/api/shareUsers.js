import request from '@/utils/request'

export function getShareUsers(params = { include: 'share_user' }) {
  return request({
    url: `/share-users`,
    method: 'get',
    params
  })
}

export function storeShareUser(phone, params = { include: 'share_user' }) {
  return request({
    url: `/share-users`,
    method: 'post',
    data: { phone },
    params
  })
}
export function deleteShareUser(share_user_id) {
  return request({
    url: `/share-users/${share_user_id}`,
    method: 'delete'
  })
}
