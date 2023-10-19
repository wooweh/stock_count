import { User, deleteUser as deleteUserOnAuth } from "firebase/auth"
import { store } from "../../app/store"
import { auth } from "../../remote"
import { generateErrorNotification } from "../core/coreUtils"
import { setOrgMember } from "../organisation/organisationSlice"
import { reauthenticate, signOut } from "./userAuth"
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
export async function signUserIn() {
  store.dispatch(setIsSignedIn(true))
}
/*




*/
export async function signUserOut() {
  store.dispatch(setIsSignedIn(false))
}
/*




*/
export async function updateUserEmail(email: string) {
  store.dispatch(setUserEmail({ email }))
}
/*




*/
export function updateUserName(first: string, last: string) {
  const orgUuid = store.getState().user.user.org?.uuid
  const orgRole = store.getState().user.user.org?.role
  const userUuid = store.getState().user.user.uuid
  store.dispatch(setUserName({ first, last }))

  if (!!orgUuid && !!orgRole && !!userUuid) {
    const member = {
      uuid: userUuid,
      firstName: first,
      lastName: last,
      role: orgRole,
    }
    store.dispatch(setOrgMember({ orgUuid, member }))
  }
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
export function resetPasswordChangeStatus() {
  setTimeout(() => updateUserPasswordChangeStatus("notChanged"), 250)
}
/*




*/
export function updateUserPasswordChangeStatus(status: PasswordChangeStatuses) {
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
    reauthenticate(user, password)
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