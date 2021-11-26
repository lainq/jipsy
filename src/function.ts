import { getValue, types } from "./constants";
import { Converter } from "./converter";
import { Exception } from "./exception";

export const addTabs = (value: string): string => {
  let valueArray: string[] = [];
  let lines = value.split("\n");
  for (let index = 0; index < lines.length; index++) {
    valueArray.push("\t" + lines[index]);
  }
  return valueArray.join("\n");
};

/**
 * @exports
 * @constant
 *
 * Generate the parameter string with the params.
 * Params can be an Identifier, AssignmentPattern
 * or a Literal
 *
 * @param params
 * @returns
 */
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

      params_ += `${paramName}=${getValue({
        type: current.right.value ? current.right.type : "Identifier",
        value: value,
      })},`;
    } else {
      // Literal is not used for function definitions
      // instead, it is used for function calls
      params_ += getValue(current) + ",";
    }
  }
  if (params_.length > 1) {
    params_ = params_.slice(0, -1);
  }
  return params_ + ")";
};

export const generateFunctionBody = (body: any[]): string => {
  const converter = new Converter("");
  converter.setProgramNode({ type: "Program", body: body });
  return converter.generateOutput();
};

export class FunctionDefiniton {
  /**
   * @public
   * @static
   *
   * The expression recived is the `declaration.init` value.
   * The name recieved is the name of the function whihc can be
   * optional. The function is conidered an anonymous function or
   * a lambda if the name isn't specified
   *
   *
   * @param expression The expression containing the arguments and values
   * @param name The name of the function.
   * @returns
   */
  public static fromArrowFunction(expression: any, name?: string): string {
    let output = "";
    if (expression.async) {
      new Exception({ message: "Async not supported yet:/" });
    }
    let body = generateFunctionBody(expression.body.body);
    body = body.replace("\n", "\n\t");
    const params = getFunctionParameters(expression.params);

    // If the name is not defined. The functional is considred
    // as an anonymous function or a lambda function
    if (name) {
      output += `def ${name}${params}:\n${
        body.length > 0 ? addTabs(body) : "\tpass"
      }`;
    } else {
      output += `lambda ${params.slice(1).slice(0, -1)}:${
        body.length > 0 ? body : "\tpass"
      }`;
    }
    output += "\n";
    return output;
  }

  /**
   * @public
   * @static
   *
   * FunctionDeclaration node is different from FunctionExpression
   * or ArrowFunctionExpression.
   *
   * @param expression
   * @returns
   */
  public static fromFunctionDeclaration(expression: any): string {
    let output = "";
    const name = expression.id.name;
    const params = getFunctionParameters(expression.params);
    let body = generateFunctionBody(expression.body.body);
    body = body.replace("\n", "\n\t");
    output += `def ${name}${params}:\n\t${
      body.length > 0 ? addTabs(body) : "\tpass"
    }\n\n`;
    return output;
  }

  public static fromMethodDefinition(expression: any): string {
    let output = "";
    const key =
      expression.key.name == "constructor" ? "__init__" : expression.key.name;
    let body = expression.value;
    if (!expression.static) {
      body.params.unshift({ type: "Identifier", name: "self" });
    }
    const value = getValue(expression.value, key);
    output += value.replace("\n", "\n\t");
    return output;
  }
}
