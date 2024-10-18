import { PlayerDto } from './player-dto'

export interface TeamDto {
  players: PlayerDto[];
  id: string;
  name: string;
}
