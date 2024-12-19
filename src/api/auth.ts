import { useAuthStore } from '../stores'
import axios from 'axios'

const API_URL = import.meta.env.VITE_KSL_API_URL

export const login = async (username: string, password: string) => {
  const authStore = useAuthStore()
  const { setToken, logInUser } = authStore

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
    return true
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export const logout = () => {
  const authStore = useAuthStore()
  const { clearToken, clearLoggedInUser } = authStore

  clearToken()
  clearLoggedInUser()
  return true
}
