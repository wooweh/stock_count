import { createListenerMiddleware } from "@reduxjs/toolkit"
import { auth } from "../../remote"
import {
  deleteUser,
  deleteUserOrgDetails,
  setUser,
  setUserEmail,
  setUserName,
  setUserOrgDetails,
} from "./userSlice"
import {
  deleteUserOnDB,
  deleteUserOrgDetailsOnDB,
  setUserEmailOnDB,
  setUserNameOnDB,
  setUserOnDB,
  setUserOrgDetailsOnDB,
} from "./userSliceRemote"
/*





*/
export const userListenerMiddleware = createListenerMiddleware()
/*





*/
userListenerMiddleware.startListening({
  actionCreator: setUserEmail,
  effect: async (action) => {
    const email = action.payload.email
    setUserEmailOnDB(email)
  },
})
/*





*/
userListenerMiddleware.startListening({
  actionCreator: setUserName,
  effect: async (action) => {
    const name = action.payload
    setUserNameOnDB(name)
  },
})
/*





*/
userListenerMiddleware.startListening({
  actionCreator: setUserOrgDetails,
  effect: async (action) => {
    const details = action.payload
    setUserOrgDetailsOnDB(details)
  },
})
/*





*/
userListenerMiddleware.startListening({
  actionCreator: deleteUserOrgDetails,
  effect: async () => {
    const userUuid = auth.currentUser?.uid
    if (!!userUuid) deleteUserOrgDetailsOnDB(userUuid)
  },
})
/*





*/
userListenerMiddleware.startListening({
  actionCreator: setUser,
  effect: async (action) => {
    const updateDB = action.payload.updateDB
    const user = action.payload.user
    if (updateDB) setUserOnDB(user)
  },
})
/*





*/
userListenerMiddleware.startListening({
  actionCreator: deleteUser,
  effect: async (action) => {
    const uuid = action.payload.uuid
    deleteUserOnDB(uuid)
  },
})
/*





*/
