import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit"
import _ from "lodash"
import { RootState } from "../../app/store"
import { UpdateDB } from "../user/userSlice"

export interface StockState {
  stock: StockProps
}
export type StockProps = {
  [key: string]: StockItemProps
}
export type SetStockProps = UpdateDB & { stock: StockProps }
export type StockItemProps = {
  id: string
  name: string
  description: string
}

const initialState: StockState = {
  stock: {},
}

export const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    setStockItem: (state, action: PayloadAction<StockItemProps>) => {
      state.stock[action.payload.id] = action.payload
    },
    deleteStockItem: (state, action: PayloadAction<string>) => {
      delete state.stock[action.payload]
    },
    setStock: (state, action: PayloadAction<SetStockProps>) => {
      state.stock = action.payload.stock
    },
    deleteStock: (state) => {
      state.stock = {}
    },
  },
})

export const { setStockItem, deleteStockItem, setStock, deleteStock } =
  stockSlice.actions

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
