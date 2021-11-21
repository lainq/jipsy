export const types: Map<string, Function> = new Map([
  [
    "number",
    (value: any) => {
      return value.toString().includes(".") ? "float" : "int";
    },
  ],
  [
    "string",
    (value: any) => {
      return "str";
    },
  ],
  [
    'object', (value:any) => "dict"
  ]
]);


export const getLiteralValue = (value:string, type:string):string => {
  let valueString = value
  switch(type.slice(1)){
      case 'str':
          valueString = `"${value}"`
          break

  }    
  return `${valueString}`
}