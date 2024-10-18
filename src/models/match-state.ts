import { MatchDto } from './match-dto'
import { NewMatchDto } from './new-match-dto'

export interface MatchState {
  matches: MatchDto[];
  newMatch: NewMatchDto;
}
