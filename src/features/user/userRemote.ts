import {
  EmailAuthProvider,
  User,
  createUserWithEmailAndPassword,
  deleteUser as deleteUserOnAuth,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
} from "firebase/auth"
import { child, get, ref, remove, set } from "firebase/database"
import { store } from "../../app/store"
import { auth, dbReal } from "../../remote"
import { getDBPath } from "../../remote/dbPaths"
import {
  generateErrorNotification,
  generateNotification,
} from "../core/coreUtils"
import { UserNameProps, UserOrgProps, UserProps } from "./userSlice"
/*





*/
const actionCodeSettings = {
  url: "http://localhost:5173/sign_in",
  handleCodeInApp: false,
}
export function resetUserPassword(email: string) {
  sendPasswordResetEmail(auth, email, actionCodeSettings)
    .then(() => {
      generateNotification("passwordReset")
    })
    .catch((error) => {
      generateErrorNotification(error.code)
    })
}
/*





*/
export async function reauthenticateUser(user: User, password: string) {
  const email = user.email as string
  const credentials = EmailAuthProvider.credential(email, password)
  return reauthenticateWithCredential(user, credentials)
}
/*





*/
export async function registerUserOnAuth(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((credential) => {
      if (!!credential.user) {
        console.log("email sent")
        sendEmailVerification(credential.user, actionCodeSettings)
      }
    })
    .catch((error) => {
      generateErrorNotification(error.code)
      console.log(error)
    })
}
/*





*/
export async function getUserFromDB() {
  const authUser = auth.currentUser
  const userUuid = authUser?.uid as string
  return get(child(ref(dbReal), getDBPath.user(userUuid).user))
    .then((snapshot) => {
      const user = snapshot.val()
      return user
    })
    .catch((error) => {
      console.error(error)
    })
}
/*





*/
export async function setNewUserOnDB() {
  const userUuid = auth.currentUser?.uid
  const userEmail = auth.currentUser?.email as string
  const user: UserProps = { uuid: userUuid, email: userEmail }

  if (!!userUuid) {
    set(ref(dbReal, getDBPath.user(userUuid).user), user).catch((error) => {
      console.log(error)
    })
  }
}
/*





*/
export async function setUserNameOnDB(name: UserNameProps) {
  const userUuid = store.getState().user.user.uuid
  if (!!userUuid) {
    set(ref(dbReal, getDBPath.user(userUuid).name), name).catch((error) => {
      console.log(error)
    })
  }
}
/*





*/
export async function setUserEmailOnDB(email: string) {
  const userUuid = store.getState().user.user.uuid
  if (!!userUuid) {
    set(ref(dbReal, getDBPath.user(userUuid).email), email).catch((error) => {
      console.log(error)
    })
  }
}
/*





*/
export async function setUserOrgDetailsOnDB(details: UserOrgProps) {
  const userUuid = store.getState().user.user.uuid
  if (!!userUuid) {
    set(ref(dbReal, getDBPath.user(userUuid).org), details).catch((error) => {
      console.log(error)
    })
  }
}
/*





*/
export async function deleteUserOrgDetailsOnDB(uuid: string) {
  remove(ref(dbReal, getDBPath.user(uuid).org)).catch((error) =>
    console.log(error),
  )
}
/*





*/
export async function deleteUserOnDB(uuid: string) {
  remove(ref(dbReal, getDBPath.user(uuid).user)).catch((error) =>
    console.log(error),
  )
}
/*





*/
