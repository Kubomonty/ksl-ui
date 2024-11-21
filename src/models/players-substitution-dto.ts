export interface PlayersSubstitutionDto {
  position: string;
  player: {
      id: string;
      name: string;
  } | null | undefined;
}
