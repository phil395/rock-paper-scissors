import type { IFormatTextOptions } from "../utils/formatText";

export interface IOutput {
  print(...args: unknown[]): void;
  printF(s: string, options: IFormatTextOptions): void;
}
