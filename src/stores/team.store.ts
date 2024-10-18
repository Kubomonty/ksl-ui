// Utilities
import { PlayerDto, TeamDto, TeamState } from '../models'
import { defineStore } from 'pinia'

const DUMMY_PLAYERS: PlayerDto[] = [
  {
    id: '1370e223-5afd-4f43-b710-1e9056df25ff',
    name: 'Rudolf Horak',
    teams: ['e5c76e8a-c4c6-412a-b24a-8a3f09c78a48', '07bbe4cc-acec-46b5-97af-4a89f8698721', '9191a867-222f-41f8-8393-b7f8392e4c4a'],
  },
  {
    id: 'b1866c74-f265-4230-b728-1252f226723b',
    name: 'Valerian Pekar',
    teams: ['e5c76e8a-c4c6-412a-b24a-8a3f09c78a48', '07bbe4cc-acec-46b5-97af-4a89f8698721', '9191a867-222f-41f8-8393-b7f8392e4c4a'],
  },
  {
    id: '4dd9ed40-64ed-486c-9e36-88d0b82bdc63',
    name: 'Vlastimil Vlcek',
    teams: ['e5c76e8a-c4c6-412a-b24a-8a3f09c78a48', '07bbe4cc-acec-46b5-97af-4a89f8698721', 'cbf4c349-f16f-406f-ba44-546d1d83fc6b'],
  },
  {
    id: '1df76920-b8b2-47c8-a241-f76fa7bf7aec',
    name: 'Norbert Toman',
    teams: ['e5c76e8a-c4c6-412a-b24a-8a3f09c78a48', '07bbe4cc-acec-46b5-97af-4a89f8698721', 'cbf4c349-f16f-406f-ba44-546d1d83fc6b'],
  },
  {
    id: '417796d7-c6cd-40e6-8544-32fd56f4eb03',
    name: 'Emil Loskot',
    teams: ['e5c76e8a-c4c6-412a-b24a-8a3f09c78a48', '4d8dd730-66b9-4624-9a5d-bb4e934a3f8d', '9191a867-222f-41f8-8393-b7f8392e4c4a'],
  },
  {
    id: 'c042d84f-692b-4e59-8371-b25ce3a34e5c',
    name: 'Hugo Ruzicka',
    teams: ['e5c76e8a-c4c6-412a-b24a-8a3f09c78a48', '4d8dd730-66b9-4624-9a5d-bb4e934a3f8d', '9191a867-222f-41f8-8393-b7f8392e4c4a'],
  },
  {
    id: 'ccb79524-1f91-4ccc-be44-64a29f0caf0f',
    name: 'Leopold Kucera',
    teams: ['e5c76e8a-c4c6-412a-b24a-8a3f09c78a48', '4d8dd730-66b9-4624-9a5d-bb4e934a3f8d', 'cbf4c349-f16f-406f-ba44-546d1d83fc6b'],
  },
  {
    id: '9900c159-55f3-43c9-8962-a4c4e562261f',
    name: 'David Kucera',
    teams: ['e5c76e8a-c4c6-412a-b24a-8a3f09c78a48', '4d8dd730-66b9-4624-9a5d-bb4e934a3f8d', 'cbf4c349-f16f-406f-ba44-546d1d83fc6b'],
  },
  {
    id: '193863c5-1839-4b17-be46-5156889a064c',
    name: 'Kevin Ondracek',
    teams: ['e5c76e8a-c4c6-412a-b24a-8a3f09c78a48', '07bbe4cc-acec-46b5-97af-4a89f8698721', '9191a867-222f-41f8-8393-b7f8392e4c4a'],
  },
  {
    id: '0623922b-37fc-4cc9-aa81-74801c9c9fed',
    name: 'Alfonz Musil',
    teams: ['e5c76e8a-c4c6-412a-b24a-8a3f09c78a48', '07bbe4cc-acec-46b5-97af-4a89f8698721', '9191a867-222f-41f8-8393-b7f8392e4c4a'],
  },
  {
    id: '4e586071-24d2-43c1-b645-8f326a8c747c',
    name: 'Filip Hrach',
    teams: ['ed9f8331-0e9f-4578-bc02-5ace373ad439', '07bbe4cc-acec-46b5-97af-4a89f8698721', 'cbf4c349-f16f-406f-ba44-546d1d83fc6b'],
  },
  {
    id: '04916f81-3df8-40d7-b738-5804762a79ab',
    name: 'Pavel Hrach',
    teams: ['ed9f8331-0e9f-4578-bc02-5ace373ad439', '07bbe4cc-acec-46b5-97af-4a89f8698721', 'cbf4c349-f16f-406f-ba44-546d1d83fc6b'],
  },
  {
    id: '31f7df5e-8609-4d9d-af5c-ece39992c4cf',
    name: 'Peter Maly',
    teams: ['ed9f8331-0e9f-4578-bc02-5ace373ad439', '4d8dd730-66b9-4624-9a5d-bb4e934a3f8d', '9191a867-222f-41f8-8393-b7f8392e4c4a'],
  },
  {
    id: '1b9c5f9b-b3fb-495f-99aa-908a834e1218',
    name: 'Kamil Velky',
    teams: ['ed9f8331-0e9f-4578-bc02-5ace373ad439', '4d8dd730-66b9-4624-9a5d-bb4e934a3f8d', '9191a867-222f-41f8-8393-b7f8392e4c4a'],
  },
  {
    id: '664800eb-d82d-4406-9fba-a9585e639c4e',
    name: 'Michal Marek',
    teams: ['ed9f8331-0e9f-4578-bc02-5ace373ad439', '4d8dd730-66b9-4624-9a5d-bb4e934a3f8d', 'cbf4c349-f16f-406f-ba44-546d1d83fc6b'],
  },
  {
    id: '20a29f15-8d3d-4340-80f4-1eb0878e70c5',
    name: 'Erik Balaz',
    teams: ['ed9f8331-0e9f-4578-bc02-5ace373ad439', '4d8dd730-66b9-4624-9a5d-bb4e934a3f8d', 'cbf4c349-f16f-406f-ba44-546d1d83fc6b'],
  },
  {
    id: '4e5a60fb-6ac2-4805-b8f8-a84296b6f77f',
    name: 'Dusan Kral',
    teams: ['ed9f8331-0e9f-4578-bc02-5ace373ad439', '07bbe4cc-acec-46b5-97af-4a89f8698721', '9191a867-222f-41f8-8393-b7f8392e4c4a'],
  },
  {
    id: '886a641b-3a5e-447b-8e08-bf7e8f35e511',
    name: 'Eugen Liska',
    teams: ['ed9f8331-0e9f-4578-bc02-5ace373ad439', '07bbe4cc-acec-46b5-97af-4a89f8698721', '9191a867-222f-41f8-8393-b7f8392e4c4a'],
  },
  {
    id: '8cc0af1b-ee16-4b90-978c-e5d2e21ff5ce',
    name: 'Pista Hudak',
    teams: ['ed9f8331-0e9f-4578-bc02-5ace373ad439', '4d8dd730-66b9-4624-9a5d-bb4e934a3f8d', 'cbf4c349-f16f-406f-ba44-546d1d83fc6b'],
  },
  {
    id: '02dba18b-2d1f-4b77-b9be-54deafb346cd',
    name: 'Koloman Lukac',
    teams: ['ed9f8331-0e9f-4578-bc02-5ace373ad439', '4d8dd730-66b9-4624-9a5d-bb4e934a3f8d', 'cbf4c349-f16f-406f-ba44-546d1d83fc6b'],
  },
]

const DUMMY_TEAMS: TeamDto[] = [
  {
    id: 'e5c76e8a-c4c6-412a-b24a-8a3f09c78a48',
    name: 'Fenix Dukla',
    players: DUMMY_PLAYERS.filter((player: {teams: string[]}) => player.teams.includes('e5c76e8a-c4c6-412a-b24a-8a3f09c78a48')),
  },
  {
    id: 'ed9f8331-0e9f-4578-bc02-5ace373ad439',
    name: 'Kraken Sokol',
    players: DUMMY_PLAYERS.filter((player: {teams: string[]}) => player.teams.includes('ed9f8331-0e9f-4578-bc02-5ace373ad439')),
  },
  {
    id: '07bbe4cc-acec-46b5-97af-4a89f8698721',
    name: 'Tetris Sparta',
    players: DUMMY_PLAYERS.filter((player: {teams: string[]}) => player.teams.includes('07bbe4cc-acec-46b5-97af-4a89f8698721')),
  },
  {
    id: '4d8dd730-66b9-4624-9a5d-bb4e934a3f8d',
    name: 'Kobra Slavia',
    players: DUMMY_PLAYERS.filter((player: {teams: string[]}) => player.teams.includes('4d8dd730-66b9-4624-9a5d-bb4e934a3f8d')),
  },
  {
    id: '9191a867-222f-41f8-8393-b7f8392e4c4a',
    name: 'Piranha Bohemians',
    players: DUMMY_PLAYERS.filter((player: {teams: string[]}) => player.teams.includes('9191a867-222f-41f8-8393-b7f8392e4c4a')),
  },
  {
    id: 'cbf4c349-f16f-406f-ba44-546d1d83fc6b',
    name: 'Orca Viktoria',
    players: DUMMY_PLAYERS.filter((player: {teams: string[]}) => player.teams.includes('cbf4c349-f16f-406f-ba44-546d1d83fc6b')),
  },
]

export const useTeamStore = defineStore('team-store', {
  actions: {
    fetchTeams (): TeamDto[] {
      this.teams = [...DUMMY_TEAMS]

      return this.teams
    },
    getTeamById (teamId: string): TeamDto | undefined {
      return this.teams.find((team: {id: string}) => team.id === teamId)
    },
  },

  state: (): TeamState => ({
    teams: [],
  }),
})
