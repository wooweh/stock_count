import { createListenerMiddleware } from "@reduxjs/toolkit"
import { signOut as signOutAuth } from "firebase/auth"
import { resetSystem } from "../features/core/coreSlice"
import { generateNotification } from "../features/core/notifications"
import {
  createOrgInviteOnDB,
  deleteAllOrgInvitesOnDB,
  deleteOrgInviteOnDB,
  deleteOrgMemberOnDB,
  deleteOrgOnDB,
  getOrgFromDB,
  getOrgUuidWithInviteKeyFromDB,
  setNewOrgMemberOnDB,
  setNewOrgOnDB,
  setOrgMemberNameOnDB,
  setOrgMemberRoleOnDB,
  setOrgMemberSurnameOnDB,
  setOrgNameOnDB,
} from "../features/organisation/organisationRemote"
import {
  OrgProps,
  createInvite,
  createOrg,
  deleteInvite,
  deleteOrg,
  deleteOrgMember,
  joinOrg,
  leaveOrg,
  setMemberStatus,
  setOrg,
  setOrgMemberName,
  setOrgMemberRole,
  setOrgMemberSurname,
  setOrgName,
} from "../features/organisation/organisationSlice"
import {
  deleteStockItemOnDB,
  deleteStockOnDB,
  setStockItemOnDB,
  setStockOnDB,
} from "../features/stock/stockRemote"
import {
  addStockBatch,
  addStockItem,
  deleteStock,
  deleteStockItem,
  editStockItem,
  setStock,
} from "../features/stock/stockSlice"
import {
  deleteUserOnAuth,
  deleteUserOnDB,
  deleteUserOrgDetailsOnDB,
  setUserEmailOnAuth,
  setUserEmailOnDB,
  setUserNameOnDB,
  setUserOrgRoleOnDB,
  setUserOrgUuidOnDB,
  setUserSurnameOnDB,
} from "../features/user/userRemote"
import {
  deleteUser,
  deleteUserOrgDetails,
  setUser,
  setUserEmail,
  setUserName,
  setUserOrgRole,
  setUserOrgUuid,
  setUserSurname,
  signIn,
  signOut,
} from "../features/user/userSlice"
import { auth } from "../remote"
import { syncUserDetails } from "./helpers"
import { store } from "./store"
/*





*/
export const listenerMiddleware = createListenerMiddleware()
listenerMiddleware.startListening({
  actionCreator: resetSystem,
  effect: async () => {
    console.log("Reset user in userSlice")
    console.log("Reset org in orgSlice")
    console.log("Reset stock in stockSlice")
    store.dispatch(setMemberStatus("notJoined"))
    store.dispatch(setUser({}))
    store.dispatch(setOrg({}))
    store.dispatch(setStock({}))
    // TODO: Stock
    // TODO: History
    // TODO: Count
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: signIn,
  effect: async () => {
    syncUserDetails()
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: signOut,
  effect: async () => {
    signOutAuth(auth).then(() => store.dispatch(resetSystem()))
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setUserEmail,
  effect: async (action) => {
    const email = action.payload
    setUserEmailOnDB(email)
    setUserEmailOnAuth(email)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setUserName,
  effect: async (action) => {
    const name = action.payload
    setUserNameOnDB(name)

    const orgUuid = store.getState().organisation.org.uuid
    const userUuid = store.getState().user.user.uuid
    if (!!orgUuid && !!userUuid)
      store.dispatch(setOrgMemberName({ uuid: userUuid, name: name }))
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setUserSurname,
  effect: async (action) => {
    const surname = action.payload
    setUserSurnameOnDB(surname)

    const orgUuid = store.getState().organisation.org.uuid
    const userUuid = store.getState().user.user.uuid
    if (!!orgUuid && !!userUuid)
      store.dispatch(setOrgMemberSurname({ uuid: userUuid, surname: surname }))
  },
})
/*
  
  
  
  
  
  
  
  
  */
listenerMiddleware.startListening({
  actionCreator: setUserOrgUuid,
  effect: async (action) => {
    const orgUuid = action.payload
    setUserOrgUuidOnDB(orgUuid)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setUserOrgRole,
  effect: async (action) => {
    const userUuid = auth.currentUser?.uid
    const orgRole = action.payload
    if (!!userUuid) setUserOrgRoleOnDB(userUuid, orgRole)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: deleteUserOrgDetails,
  effect: async () => {
    const userUuid = auth.currentUser?.uid
    if (!!userUuid) deleteUserOrgDetailsOnDB(userUuid)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: deleteUser,
  effect: async () => {
    const userUuid = auth.currentUser?.uid
    const orgUuid = store.getState().organisation.org.uuid
    if (!!userUuid) {
      deleteUserOnDB()
        .then(() => deleteUserOnAuth())
        .catch((error) => console.log(error))
      if (!!orgUuid) deleteOrgMemberOnDB(orgUuid, userUuid)
    }
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: createOrg,
  effect: async (action) => {
    const org = action.payload

    const orgUuid = action.payload.uuid
    if (!!orgUuid) {
      store.dispatch(setUserOrgUuid(orgUuid))
      store.dispatch(setUserOrgRole("admin"))
      store.dispatch(setMemberStatus("isJoined"))
      setNewOrgOnDB(org)
    }
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: joinOrg,
  effect: async (action) => {
    const inviteKey = action.payload
    getOrgUuidWithInviteKeyFromDB(inviteKey)
      .then((orgUuid: string) => {
        deleteOrgInviteOnDB(orgUuid, inviteKey)
        setNewOrgMemberOnDB(orgUuid)
        store.dispatch(setUserOrgUuid(orgUuid))
        store.dispatch(setUserOrgRole("member"))
        return getOrgFromDB(orgUuid)
      })
      .then((org: OrgProps) => {
        store.dispatch(setOrg(org))
      })
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setOrgName,
  effect: async (action) => {
    const name = action.payload
    setOrgNameOnDB(name)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: leaveOrg,
  effect: async (action) => {
    const userUuid = auth.currentUser?.uid
    const orgUuid = action.payload
    if (!!userUuid) {
      store.dispatch(deleteUserOrgDetails())
      deleteOrgMemberOnDB(orgUuid, userUuid)
        .then(() => store.dispatch(setStock({})))
        .then(() => generateNotification("leaveOrg"))
        .catch((error) => console.log(error))
    }
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: deleteOrg,
  effect: async (action) => {
    const invites: any = action.payload.invites
    const orgUuid = action.payload.uuid
    if (!!orgUuid) {
      store.dispatch(deleteUserOrgDetails())
      deleteAllOrgInvitesOnDB(invites)
        .then(() => deleteOrgOnDB(orgUuid))
        .then(() => deleteStockOnDB(orgUuid))
        .then(() => store.dispatch(setStock({})))
        .then(() => generateNotification("deleteOrg"))
        .catch((error) => console.log(error))
    }
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: createInvite,
  effect: async (action) => {
    const inviteKey = action.payload.inviteKey
    const tempName = action.payload.tempName
    createOrgInviteOnDB(inviteKey, tempName)
      .then(() => generateNotification("createInvite"))
      .catch((error) => console.log(error))
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: deleteInvite,
  effect: async (action) => {
    const orgUuid = store.getState().organisation.org.uuid
    const inviteKey = action.payload
    if (!!orgUuid)
      deleteOrgInviteOnDB(orgUuid, inviteKey)
        .then(() => generateNotification("deleteInvite"))
        .catch((error) => console.log(error))
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setOrgMemberName,
  effect: async (action) => {
    const name = action.payload.name
    setOrgMemberNameOnDB(name)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setOrgMemberSurname,
  effect: async (action) => {
    const surname = action.payload.surname
    setOrgMemberSurnameOnDB(surname)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setOrgMemberRole,
  effect: async (action) => {
    const role = action.payload.role
    const memberUuid = action.payload.uuid
    if (!!memberUuid) {
      setOrgMemberRoleOnDB(memberUuid, role)
        .then(() => setUserOrgRoleOnDB(memberUuid, role))
        .catch((error) => console.log(error))
    }
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: deleteOrgMember,
  effect: async (action) => {
    const memberUuid = action.payload
    const orgUuid = store.getState().organisation.org.uuid
    if (!!memberUuid && !!orgUuid) {
      deleteUserOrgDetailsOnDB(memberUuid)
        .then(() => deleteOrgMemberOnDB(orgUuid, memberUuid))
        .then(() => generateNotification("deleteOrgMember"))
        .catch((error) => console.log(error))
    }
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: addStockItem,
  effect: async (action) => {
    const stockId = action.payload.id
    const stockItem = action.payload
    setStockItemOnDB(stockId, stockItem)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: addStockBatch,
  effect: async (action) => {
    const stock = action.payload
    setStockOnDB(stock)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: editStockItem,
  effect: async (action) => {
    const stockId = action.payload.id
    const stockItem = action.payload
    setStockItemOnDB(stockId, stockItem)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: deleteStockItem,
  effect: async (action) => {
    const stockId = action.payload
    deleteStockItemOnDB(stockId)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: deleteStock,
  effect: async () => {
    const orgUuid = store.getState().organisation.org.uuid
    if (!!orgUuid) deleteStockOnDB(orgUuid)
  },
})
/*





*/
