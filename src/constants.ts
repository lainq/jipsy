export const types:Map<string, Function> = new Map([
    ['number', (value:any) => {
        return value.toString().includes(".") ? 'float' : 'int'
    }],
    ['string', (value:any) => {
        return "char* "
    }]
])

export const getCompleteSource = (body:string):string => {
    return `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char** argv) {
    ${body}
    return 0;
}`
}