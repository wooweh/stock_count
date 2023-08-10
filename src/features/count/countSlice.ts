import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import _ from "lodash"
import { RootState } from "../../app/store"

export type CountItemProps = {
  stockId: string
  useableCount: number
  damagedCount: number
  obsoleteCount: number
}
export type CountProps = {
  [key: string]: { [key: string]: CountItemProps }
}
export type CountSteps =
  | "idle"
  | "setup"
  | "preparation"
  | "stockCount"
  | "review"
  | "finalization"
export type CountTypes = "solo" | "dual" | "complimentary"
export type CountMemberProps = {
  memberUuid: string
  isJoined: boolean
  step: CountSteps
}
export type CountMembersProps = {
  [key: string]: CountMemberProps
}
export type AddCountItemProps = {
  memberUuid: string
  stockId: string
}
export type RemoveCountItemProps = AddCountItemProps
export type SetCountProps = CountItemProps & {
  memberUuid: string
}

export interface CountState {
  step: CountSteps
  type: CountTypes
  members: CountMembersProps
  count: CountProps
}

const initialState: CountState = {
  step: "idle",
  type: "solo",
  members: {},
  count: {},
}

export const countSlice = createSlice({
  name: "count",
  initialState,
  reducers: {
    setCountStep: (state, action: PayloadAction<CountSteps>) => {
      state.step = action.payload
    },
    setCountType: (state, action: PayloadAction<CountTypes>) => {
      state.type = action.payload
    },
    setCountMember: (state, action: PayloadAction<CountMemberProps>) => {
      const memberUuid = action.payload.memberUuid
      state.members[memberUuid] = action.payload
    },
    deleteCountMember: (state, action: PayloadAction<string>) => {
      const memberUuid = action.payload
      delete state.members[memberUuid]
    },
    setCountItem: (state, action: PayloadAction<SetCountProps>) => {
      const memberUuid = action.payload.memberUuid
      const stockId = action.payload.stockId
      const countItem = _.omit(action.payload, ["memberUuid"])
      state.count[memberUuid][stockId] = countItem
    },
    deleteCountItem: (state, action: PayloadAction<RemoveCountItemProps>) => {
      const memberUuid = action.payload.memberUuid
      const stockId = action.payload.stockId
      delete state.count[memberUuid][stockId]
    },
  },
})

export const {
  setCountStep,
  setCountType,
  setCountMember,
  deleteCountMember,
  setCountItem,
} = countSlice.actions

export const selectCountType = (state: RootState) => state.count.type
export const selectCountStep = (state: RootState) => state.count.step
export const selectCountMembers = (state: RootState) => state.count.members
export const selectCount = (state: RootState) => state.count.count

export default countSlice.reducer
