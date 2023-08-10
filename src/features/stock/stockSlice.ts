import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import _ from "lodash"

export type StockItemProps = {
  id: string
  name: string
  description: string
}
export type StockProps = {
  [key: string]: StockItemProps
}
export interface StockState {
  stock: StockProps
}

const initialState: StockState = {
  stock: {},
}

export const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    addStockItem: (state, action: PayloadAction<StockItemProps>) => {
      state.stock[action.payload.id] = action.payload
    },
    addStockList: (state, action: PayloadAction<StockProps>) => {
      state.stock = action.payload
    },
    editStockItem: (state, action: PayloadAction<StockItemProps>) => {
      state.stock[action.payload.id] = action.payload
    },
    setStockItem: (state, action: PayloadAction<StockItemProps>) => {
      state.stock[action.payload.id] = action.payload
    },
    deleteStockItem: (state, action: PayloadAction<string>) => {
      delete state.stock[action.payload]
    },
    setStock: (state, action: PayloadAction<StockProps>) => {
      state.stock = action.payload
    },
    deleteStock: (state) => {
      state.stock = {}
    },
  },
})

export const {
  addStockItem,
  addStockList,
  editStockItem,
  setStockItem,
  deleteStockItem,
  setStock,
  deleteStock,
} = stockSlice.actions

export const selectStock = (state: RootState) => state.stock.stock
export const selectStockList = createSelector(selectStock, (stock) =>
  _.values(stock),
)
export const selectStockIdList = createSelector(selectStock, (stock) =>
  _.keys(stock),
)
export const selectStockItem = (state: RootState, itemId: string) =>
  state.stock.stock[itemId]

export default stockSlice.reducer
