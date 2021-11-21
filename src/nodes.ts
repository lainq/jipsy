interface Loc {
  start: { line: number; column: number };
  end: { line: number; column: number };
}

type VariableDeclarationKind = "const" | "var" | "let";

export interface VariableDeclarationNode {
  kind: VariableDeclarationKind;
  start: number;
  end: number;
  loc: Loc;
  declarations: Array<any>;
}

interface ObjectExpressionProperty {
  type: string,
  key: {
    type: string,
    name? :string,
    value?:any
  },
  value: {
    type: string,
    name? :string,
    value?:any
  }
}

export interface ObjectExpression {
  type: string,
  properties: ObjectExpressionProperty[],
  loc: Loc
}
