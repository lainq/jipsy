import { getValue } from "./constants";
import { Converter } from "./converter";
import { addTabs } from "./function";
import { IfStatement } from "./nodes";

export class Conditionals {
  private conditional: IfStatement;
  private output: string = "";

  constructor(conditional: IfStatement) {
    this.conditional = conditional;
  }

  public generateOutput(): string {
    const testCondition = getValue(this.conditional.test);
    const consequent = this.conditional.consequent;
    const alternate = this.conditional.alternate;

    const converter = new Converter("");
    converter.setProgramNode(consequent);

    const bodyString = addTabs(converter.generateOutput());

    let alternateBody: string = "";
    if (alternate) {
      const parameter =
        alternate.type == "IfStatement"
          ? { type: "Program", body: [alternate] }
          : alternate;

      const alternateConverter = new Converter("");
      alternateConverter.setProgramNode(parameter);
      alternateBody = "\t" + alternateConverter.generateOutput();
    }

    this.output += `if ${testCondition}:\n${bodyString}`;
    if (alternateBody.length > 0) {
      const type = alternate.type;
      if (type == "IfStatement") {
        this.output += `\nel${alternateBody.slice(1)}\n`;
      } else {
        this.output += `\nelse:\n${alternateBody}`;
      }
    }

    return this.output;
  }
}
