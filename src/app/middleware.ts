import { createListenerMiddleware } from "@reduxjs/toolkit"
import { User, signOut as signOutAuth } from "firebase/auth"
import { resetSystem, setSystemStatus } from "../features/core/coreSlice"
import {
  generateErrorNotification,
  generateNotification,
} from "../features/core/notifications"
import {
  deleteCount,
  deleteCountMember,
  deleteCountResultsItem,
  setCount,
  setCountChecks,
  setCountComments,
  setCountMember,
  setCountMembers,
  setCountMetaData,
  setCountResultsItem,
  setCountStep,
} from "../features/count/countSlice"
import {
  deleteCountMemberOnDB,
  deleteCountOnDB,
  deleteCountResultsItemOnDB,
  setCountChecksOnDB,
  setCountCommentsOnDB,
  setCountMemberOnDB,
  setCountMembersOnDB,
  setCountMetaDataOnDB,
  setCountResultsItemOnDB,
} from "../features/count/countSliceRemote"
import { updateUserCountMember } from "../features/count/countUtils"
import {
  createOrgInviteOnDB,
  deleteAllOrgInvitesOnDB,
  deleteCountCheckOnDB,
  deleteOrgInviteOnDB,
  deleteOrgMemberOnDB,
  deleteOrgOnDB,
  getOrgFromDB,
  getOrgUuidWithInviteKeyFromDB,
  setCountCheckOnDB,
  setNewOrgOnDB,
  setOrgMemberOnDB,
  setOrgNameOnDB,
} from "../features/organisation/organisationRemote"
import {
  OrgProps,
  createInvite,
  createOrg,
  deleteCountCheck,
  deleteInvite,
  deleteOrg,
  deleteOrgMember,
  joinOrg,
  leaveOrg,
  setCountCheck,
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
  deleteStock,
  deleteStockItem,
  setStock,
  setStockItem,
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
    store.dispatch(setCount({}))
    // TODO: History
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
  actionCreator: setCountCheck,
  effect: async (action) => {
    const id = action.payload.id
    const check = action.payload.check
    setCountCheckOnDB(check, id)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setCountChecks,
  effect: async (action) => {
    const checks = action.payload.checks
    const updateDB = action.payload.updateDB
    if (updateDB) setCountChecksOnDB(checks)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: deleteCountCheck,
  effect: async (action) => {
    const id = action.payload
    deleteCountCheckOnDB(id)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setStockItem,
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
    const stockList = action.payload
    setStockOnDB(stockList)
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
listenerMiddleware.startListening({
  actionCreator: setCountStep,
  effect: async (action) => {
    const updateMember = action.payload.updateMember
    const step = action.payload.step
    if (updateMember) {
      updateUserCountMember({ step })
    }
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setCountMember,
  effect: async (action) => {
    const orgUuid = store.getState().organisation.org.uuid
    const members = store.getState().count.count.members
    const updateDB = action.payload.updateDB
    const member = action.payload.member
    if (!!orgUuid && !!members && !!updateDB) {
      setCountMemberOnDB(member)
    }
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: deleteCountMember,
  effect: async (action) => {
    const memberUuid = action.payload
    deleteCountMemberOnDB(memberUuid)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setCountResultsItem,
  effect: async (action) => {
    const payload = action.payload
    setCountResultsItemOnDB(payload)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: deleteCountResultsItem,
  effect: async (action) => {
    const payload = action.payload
    deleteCountResultsItemOnDB(payload)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setCountMembers,
  effect: async (action) => {
    const updateDB = action.payload.updateDB
    const members = action.payload.members
    if (updateDB) setCountMembersOnDB(members)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setCountMetaData,
  effect: async (action) => {
    const updateDB = action.payload.updateDB
    const metadata = action.payload.metadata
    if (updateDB) setCountMetaDataOnDB(metadata)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setCountComments,
  effect: async (action) => {
    const comments = action.payload.comments
    const updateDB = action.payload.updateDB
    if (updateDB) setCountCommentsOnDB(comments)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: deleteCount,
  effect: async (action) => {
    const orgUuid = store.getState().organisation.org.uuid
    if (!!orgUuid) deleteCountOnDB(orgUuid)
  },
})
/*





*/
