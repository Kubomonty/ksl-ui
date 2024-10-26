import axios from 'axios'

const API_URL = import.meta.env.VITE_KSL_API_URL

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password })
    return response.data
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export const logout = async () => {
  try {
    const response = await axios.post(`${API_URL}/auth/logout`)
    return response.data
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
}
