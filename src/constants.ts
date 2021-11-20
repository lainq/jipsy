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
      return "char* ";
    },
  ],
]);
