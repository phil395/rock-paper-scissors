import prompts from "prompts";
import { randomInt } from "node:crypto";
import { promisify } from "node:util";

import { ArgsParser } from "./ArgsParser";
import { Authn } from "./Authn";
import { Rules } from "./Rules";
import { Table } from "./Table";

import { INCORRECT_INPUT_MSG } from "./messages";
import { formatText } from "./utils";

export class Game {
  private parser: ArgsParser = new ArgsParser();
  private authn: Authn = new Authn("SHA3-256");
  private rules: Rules;
  private table: Table;
  private moves: string[];
  private computerMove: string;
  private playerMove: string;

  constructor() {
    const moves = this.parser.parseArgs();
    if (!moves) {
      this.showMessage(INCORRECT_INPUT_MSG);
      return;
    }
    this.moves = moves;
    this.rules = new Rules(moves);
    this.table = new Table(moves, this.rules);
    this.run();
  }

  public async run() {
    const computerMoveCode = await promisify<number, number>(randomInt)(
      this.moves.length
    );
    this.computerMove = this.moves[computerMoveCode];

    await this.authn.generateHmac(this.computerMove);

    this.showMessage("HMAC:", this.authn.hmac);
    this.showMessage(
      "Available moves:\n",
      ...this.buildMovesInfo(),
      "0 - exit\n",
      "? - help\n"
    );

    const playerMoveCode = await this.getPlayerMoveCode();
    if (playerMoveCode === "?") {
      this.table.showTable();
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
    const { playerMoveCode } = await prompts({
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
        return `the value must be in the range from 1 to ${this.moves.length} or it must be "?"`;
      },
    });
    return playerMoveCode as string;
  }

  private showResult(): void {
    this.showMessage("Your move:", this.playerMove);
    this.showMessage("Computer move:", this.computerMove);
    const winner = this.rules.getWinner(this.computerMove, this.playerMove);
    if (!winner) {
      this.showMessage(formatText("Draw", { color: "yellow", bold: true }));
      return;
    }
    if (winner === this.playerMove) {
      this.showMessage(formatText("You win!", { color: "green", bold: true }));
      return;
    }
    this.showMessage(formatText("You lose", { color: "red", bold: true }));
    this.showMessage("KEY:", this.authn.key);
    this.showMessage("Algorithm:", this.authn.algorithm);
  }

  private async askAboutNewGame() {
    const { startNewGame } = await prompts({
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

  private showMessage(...msgs: string[]): void {
    console.log(...msgs);
  }

  private buildMovesInfo(): string[] {
    return this.moves.map((move, index) => `${index + 1} - ${move}\n`);
  }
}
