import { child, get, ref, remove, set } from "firebase/database"
import { store } from "../../app/store"
import { auth, dbReal } from "../../remote"
import { getDBPath } from "../../remote/dbPaths"
import { UserNameProps, UserOrgProps, UserProps } from "./userSlice"
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
export async function setUserOnDB(user: UserProps) {
  const uuid = user.uuid
  if (!!uuid) {
    set(ref(dbReal, getDBPath.user(uuid).user), user).catch((error) => {
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
