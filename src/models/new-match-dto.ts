export interface NewMatchDto {
  createdAt: Date;
  createdBy: string;
  guestTeam: string;
  guestCaptain: string;
  guestPos1: string;
  guestPos2: string;
  guestPos3: string;
  guestPos4?: string;
  guestPos5?: string;
  guestPos6?: string;
  guestPos7?: string;
  guestPos8?: string;
  homeTeam: string;
  homeCaptain: string;
  homePos1: string;
  homePos2: string;
  homePos3: string;
  homePos4?: string;
  homePos5?: string;
  homePos6?: string;
  homePos7?: string;
  homePos8?: string;
  matchLocation: string;
  matchDate: Date;
}
