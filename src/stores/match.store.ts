// Utilities
import { MatchDto, MatchState, NewMatchDto } from '../models'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

export const useMatchStore = defineStore('match-store', {
  actions: {
    addMatch (newMatch: NewMatchDto) {
      const match: MatchDto = {
        guestTeam: newMatch.guestTeam!,
        guestTeamRoster: {
          captain: newMatch.guestTeamCaptain!,
          position1: newMatch.guestTeamRoster[0],
          position2: newMatch.guestTeamRoster[1],
          position3: newMatch.guestTeamRoster[2],
          position4: newMatch.guestTeamRoster[3],
          position5: newMatch.guestTeamRoster[4],
          position6: newMatch.guestTeamRoster[5],
          position7: newMatch.guestTeamRoster[6],
          position8: newMatch.guestTeamRoster[7],
        },
        homeTeam: newMatch.homeTeam!,
        homeTeamRoster: {
          captain: newMatch.homeTeamCaptain!,
          position1: newMatch.homeTeamRoster[0],
          position2: newMatch.homeTeamRoster[1],
          position3: newMatch.homeTeamRoster[2],
          position4: newMatch.homeTeamRoster[3],
          position5: newMatch.homeTeamRoster[4],
          position6: newMatch.homeTeamRoster[5],
          position7: newMatch.homeTeamRoster[6],
          position8: newMatch.homeTeamRoster[7],
        },
        matchDateTime: newMatch.matchDateTime!,
        matchId: uuidv4(),
        matchLocation: newMatch.matchLocation!,
      }
      this.matches.push(match)
    },
    createMatch () {
      this.addMatch(this.newMatch)
      this.resetNewMatch()
    },
    resetNewMatch () {
      this.newMatch = {
        guestTeam: undefined,
        guestTeamCaptain: undefined,
        guestTeamRoster: [
          { position: 'H1', playerId: undefined },
          { position: 'H2', playerId: undefined },
          { position: 'H3', playerId: undefined },
          { position: 'H4', playerId: undefined },
          { position: 'H5', playerId: undefined },
          { position: 'H6', playerId: undefined },
          { position: 'H7', playerId: undefined },
          { position: 'H8', playerId: undefined },
        ],
        homeTeam: undefined,
        homeTeamCaptain: undefined,
        homeTeamRoster: [
          { position: 'D1', playerId: undefined },
          { position: 'D2', playerId: undefined },
          { position: 'D3', playerId: undefined },
          { position: 'D4', playerId: undefined },
          { position: 'D5', playerId: undefined },
          { position: 'D6', playerId: undefined },
          { position: 'D7', playerId: undefined },
          { position: 'D8', playerId: undefined },
        ],
        matchLocation: undefined,
        matchDateTime: new Date(),
      }
    },
  },

  getters: {},

  state: (): MatchState => ({
    matches: [],
    newMatch: {
      guestTeam: undefined,
      guestTeamCaptain: undefined,
      guestTeamRoster: [
        { position: 'H1', playerId: undefined },
        { position: 'H2', playerId: undefined },
        { position: 'H3', playerId: undefined },
        { position: 'H4', playerId: undefined },
        { position: 'H5', playerId: undefined },
        { position: 'H6', playerId: undefined },
        { position: 'H7', playerId: undefined },
        { position: 'H8', playerId: undefined },
      ],
      homeTeam: undefined,
      homeTeamCaptain: undefined,
      homeTeamRoster: [
        { position: 'D1', playerId: undefined },
        { position: 'D2', playerId: undefined },
        { position: 'D3', playerId: undefined },
        { position: 'D4', playerId: undefined },
        { position: 'D5', playerId: undefined },
        { position: 'D6', playerId: undefined },
        { position: 'D7', playerId: undefined },
        { position: 'D8', playerId: undefined },
      ],
      matchLocation: undefined,
      matchDateTime: new Date(),
    },
  }),
})
