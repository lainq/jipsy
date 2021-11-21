import { getLiteralValue, types } from "./constants";
import { ObjectExpression } from "./nodes";

const getValue = (expression: any): string => {
  let output = "";
  if (expression.type == "Identifier") {
    output += `"${expression.name}"`;
  } else {
    let type = types.get(typeof expression.value);
    output += getLiteralValue(
      expression.value,
      type ? `:${type(expression.value)}` : ""
    );
  }
  return output;
};

/**
 * Generate a python dict with the values from a
 * javascript object expression
 * @param expression
 * @returns
 */
export const getObjectExpressionValue = (expression: ObjectExpression) => {
  let output = "{";
  for (let index = 0; index < expression.properties.length; index++) {
    let property = expression.properties[index];
    let key = property.key;
    let value = property.value;
    output += `${getValue(key)}:${getValue(value)},`;
  }
  if (output.length > 1) {
    output = output.slice(0, -1);
  }
  return output + "}";
};
