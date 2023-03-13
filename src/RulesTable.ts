import { default as CliTable3, HorizontalAlignment } from "cli-table3";

import type { IRulesConsumer, IRulesTable, IOutput } from "./interfaces";
import type { FormatText } from "./utils/formatText";

type MoveResult = "Win" | "Lose" | "Draw";
type Row = [rowName: string, ...value: MoveResult[]];

export class RulesTable implements IRulesTable {
  private moves: readonly string[];
  private rules: IRulesConsumer;

  constructor(
    private Table: typeof CliTable3,
    private output: IOutput,
    private infoMsg: string,
    private formatText: FormatText
  ) {}

  private constructRows(): Row[] {
    const rows: Row[] = [];

    for (const outerMove of this.moves) {
      const winnerMoves = this.rules.getWinnersList(outerMove);
      const rowTitle = this.formatText(outerMove, {
        color: "blue",
        bold: true,
      });
      const row: Row = [rowTitle];

      for (const innerMove of this.moves) {
        if (innerMove === outerMove) {
          row.push(this.formatText("Draw", { color: "yellow" }));
          continue;
        }
        if (winnerMoves.has(innerMove)) {
          row.push(this.formatText("Win", { color: "green" }));
          continue;
        }
        row.push(this.formatText("Lose", { color: "red" }));
      }

      rows.push(row);
    }

    return rows;
  }

  public set(moves: string[], rules: IRulesConsumer): void {
    this.moves = moves;
    this.rules = rules;
  }

  public print(): void {
    if (!this.moves) {
      throw new Error("You must specify the rules and moves");
    }

    this.output.print(this.infoMsg);

    const table = new this.Table({
      head: [
        "",
        ...this.moves.map((move) =>
          this.formatText(move, { color: "blue", bold: true })
        ),
      ],
      colAligns: Array.from<HorizontalAlignment>({
        length: this.moves.length + 1,
      }).fill("center"),
    });

    table.push(...this.constructRows());
    this.output.print(table.toString());
  }
}
