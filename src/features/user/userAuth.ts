import {
  ActionCodeSettings,
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
import _ from "lodash"
import { store } from "../../app/store"
import { auth } from "../../remote"
import {
  resetSystem,
  setSystemIsBooting,
  setSystemNotBooted,
} from "../core/coreSliceUtils"
import {
  generateCustomNotification,
  generateErrorNotification,
  generateNotification,
} from "../core/coreUtils"
import { getUserFromDB } from "./userSliceRemote"
import {
  createNewUser,
  resetEmailChangeStatus,
  resetPasswordChangeStatus,
  signUserIn,
  signUserOut,
  updateUser,
  updateUserEmail,
  updateUserEmailChangeStatus,
  updateUserPasswordChangeStatus,
} from "./userSliceUtils"
import { checkNewPassword } from "./userUtils"
/*




*/
export async function signIn(email: string, password: string) {
  return signInOnAuth(auth, email, password)
    .then((credential) => {
      const user = credential.user
      if (!!user) {
        signUserIn()
        syncUserDetails(user)
      }
    })
    .catch((error) => generateErrorNotification(error.code))
}
/*




*/
export async function syncUserDetails(user: User) {
  const isSystemBooted = store.getState().core.systemStatus === "isBooted"
  const uuid = user.uid
  const email = user.email as string

  if (!isSystemBooted) {
    getUserFromDB()
      .then((dbUser) =>
        !!dbUser ? updateUser(dbUser) : createNewUser({ uuid, email }),
      )
      .then(() => setSystemIsBooting())
      .catch((error) => setSystemNotBooted())
  }
}
/*




*/
export async function signOut() {
  return signOutOnAuth(auth)
    .then(() => signUserOut())
    .then(() => resetSystem())
    .catch((error) => generateErrorNotification(error.code))
}
/*




*/
const url = import.meta.env.VITE_EMAIL_VERIFICATION_REDIRECT_URL
export const codeSettings = { url }
export async function changeEmail(
  newEmail: string,
  oldEmail: string,
  password: string,
) {
  const authUser = auth.currentUser
  if (!!authUser && newEmail !== oldEmail) {
    updateUserEmailChangeStatus("isPending")
    reauthenticate(authUser, password)
      .then(() => updateUserEmail(newEmail))
      .then(() => updateEmailOnAuth(authUser, newEmail))
      .then(() => {
        _.delay(() => {
          updateUserEmailChangeStatus("isSuccess")
          generateCustomNotification("success", "Your email has been changed.")
        }, 1000)
        sendEmailVerification(authUser, codeSettings)
        resetEmailChangeStatus()
      })
      .catch((error) => {
        updateUserEmail(oldEmail)
        updateUserEmailChangeStatus("isFailed")
        generateErrorNotification(error.code)
        resetEmailChangeStatus()
      })
  }
}
/*




*/
export async function sendEmailVerification(
  user: User,
  settings: ActionCodeSettings,
) {
  sendAuthEmailVerification(user, codeSettings).catch((error) =>
    generateErrorNotification(error.code),
  )
}
/*




*/
export async function register(email: string, password: string) {
  return createUserOnAuth(auth, email, password)
    .then((credential) => {
      if (!!credential.user)
        sendEmailVerification(credential.user, codeSettings)
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
