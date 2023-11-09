import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit"
import _ from "lodash"
import { RootState } from "../../app/store"
import {
  CountCommentsProps,
  CountMemberResultsProps,
  CountMetadataProps,
} from "../count/countSlice"
import { UpdateDB } from "../user/userSlice"
/*




*/
export type HistoryProps = {
  [key: string]: HistoryItemProps
}
export type HistoryItemProps = {
  uuid: string
  results: HistoryItemResultsProps
  comments: HistoryItemCommentsProps
  metadata: HistoryItemMetadataProps
  members: HistoryItemMembersProps
}
export type HistoryItemResultsProps = CountMemberResultsProps
export type HistoryItemCommentsProps = CountCommentsProps
export type HistoryItemMetadataProps = Required<CountMetadataProps>
export type HistoryItemMembersProps = {
  [key: string]: HistoryItemMemberProps
}
export type HistoryItemMemberProps = {
  uuid: string
  firstName: string
  lastName: string
}

export type DeleteHistoryProps = UpdateDB
export type DeleteHistoryItemProps = { uuid: string }

export interface HistoryState {
  history: HistoryProps
}

const initialState: HistoryState = {
  history: {},
}

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    setHistory: (state, action: PayloadAction<HistoryProps>) => {
      state.history = action.payload
    },
    deleteHistory: (state) => {
      state.history = {}
    },
    setHistoryItem: (state, action: PayloadAction<HistoryItemProps>) => {
      const uuid = action.payload.uuid
      state.history[uuid] = action.payload
    },
    deleteHistoryItem: (
      state,
      action: PayloadAction<DeleteHistoryItemProps>,
    ) => {
      const uuid = action.payload.uuid
      delete state.history[uuid]
    },
  },
})

export const { setHistory, deleteHistory, setHistoryItem, deleteHistoryItem } =
  historySlice.actions

export const selectHistory = (state: RootState) => state.history.history
export const selectHistoryList = createSelector(selectHistory, (history) =>
  _.values(history),
)
export const selectHistoryIdList = createSelector(selectHistory, (history) =>
  _.keys(history),
)

export default historySlice.reducer
