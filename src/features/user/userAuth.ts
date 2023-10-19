import {
  EmailAuthProvider,
  User,
  createUserWithEmailAndPassword as createUserOnAuth,
  reauthenticateWithCredential as reauthenticateOnAuth,
  sendEmailVerification as sendAuthEmailVerification,
  sendPasswordResetEmail as sendAuthPasswordReset,
  signInWithEmailAndPassword as signInOnAuth,
  signOut as signOutOnAuth,
  updateEmail as updateEmailOnAuth,
  updatePassword as updatePasswordOnAuth,
} from "firebase/auth"
import { auth } from "../../remote"
import {
  generateErrorNotification,
  generateNotification,
} from "../core/coreUtils"
import {
  resetPasswordChangeStatus,
  signUserIn,
  signUserOut,
  updateUserEmail,
  updateUserPasswordChangeStatus,
} from "./userSliceUtils"
import { checkNewPassword } from "./userUtils"
/*




*/
export async function signIn(email: string, password: string) {
  return signInOnAuth(auth, email, password)
    .then((credential) => {
      if (!!credential.user) signUserIn()
    })
    .catch((error) => generateErrorNotification(error.code))
}
/*




*/
export async function signOut() {
  return signOutOnAuth(auth)
    .then(() => signUserOut())
    .catch((error) => generateErrorNotification(error.code))
}
/*




*/
export async function changeEmail(email: string, oldEmail: string) {
  const authUser = auth.currentUser
  if (!!authUser && email !== oldEmail) {
    updateEmailOnAuth(authUser, email)
      .then(() => updateUserEmail(email))
      .catch((error) => generateErrorNotification(error.code))
  }
}
/*




*/
const codeSettings = {
  // TODO: Set url env variable for production vs development
  url: "http://localhost:5173/sign_in",
  handleCodeInApp: false,
}

export async function register(email: string, password: string) {
  return createUserOnAuth(auth, email, password)
    .then((credential) => {
      if (!!credential.user) {
        sendAuthEmailVerification(credential.user, codeSettings)
      }
    })
    .catch((error) => generateErrorNotification(error.code))
}
/*





*/
export async function reauthenticate(user: User, password: string) {
  const email = user.email as string
  const credentials = EmailAuthProvider.credential(email, password)
  return reauthenticateOnAuth(user, credentials).catch((error) =>
    generateErrorNotification(error.code),
  )
}
/*





*/
export function resetPassword(email: string) {
  sendAuthPasswordReset(auth, email, codeSettings)
    .then(() => generateNotification("passwordReset"))
    .catch((error) => generateErrorNotification(error.code))
}
/*





*/
export async function changePassword(
  password: string,
  newPassword: string,
  confirmedNewPassword: string,
) {
  const check = checkNewPassword(password, newPassword, confirmedNewPassword)
  if (check.isValid && check.isConfirmed && check.isUnique) {
    updatePassword(password, newPassword)
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
export async function updatePassword(password: string, newPassword: string) {
  const user = auth.currentUser as User
  updateUserPasswordChangeStatus("isPending")
  return reauthenticate(user, password)
    .then(() => updatePasswordOnAuth(user, newPassword))
    .then(() => {
      updateUserPasswordChangeStatus("isSuccess")
      generateNotification("passwordChange")
      resetPasswordChangeStatus()
    })
    .catch((error) => {
      updateUserPasswordChangeStatus("isFailed")
      generateErrorNotification(error.code)
      resetPasswordChangeStatus()
    })
}
/*





*/
