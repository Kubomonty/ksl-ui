import { TeamDto } from './team-dto'
import { TeamStandingsDto } from './team-standings-dto'

export interface TeamState {
  teamStandings: TeamStandingsDto[];
  teams: TeamDto[];
}
