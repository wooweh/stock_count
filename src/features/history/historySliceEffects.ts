import { createListenerMiddleware } from "@reduxjs/toolkit"
import { store } from "../../app/store"
import {
  deleteHistory,
  deleteHistoryItem,
  setHistoryItem,
} from "./historySlice"
import {
  deleteHistoryItemOnDB,
  deleteHistoryOnDB,
  setHistoryItemOnDB,
} from "./historySliceRemote"
/*





*/
export const historyListenerMiddleware = createListenerMiddleware()
/*





*/
historyListenerMiddleware.startListening({
  actionCreator: deleteHistory,
  effect: async () => {
    const orgUuid = store.getState().org.org.uuid
    if (orgUuid) deleteHistoryOnDB(orgUuid)
  },
})
/*





*/
historyListenerMiddleware.startListening({
  actionCreator: setHistoryItem,
  effect: async (action) => {
    const historyItem = action.payload
    setHistoryItemOnDB(historyItem)
  },
})
/*





*/
historyListenerMiddleware.startListening({
  actionCreator: deleteHistoryItem,
  effect: async (action) => {
    const uuid = action.payload.uuid
    deleteHistoryItemOnDB(uuid)
  },
})
/*





*/
