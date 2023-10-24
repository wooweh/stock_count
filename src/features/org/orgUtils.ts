/*




*/
export function getInviteKeyValidation(key: string) {
  if (!!key && typeof key === "string" && key.length === 36) {
    return true
  } else {
    return false
  }
}
/*




*/
