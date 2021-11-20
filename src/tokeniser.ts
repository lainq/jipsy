import { KEYWORDS, TokenType } from "./tokens";

export interface Token {
    type: TokenType;
    value: string;
    startPos?: number;
    endPos?: number;
}

type GetTokenCondition = (char: string) => boolean;

export class Tokeniser {
    private tokens: Token[] = [];
    private currentPosition: number = 0
    private source:string

    constructor(source:string){
        this.source = source
    }

    private getToken(condition:GetTokenCondition):string {
        let value:string = ""
        let character = this.source.charAt(this.currentPosition)
        while(character.length > 0){
            let conditionIsTrue = condition(character)
            if(!conditionIsTrue){
                break
            }
            value += character
            this.currentPosition += 1
            character = this.source.charAt(this.currentPosition)
        }
        return value
    }

    private getTokenAtIndex(index:number):string | undefined {
        return this.source.charAt(index)
    }

    public tokenise():Token[] {
        let character = this.source.charAt(this.currentPosition)
        while (character.length > 0) {
            if(character.trim().length == 0) {
                this.currentPosition += 1
                character = this.source.charAt(this.currentPosition)
                continue
            } else if (character == '|') {
                this.tokens.push({
                    type: TokenType.PIPE,
                    value: '|',
                    startPos: this.currentPosition,
                    endPos: this.currentPosition 
                })
            }else if (character == '=') {
                let nextToken = this.getTokenAtIndex(this.currentPosition + 1)
                this.tokens.push({
                    type: nextToken == '=' ? TokenType.EQUALS : TokenType.IS_EQUAL_TO,
                    value: nextToken == '=' ? '==' : '=',
                    startPos: this.currentPosition,
                    endPos: nextToken == '=' ? this.currentPosition + 1 : this.currentPosition
                })
                if(nextToken == '=') {
                    this.currentPosition += 1
                }
            } else if(['>', '<'].includes(character)) {
                let nextToken = this.getTokenAtIndex(this.currentPosition + 1)
                if(nextToken == '='){
                    this.tokens.push({
                        type: character == '>' ? TokenType.GREATER_THAN_OR_EQUAL_TO : TokenType.LESS_THAN_OR_EQUAL_TO,
                        value: character + nextToken,
                        startPos: this.currentPosition,
                        endPos: this.currentPosition + 1
                    })
                    this.currentPosition += 2
                    character = this.source.charAt(this.currentPosition)
                    continue
                } else {
                    this.tokens.push({
                        type: character == '>' ? TokenType.GREATER_THAN : TokenType.LESS_THAN,
                        value: character,
                        startPos: this.currentPosition,
                        endPos: this.currentPosition
                    })
                }   
            } else if(character == '!'){
                let nextToken = this.getTokenAtIndex(this.currentPosition + 1)
                let isNextTokenEqualTo = nextToken == '='
                this.tokens.push({
                    type: isNextTokenEqualTo ? TokenType.NOT_EQUALS : TokenType.NOT,
                    value: isNextTokenEqualTo ? '!=' : '!',
                    startPos: this.currentPosition,
                    endPos: this.currentPosition + 1
                })
                if(isNextTokenEqualTo) {
                    this.currentPosition += 2
                }
            } 
            
            if(Number.isInteger(parseInt(character))){
                let startPos:number = this.currentPosition
                const value = this.getToken((character:string):boolean => {
                    return Number.isInteger(parseInt(character)) || character == '.'
                })
                this.tokens.push({
                    type: TokenType.NUMBER,
                    value: value,
                    startPos: startPos,
                    endPos: this.currentPosition
                })
            } else if (character == '"'){
                this.currentPosition += 1
                let startPos:number = this.currentPosition
                const value = this.getToken((character:string):boolean => {
                    return character != '"'
                })
                let tokenType = value.length > 1 ? TokenType.STRING : TokenType.CHAR
                this.tokens.push({
                    type: tokenType,
                    value: value,
                    startPos: startPos,
                    endPos: this.currentPosition
                })
            } else {
                let startPos:number = this.currentPosition
                const value = this.getToken((character:string):boolean => {
                    let regexResult = character.match(/^[0-9a-z]+$/)
                    if(!regexResult){
                        return false
                    }
                    return regexResult.length > 0   
                })
                this.tokens.push({
                    type: KEYWORDS.includes(value) ? TokenType.KEYWORD : TokenType.IDENTIFIER,
                    value: value,
                    startPos: startPos,
                    endPos: this.currentPosition
                })
            }
            this.currentPosition += 1
            character = this.source.charAt(this.currentPosition)
        }
        return this.tokens
    }
}
