import { createListenerMiddleware } from "@reduxjs/toolkit"
import { User, signOut as signOutAuth } from "firebase/auth"
import { resetSystem, setSystemStatus } from "../features/core/coreSlice"
import {
  generateErrorNotification,
  generateNotification,
} from "../features/core/notifications"
import {
  createOrgInviteOnDB,
  deleteAllOrgInvitesOnDB,
  deleteOrgInviteOnDB,
  deleteOrgMemberOnDB,
  deleteOrgOnDB,
  getOrgFromDB,
  getOrgUuidWithInviteKeyFromDB,
  setOrgMemberOnDB,
  setNewOrgOnDB,
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
  setOrgMember,
  setOrgName,
} from "../features/organisation/organisationSlice"
import {
  deleteStockItemOnDB,
  deleteStockOnDB,
  setStockItemOnDB,
  setStockOnDB,
} from "../features/stock/stockRemote"
import {
  addStockList,
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
  reauthenticateUser,
  setUserEmailOnAuth,
  setUserEmailOnDB,
  setUserFullNameOnDB,
  setUserOrgDetailsOnDB,
  updateUserPassword,
} from "../features/user/userRemote"
import {
  changeUserPassword,
  deleteUser,
  deleteUserOrgDetails,
  setPasswordChangeStatus,
  setUser,
  setUserEmail,
  setUserFullName,
  setUserOrgDetails,
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
    store.dispatch(setSystemStatus("notBooted"))
    store.dispatch(setMemberStatus("notJoined"))
    store.dispatch(setUser({}))
    store.dispatch(setOrg({}))
    store.dispatch(setStock({}))
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
  actionCreator: setUserFullName,
  effect: async (action) => {
    const name = action.payload.name
    const surname = action.payload.surname
    setUserFullNameOnDB(name, surname)

    const orgUuid = store.getState().user.user.orgUuid
    const orgRole = store.getState().user.user.orgRole
    const userUuid = store.getState().user.user.uuid
    if (!!orgUuid && !!orgRole && !!userUuid)
      store.dispatch(
        setOrgMember({
          uuid: userUuid,
          name: name,
          surname: surname,
          role: orgRole,
        }),
      )
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setUserOrgDetails,
  effect: async (action) => {
    const orgUuid = action.payload.orgUuid
    const orgRole = action.payload.orgRole
    const updateDB = action.payload.updateDB
    if (updateDB) setUserOrgDetailsOnDB(orgUuid, orgRole)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: deleteUserOrgDetails,
  effect: async (action) => {
    const userUuid = auth.currentUser?.uid
    const updateDB = action.payload.updateDB
    if (!!userUuid && updateDB) deleteUserOrgDetailsOnDB(userUuid)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: changeUserPassword,
  effect: async (action) => {
    const password = action.payload.password
    const newPassword = action.payload.newPassword
    const user = auth.currentUser as User
    reauthenticateUser(user, password)
      .then(() => updateUserPassword(user, newPassword))
      .then(() => {
        store.dispatch(setPasswordChangeStatus("isSuccess"))
        generateNotification("passwordChange")
      })
      .catch((error) => {
        console.log(error)
        store.dispatch(setPasswordChangeStatus("isFailed"))
        generateErrorNotification(error.code)
      })
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: deleteUser,
  effect: async (action) => {
    const user = auth.currentUser as User
    const password = action.payload
    const userUuid = user.uid
    const orgUuid = store.getState().organisation.org.uuid
    if (!!userUuid) {
      reauthenticateUser(user, password)
        .then(() => store.dispatch(signOut()))
        .then(() => {
          deleteUserOnDB()
          deleteUserOnAuth()
          if (!!orgUuid) deleteOrgMemberOnDB(orgUuid, userUuid)
        })
        .catch((error) => generateErrorNotification(error.code))
      // TODO: If only admin then delete org
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
      store.dispatch(
        setUserOrgDetails({
          orgUuid: orgUuid,
          orgRole: "admin",
          updateDB: true,
        }),
      )
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
    const uuid = store.getState().user.user.uuid as string
    const name = store.getState().user.user.name as string
    const surname = store.getState().user.user.surname as string
    getOrgUuidWithInviteKeyFromDB(inviteKey)
      .then((orgUuid: string) => {
        deleteOrgInviteOnDB(orgUuid, inviteKey)
        setOrgMemberOnDB(orgUuid, {
          uuid: uuid,
          name: name,
          surname: surname,
          role: "member",
        })
        store.dispatch(
          setUserOrgDetails({
            orgUuid: orgUuid,
            orgRole: "member",
            updateDB: true,
          }),
        )
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
      store.dispatch(deleteUserOrgDetails({ updateDB: true }))
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
      store.dispatch(deleteUserOrgDetails({ updateDB: true }))
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
  actionCreator: setOrgMember,
  effect: async (action) => {
    const orgUuid = store.getState().organisation.org.uuid
    const orgMember = action.payload
    if (!!orgUuid) setOrgMemberOnDB(orgUuid, orgMember)
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
      deleteOrgMemberOnDB(orgUuid, memberUuid)
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
  actionCreator: addStockList,
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
