import { getValue } from "./constants";
import { Converter } from "./converter";
import { addTabs } from "./function";

const switchCaseStatement = (
  statement: any,
  discriminator: any,
  index: number
): string => {
  let condition = statement.test ? getValue(statement.test) : null;
  let bodyConverter = new Converter("");

  bodyConverter.setProgramNode({ type: "Program", body: statement.consequent });
  const body = addTabs(bodyConverter.generateOutput());
  return `${condition ? (index > 0 ? "elif" : "if") : "else"} ${
    condition ? discriminator + "==" + condition : ""
  }:\n${body}`;
};

export const getSwitchStatementValue = (statement: any): string => {
  let discriminator = getValue(statement.discriminant);
  let cases = statement.cases
    .map((case_: any, index: number): string => {
      return switchCaseStatement(case_, discriminator, index);
    })
    .join("\n");
  return cases;
};
