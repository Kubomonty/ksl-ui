import { PlayerDto } from './player-dto'

export interface TeamDto {
  players: PlayerDto[];
  id: string;
  teamName: string;
  teamEmail: string;
}
