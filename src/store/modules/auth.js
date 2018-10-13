import { login, logout, me } from '@/api/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'

const auth = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, { username, password }) {
      return new Promise((resolve, reject) => {
        login(username.trim(), password).then(response => {
          setToken(response.access_token)
          commit('SET_TOKEN', response.access_token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    Me({ commit, state }) {
      return new Promise((resolve, reject) => {
        me(state.token).then(response => {
          commit('SET_ID', response.id)
          commit('SET_NAME', response.name)
          commit('SET_AVATAR', response.avatar)
          commit('SET_ROLES', response.roles.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default auth
