import type { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import router from '@/router'
import axios from 'axios'
import Cookies from 'js-cookie'

export interface State {
  userName: string | null
  isLoggedIn: boolean
  token: string | undefined
  refreshTokenTimeout: number | undefined
  rule: string | null
  type: string | null
  owner: string | null
  password: string | null
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    userName: localStorage.getItem('userName') || null,
    isLoggedIn: false,
    token: Cookies.get('token') || undefined,
    refreshTokenTimeout: undefined,
    rule: localStorage.getItem('rule') || null,
    type: null,
    owner: null,
    password: null
  },
  mutations: {
    SET_USER(state, user) {
      state.userName = user
      state.isLoggedIn = true
      localStorage.setItem('userName', user)
      Cookies.set('userName', user)
    },
    CLEAR_USER(state) {
      state.userName = null
      state.isLoggedIn = false
      localStorage.removeItem('userName')
      Cookies.remove('userName')
    },
    SET_TOKEN(state, token) {
      state.token = token
      Cookies.set('token', token)
    },
    CLEAR_TOKEN(state) {
      state.token = undefined
      Cookies.remove('token')
    },
    SET_REFRESH_TOKEN_TIMEOUT(state, timeout) {
      state.refreshTokenTimeout = timeout
    },
    CLEAR_REFRESH_TOKEN_TIMEOUT(state) {
      clearTimeout(state.refreshTokenTimeout)
      state.refreshTokenTimeout = undefined
    },
    SET_RULE(state, rule) {
      state.rule = rule
      localStorage.setItem('rule', rule)
    },
    CLEAR_RULE(state) {
      state.rule = null
      localStorage.removeItem('rule')
    },
    SET_OWNER(state, owner) {
      state.owner = owner
      localStorage.setItem('owner', owner)
    },
    CLEAR_OWNER(state) {
      state.owner = null
      localStorage.removeItem('owner')
    },
    SET_PASSWORD(state, password) {
      state.password = password
      localStorage.setItem('password', password)
    },
    CLEAR_PASSWORD(state) {
      state.password = null
      localStorage.removeItem('password')
    }
  },
  actions: {
    async login({ commit, dispatch }, details) {
      try {
        const response = await axios.post('http://127.0.0.1:3333/user/login', details)
        if (response.data.token) {
          commit('SET_USER', response.data.userName)
          commit('SET_OWNER', response.data.owner)
          commit('SET_PASSWORD', response.data.password)
          commit('SET_TOKEN', response.data.token)
          router.push('/')
          const tokenExpiration = 60 * 60 * 1000
          const refreshTokenTimeout = setTimeout(() => {
            dispatch('refreshToken');
          }, tokenExpiration - 60000);
          commit('SET_REFRESH_TOKEN_TIMEOUT', refreshTokenTimeout)
          if (response.data.type === '0') {
            commit('SET_RULE', 'admin')
          } else if (response.data.type === '1') {
            commit('SET_RULE', 'equipmentManager')
          } else if (response.data.type === '2') {
            commit('SET_RULE', 'receptionist')
          } else if (response.data.type === '3') {
            commit('SET_RULE', 'doctor')
          }
        } else {
          alert('Tên đăng nhập hoặc mật khẩu không chính xác.')
        }
      } catch (error) {
        console.error('Đăng nhập thất bại:', error.message)
      }
    },
    async refreshToken({ commit, state }) {
      try {
        const response = await axios.post('http://127.0.0.1:3333/user/refresh')
        if (response.data.token) {
          commit('SET_USER', response.data.userName)
          commit('SET_OWNER', response.data.owner)
          commit('SET_PASSWORD', response.data.password)
          commit('SET_TOKEN', response.data.token)
          if (state.userName === null) {
            commit('SET_USER', response.data.userName)
          }
          if (response.data.type === '0') {
            commit('SET_RULE', 'admin')
          } else if (response.data.type === '1') {
            commit('SET_RULE', 'equipmentManager')
          } else if (response.data.type === '2') {
            commit('SET_RULE', 'receptionist')
          } else if (response.data.type === '3') {
            commit('SET_RULE', 'doctor')
          }
        }
      } catch (error) {
        console.error('Làm mới token thất bại:', error.message)
      }
    },
    async logout({ commit, state }) {
      try {
        localStorage.clear()
        const refreshTokenTimeout = state.refreshTokenTimeout
        if (refreshTokenTimeout) {
          commit('CLEAR_REFRESH_TOKEN_TIMEOUT')
        }
        await axios.post('http://127.0.0.1:3333/user/logout')
        commit('CLEAR_USER')
        commit('CLEAR_OWNER')
        commit('CLEAR_PASSWORD')
        commit('CLEAR_TOKEN')
        commit('CLEAR_RULE')
      } catch (error) {
        console.error('Đăng xuất thất bại:', error.message)
        if (error.response && error.response.status === 401) {
          alert('Tên đăng nhập hoặc mật khẩu không chính xác.')
        }
      }
    }
  }
})
