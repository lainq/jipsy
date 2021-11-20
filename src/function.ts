import exp from "constants";
import { Converter } from "./converter";
import { Exception } from "./exception";

export const getFunctionParameters = (params: Array<any>): string => {
  let params_ = "(";
  for (let index = 0; index < params.length; index++) {
    const current = params[index];
    if (current.type == "Identifier") {
      params_ += current.name + ",";
    } else if (current.type == "AssignmentPattern") {
      const paramName = current.left.name;
      const value =
        current.right.value != undefined
          ? current.right.value
          : current.right.name;
      params_ += `${paramName}=${value},`;
    } else if (current.type == "Literal") {
      params_ += current.value + ",";
    }
  }
  params_ = params_.slice(0, -1) + ")";
  return params_;
};

export const generateFunctionBody = (body: any[]): string => {
  const converter = new Converter("");
  converter.setProgramNode({ type: "Program", body: body });
  return converter.generateOutput();
};

export class FunctionDefiniton {
  public static fromArrowFunction(expression: any): string {
    let output = "";
    if (expression.init.async) {
      new Exception({ message: "Async not supported yet:/" });
    }
    const name = expression.id.name;
    let body = generateFunctionBody(expression.init.body.body);
    body = body.replace("\n", "\n\t");
    output += `def ${name}${getFunctionParameters(expression.init.params)}:\n${
      body.length > 0 ? body : "\tpass"
    }`;
    console.log(body.length);
    output += "\n\n\n";
    return output;
  }

  public static fromFunctionDeclaration(expression: any): string {
    let output = "";
    const name = expression.id.name;
    const params = getFunctionParameters(expression.params);
    let body = generateFunctionBody(expression.body.body);
    body = body.replace("\n", "\n\t");
    output += `def ${name}${params}:\n\t${
      body.length > 0 ? body : "\tpass"
    }\n\n`;
    return output;
  }
}
