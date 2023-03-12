import { formatText } from "./utils";

export const INCORRECT_INPUT_MSG = `
  ${formatText("Incorrectly passed arguments", { color: "red" })}
  You must pass an odd number of arguments when running the script.
  The number of arguments must be >= 3.
  All arguments must be unique.
  
  ${formatText("Examples:", { color: "blue", bold: true })}
  ${formatText("Correct:", { color: "green" })}
      yarn start rock paper scissors lizard Spock
      yarn start rock paper scissors
      yarn start A B C D E F G
  ${formatText("Incorrect:", { color: "red" })}
      yarn start rock paper
      yarn start rock paper paper paper paper
`;

export const TABLE_INFO = `
  The horizontal heading indicates your move.
  The vertical header shows the computer's move.
  The cells in the table contain the results of the moves. 
  If the cell says "Win", you will win as a result of the move.
`;
