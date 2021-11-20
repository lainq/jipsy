interface Loc {
    start: {line:number, column:number};
    end: {line:number, column:number};
}

type VariableDeclarationKind = 'const' | 'var' | 'let'

export interface Declaration {
    type: string,
    id: {
        type: string,
        name: string,
        loc:Loc
    },
    init: {
        type: string,
        name?: string,
        value?: any
    },
    loc: Loc
}

export interface VariableDeclarationNode {
    kind: VariableDeclarationKind,
    start: number,
    end: number,
    loc: Loc,
    declarations: Array<Declaration>
}

