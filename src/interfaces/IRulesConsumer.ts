export interface IRulesConsumer {
  getWinner(moveA: string, moveB: string): string | null;
  getWinnersList(move: string): Set<string>;
}
