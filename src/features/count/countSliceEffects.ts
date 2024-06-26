import { createListenerMiddleware } from "@reduxjs/toolkit"
import { store } from "../../app/store"
import {
  deleteCount,
  deleteCountMember,
  deleteCountResultsItem,
  setCount,
  setCountComments,
  setCountMember,
  setCountMembers,
  setCountMetaData,
  setCountResults,
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
  setCountOnDB,
  setCountResultsItemOnDB,
  setCountResultsOnDB,
} from "./countSliceRemote"
import { updateUserCountMember } from "./countSliceUtils"
/*




*/
export const countListenerMiddleware = createListenerMiddleware()
/*




*/
countListenerMiddleware.startListening({
  actionCreator: setCount,
  effect: async (action) => {
    const updateDB = action.payload.updateDB
    const count = action.payload.count
    if (updateDB) setCountOnDB(count)
  },
})
/*




*/
countListenerMiddleware.startListening({
  actionCreator: setCountStep,
  effect: async (action) => {
    const updateMember = action.payload.updateMember
    const step = action.payload.step
    if (updateMember) updateUserCountMember({ step })
  },
})
/*




*/
countListenerMiddleware.startListening({
  actionCreator: setCountMember,
  effect: async (action) => {
    const updateDB = action.payload.updateDB
    const member = action.payload.member
    if (updateDB) setCountMemberOnDB(member)
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
  actionCreator: setCountResults,
  effect: async (action) => {
    const results = action.payload
    setCountResultsOnDB(results)
  },
})
/*




*/
countListenerMiddleware.startListening({
  actionCreator: setCountResultsItem,
  effect: async (action) => {
    const payload = action.payload
    const updateDB = payload.updateDB
    if (updateDB) setCountResultsItemOnDB(payload)
  },
})
/*




*/
countListenerMiddleware.startListening({
  actionCreator: deleteCountResultsItem,
  effect: async (action) => {
    const payload = action.payload
    const updateDB = payload.updateDB
    if (updateDB) deleteCountResultsItemOnDB(payload)
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
    const updateDB = action.payload.updateDB
    if (!!orgUuid && !!updateDB) deleteCountOnDB(orgUuid)
  },
})
/*




*/
