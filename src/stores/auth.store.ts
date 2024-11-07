import { authState } from '../models'
import axios from 'axios'
import { defineStore } from 'pinia'

const API_URL = import.meta.env.VITE_KSL_API_URL

export const useAuthStore = defineStore('auth-store', {
  actions: {
    setToken (token: string) {
      this.token = token
      localStorage.setItem('authToken', token)
    },
    logInUser (user: { id: string, userEmail: string, username: string, userRole: string, teamName?: string | undefined }) {
      this.loggedInUser = { ...user }
    },
    clearToken () {
      this.token = ''
      localStorage.removeItem('authToken')
    },
    clearLoggedInUser () {
      this.loggedInUser = null
    },
    async createAdmin (admin: { email: string, username: string }): Promise<string | null> {
      const authStore = useAuthStore()
      const token = authStore.token

      try {
        const response = await axios.post(`${API_URL}/auth/create-admin`, admin, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        return response.data
      } catch (error) {
        console.error('Error creating team:', error)
        return null
      }
    },
  },

  getters: {
    isAdmin: state => !!state.loggedInUser && state.loggedInUser.userRole.toLowerCase() === 'admin',
    isLoggedIn: state => !!state.loggedInUser?.id,
    isUser: state => !!state.loggedInUser && state.loggedInUser.userRole.toLowerCase() === 'user',
  },

  state: (): authState => ({
    token: localStorage.getItem('authToken') || '',
    loggedInUser: null,
  }),
})
