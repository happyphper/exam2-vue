import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function me() {
  return request({
    url: '/auth/me',
    method: 'get',
    params: { include: 'roles' }
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'delete'
  })
}

export function refresh() {
  return request({
    url: '/auth/refresh',
    method: 'patch'
  })
}
