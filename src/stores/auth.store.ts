import { logout } from '../api'
import { AuthState } from '../models'
import axios from 'axios'
import { defineStore } from 'pinia'

const API_URL = import.meta.env.VITE_KSL_API_URL

const getUserFromLocalStorage = (): { id: string; userEmail: string; username: string; userRole: string; teamName?: string | null } | null => {
  const storeUser: {
    id?: string;
    userEmail?: string;
    username?: string;
    userRole?: string,
    teamName?: string | null;
  } = {}
  if (localStorage.getItem('userId')) {
    storeUser.id = localStorage.getItem('userId') as string
  }
  if (localStorage.getItem('userEmail')) {
    storeUser.userEmail = localStorage.getItem('userEmail') as string
  }
  if (localStorage.getItem('username')) {
    storeUser.username = localStorage.getItem('username') as string
  }
  if (localStorage.getItem('userRole')) {
    storeUser.userRole = localStorage.getItem('userRole') as string
  }
  if (localStorage.getItem('teamName')) {
    storeUser.teamName = localStorage.getItem('teamName') as string
  }
  if (storeUser.id?.length && storeUser.userEmail?.length && storeUser.username?.length && storeUser.userRole?.length) {
    return { ...storeUser } as { id: string; userEmail: string; username: string; userRole: string; teamName?: string | null }
  }
  return null
}

export const useAuthStore = defineStore('auth-store', {
  actions: {
    setToken (token: string) {
      this.token = token
      localStorage.setItem('authToken', token)
    },
    logInUser (user: { id: string, userEmail: string, username: string, userRole: string, teamName?: string | undefined }) {
      this.loggedInUser = { ...user }
      localStorage.setItem('userId', user.id)
      localStorage.setItem('userEmail', user.userEmail)
      localStorage.setItem('username', user.username)
      localStorage.setItem('userRole', user.userRole)
      if (user.teamName) {
        localStorage.setItem('teamName', user.teamName)
      }
    },
    clearToken () {
      this.token = ''
      localStorage.removeItem('authToken')
    },
    clearLoggedInUser () {
      this.loggedInUser = null
      localStorage.removeItem('userId')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('username')
      localStorage.removeItem('userRole')
      localStorage.removeItem('teamName')
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
        if (axios.isAxiosError(error) && error.response?.data === 'Invalid token') {
          this.logoutTimeOutTriggered = true
        }
        console.error('Error creating team:', error)
        return null
      }
    },
    logoutTokenTimeOut () {
      this.logoutTimeOutTriggered = true
    },
    async resetToken () {
      const authStore = useAuthStore()
      const token = authStore.token

      try {
        const response = await axios.post(`${API_URL}/auth/reset-token`, {}, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        this.setToken(response.data.token)
        return response.data
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data === 'Invalid token') {
          logout()
        }
        console.error('Error reseting login token', error)
        return null
      }
    },
  },

  getters: {
    isAdmin: (state: AuthState): boolean => {
      if (!state.loggedInUser) {
        const storeUser = getUserFromLocalStorage()
        state.loggedInUser = { ...storeUser } as { id: string; userEmail: string; username: string; userRole: string; teamName?: string | null }
      }
      if (!state.loggedInUser.id) {
        return false
      }
      return !!state.loggedInUser && state.loggedInUser.userRole?.toLowerCase() === 'admin'
    },
    isLoggedIn: (state: AuthState): boolean => {
      if (!state.loggedInUser) {
        const storeUser = getUserFromLocalStorage()
        state.loggedInUser = { ...storeUser } as { id: string; userEmail: string; username: string; userRole: string; teamName?: string | null }
      }
      if (!state.loggedInUser) {
        return false
      }
      return !!state.loggedInUser?.id
    },
    isUser: (state: AuthState): boolean => {
      if (!state.loggedInUser) {
        const storeUser = getUserFromLocalStorage()
        state.loggedInUser = { ...storeUser } as { id: string; userEmail: string; username: string; userRole: string; teamName?: string | null }
      }
      if (!state.loggedInUser) {
        return false
      }
      return !!state.loggedInUser && state.loggedInUser.userRole?.toLowerCase() === 'user'
    },
  },

  state: (): AuthState => ({
    token: localStorage.getItem('authToken') || '',
    loggedInUser: null,
    logoutTimeOutTriggered: false,
  }),
})
