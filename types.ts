
export type Player = 'X' | 'O' | null;

export enum GameMode {
  PVP = 'PVP',
  PVE = 'PVE'
}

export interface GameState {
  board: Player[];
  xIsNext: boolean;
  winner: Player | 'Draw';
  winningLine: number[] | null;
  commentary: string;
  isAiThinking: boolean;
}

export interface GeminiMoveResponse {
  index: number;
  commentary: string;
}
