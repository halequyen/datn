import type { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from "vuex"
import router from '@/router'
import axios from 'axios'

export interface State {
  userName: string | null
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    userName: null
  },
  mutations: {
    SET_USER (state, user) {
      state.userName = user
    },
    CLEAR_USER (state) {
      state.userName = null
    }
  },
  actions: {
    async login ({ commit }, details) {
      try {
        const response = await axios.post('http://127.0.0.1:3333/user/login', details)

        commit('SET_USER', response.data.userName)

      } catch (error) {
        console.error('Đăng nhập thất bại:', error.message)
      }
    },
    async logout ({ commit }) {
      try {
        await axios.post('http://127.0.0.1:3333/user/logout')

        commit('CLEAR_USER')

      } catch (error) {
        console.error('Đăng xuất thất bại:', error.message)
      }
    }
  }
})
