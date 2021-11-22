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
      const functionName = value.callee.name;
      const parameters = getFunctionParameters(value.arguments);
      return `${name ? name : ""}=${functionName}${parameters}\n`;
    default:
      return "";
  }
};
