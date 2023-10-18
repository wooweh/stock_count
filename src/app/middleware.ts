import { createListenerMiddleware } from "@reduxjs/toolkit"
import { resetSystem } from "../features/core/coreSliceUtils"
import { generateNotification } from "../features/core/coreUtils"
import {
  deleteCount,
  deleteCountMember,
  deleteCountResultsItem,
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
  deleteHistory,
  deleteHistoryItem,
  setHistoryItem,
} from "../features/history/historySlice"
import {
  deleteHistoryItemOnDB,
  deleteHistoryOnDB,
  setHistoryItemOnDB,
} from "../features/history/historySliceRemote"
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
  MemberProps,
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
  deleteStock,
  deleteStockItem,
  setStock,
  setStockItem,
} from "../features/stock/stockSlice"
import {
  deleteUserOnDB,
  deleteUserOrgDetailsOnDB,
  setNewUserOnDB,
  setUserEmailOnDB,
  setUserNameOnDB,
  setUserOrgDetailsOnDB,
} from "../features/user/userRemote"
import {
  deleteUser,
  deleteUserOrgDetails,
  setIsSignedIn,
  setUser,
  setUserEmail,
  setUserName,
  setUserOrgDetails,
} from "../features/user/userSlice"
import {
  removeUserOrgDetails,
  updateUserOrgDetails,
} from "../features/user/userSliceUtils"
import { auth } from "../remote"
import { syncUserDetails } from "./helpers"
import { store } from "./store"
/*





*/
export const listenerMiddleware = createListenerMiddleware()
listenerMiddleware.startListening({
  actionCreator: setIsSignedIn,
  effect: async (action) => {
    if (action.payload) {
      syncUserDetails()
    } else {
      resetSystem()
    }
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setUserEmail,
  effect: async (action) => {
    const email = action.payload.email
    setUserEmailOnDB(email)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setUserName,
  effect: async (action) => {
    const name = action.payload
    setUserNameOnDB(name)

    const orgUuid = store.getState().user.user.org?.uuid
    const orgRole = store.getState().user.user.org?.role
    const userUuid = store.getState().user.user.uuid
    if (!!orgUuid && !!orgRole && !!userUuid)
      store.dispatch(
        setOrgMember({
          uuid: userUuid,
          name: name.first,
          surname: name.last,
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
    const details = action.payload
    setUserOrgDetailsOnDB(details)
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
  actionCreator: setUser,
  effect: async (action) => {
    const updateDB = action.payload.updateDB
    if (updateDB) setNewUserOnDB()
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: deleteUser,
  effect: async (action) => {
    const uuid = action.payload.uuid
    deleteUserOnDB(uuid)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: createOrg,
  effect: async (action) => {
    const org = action.payload
    const uuid = action.payload.uuid
    const role = "admin"
    if (!!uuid) {
      updateUserOrgDetails(uuid, role)
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
    const name = store.getState().user.user.name?.first as string
    const surname = store.getState().user.user.name?.last as string
    const role = "member"
    const member: MemberProps = { uuid, name, surname, role }
    getOrgUuidWithInviteKeyFromDB(inviteKey)
      .then((orgUuid: string) => {
        deleteOrgInviteOnDB(orgUuid, inviteKey)
        setOrgMemberOnDB(orgUuid, member)
        updateUserOrgDetails(orgUuid, role)
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
      removeUserOrgDetails()
      deleteOrgMemberOnDB(orgUuid, userUuid)
        .then(() => store.dispatch(setStock({ stock: {}, updateDB: false })))
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
      removeUserOrgDetails()
      deleteAllOrgInvitesOnDB(invites)
        .then(() => deleteOrgOnDB(orgUuid))
        .then(() => deleteStockOnDB(orgUuid))
        .then(() => store.dispatch(setStock({ stock: {}, updateDB: true })))
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
  actionCreator: setStock,
  effect: async (action) => {
    const stock = action.payload.stock
    const updateDB = action.payload.updateDB
    if (updateDB) setStockOnDB(stock)
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
listenerMiddleware.startListening({
  actionCreator: deleteHistory,
  effect: async (action) => {
    const updateDB = action.payload.updateDB
    if (updateDB) deleteHistoryOnDB()
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setHistoryItem,
  effect: async (action) => {
    const historyItem = action.payload
    setHistoryItemOnDB(historyItem)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: deleteHistoryItem,
  effect: async (action) => {
    const uuid = action.payload.uuid
    deleteHistoryItemOnDB(uuid)
  },
})
/*





*/
