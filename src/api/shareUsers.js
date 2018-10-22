import request from '@/utils/request'

export function getShareUsers() {
  return request({
    url: `/share-users`,
    method: 'get'
  })
}

export function storeShareUser(phone) {
  return request({
    url: `/share-users`,
    method: 'post',
    data: { phone }
  })
}
export function deleteShareUser(share_user_id) {
  return request({
    url: `/share-users/${share_user_id}`,
    method: 'delete'
  })
}
