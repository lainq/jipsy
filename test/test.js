import { readFile } from 'fs'
import { argv } from 'process'

class Interpreter {
  constructor(source) {
    this.source = source
    this.index = index
    this.ascii = 0
  }

  interpret() {
    while(this.index < this.source.length()){
      const character = this.source[index]
      if(character == '+'){
        this.ascii += 1
      } else if(character == '-'){
        this.ascii -= 1
      } else if(character == ';'){
        process.exit()
      } else if (character == '#') {
        console.log(String.fromCharCode(character))
      }
    }
  }
}

const args = argv.slice(2)
const filename = args[0]
readFile(filename, (content) => {new Interpreter(content).interpret()})
