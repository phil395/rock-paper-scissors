import { default as CliTable3, HorizontalAlignment } from "cli-table3";

import { Rules } from "./Rules";
import { formatText } from "./utils";

import { TABLE_INFO } from "./messages";

type Row = [string, ...("Win" | "Lose" | "Draw")[]];

export class Table {
  constructor(private moves: readonly string[], private rules: Rules) {}

  private constructRows(): Row[] {
    const rows: Row[] = [];

    for (const outerMove of this.moves) {
      const winnerMoves = this.rules.getWinnersList(outerMove);
      const rowTitle = formatText(outerMove, { color: "blue", bold: true });
      const row: Row = [rowTitle];

      for (const innerMove of this.moves) {
        if (innerMove === outerMove) {
          row.push(formatText("Draw", { color: "yellow" }));
          continue;
        }
        if (winnerMoves.has(innerMove)) {
          row.push(formatText("Win", { color: "green" }));
          continue;
        }
        row.push(formatText("Lose", { color: "red" }));
      }

      rows.push(row);
    }

    return rows;
  }

  private showMessage(msg: string): void {
    console.log(msg);
  }

  public showTable() {
    this.showMessage(TABLE_INFO);

    const table = new CliTable3({
      head: [
        "",
        ...this.moves.map((move) =>
          formatText(move, { color: "blue", bold: true })
        ),
      ],
      colAligns: Array.from<HorizontalAlignment>({
        length: this.moves.length + 1,
      }).fill("center"),
    });
    table.push(...this.constructRows());
    this.showMessage(table.toString());
  }
}
