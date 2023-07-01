import { randomInt } from "node:crypto";
import { promisify } from "node:util";

import type {
  IHmacGenerator,
  IMovesProvider,
  IOutput,
  IPrompt,
  IRulesCreator,
  IRulesTable,
  IMenu,
} from "./interfaces";

export class Game {
  private moves: readonly string[];
  private computerMove: string;
  private playerMove: string;

  constructor(
    private movesProvider: IMovesProvider,
    private menu: IMenu,
    private prompt: IPrompt,
    private output: IOutput,
    private rules: IRulesCreator,
    private rulesTable: IRulesTable,
    private hmacGenerator: IHmacGenerator,
    incorrectInputMsg: string
  ) {
    try {
      const moves = this.movesProvider.get();
      if (!moves) {
        this.output.print(incorrectInputMsg);
        return;
      }
      this.moves = moves;
      this.rules.setMoves(moves);
      this.rulesTable.set(moves, rules);
      this.menu.setMoves(moves);
      this.prompt.setMoves(moves);
      this.run();
    } catch (error) {
      this.errorHandler(error);
    }
  }

  public async run() {
    const computerMoveCode = await promisify<number, number>(randomInt)(
      this.moves.length
    );
    this.computerMove = this.moves[computerMoveCode];

    await this.hmacGenerator.generateHmac(this.computerMove);
    const [hmac] = this.hmacGenerator.getResult();
    this.output.print("HMAC:", hmac);

    this.menu.show();

    const playerMoveCode = await this.prompt.getPlayerMoveCode();
    if (playerMoveCode === "?") {
      this.rulesTable.print();
      this.newGameHandler();
      return;
    }
    if (playerMoveCode === "0") {
      return;
    }
    this.playerMove = this.moves[parseInt(playerMoveCode) - 1];

    this.showResult();
    this.newGameHandler();
  }

  private showResult(): void {
    // print moves
    this.output.print("Your move:", this.playerMove);
    this.output.print("Computer move:", this.computerMove);

    // define winner and print
    const winnerMove = this.rules.getWinner(this.computerMove, this.playerMove);

    switch (winnerMove) {
      case this.playerMove:
        this.output.printF("You win!", { color: "green", bold: true });
        break;
      case this.computerMove:
        this.output.printF("You lose", { color: "red", bold: true });
        break;
      default:
        this.output.printF("Draw", { color: "yellow", bold: true });
    }

    // print hmac things
    const [_, hmacKey, hmacAlgorithm] = this.hmacGenerator.getResult();
    this.output.print("KEY:", hmacKey);
    this.output.print("Algorithm:", hmacAlgorithm);
  }

  private async newGameHandler() {
    const startNewGame = await this.prompt.askAboutNewGame();
    if (startNewGame) {
      this.run();
    }
  }

  private errorHandler(error: unknown): void {
    this.output.print(new Error("Something broke", { cause: error }));
  }
}
