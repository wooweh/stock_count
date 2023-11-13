import { createSelector } from "@reduxjs/toolkit"
import _ from "lodash"
import { stockSelector } from "./stockSlice"
/*




*/
export const selectStock = createSelector(
  [stockSelector],
  (stock) => stock.stock,
)
/*




*/
export const selectStockList = createSelector([selectStock], (stock) =>
  _.values(stock),
)
/*




*/
