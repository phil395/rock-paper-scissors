export interface IPrompt {
  setMoves(moves: string[]): void;
  getPlayerMoveCode(): Promise<string>;
  askAboutNewGame(): Promise<boolean>;
}
