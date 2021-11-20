import exp from "constants"
import { Exception } from "./exception"

export const getFunctionParameters = (params:Array<any>):string => {
    let params_ = "("
    for(let index=0; index<params.length; index++){
        const current = params[index]
        if(current.type == "Identifier"){
            params_ += current.name + ","
        } else if(current.type == "AssignmentPattern"){
            const paramName = current.left.name
            const value = 
                current.right.value != undefined ? current.right.value : current.right.name
            params_ += `${paramName}=${value},`
        }
    }
    params_ = params_.slice(0, -1) + ")"
    return params_
}

export class FunctionDefiniton {
    public static fromArrowFunction(expression:any):string {
        let output = ""
        if(expression.init.async){
            new Exception({message:"Async not supported yet:/"})
        }
        const name = expression.id.name
        output += `def ${name}${getFunctionParameters(expression.init.params)}:\n\tpass`

        output += "\n\n\n"
        return output
    }

    public static fromFunctionDeclaration(expression:any):string {
        let output = ""
        const name = expression.id.name
        const params = getFunctionParameters(expression.params)
        output += `def ${name}${params}:\n\tpass\n\n\n`
        return output
    }
}