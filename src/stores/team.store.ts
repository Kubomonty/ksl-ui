// Utilities
import { TeamDto, TeamState } from '../models'
import { defineStore, storeToRefs } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth.store'

const API_URL = import.meta.env.VITE_KSL_API_URL

const logoutTokenTimeOut = () => {
  const authStore = useAuthStore()
  const { logoutTimeOutTriggered } = storeToRefs(authStore)
  logoutTimeOutTriggered.value = true
}

export const useTeamStore = defineStore('team-store', {
  actions: {
    async cancelTeam (teamId: string): Promise<string | null> {
      const authStore = useAuthStore()
      const token = authStore.token

      try {
        const response = await axios.delete(`${API_URL}/api/team/${teamId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        return response.data
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data === 'Invalid token') {
          logoutTokenTimeOut()
        }
        console.error('Error canceling team:', error)
        return null
      }
    },
    async createTeam (team: { teamEmail: string, teamMembers?: string[], teamName: string, username: string }): Promise<string | null> {
      const authStore = useAuthStore()
      const token = authStore.token

      try {
        const response = await axios.post(`${API_URL}/api/team`, team, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        return response.data
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data === 'Invalid token') {
          logoutTokenTimeOut()
        }
        console.error('Error creating team:', error)
        return null
      }
    },
    async fetchActiveTeamById (teamId: string): Promise<TeamDto | null> {
      const authStore = useAuthStore()
      const token = authStore.token

      try {
        const response = await axios.get(`${API_URL}/api/team/active/${teamId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        const responseData = response.data
        return responseData
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data === 'Invalid token') {
          logoutTokenTimeOut()
        }
        console.error('Error fetching teams:', error)
      }
      return null
    },
    async fetchTeamById (teamId: string): Promise<TeamDto | null> {
      const authStore = useAuthStore()
      const token = authStore.token

      try {
        const response = await axios.get(`${API_URL}/api/team/${teamId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        const responseData = response.data
        return responseData
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data === 'Invalid token') {
          logoutTokenTimeOut()
        }
        console.error('Error fetching teams:', error)
      }
      return null
    },
    async fetchActiveTeams (): Promise<TeamDto[]> {
      const authStore = useAuthStore()
      const token = authStore.token

      try {
        const response = await axios.get(`${API_URL}/api/team/active`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        this.teams = response.data
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data === 'Invalid token') {
          logoutTokenTimeOut()
        }
        console.error('Error fetching teams:', error)
      }
      return this.teams
    },
    async fetchTeams (): Promise<TeamDto[]> {
      const authStore = useAuthStore()
      const token = authStore.token

      try {
        const response = await axios.get(`${API_URL}/api/team`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        this.teams = response.data
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data === 'Invalid token') {
          logoutTokenTimeOut()
        }
        console.error('Error fetching teams:', error)
      }
      return this.teams
    },
    getTeamById (teamId: string): TeamDto | undefined {
      return this.teams.find((team: {id: string}) => team.id === teamId)
    },
    async isTeamUsernameUnique (username: string): Promise<boolean> {
      try {
        const response = await axios.get(`${API_URL}/api/team/is-unique/${username}`)
        return response.data.unique
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data === 'Invalid token') {
          logoutTokenTimeOut()
        }
        console.error('Error checking if username is unique:', error)
      }
      return false
    },
    async updateTeam (team: { teamId: string, teamEmail: string, teamMembers?: {id: string, name: string}[], teamName: string }): Promise<string | null> {
      const authStore = useAuthStore()
      const token = authStore.token

      try {
        const response = await axios.put(`${API_URL}/api/team/${team.teamId}`, team, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        return response.data
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data === 'Invalid token') {
          logoutTokenTimeOut()
        }
        console.error('Error updating team:', error)
        return null
      }
    },
  },

  state: (): TeamState => ({
    teams: [],
  }),
})
