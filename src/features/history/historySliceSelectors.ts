import { createSelector } from "@reduxjs/toolkit"
import _ from "lodash"
import { historySelector } from "./historySlice"
/*




*/
export const selectHistory = createSelector(
  [historySelector],
  (history) => history.history,
)
/*




*/
export const selectHistoryList = createSelector(selectHistory, (history) =>
  _.values(history),
)
/*




*/
