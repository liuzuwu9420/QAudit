// const jwt = require('jsonwebtoken')
// import { login, logout } from '@/api/login'
// import { findEmployByUserName } from '@/api/emplotee'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  userInfo: {
    id: '',
    userName: '',
    userDesc: '',
    avatarPath: '',
    phone: '',
    address: '',
    email: '',
    enabled: ''
  }, // 当前登录用户的个人信息
  roles: [], // 当前登录用户的权限集合
  token: getToken('Token'),
  checkToken: false,
  jwtObj: { // 当前登录用户的用户令牌包含的信息
    sub: '', // 用户名
    iat: '', // 开始时间
    exp: '' // 超时时间
  }
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_JWTOBJ: (state, jwtObj) => {
    state.jwtObj = jwtObj
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_CHECKTOKEN: (state, checkToken) => {
    state.checkToken = checkToken
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    // const { userName, password } = userInfo
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', 'token')
      setToken('Token', 'token')
      resolve(true)
      /* login({ userName: userName.trim(), password: password }).then(response => {
        if (response.ok === false) {
          resolve(false)
        }
        commit('SET_TOKEN', response)
        setToken('Token', response)
        resolve(true)
      }).catch(error => {
        reject(error)
      }) */
    })
  },

  // get user info
  getInfo({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      const data = {
        roles: ['admin']
      }
      commit('SET_ROLES', ['admin'])
      resolve(data)
      /* commit('SET_JWTOBJ', jwt.decode(state.token))
      findEmployByUserName(state.jwtObj.sub).then(response => {
        if (response.code === '200') {
          const data = {
            roles: ['admin']
          }
          commit('SET_ROLES', ['admin'])
          commit('SET_USERINFO', response.obj)
          resolve(data)
        } else {
          reject(response)
        }
      }).catch(error => {
        reject(error)
      }) */
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken('Token')
      resetRouter()

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
      /* logout().then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken('Token')
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      }) */
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken('Token')
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
