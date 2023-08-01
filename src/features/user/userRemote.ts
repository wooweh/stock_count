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
import { auth, dbReal } from "../../remote"
import { store } from "../../app/store"
import { UserOrgRoles, UserProps, signIn } from "./userSlice"
import { getDBPath } from "../../remote/dbPaths"
import {
  generateErrorNotification,
  generateNotification,
} from "../core/notifications"
import { routePaths } from "../core/core"
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
export function resetUserPassword(email: string) {
  const actionCodeSettings = {
    url: "http://localhost:5173/sign_in",
    handleCodeInApp: false,
  }
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
export function registerUserOnAuth(
  email: string,
  password: string,
  dispatch: any,
  navigate: any,
) {
  const actionCodeSettings = {
    url: "http://localhost:5173/signing_in",
    handleCodeInApp: false,
  }
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const signedIn = store.getState().user.isLoggedIn
      if (!!userCredential.user && !signedIn) {
        sendEmailVerification(userCredential.user, actionCodeSettings)
      }
    })
    .catch((error) => {
      navigate(routePaths.signIn)
      generateErrorNotification(error.code)
      console.log(error)
    })
}
/*





*/
export async function signInUserOnAuth(
  email: string,
  password: string,
  dispatch: any,
  navigate: any,
) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const signedIn = store.getState().user.isLoggedIn
      if (!!userCredential.user && !signedIn) {
        dispatch(signIn())
      }
    })
    .catch((error) => {
      navigate(routePaths.signIn)
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
export async function setUserNameOnDB(name: string) {
  const userUuid = store.getState().user.user.uuid
  if (!!userUuid) {
    set(ref(dbReal, getDBPath.user(userUuid).name), name).catch((error) => {
      console.log(error)
    })
  }
}
/*





*/
export async function setUserSurnameOnDB(surname: string) {
  const userUuid = store.getState().user.user.uuid
  if (!!userUuid) {
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
export async function setUserOrgUuidOnDB(uuid: string | undefined) {
  const userUuid = store.getState().user.user.uuid
  if (!!userUuid) {
    set(ref(dbReal, getDBPath.user(userUuid).orgUuid), uuid).catch((error) => {
      console.log(error)
    })
  }
}
/*





*/
export async function setUserOrgRoleOnDB(userUuid: string, role: UserOrgRoles) {
  if (!!userUuid) {
    set(ref(dbReal, getDBPath.user(userUuid).orgRole), role).catch((error) => {
      console.log(error)
    })
  }
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
