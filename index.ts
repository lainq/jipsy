import { existsSync, readFileSync } from 'fs'
import { PassThrough } from 'stream'
import { ArgumentParser, ArgumentParserResults } from './src/argument'
import { Exception } from './src/exception'
import { Tokeniser } from './src/tokeniser'

const performCommand = (result:ArgumentParserResults):void => {
    switch(result.command) {
        case 'help':
            console.log("helping..")
            break
        default:
            if(!result.command){
                return  
            }
            if(!existsSync(result.command)){
                new Exception({
                    message: `${result.command} doesn't exist`,
                    suggestion: 'Try creating the file'
                })
            }
            let content = readFileSync(result.command).toString()
            let tokeniser = new Tokeniser(content)
            console.log(tokeniser.tokenise())
        }
}

const args = new ArgumentParser()
const result = args.parseArguments()
performCommand(result)