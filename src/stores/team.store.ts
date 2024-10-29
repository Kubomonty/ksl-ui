// Utilities
import { TeamDto, TeamState } from '../models'
import axios from 'axios'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth.store'

const API_URL = import.meta.env.VITE_KSL_API_URL

export const useTeamStore = defineStore('team-store', {
  actions: {
    async createTeam (team: { teamEmail: string, teamMembers?: string[], teamName: string, username: string }): Promise<string | null> {
      const authStore = useAuthStore()
      const token = authStore.token

      try {
        const response = await axios.post(`${API_URL}/api/create-team`, team, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        return response.data
      } catch (error) {
        console.error('Error creating team:', error)

        return null
      }
    },
    async fetchTeams (): Promise<TeamDto[]> {
      const authStore = useAuthStore()
      const token = authStore.token

      try {
        const response = await axios.get(`${API_URL}/api/teams`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        this.teams = response.data
      } catch (error) {
        console.error('Error fetching teams:', error)
      }

      return this.teams
    },
    getTeamById (teamId: string): TeamDto | undefined {
      return this.teams.find((team: {id: string}) => team.id === teamId)
    },
    async isTeamUsernameUnique (username: string): Promise<boolean> {
      try {
        const response = await axios.get(`${API_URL}/api/teams/is-unique/${username}`)
        return response.data.unique
      } catch (error) {
        console.error('Error checking if username is unique:', error)
      }
      return false
    },
  },

  state: (): TeamState => ({
    teams: [],
  }),
})
