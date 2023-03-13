import prompts from "prompts";
import { randomInt } from "node:crypto";
import { promisify } from "node:util";

import type {
  IHmacGenerator,
  IMovesProvider,
  IOutput,
  IRulesCreator,
  IRulesTable,
} from "./interfaces";

export class Game {
  private moves: readonly string[];
  private computerMove: string;
  private playerMove: string;

  constructor(
    private movesProvider: IMovesProvider,
    private output: IOutput,
    private rules: IRulesCreator,
    private rulesTable: IRulesTable,
    private hmacGenerator: IHmacGenerator,
    private getAnswer: typeof prompts,
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
    this.output.print(
      "Available moves:\n",
      ...this.buildMovesInfo(),
      "0 - exit\n",
      "? - help\n"
    );

    const playerMoveCode = await this.getPlayerMoveCode();
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

  private async getPlayerMoveCode(): Promise<string> {
    const { playerMoveCode } = await this.getAnswer({
      name: "playerMoveCode",
      type: "text",
      message: "Enter your move:",
      validate: (value) => {
        if (value === "?") {
          return true;
        }
        const num = parseInt(value);
        if (num >= 0 && num <= this.moves.length) {
          return true;
        }
        return `the value must be in the range from 0 to ${this.moves.length} or it must be "?"`;
      },
    });
    return playerMoveCode as string;
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

  private async askAboutNewGame() {
    const { startNewGame } = await this.getAnswer({
      name: "startNewGame",
      type: "confirm",
      message: "Do you want to continue the game:",
      initial: false,
    });
    return startNewGame as boolean;
  }

  private async newGameHandler() {
    const startNewGame = await this.askAboutNewGame();
    if (startNewGame) {
      this.run();
    }
  }

  private buildMovesInfo(): string[] {
    return this.moves.map((move, index) => `${index + 1} - ${move}\n`);
  }

  private errorHandler(error: unknown): void {
    this.output.print(new Error("Something broke", { cause: error }));
  }
}
