import { default as CliTable3 } from "cli-table3";
import prompts from "prompts";

import { Game } from "./Game";
import { HmacGenerator } from "./HmacGenerator";
import { MovesProvider } from "./MovesProvider";
import { Output } from "./Output";
import { Rules } from "./Rules";
import { RulesTable } from "./RulesTable";

import { TABLE_INFO, INCORRECT_INPUT_MSG } from "./messages";
import { formatText } from "./utils/formatText";

const movesProvider = new MovesProvider(process.argv.slice(2));
const output = new Output(console.log, formatText);
const rules = new Rules();
const rulesTable = new RulesTable(CliTable3, output, TABLE_INFO, formatText);
const hmacGenerator = new HmacGenerator("SHA3-256", 32);

new Game(
  movesProvider,
  output,
  rules,
  rulesTable,
  hmacGenerator,
  prompts,
  INCORRECT_INPUT_MSG
);
