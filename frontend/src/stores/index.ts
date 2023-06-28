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
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    userName: null,
    isLoggedIn: false,
    token: Cookies.get('token') || undefined,
    refreshTokenTimeout: undefined,
    rule: null
  },
  mutations: {
    SET_USER(state, user) {
      state.userName = user
      state.isLoggedIn = true
    },
    CLEAR_USER(state) {
      state.userName = null
      state.isLoggedIn = false
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
    }
  },
  actions: {
    async login({ commit, dispatch }, details) {
      try {
        const response = await axios.post('http://127.0.0.1:3333/user/login', details)
        if (response.data.token) {
          commit('SET_USER', response.data.userName)
          commit('SET_TOKEN', response.data.token)
          router.push('/')
          const tokenExpiration = 60 * 60 * 1000
          const refreshTokenTimeout = setTimeout(() => {
            dispatch('refreshToken');
          }, tokenExpiration - 60000);
          commit('SET_REFRESH_TOKEN_TIMEOUT', refreshTokenTimeout)
          if (response.data.userName === 'admin') {
            commit('SET_RULE', 'admin')
          } else {
            commit('SET_RULE', 'user')
          }
        } else {
          alert('Tên đăng nhập hoặc mật khẩu không chính xác.')
        }
      } catch (error) {
        console.error('Đăng nhập thất bại:', error.message)
      }
    },
    async refreshToken({ commit }) {
      try {
        const response = await axios.post('http://127.0.0.1:3333/user/refresh')
        if (response.data.token) {
          commit('SET_TOKEN', response.data.token)
        }
      } catch (error) {
        console.error('Làm mới token thất bại:', error.message)
      }
    },
    async logout({ commit, state }) {
      try {
        const refreshTokenTimeout = state.refreshTokenTimeout
        if (refreshTokenTimeout) {
          commit('CLEAR_REFRESH_TOKEN_TIMEOUT')
        }
        await axios.post('http://127.0.0.1:3333/user/logout')
        commit('CLEAR_USER')
        commit('CLEAR_TOKEN')
      } catch (error) {
        console.error('Đăng xuất thất bại:', error.message)
        if (error.response && error.response.status === 401) {
          alert('Tên đăng nhập hoặc mật khẩu không chính xác.')
        }
      }
    }
  }
})
