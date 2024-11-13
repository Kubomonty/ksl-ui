import { MatchDetailsDto } from './match-details-dto'
import { MatchDto } from './match-dto'
import { NewMatchDto } from './new-match-dto'

export interface MatchState {
  matches: MatchDto[];
  newMatch: NewMatchDto;
  selectedMatchDetails?: MatchDetailsDto;
}
