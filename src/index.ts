import { default as CliTable3 } from "cli-table3";
import getAnswer from "prompts";

import { Game } from "./Game";
import { HmacGenerator } from "./HmacGenerator";
import { MovesProvider } from "./MovesProvider";
import { Output } from "./Output";
import { Rules } from "./Rules";
import { RulesTable } from "./RulesTable";
import { Menu } from "./Menu";
import { Prompt } from "./Prompt";

import { TABLE_INFO, INCORRECT_INPUT_MSG } from "./messages";
import { formatText } from "./utils/formatText";

const movesProvider = new MovesProvider(process.argv.slice(2));
const output = new Output(console.log, formatText);
const rules = new Rules();
const rulesTable = new RulesTable(CliTable3, output, TABLE_INFO, formatText);
const hmacGenerator = new HmacGenerator("SHA3-256", 32);
const menu = new Menu(output);
const prompt = new Prompt(getAnswer);

new Game(
  movesProvider,
  menu,
  prompt,
  output,
  rules,
  rulesTable,
  hmacGenerator,
  INCORRECT_INPUT_MSG
);
