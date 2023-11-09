import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit"
import _ from "lodash"
import { RootState } from "../../app/store"
import { UpdateDB } from "../user/userSlice"
import { prepareStockSearchList } from "./stockUtils"
/*




*/
export type StockProps = {
  [key: string]: StockItemProps
}
export type SetStockProps = UpdateDB & { stock: StockProps }
export type StockItemProps = {
  id: string
  name: string
  unit: string
}
export type DeleteStockItemProps = {
  id: string
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
    setStockItem: (state, action: PayloadAction<StockItemProps>) => {
      const id = action.payload.id
      state.stock[id] = action.payload
    },
    deleteStockItem: (state, action: PayloadAction<DeleteStockItemProps>) => {
      const id = action.payload.id
      delete state.stock[id]
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
export const selectStockList = createSelector([selectStock], (stock) =>
  _.values(stock),
)
export const selectStockIdList = createSelector([selectStock], (stock) =>
  _.keys(stock),
)

export default stockSlice.reducer
/*




*/
