export interface TeamStandingsDto {
  teamId: string;
  teamName: string;
  matchesPlayed: number;
  points: number;
  wins: number;
  losses: number;
  overTimeWins: number;
  overTimeLosses: number;
  legsWon: number;
  legsLost: number;
  gamesWon: number;
  gamesLost: number;
  matches: {
    matchDate: string;
    homeTeam: string;
    homeTeamName: string;
    guestTeam: string;
    guestTeamName: string;
    matchLocation: string;
    homeLegs: number;
    guestLegs: number;
    homeScore: number;
    guestScore: number;
    homeOvertimeScore: number;
    guestOvertimeScore: number;
  }[];
  place: number;
}
