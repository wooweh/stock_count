import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import _ from "lodash"
import { RootState } from "../../app/store"
import { UpdateDB } from "../user/userSlice"
/*




*/
export type CountSteps =
  | "dashboard"
  | "setup"
  | "preparation"
  | "stockCount"
  | "review"
  | "finalization"
export type CountTypes = "solo" | "dual" | "team"
export type CountProps = {
  metadata?: CountMetadataProps
  comments?: CountCommentsProps
  results?: CountResultsProps
  members?: CountMembersProps
  checks?: CountCheckProps[]
}
export type CountMetadataProps = {
  type?: CountTypes
  prepStartTime?: number
  countStartTime?: number
  reviewStartTime?: number
  finalizationStartTime?: number
  finalSubmissionTime?: number
  organiser: string
  counters: string[]
}
export type CountCommentsProps = {
  preparation?: string[]
  finalization?: string[]
}
export type CountResultsProps = {
  [key: string]: CountMemberResultsProps
}
export type CountMemberResultsProps = {
  [key: string]: CountItemProps
}
export type CountItemProps = {
  id: string
  useableCount: number
  damagedCount: number
  obsoleteCount: number
}
export type CountMembersProps = {
  [key: string]: CountMemberProps
}
export type CountCheckProps = {
  check: string
  isChecked: boolean
}
export type CountMemberProps = {
  uuid: string
  firstName: string
  lastName: string
  isOrganiser: boolean
  isCounter: boolean
  isJoined: boolean
  isCounting: boolean
  isDeclined?: boolean
  step: CountSteps
}
export type SetCountMemberProps = UpdateDB & { member: CountMemberProps }
export type SetCountMembersProps = UpdateDB & { members: CountMembersProps }
export type SetCountChecksProps = UpdateDB & { checks: CountCheckProps[] }
export type SetCountMetadataProps = UpdateDB & { metadata: CountMetadataProps }
export type SetCountCommentsProps = UpdateDB & { comments: CountCommentsProps }
export type SetCountStep = { step: CountSteps; updateMember: boolean }
export type SetCountResultsItemProps = {
  item: CountItemProps
  memberUuid: string
} & UpdateDB
export type SetCountMemberResultsProps = {
  results: CountMemberResultsProps
  memberUuid: string
}
export type DeleteCountMemberProps = {
  uuid: string
}
export type DeleteCountItemProps = {
  memberUuid: string
  id: string
}

export interface CountState {
  step: CountSteps
  count: CountProps
}
const initialState: CountState = {
  step: "dashboard",
  count: {},
}

export const countSlice = createSlice({
  name: "count",
  initialState,
  reducers: {
    setCountStep: (state, action: PayloadAction<SetCountStep>) => {
      state.step = action.payload.step
    },
    setCountMember: (state, action: PayloadAction<SetCountMemberProps>) => {
      const member = action.payload.member
      const memberUuid = member.uuid
      const count = state.count
      if (count) _.set(count, `members.${memberUuid}`, member)
    },
    deleteCountMember: (
      state,
      action: PayloadAction<DeleteCountMemberProps>,
    ) => {
      const members = state.count.members
      const uuid = action.payload.uuid
      if (members) delete members[uuid]
    },
    setCountResultsItem: (
      state,
      action: PayloadAction<SetCountResultsItemProps>,
    ) => {
      const count = state.count
      const memberUuid = action.payload.memberUuid
      const countItem = action.payload.item
      const stockId = countItem.id
      if (count) _.set(count, `results.${memberUuid}.${stockId}`, countItem)
    },
    deleteCountResultsItem: (
      state,
      action: PayloadAction<DeleteCountItemProps>,
    ) => {
      const memberUuid = action.payload.memberUuid
      const stockId = action.payload.id
      const results = state.count.results
      if (!!results) delete results[memberUuid][stockId]
    },
    setCountMembers: (state, action: PayloadAction<SetCountMembersProps>) => {
      state.count.members = action.payload.members
    },
    setCountMetaData: (state, action: PayloadAction<SetCountMetadataProps>) => {
      state.count.metadata = action.payload.metadata
    },
    setCountChecks: (state, action: PayloadAction<SetCountChecksProps>) => {
      state.count.checks = action.payload.checks
    },
    setCountComments: (state, action: PayloadAction<SetCountCommentsProps>) => {
      state.count.comments = action.payload.comments
    },
    setCountResults: (state, action: PayloadAction<CountResultsProps>) => {
      state.count.results = action.payload
    },
    setCountMemberResults: (
      state,
      action: PayloadAction<SetCountMemberResultsProps>,
    ) => {
      const count = state.count
      const uuid = action.payload.memberUuid
      const results = action.payload.results
      if (count) _.set(count, `results.${uuid}`, results)
    },
    setCount: (state, action: PayloadAction<CountProps>) => {
      state.count = action.payload
    },
    deleteCount: (state) => {
      state.count = {}
      state.step = "dashboard"
    },
  },
})

export const {
  setCountStep,
  setCountMember,
  deleteCountMember,
  setCountResultsItem,
  deleteCountResultsItem,
  setCountMembers,
  setCountMetaData,
  setCountChecks,
  setCountComments,
  setCountResults,
  setCountMemberResults,
  setCount,
  deleteCount,
} = countSlice.actions

export const countSelector = (state: RootState) => state.count

export default countSlice.reducer
