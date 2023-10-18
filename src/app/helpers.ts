import {
  setSystemIsBooting,
  setSystemNotBooted,
} from "../features/core/coreSliceUtils"
import { getUserFromDB, setNewUserOnDB } from "../features/user/userRemote"
import { createNewUser, updateUser } from "../features/user/userSliceUtils"
import { auth } from "../remote"
import { store } from "./store"
/*







*/
export async function syncUserDetails() {
  const authUser = auth.currentUser
  const isSystemBooted = store.getState().core.systemStatus === "isBooted"

  if (!!authUser && !isSystemBooted) {
    const newUser = {
      uuid: authUser.uid,
      email: authUser.email as string,
    }

    getUserFromDB()
      .then((dbUser) => {
        if (!!dbUser) {
          console.log("Setting existing user in userSlice")
          updateUser(dbUser)
        } else {
          console.log("Setting new user in userSlice and db")
          createNewUser(newUser)
          setNewUserOnDB()
        }
      })
      .then(() => {
        setSystemIsBooting()
        console.log("System booting")
      })
      .catch((error) => {
        setSystemNotBooted()
        console.log("System booting stopped")
        console.error(error)
      })
  }
}
/*







*/
