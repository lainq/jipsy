import { getValue } from "./constants";
import { Converter } from "./converter";
import { ClassDefinition } from "./nodes";

export class ClassBody {
    private id:any
    private superClass:any
    private body:any

    private output:string = ""

    constructor(defintion:ClassDefinition) {
        this.id = defintion.id
        this.superClass = defintion.superClass
        this.body = defintion.body
    }

    public getOutput():string {
        const name = this.id.name
        const superClass = this.superClass ? getValue(this.superClass) : ""
        this.output = `class ${name}(${superClass}):`

        const converter = new Converter("")
        converter.setProgramNode({ type: "Program", body: this.body.body })
        this.output += converter.generateOutput()

        return this.output
    }
     
}