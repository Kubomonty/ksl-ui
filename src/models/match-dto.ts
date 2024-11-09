import { NewMatchDto } from './new-match-dto'

export interface MatchDto extends NewMatchDto {
  id: string;
  status: string;
  statusChangedAt: Date;
  statusChangedBy: string;
}
