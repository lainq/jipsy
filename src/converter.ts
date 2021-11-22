import { parse } from "seafox";
import { types, getLiteralValue, getValue } from "./constants";
import { VariableDeclarationNode } from "./nodes";
import { FunctionDefiniton, getFunctionParameters } from "./function";
import { getObjectExpressionValue } from "./objects";
import { ClassBody } from "./classes";

interface ProgramBody {
  type: string;
  sourceType?: string;
  start?: number;
  end?: number;

  // All the nodes in the program
  body: any[];
}

export class Converter {
  // The source string to be converted
  // into a program body
  private convert: string;
  private programNode: ProgramBody;

  // The output which is dumped into
  // the outfile after conversion
  private output: string = ``;

  constructor(convert: string) {
    this.convert = convert;
    this.programNode = parse(this.convert, {
      module: true,
      loc: true,
    }) as ProgramBody;
  }

  /**
   * Change the program body
   */
  public setProgramNode(programNode: ProgramBody) {
    this.programNode = programNode;
  }

  private declareVariable(node: VariableDeclarationNode): string {
    let output: string = "";
    for (let index = 0; index < node.declarations.length; index++) {
      const declaration = node.declarations[index];
      if (
        ["ArrowFunctionExpression", "FunctionExpression"].includes(
          declaration.init.type
        )
      ) {
        output += FunctionDefiniton.fromArrowFunction(
          declaration.init,
          declaration.id.name
        );
        continue;
      }
      const name = declaration.id.name;
      if (declaration.init.type == "ObjectExpression") {
        output += name + "=" + getObjectExpressionValue(declaration.init);
        continue;
      }
      const value = declaration.init
        ? declaration.init.value != undefined
          ? declaration.init.value
          : declaration.init.name
        : null;
      const typeFunction = types.get(typeof value);
      const type: string = typeFunction ? `:${typeFunction(value)}` : "";

      const valueString: string = value ? `= ${value}` : "= None";
      output += `${name}${type}=${getLiteralValue(value, type)}\n`;
    }
    return output;
  }

  public generateOutput(): string {
    const body = this.programNode.body;
    console.log(body.length)
    for (let index = 0; index < body.length; index++) {
      const node = body[index];
      switch (node.type) {
        case "VariableDeclaration":
          this.output += this.declareVariable(node);
          break;
        case "ExpressionStatement":
          const expression = node.expression;
          if (expression.type == "CallExpression") {
            const functionName = expression.callee.name;
            const parameters = getFunctionParameters(expression.arguments);
            this.output += `${functionName}${parameters}\n`;
          } else if (expression.type == "AssignmentExpression") {
            const left = getValue(expression.left);
            const right = getValue(expression.right);
            const operator = expression.operator;
            this.output += `${left}${operator}${right}\n`;
          } else {
            console.log(`expression : ${expression}`)
          }
          break;
        case "FunctionDeclaration":
          this.output += FunctionDefiniton.fromFunctionDeclaration(node);
          break;
        case "ReturnStatement":
          this.output += `\treturn ${getValue(node.argument)}`;
          break;
        case 'ClassDeclaration':
          const classBody = new ClassBody(node)
          this.output += classBody.getOutput()
          break
        case 'MethodDefinition':
          this.output += FunctionDefiniton.fromMethodDefinition(node)
          break
        default:
          console.log(node);
          break;
      }
    }
    return this.output;
  }
}
