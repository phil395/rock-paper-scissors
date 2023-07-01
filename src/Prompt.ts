import prompts from "prompts";
import type { IPrompt } from "./interfaces";

export class Prompt implements IPrompt {
  private moves: readonly string[];

  constructor(private getAnswer: typeof prompts) {}

  public setMoves(moves: string[]) {
    this.moves = moves;
  }

  public async getPlayerMoveCode() {
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

  public async askAboutNewGame() {
    const { startNewGame } = await this.getAnswer({
      name: "startNewGame",
      type: "confirm",
      message: "Do you want to continue the game:",
      initial: false,
    });
    return startNewGame as boolean;
  }
}
