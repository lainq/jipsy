import { parse } from "seafox";
import { types } from "./constants";
import { VariableDeclarationNode } from "./nodes";
import { Exception } from "./exception";
import { FunctionDefiniton, getFunctionParameters } from "./function";
import { redBright } from "chalk";

interface ProgramBody {
  type: string;
  sourceType?: string;
  start?: number;
  end?: number;
  body: any[];
}

export class Converter {
  private convert: string;
  private programNode: ProgramBody;
  private output: string = ``;

  constructor(convert: string) {
    this.convert = convert;
    this.programNode = parse(this.convert, {
      module: true,
      loc: true,
    }) as ProgramBody;
  }

  public setProgramNode(programNode: ProgramBody) {
    this.programNode = programNode;
  }

  // private arrowFunctionDefinition()

  private declareVariable(node: VariableDeclarationNode) {
    for (let index = 0; index < node.declarations.length; index++) {
      const declaration = node.declarations[index];
      if (
        ["ArrowFunctionExpression", "FunctionExpression"].includes(
          declaration.init.type
        )
      ) {
        this.output += FunctionDefiniton.fromArrowFunction(declaration);
        continue;
      }
      const name = declaration.id.name;
      const value = declaration.init
        ? declaration.init.value != undefined
          ? declaration.init.value
          : declaration.init.name
        : null;
      const typeFunction = types.get(typeof value);
      const type: string = typeFunction ? `:${typeFunction(value)}` : "";

      const valueString: string = value ? `= ${value}` : "= None";
      this.output += `${name}${type} ${valueString}\n`;
    }
  }

  public generateOutput(): string {
    const body = this.programNode.body;
    for (let index = 0; index < body.length; index++) {
      const node = body[index];
      if (node.type === "VariableDeclaration") {
        this.declareVariable(node);
        continue;
      } else if (node.type == "FunctionDeclaration") {
        this.output += FunctionDefiniton.fromFunctionDeclaration(node);
      } else if (node.type == "ExpressionStatement") {
        const expression = node.expression;
        if (expression.type == "CallExpression") {
          const functionName = expression.callee.name;
          const params = getFunctionParameters(expression.arguments);
          this.output += `${functionName}${params}\n`;
        }
      }
    }
    return this.output;
  }
}
