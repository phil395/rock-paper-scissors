export class Rules {
  private movesMap: Record<string, number>;

  constructor(private moves: readonly string[]) {
    this.constructMap();
  }

  private constructMap(): void {
    this.movesMap = this.moves.reduce((map, move, index) => {
      map[move] = index;
      return map;
    }, {} as typeof this.movesMap);
  }

  private validateInput(moveA: string, moveB?: string): void {
    if (
      typeof this.movesMap[moveA] === "undefined" ||
      (moveB && typeof this.movesMap[moveB] === "undefined")
    ) {
      throw new Error("Rules: Incorrect Move(s)");
    }
  }

  public getWinnersList(move: string) {
    this.validateInput(move);
    const { length } = this.moves;
    const moveIndex = this.movesMap[move];
    const winnerMoves = new Set<string>();
    let count = (length - 1) / 2;

    while (count) {
      const index = (moveIndex + count) % length;
      winnerMoves.add(this.moves[index]);
      count--;
    }

    return winnerMoves;
  }

  public getWinner(moveA: string, moveB: string): string | null {
    this.validateInput(moveA, moveB);

    if (moveA === moveB) {
      return null;
    }

    const winnerMoves = this.getWinnersList(moveA);

    if (winnerMoves.has(moveB)) {
      return moveB;
    }
    return moveA;
  }
}
