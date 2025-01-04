export interface PlayersSubstitutionDto {
  position: string;
  player: {
      id: string;
      name: string;
      playerOrder: number;
  } | null | undefined;
}
