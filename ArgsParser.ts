export class ArgsParser {
  public parseArgs(): string[] | null {
    const args = process.argv.slice(2);
    const correct = this.checkArgs(args);
    if (correct) {
      return args;
    }
    return null;
  }

  private checkArgs(args: string[]): boolean {
    if (args.length % 2 === 0 || args.length < 3) {
      return false;
    }

    const unique = new Set(args);
    if (unique.size !== args.length) {
      return false;
    }

    return true;
  }
}
