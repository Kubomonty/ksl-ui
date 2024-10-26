import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth-store', {
  actions: {
    setToken (token: string) {
      this.token = token
      localStorage.setItem('authToken', token)
    },
    clearToken () {
      this.token = ''
      localStorage.removeItem('authToken')
    },
  },

  getters: {
    isAuthenticated: state => !!state.token,
  },

  state: () => ({
    token: localStorage.getItem('authToken') || '',
  }),
})
