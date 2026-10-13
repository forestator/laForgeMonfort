export interface Player {
  id: string;
  name: string;
}

export interface GameTable {
  id: string;
  date: string;
  gameName: string;
  hostId: string;
  hostName: string;
  maxPlayers: number;
  notes: string;
  players: Player[];
  startTime?: string;
  coverUrl?: string;
}

export type NewGameTable = Omit<GameTable, 'id'>;

export interface KeyHolder {
  id: string;
  name: string;
}
