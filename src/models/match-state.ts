import { MatchDetailsDto } from './match-details-dto'
import { MatchDto } from './match-dto'
import { NewMatchDto } from './new-match-dto'

export interface MatchState {
  fetchedMatchDetails?: MatchDetailsDto;
  matches: MatchDto[];
  matchPages: number;
  newMatch: NewMatchDto;
  selectedMatchDetails?: MatchDetailsDto;
}
