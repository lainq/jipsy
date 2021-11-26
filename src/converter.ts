import { parse } from "seafox";
import { types, getLiteralValue, getValue } from "./constants";
import { VariableDeclarationNode } from "./nodes";
import { addTabs, FunctionDefiniton, getFunctionParameters } from "./function";
import { ClassBody } from "./classes";
import { Conditionals } from "./conditionals";
import { getSwitchStatementValue } from "./switch";
import { ImportDeclaration } from "./imports";
import { redBright } from "chalk";

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
      } else if (declaration.init.type == "CallExpression") {
        output += getValue(declaration.init, declaration.id.name);
        continue;
      }
      const name = declaration.id.name;
      const literalTypes = [
        "NewExpression",
        "ObjectExpression",
        "ConditionalExpression",
        "ArrayExpression",
        "MemberExpression",
      ];
      if (literalTypes.includes(declaration.init.type)) {
        output += name + "=" + getValue(declaration.init) + "\n";
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
    for (let index = 0; index < body.length; index++) {
      const node = body[index];
      switch (node.type) {
        case "VariableDeclaration":
          this.output += this.declareVariable(node);
          break;
        case "ExpressionStatement":
          const expression = node.expression;
          this.output += getValue(expression);
          break;
        case "FunctionDeclaration":
          this.output += FunctionDefiniton.fromFunctionDeclaration(node);
          break;
        case "ReturnStatement":
          this.output += `return ${getValue(node.argument)}`;
          break;
        case "ClassDeclaration":
          const classBody = new ClassBody(node);
          this.output += classBody.getOutput();
          break;
        case "MethodDefinition":
          this.output += `\t` + FunctionDefiniton.fromMethodDefinition(node);
          break;
        case "WhileStatement":
          const testCondition = getValue(node.test);

          const converter = new Converter("");
          converter.setProgramNode(node.body);

          const body = addTabs(converter.generateOutput());
          this.output += `while ${testCondition}:\n${body}`;
          break;
        case "IfStatement":
          const conditional = new Conditionals(node);
          this.output += conditional.generateOutput();
          break;
        case "SwitchStatement":
          this.output += getSwitchStatementValue(node);
          break;
        case "ImportDeclaration":
          const importDeclaration = new ImportDeclaration(node);
          this.output += importDeclaration.generateOutput() + "\n";
          break;
        case "ForStatement":
          const name = node.init.declarations[0].id.name;
          const initialValue = getValue(node.init.declarations[0].init);

          const test = getValue(node.test);
          const update = getValue(node.update);

          const loopConverter = new Converter("");
          loopConverter.setProgramNode(node.body);

          const bodyString = addTabs(loopConverter.generateOutput());
          this.output += `${name}=${initialValue}\nwhile ${test}:\n${bodyString}\n\t${update}`;
          break;
        default:
          console.log(node);
          break;
      }
    }
    return this.output;
  }
}
