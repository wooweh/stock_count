/*




*/
export type CheckNewPasswordReturnProps = {
  isConfirmed: boolean
  isUnique: boolean
  isValid: boolean
}
export function checkNewPassword(
  password: string,
  newPassword: string,
  confirmedNewPassword: string,
): CheckNewPasswordReturnProps {
  const isConfirmed = !!newPassword && newPassword === confirmedNewPassword
  const isUnique = newPassword !== password
  const isValid = getPasswordValidation(newPassword).isValid
  return { isConfirmed, isUnique, isValid }
}
/*





*/
export type PasswordValidationReturnProps = {
  minCharCount: boolean
  minCapCharCount: boolean
  minNumCharCount: boolean
  minSpecialCharCount: boolean
  isValid: boolean
}
export function getPasswordValidation(
  password: string,
): PasswordValidationReturnProps {
  const MIN_CHAR_COUNT = 6
  const MIN_CAP_CHAR_COUNT = 1
  const MIN_NUM_CHAR_COUNT = 1
  const MIN_SPECIAL_CHAR_COUNT = 1

  const charCount = password.length
  const capCharCount = (password.match(/[A-Z]/g) || []).length
  const numCharCount = (password.match(/\d/g) || []).length
  const specialCharCount = (password.match(/[^\w\s]/g) || []).length

  const minCharCount = charCount >= MIN_CHAR_COUNT
  const minCapCharCount = capCharCount >= MIN_CAP_CHAR_COUNT
  const minNumCharCount = numCharCount >= MIN_NUM_CHAR_COUNT
  const minSpecialCharCount = specialCharCount >= MIN_SPECIAL_CHAR_COUNT
  const isValid =
    minCharCount && minCapCharCount && minNumCharCount && minSpecialCharCount

  return {
    minCharCount,
    minCapCharCount,
    minNumCharCount,
    minSpecialCharCount,
    isValid,
  }
}
/*




*/
