interface Loc {
  start: { line: number; column: number };
  end: { line: number; column: number };
}

type VariableDeclarationKind = "const" | "var" | "let";

export interface VariableDeclarationNode {
  // The type of variable declaration
  // const for immutable variables, and var and let
  // for mutable variables
  kind: VariableDeclarationKind;
  start: number;
  end: number;
  loc: Loc;
  declarations: Array<any>;
}

interface ObjectExpressionProperty {
  type: string;
  key: {
    type: string;
    name?: string;
    value?: any;
  };
  value: {
    type: string;
    name?: string;
    value?: any;
  };
}

export interface ObjectExpression {
  type: string;
  // The object properties containing the key and value
  properties: ObjectExpressionProperty[];
  loc: Loc;
}

export interface ClassDefinition {
  type: string,
  id: any,
  superClass: any,
  body:any
}