import {
  EmailAuthProvider,
  User,
  createUserWithEmailAndPassword,
  deleteUser,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
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
} from "../core/notifications"
import { UserOrgRoles, UserProps, signIn } from "./userSlice"
/*







*/
export async function setUserEmailOnAuth(email: string) {
  const authUser = auth.currentUser
  if (!!authUser) {
    updateEmail(authUser, email).catch((error) => {
      console.log(error)
    })
  }
}
/*





*/
export async function deleteUserOnAuth() {
  const authUser = auth.currentUser
  console.log(authUser)
  if (!!authUser) {
    deleteUser(authUser).catch((error) => {
      console.log(error)
    })
  }
}
/*





*/
export async function updateUserPassword(user: User, newPassword: string) {
  return updatePassword(user, newPassword)
}
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
export async function signInUserOnAuth(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      if (!!userCredential.user) {
        store.dispatch(signIn())
      }
    })
    .catch((error) => {
      generateErrorNotification(error.code)
      console.log(error.code)
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
export async function setUserFullNameOnDB(name: string, surname: string) {
  const userUuid = store.getState().user.user.uuid
  if (!!userUuid) {
    set(ref(dbReal, getDBPath.user(userUuid).name), name).catch((error) => {
      console.log(error)
    })
    set(ref(dbReal, getDBPath.user(userUuid).surname), surname).catch(
      (error) => {
        console.log(error)
      },
    )
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
export async function setUserOrgDetailsOnDB(
  orgUuid: string,
  orgRole: UserOrgRoles,
) {
  const userUuid = store.getState().user.user.uuid
  if (!!userUuid) {
    set(ref(dbReal, getDBPath.user(userUuid).orgUuid), orgUuid).catch(
      (error) => {
        console.log(error)
      },
    )
    set(ref(dbReal, getDBPath.user(userUuid).orgRole), orgRole).catch(
      (error) => {
        console.log(error)
      },
    )
  }
}
/*





*/
export async function deleteUserOrgDetailsOnDB(userUuid: string) {
  remove(ref(dbReal, getDBPath.user(userUuid).orgRole)).catch((error) =>
    console.log(error),
  )
  remove(ref(dbReal, getDBPath.user(userUuid).orgUuid)).catch((error) =>
    console.log(error),
  )
}
/*





*/
export async function deleteUserOnDB() {
  const userUuid = auth.currentUser?.uid
  if (!!userUuid) {
    remove(ref(dbReal, getDBPath.user(userUuid).user)).catch((error) =>
      console.log(error),
    )
  }
}
/*





*/
