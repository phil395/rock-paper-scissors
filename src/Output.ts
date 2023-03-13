import type { IOutput } from "./interfaces";
import type { IFormatTextOptions } from "./utils/formatText";

export class Output implements IOutput {
  constructor(
    private source: (...args: unknown[]) => unknown,
    private formatter: IOutput["printF"]
  ) {}

  public print(...args: unknown[]): void {
    this.source(...args);
  }

  public printF(s: string, options: IFormatTextOptions): void {
    const formattedText = this.formatter(s, options);
    this.source(formattedText);
  }
}
