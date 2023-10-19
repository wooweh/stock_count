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
  deleteCountCheckOnDB,
  deleteOrgInviteOnDB,
  deleteOrgInvitesOnDB,
  deleteOrgMemberOnDB,
  deleteOrgOnDB,
  setCountCheckOnDB,
  setOrgMemberOnDB,
  setOrgNameOnDB,
  setOrgOnDB,
} from "../features/organisation/organisationRemote"
import {
  deleteCountCheck,
  deleteInvite,
  deleteInvites,
  deleteOrg,
  deleteOrgMember,
  setCountCheck,
  setInvite,
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
  actionCreator: setOrg,
  effect: async (action) => {
    const org = action.payload.org
    const updateDB = action.payload.updateDB
    if (updateDB) setOrgOnDB(org)
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
  actionCreator: deleteOrg,
  effect: async (action) => {
    const orgUuid = action.payload.uuid
    deleteOrgOnDB(orgUuid)
      .then(() => generateNotification("deleteOrg"))
      .catch((error) => console.log(error))
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setInvite,
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
  actionCreator: deleteInvites,
  effect: async () => {
    const orgUuid = store.getState().organisation.org.uuid
    const invites = store.getState().organisation.org.invites
    if (!!orgUuid && !!invites) {
      deleteOrgInvitesOnDB(invites)
    }
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: setOrgMember,
  effect: async (action) => {
    const orgUuid = action.payload.orgUuid
    const orgMember = action.payload.member
    setOrgMemberOnDB(orgUuid, orgMember)
  },
})
/*





*/
listenerMiddleware.startListening({
  actionCreator: deleteOrgMember,
  effect: async (action) => {
    const userUuid = store.getState().user.user.uuid
    const memberUuid = action.payload.memberUuid
    const orgUuid = action.payload.orgUuid
    const isLeaving = userUuid === memberUuid
    deleteOrgMemberOnDB(orgUuid, memberUuid)
      .then(() => {
        if (isLeaving) {
          generateNotification("leaveOrg")
        } else {
          generateNotification("deleteOrgMember")
        }
      })
      .catch((error) => console.log(error))
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
  effect: async () => {
    deleteHistoryOnDB()
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
