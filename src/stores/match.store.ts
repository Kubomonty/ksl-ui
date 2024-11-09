// Utilities
import { defineStore } from 'pinia'
import { MatchDto, MatchState } from '../models'
import axios from 'axios'
import { useAuthStore } from './auth.store'

const API_URL = import.meta.env.VITE_KSL_API_URL

export const useMatchStore = defineStore('match-store', {
  actions: {
    async createMatch () {
      const authStore = useAuthStore()
      const token = authStore.token
      try {
        const response = await axios.post(`${API_URL}/api/match`, this.$state.newMatch, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        this.resetNewMatch()
        return response.data
      } catch (error) {
        console.error('Error creating team:', error)
        return null
      }
    },
    async fetchMatchesPage (itemsPerPage: number, currentPage: number) {
      const pageInfo = { page: currentPage, limit: itemsPerPage }
      try {
        const response = await axios.get(`${API_URL}/api/match`, {
          params: pageInfo,
        })
        const matches: MatchDto[] = response.data.map((match: any): MatchDto => {
          return {
            createdAt: new Date(match.created_at),
            createdBy: match.created_by,
            guestCaptain: match.guest_captain,
            guestPos1: match.guest_pos1,
            guestPos2: match.guest_pos2,
            guestPos3: match.guest_pos3,
            guestPos4: match.guest_pos4,
            guestPos5: match.guest_pos5,
            guestPos6: match.guest_pos6,
            guestPos7: match.guest_pos7,
            guestPos8: match.guest_pos8,
            guestTeam: match.guest_team,
            homeCaptain: match.home_captain,
            homePos1: match.home_pos1,
            homePos2: match.home_pos2,
            homePos3: match.home_pos3,
            homePos4: match.home_pos4,
            homePos5: match.home_pos5,
            homePos6: match.home_pos6,
            homePos7: match.home_pos7,
            homePos8: match.home_pos8,
            homeTeam: match.home_team,
            id: match.id,
            matchLocation: match.match_location,
            matchDate: new Date(match.match_date),
            status: match.status,
            statusChangedAt: new Date(match.status_changed_at),
            statusChangedBy: match.status_changed_by,
          }
        })
        this.$state.matches = matches
        console.log('Matches:', this.$state.matches)
        return response.data
      } catch (error) {
        console.error('Error creating team:', error)
        return null
      }
    },
    resetNewMatch () {
      this.newMatch = {
        createdAt: new Date(),
        createdBy: '',
        guestCaptain: '',
        guestPos1: '',
        guestPos2: '',
        guestPos3: '',
        guestPos4: '',
        guestPos5: '',
        guestPos6: '',
        guestPos7: '',
        guestPos8: '',
        guestTeam: '',
        homeCaptain: '',
        homePos1: '',
        homePos2: '',
        homePos3: '',
        homePos4: '',
        homePos5: '',
        homePos6: '',
        homePos7: '',
        homePos8: '',
        homeTeam: '',
        matchLocation: '',
        matchDate: new Date(),
      }
    },
  },

  getters: {},

  state: (): MatchState => ({
    matches: [],
    newMatch: {
      createdAt: new Date(),
      createdBy: '',
      guestCaptain: '',
      guestPos1: '',
      guestPos2: '',
      guestPos3: '',
      guestPos4: '',
      guestPos5: '',
      guestPos6: '',
      guestPos7: '',
      guestPos8: '',
      guestTeam: '',
      homeCaptain: '',
      homePos1: '',
      homePos2: '',
      homePos3: '',
      homePos4: '',
      homePos5: '',
      homePos6: '',
      homePos7: '',
      homePos8: '',
      homeTeam: '',
      matchLocation: '',
      matchDate: new Date(),
    },
  }),
})
