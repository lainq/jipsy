import { parse } from "seafox"
import { types } from "./constants"
import { VariableDeclarationNode } from "./nodes"
import { Exception } from './exception'
import { FunctionDefiniton } from "./function"

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

    // private arrowFunctionDefinition()

    private declareVariable(node:VariableDeclarationNode) {
        for(let index=0; index<node.declarations.length; index++){
            const declaration = node.declarations[index]
            if(["ArrowFunctionExpression", "FunctionExpression"].includes(declaration.init.type)){
                this.output += FunctionDefiniton.fromArrowFunction(declaration)
                continue
            }
            const name = declaration.id.name
            const value = declaration.init ? (
                declaration.init.value != undefined ? declaration.init.value : declaration.init.name
            ): null
            const typeFunction = types.get(typeof(value))
            const type:string = typeFunction ? `:${typeFunction(value)}` : ""

            const valueString:string = value ? `= ${value}` : '= None'
            this.output += `${name}${type} ${valueString}\n`
        }
    }

    public generateOutput():string {
        const body = this.programNode.body
        for(let index=0; index<body.length; index++) {
            const node = body[index]
            if(node.type === "VariableDeclaration") {
                this.declareVariable(node)
                continue
            } else if(node.type == "FunctionDeclaration"){
                this.output += FunctionDefiniton.fromFunctionDeclaration(node)
            }
        }   
        return this.output
    }

}