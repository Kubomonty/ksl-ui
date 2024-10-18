export interface RosterDto {
  position1: { position: string, playerId: string | undefined };
  position2: { position: string, playerId: string | undefined };
  position3: { position: string, playerId: string | undefined };
  position4?: { position: string, playerId: string | undefined };
  position5?: { position: string, playerId: string | undefined };
  position6?: { position: string, playerId: string | undefined };
  position7?: { position: string, playerId: string | undefined };
  position8?: { position: string, playerId: string | undefined };
  captain: string;
}
