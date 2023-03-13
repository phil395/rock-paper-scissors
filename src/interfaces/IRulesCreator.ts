import type { IRulesConsumer } from "./IRulesConsumer";

export interface IRulesCreator extends IRulesConsumer {
  setMoves(moves: string[]): void;
}
