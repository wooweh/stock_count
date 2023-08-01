/*





*/
export const generateModules = (
  start: number,
  count: number,
  ratio: number,
) => {
  return new Array(count + 1)
    .fill(true)
    .map(() => {
      start *= ratio
      return Math.round(start * count) / count
    })
    .map((module: any) => module + "rem")
}
/*





*/
export function makeSentenceCase(string: string) {
  const modifiedString = string.charAt(0).toUpperCase() + string.slice(1)
  return modifiedString
}
/*









*/
