import axios from 'axios'
const API_URL = import.meta.env.VITE_KSL_API_URL

const fetchTeams = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/teams`)
    return response.data
  } catch (error) {
    console.error('Error fetching teams:', error)
  }

  return []
}

export default fetchTeams
