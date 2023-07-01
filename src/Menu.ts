import type { IMenu, IOutput } from "./interfaces";

export class Menu implements IMenu {
  private moves: readonly string[];

  constructor(private output: IOutput) {}

  public setMoves(moves: string[]) {
    this.moves = moves;
  }

  public show() {
    this.output.print(
      "Available moves:\n",
      ...this.buildRows(),
      "0 - exit\n",
      "? - help\n"
    );
  }

  private buildRows(): string[] {
    return this.moves.map((move, index) => `${index + 1} - ${move}\n`);
  }
}
