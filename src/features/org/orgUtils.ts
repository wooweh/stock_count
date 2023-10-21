/*




*/
export function getInviteKeyValidation(key: string) {
  if (!!key && typeof key === "string" && key.length === 28) {
    return true
  } else {
    return false
  }
}
/*




*/
