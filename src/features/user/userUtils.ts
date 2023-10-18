import { User, updatePassword } from "firebase/auth"
import { auth } from "../../remote"
import {
  generateErrorNotification,
  generateNotification,
} from "../core/coreUtils"
import { getPasswordValidation } from "./authentication"
import { reauthenticateUser } from "./userRemote"
import { updatePasswordChangeStatus } from "./userSliceUtils"
/*




*/
export async function changeUserPassword(
  password: string,
  newPassword: string,
  confirmedNewPassword: string,
) {
  const check = checkUserNewPassword(
    password,
    newPassword,
    confirmedNewPassword,
  )
  if (check.isValid && check.isConfirmed && check.isUnique) {
    updateUserPassword(password, newPassword)
  } else if (!check.isConfirmed) {
    generateNotification("newPasswordNotConfirmed")
  } else if (!check.isUnique) {
    generateNotification("newPasswordNotUnique")
  } else if (!check.isValid) {
    generateNotification("newPasswordNotValid")
  }
}
/*




*/
export async function updateUserPassword(
  password: string,
  newPassword: string,
) {
  const user = auth.currentUser as User
  updatePasswordChangeStatus("isPending")
  return reauthenticateUser(user, password)
    .then(() => updatePassword(user, newPassword))
    .then(() => {
      updatePasswordChangeStatus("isSuccess")
      generateNotification("passwordChange")
      setTimeout(() => updatePasswordChangeStatus("notChanged"), 250)
    })
    .catch((error) => {
      updatePasswordChangeStatus("isFailed")
      generateErrorNotification(error.code)
      setTimeout(() => updatePasswordChangeStatus("notChanged"), 250)
    })
}
/*




*/
export function checkUserNewPassword(
  password: string,
  newPassword: string,
  confirmedNewPassword: string,
) {
  const isConfirmed = !!newPassword && newPassword === confirmedNewPassword
  const isUnique = newPassword !== password
  const isValid = getPasswordValidation(newPassword).isValid
  return { isConfirmed, isUnique, isValid }
}
