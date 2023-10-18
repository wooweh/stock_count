import { bootSystem, setSystemStatus } from "../features/core/coreSlice"
import { setUser } from "../features/user/userSlice"
import { auth } from "../remote"
import { getUserFromDB, setNewUserOnDB } from "../features/user/userRemote"
import { store } from "./store"
import {
  setSystemIsBooting,
  setSystemNotBooted,
} from "../features/core/coreSliceUtils"
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
          store.dispatch(setUser({ ...dbUser }))
        } else {
          console.log("Setting new user in userSlice and db")
          store.dispatch(setUser({ ...newUser }))
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
