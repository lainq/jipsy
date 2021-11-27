import { CallExpression, MemberExpression } from "seafox/dist/parser/types";
import { getValue } from "./constants";
import { Converter } from "./converter";
import { ClassDefinition } from "./nodes";

export class ClassBody {
  private id: any;
  private superClass: any;
  private body: any;

  private output: string = "";

  constructor(defintion: ClassDefinition) {
    this.id = defintion.id;
    this.superClass = defintion.superClass;
    this.body = defintion.body;
  }

  public getOutput(): string {
    const name = this.id.name;
    const superClass = this.superClass ? getValue(this.superClass) : "";
    this.output = `class ${name}(${superClass}):\n`;

    const converter = new Converter("");
    converter.setProgramNode({ type: "Program", body: this.body.body });
    this.output += converter.generateOutput();

    return this.output;
  }
}

export const getMemberExpressionValue = (expression: any): string => {
  let output = "";
  if (expression.type == "Super") {
    return "super";
  }
  let object = expression.object;
  if (!object) {
    return "";
  }
  if (object.type == "ThisExpression") {
    object = {
      type: "Identifier",
      name: "self",
    };
  }
  const property = expression.property ? (expression.property as any).name : "";
  if (object.type == "MemberExpression") {
    output += getMemberExpressionValue(object) + ".";
  } else {
    output += (object as any).name + ".";
  }
  output += property;
  return output;
};
