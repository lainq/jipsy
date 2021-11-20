interface Loc {
    start: {line:number, column:number};
    end: {line:number, column:number};
}

type VariableDeclarationKind = 'const' | 'var' | 'let'


export interface VariableDeclarationNode {
    kind: VariableDeclarationKind,
    start: number,
    end: number,
    loc: Loc,
    declarations: Array<any>
}

// export interface ArrowFunctionExpression {
//     type: string,
//     params: Array<{
//         tyoe: string,
//         name: 
//     }>
// }