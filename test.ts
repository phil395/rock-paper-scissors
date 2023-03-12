import { strictEqual, throws } from "node:assert/strict";
import test from "node:test";

import { Rules } from "./Rules";

test("Rules.defineWinner() with 3 items", (t) => {
  const rules = new Rules(["A", "B", "C"]);
  strictEqual(rules.getWinner("A", "B"), "B");
  strictEqual(rules.getWinner("A", "C"), "A");
  strictEqual(rules.getWinner("C", "B"), "C");
  strictEqual(rules.getWinner("C", "A"), "A");
  strictEqual(rules.getWinner("C", "C"), null);
  throws(() => {
    rules.getWinner("ABG", "C");
  });
});

test("Rules.defineWinner() with 5 items", (t) => {
  const rules = new Rules(["A", "B", "C", "D", "E"]);

  strictEqual(rules.getWinner("A", "B"), "B");
  strictEqual(rules.getWinner("C", "E"), "E");
  strictEqual(rules.getWinner("D", "A"), "A");
  strictEqual(rules.getWinner("E", "B"), "B");
  strictEqual(rules.getWinner("D", "B"), "D");
  strictEqual(rules.getWinner("C", "C"), null);
  throws(() => {
    rules.getWinner("ABG", "C");
  });
});

test("Rules.defineWinner() with 7 items", (t) => {
  const rules = new Rules(["A", "B", "C", "D", "E", "F", "G"]);

  strictEqual(rules.getWinner("A", "C"), "C");
  strictEqual(rules.getWinner("A", "D"), "D");
  strictEqual(rules.getWinner("D", "E"), "E");
  strictEqual(rules.getWinner("D", "G"), "G");
  strictEqual(rules.getWinner("F", "A"), "A");
  strictEqual(rules.getWinner("B", "F"), "B");
  strictEqual(rules.getWinner("F", "A"), "A");
  strictEqual(rules.getWinner("C", "G"), "C");
  strictEqual(rules.getWinner("E", "A"), "A");
  strictEqual(rules.getWinner("C", "C"), null);
  throws(() => {
    rules.getWinner("ABG", "C");
  });
});
