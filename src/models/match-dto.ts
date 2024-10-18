import { RosterDto } from './roster-dto'

export interface MatchDto {
  guestTeam: string;
  guestTeamRoster: RosterDto
  homeTeam: string;
  homeTeamRoster: RosterDto;
  matchId: string;
  matchLocation: string;
  matchDateTime: Date;
}
