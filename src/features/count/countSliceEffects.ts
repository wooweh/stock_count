import { createListenerMiddleware } from "@reduxjs/toolkit"
import { store } from "../../app/store"
import {
  deleteCount,
  deleteCountMember,
  deleteCountResultsItem,
  setCountComments,
  setCountMember,
  setCountMembers,
  setCountMetaData,
  setCountResultsItem,
  setCountStep,
} from "./countSlice"
import {
  deleteCountMemberOnDB,
  deleteCountOnDB,
  deleteCountResultsItemOnDB,
  setCountCommentsOnDB,
  setCountMemberOnDB,
  setCountMembersOnDB,
  setCountMetaDataOnDB,
  setCountResultsItemOnDB,
} from "./countSliceRemote"
import { updateUserCountMember } from "./countSliceUtils"
/*





*/
export const countListenerMiddleware = createListenerMiddleware()
/*





*/
countListenerMiddleware.startListening({
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
countListenerMiddleware.startListening({
  actionCreator: setCountMember,
  effect: async (action) => {
    const orgUuid = store.getState().org.org.uuid
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
countListenerMiddleware.startListening({
  actionCreator: deleteCountMember,
  effect: async (action) => {
    const memberUuid = action.payload.uuid
    deleteCountMemberOnDB(memberUuid)
  },
})
/*





*/
countListenerMiddleware.startListening({
  actionCreator: setCountResultsItem,
  effect: async (action) => {
    const payload = action.payload
    setCountResultsItemOnDB(payload)
  },
})
/*





*/
countListenerMiddleware.startListening({
  actionCreator: deleteCountResultsItem,
  effect: async (action) => {
    const payload = action.payload
    deleteCountResultsItemOnDB(payload)
  },
})
/*





*/
countListenerMiddleware.startListening({
  actionCreator: setCountMembers,
  effect: async (action) => {
    const updateDB = action.payload.updateDB
    const members = action.payload.members
    if (updateDB) setCountMembersOnDB(members)
  },
})
/*





*/
countListenerMiddleware.startListening({
  actionCreator: setCountMetaData,
  effect: async (action) => {
    const updateDB = action.payload.updateDB
    const metadata = action.payload.metadata
    if (updateDB) setCountMetaDataOnDB(metadata)
  },
})
/*





*/
countListenerMiddleware.startListening({
  actionCreator: setCountComments,
  effect: async (action) => {
    const comments = action.payload.comments
    const updateDB = action.payload.updateDB
    if (updateDB) setCountCommentsOnDB(comments)
  },
})
/*





*/
countListenerMiddleware.startListening({
  actionCreator: deleteCount,
  effect: async (action) => {
    const orgUuid = store.getState().org.org.uuid
    if (!!orgUuid) deleteCountOnDB(orgUuid)
  },
})
/*





*/
