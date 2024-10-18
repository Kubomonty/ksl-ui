export interface NewMatchDto {
  guestTeam?: string;
  guestTeamCaptain?: string;
  guestTeamRoster: { position: string, playerId: string | undefined }[];
  homeTeam?: string;
  homeTeamCaptain?: string;
  homeTeamRoster: { position: string, playerId: string | undefined }[];
  matchLocation?: string;
  matchDateTime?: Date;
}
