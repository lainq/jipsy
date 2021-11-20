import { yellowBright } from "chalk";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { ArgumentParser, ArgumentParserResults } from "./src/argument";
import { Converter } from "./src/converter";
import { Exception } from "./src/exception";


const performCommand = (result: ArgumentParserResults): void => {
  switch (result.command) {
    case "help":
      console.log("helping..");
      break;
    default:
      if (!result.command) {
        return;
      }
      console.log(yellowBright(`Reading ${result.command}`));
      if (!existsSync(result.command)) {
        new Exception({
          message: `${result.command} doesn't exist`,
          suggestion: "Try creating the file",
        });
      }
      let content = readFileSync(result.command).toString();
      let converter = new Converter(content);
      const output = converter.generateOutput()
      writeFileSync('out.py', output)
  }
};

const args = new ArgumentParser();
const result = args.parseArguments();
performCommand(result);
