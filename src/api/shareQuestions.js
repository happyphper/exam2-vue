import request from '@/utils/request'

export function getShareQuestions() {
  return request({
    url: `/share-questions`,
    method: 'get'
  })
}

export function storeShareQuestion(phone) {
  return request({
    url: `/share-questions`,
    method: 'post',
    data: { phone }
  })
}
export function deleteShareQuestion(share_user_id) {
  return request({
    url: `/share-questions/${share_user_id}`,
    method: 'delete'
  })
}
