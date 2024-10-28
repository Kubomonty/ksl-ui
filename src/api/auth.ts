import { useAuthStore, useMatchStore } from '../stores'
import axios from 'axios'

const API_URL = import.meta.env.VITE_KSL_API_URL
console.log('API_URL:', API_URL)

const authStore = useAuthStore()
const { setToken, logInUser, clearToken, clearLoggedInUser } = authStore

const matchStore = useMatchStore()
const { resetNewMatch } = matchStore

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password })
    setToken(response.data.token)
    const userData = {
      id: response.data.id,
      userEmail: response.data.userEmail,
      username: response.data.username,
      userRole: response.data.userRole,
      teamName: response.data.teamName,
    }
    logInUser(userData)
    resetNewMatch()
    return true
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export const logout = async () => {
  clearToken()
  clearLoggedInUser()
  resetNewMatch()
  return true
}
