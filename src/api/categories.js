import request from '@/utils/request'

export function getCategories(type, params) {
  return request({
    url: `${type}/categories`,
    method: 'get',
    params
  })
}

export function storeCategory(type, data) {
  if (data.parent_id === 0) {
    delete data.parent_id
  }
  return request({
    url: `${type}/categories`,
    method: 'post',
    data
  })
}

export function updateCategory(type, categoryId, data) {
  return request({
    url: `${type}/categories/${categoryId}`,
    method: 'put',
    data
  })
}

export function deleteCategory(type, category) {
  return request({
    url: `${type}/categories/${category}`,
    method: 'delete'
  })
}
