import {
  User,
  deleteUser as deleteUserOnAuth,
  signInWithEmailAndPassword,
  signOut as signOutAuth,
  updateEmail,
} from "firebase/auth"
import { store } from "../../app/store"
import { auth } from "../../remote"
import { generateErrorNotification } from "../core/coreUtils"
import { reauthenticateUser } from "./userRemote"
import {
  PasswordChangeStatuses,
  UserOrgRoles,
  UserProps,
  deleteUser,
  deleteUserOrgDetails,
  setIsSignedIn,
  setPasswordChangeStatus,
  setUser,
  setUserEmail,
  setUserName,
  setUserOrgDetails,
} from "./userSlice"
/*




*/
export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      if (!!userCredential.user) {
        store.dispatch(setIsSignedIn(true))
      }
    })
    .catch((error) => {
      generateErrorNotification(error.code)
    })
}
/*




*/
export async function signOut() {
  return signOutAuth(auth)
    .then(() => {
      store.dispatch(setIsSignedIn(false))
    })
    .catch((error) => console.log(error))
}
/*




*/
export async function updateUserEmail(email: string, oldEmail: string) {
  const authUser = auth.currentUser
  if (!!authUser && email !== oldEmail) {
    updateEmail(authUser, email)
      .then(() => store.dispatch(setUserEmail({ email })))
      .catch((error) => {
        generateErrorNotification(error.code)
        console.log(error)
      })
  }
}
/*




*/
export function updateUserName(first: string, last: string) {
  store.dispatch(setUserName({ first, last }))
}
/*




*/
export function updateUserOrgDetails(uuid: string, role: UserOrgRoles) {
  store.dispatch(setUserOrgDetails({ uuid, role }))
}
/*




*/
export function removeUserOrgDetails() {
  store.dispatch(deleteUserOrgDetails())
}
/*




*/
export function updatePasswordChangeStatus(status: PasswordChangeStatuses) {
  store.dispatch(setPasswordChangeStatus(status))
}
/*




*/
export function createNewUser(user: UserProps) {
  store.dispatch(setUser({ user, updateDB: true }))
}
/*




*/
export function updateUser(user: UserProps) {
  store.dispatch(setUser({ user, updateDB: false }))
}
/*




*/
export function resetUser() {
  store.dispatch(setUser({ user: {}, updateDB: false }))
}
/*




*/
export function removeUser(password: string) {
  const user = auth.currentUser as User
  const uuid = user.uid
  if (!!uuid) {
    reauthenticateUser(user, password)
      .then(() => signOut())
      .then(() => deleteUserOnAuth(user))
      .then(() => store.dispatch(deleteUser({ uuid, password })))
      // TODO: If only admin then delete org
      // TODO: If not only admin then delete orgMember
      .catch((error) => generateErrorNotification(error.code))
  }
}
/*




*/
