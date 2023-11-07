import { createListenerMiddleware } from "@reduxjs/toolkit"
import { store } from "../../app/store"
import {
  deleteStock,
  deleteStockItem,
  setStock,
  setStockItem,
} from "./stockSlice"
import {
  deleteStockItemOnDB,
  deleteStockOnDB,
  setStockItemOnDB,
  setStockOnDB,
} from "./stockSliceRemote"
/*





*/
export const stockListenerMiddleware = createListenerMiddleware()
/*





*/
stockListenerMiddleware.startListening({
  actionCreator: setStockItem,
  effect: async (action) => {
    const stockId = action.payload.id
    const stockItem = action.payload
    setStockItemOnDB(stockId, stockItem)
  },
})
/*





*/
stockListenerMiddleware.startListening({
  actionCreator: setStock,
  effect: async (action) => {
    const stock = action.payload.stock
    const updateDB = action.payload.updateDB
    if (updateDB) setStockOnDB(stock)
  },
})
/*





*/
stockListenerMiddleware.startListening({
  actionCreator: deleteStockItem,
  effect: async (action) => {
    const id = action.payload.id
    deleteStockItemOnDB(id)
  },
})
/*





*/
stockListenerMiddleware.startListening({
  actionCreator: deleteStock,
  effect: async () => {
    const orgUuid = store.getState().org.org.uuid
    if (!!orgUuid) deleteStockOnDB(orgUuid)
  },
})
/*





*/
