import request from '@/utils/request'

export function getToken() {
  return request({
    url: '/cloud-storage',
    method: 'post'
  })
}

export function deleteImage(name) {
  return request({
    url: `/cloud-storage/${name}`,
    method: 'delete'
  })
}
