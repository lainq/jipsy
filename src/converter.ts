import { parse } from "seafox"
import { types } from "./constants"
import { Declaration, VariableDeclarationNode } from "./nodes"

interface ProgramBody {
    type: string,
    sourceType: string,
    start: number,
    end: number,
    body: any[]
}

export class Converter {
    private convert:string
    private programNode:ProgramBody
    private output:string = ``

    constructor(convert:string) {
        this.convert = convert
        this.programNode = parse(this.convert, {
            module: true,
            loc: true
        }) as ProgramBody
    }

    private declareVariable(node:VariableDeclarationNode) {
        const mutability:string = node.kind === "const" ? "const " : ""
        let value:string = ""
        for(let index=0; index<node.declarations.length; index++){
            const declaration:Declaration = node.declarations[index]
            console.log(declaration.init)
            const name = declaration.id.name
            const value = declaration.init ? (
                declaration.init.value != undefined ? declaration.init.value : declaration.init.name
            ): null
            const typeFunction = types.get(typeof(value))
            const type:string = typeFunction ? typeFunction(value) : "auto"

            const valueString:string = value ? `= ${value}` : ''
            this.output += `${mutability}${type} ${name} ${valueString};\n`
        }
    }

    public generateOutput():string {
        const body = this.programNode.body
        for(let index=0; index<body.length; index++) {
            const node = body[index]
            if(node.type === "VariableDeclaration") {
                this.declareVariable(node)
            }
        }   
        return this.output
    }

}