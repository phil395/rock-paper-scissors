import type { IRulesConsumer } from "./IRulesConsumer";

export interface IRulesTable {
  set(moves: string[], rules: IRulesConsumer): void;
  print(): void;
}
