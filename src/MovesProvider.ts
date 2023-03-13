import type { IMovesProvider } from "./interfaces";

export class MovesProvider implements IMovesProvider {
  constructor(private readonly args: string[]) {}

  public get(): string[] | null {
    const correct = this.check();
    if (correct) {
      return this.args;
    }
    return null;
  }

  private check(): boolean {
    if (this.args.length % 2 === 0 || this.args.length < 3) {
      return false;
    }

    const unique = new Set(this.args);
    if (unique.size !== this.args.length) {
      return false;
    }

    return true;
  }
}
