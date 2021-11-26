import { getMemberExpressionValue } from "./classes";
import { FunctionDefiniton, getFunctionParameters } from "./function";
import { getObjectExpressionValue } from "./objects";

// javascript types and python types
export const types: Map<string, Function> = new Map([
  [
    "number",
    (value: any) => {
      return value.toString().includes(".") ? "float" : "int";
    },
  ],
  [
    "string",
    (value: any) => {
      return "str";
    },
  ],
  ["object", (value: any) => "dict"],
]);

export const getLiteralValue = (value: string, type: string): string => {
  let valueString = value;
  switch (type.slice(1)) {
    case "str":
      valueString = `"${value}"`;
      break;
  }
  return `${valueString}`;
};

const callExpressionValue = (expression: any, name?: string): string => {
  const functionName =
    expression.callee.name || getMemberExpressionValue(expression.callee);
  const parameters = getFunctionParameters(expression.arguments);
  return `${name ? name + "=" : ""}${functionName}${parameters}\n`;
};

export const getValue = (value: any, name?: string): string => {
  switch (value.type) {
    case "Literal":
      const typeFunction = types.get(typeof value.value);
      const typeString = typeFunction ? `:${typeFunction(value.value)}` : "";
      return getLiteralValue(value.value, typeString);
    case "ObjectExpression":
      return getObjectExpressionValue(value);
    case "ArrowFunctionExpression":
      return FunctionDefiniton.fromArrowFunction(value, name);
    case "FunctionExpression":
      return FunctionDefiniton.fromArrowFunction(value, name);
    case "Identifier":
      return value.name;
    case "CallExpression":
      return callExpressionValue(value, name);
    case "NewExpression":
      return callExpressionValue(value, name);
    case "BinaryExpression":
      const left = getValue(value.left);
      const right = getValue(value.right);
      const operator = value.operator;
      return `${left}${operator}${right}`;
    case "ConditionalExpression":
      const test = getValue(value.test);
      const consequentValue = getValue(value.consequent);
      const alternate = getValue(value.alternate);
      return `${consequentValue} if ${test} else ${alternate}`;
    case "ArrayExpression":
      const values = value.elements.map((element: any): string => {
        return getValue(element);
      });
      return `[${values.join(",")}]`;
    case "MemberExpression":
      return getMemberExpressionValue(value);
    case "ThisExpression":
      return "self";
    case "UpdateExpression":
      const updateVariableName = getValue(value.argument);
      return `${updateVariableName} += 1`;
    default:
      return "";
  }
};
