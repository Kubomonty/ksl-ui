import { NewMatchDto } from './new-match-dto'

export interface MatchDto extends NewMatchDto {
  homeScore: number;
  guestScore: number;
  id: string;
  status: string;
  statusChangedAt: Date;
  statusChangedBy: string;
}
