import exp from "constants"
import { Exception } from "./exception"

export const getFunctionParameters = (params:Array<any>):string => {
    let params_ = "("
    for(let index=0; index<params.length; index++){
        const current = params[index]
        if(current.type == "Identifier"){
            params_ += "auto " + current.name + ","
        } else if(current.type == "AssignmentPattern"){
            new Exception({
                message:"Default parameter values not supported", 
                suggestion: `In line ${current.loc.start.line} column ${current.loc.start.column}`
            })
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
        // console.log(expression.init)
        output += `auto ${name}${getFunctionParameters(expression.init.params)}{

        };\n`
        return output
    }
}