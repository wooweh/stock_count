import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit"
import _ from "lodash"
import { RootState } from "../../app/store"
import { UpdateDB, selectUserUuid } from "../user/userSlice"
import { selectOrgMembers } from "../organisation/organisationSlice"

export interface CountState {
  step: CountSteps
  count: CountProps
}
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
}
export type CountMetadataProps = {
  type?: CountTypes
  prepStartTime?: string
  countStartTime?: string
  reviewStartTime?: string
  finalSubmissionTime?: string
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
  stockId: string
  useableCount: number
  damagedCount: number
  obsoleteCount: number
}
export type CountMembersProps = {
  [key: string]: CountMemberProps
}
export type CountMemberProps = {
  uuid: string
  name: string
  surname: string
  isOrganiser: boolean
  isCounter: boolean
  isJoined: boolean
  step: CountSteps
}
export type SetCountMemberProps = UpdateDB & { member: CountMemberProps }
export type SetCountMembersProps = UpdateDB & { members: CountMembersProps }
export type SetCountMetadataProps = UpdateDB & { metadata: CountMetadataProps }
export type DeleteCountItemProps = {
  memberUuid: string
  stockId: string
}
export type SetCountResultsItemProps = CountItemProps & {
  memberUuid: string
}

const initialState: CountState = {
  step: "dashboard",
  count: {},
}

export const countSlice = createSlice({
  name: "count",
  initialState,
  reducers: {
    setCountStep: (state, action: PayloadAction<CountSteps>) => {
      state.step = action.payload
    },
    setCountMember: (state, action: PayloadAction<SetCountMemberProps>) => {
      const member = action.payload.member
      const memberUuid = member.uuid
      const count = state.count
      if (count) _.set(count, `members.${memberUuid}`, member)
    },
    deleteCountMember: (state, action: PayloadAction<string>) => {
      const memberUuid = action.payload
      const members = state.count.members
      if (members) delete members[memberUuid]
    },
    setCountResultsItem: (
      state,
      action: PayloadAction<SetCountResultsItemProps>,
    ) => {
      const memberUuid = action.payload.memberUuid
      const stockId = action.payload.stockId
      const countItem = _.omit(action.payload, ["memberUuid"])
      const count = state.count
      if (count) _.set(count, `results.${memberUuid}.${stockId}`, countItem)
    },
    deleteCountResultsItem: (
      state,
      action: PayloadAction<DeleteCountItemProps>,
    ) => {
      const memberUuid = action.payload.memberUuid
      const stockId = action.payload.stockId
      const results = state.count.results
      if (results) delete results[memberUuid][stockId]
    },
    setCountMembers: (state, action: PayloadAction<SetCountMembersProps>) => {
      state.count.members = action.payload.members
    },
    setCountMetaData: (state, action: PayloadAction<SetCountMetadataProps>) => {
      state.count.metadata = action.payload.metadata
    },
    setCountComments: (state, action: PayloadAction<CountCommentsProps>) => {
      state.count.comments = action.payload
    },
    setCountPrepComments: (state, action: PayloadAction<string[]>) => {
      const count = state.count
      if (count) _.set(count, "comments.preparation", action.payload)
    },
    setCountFinalComments: (state, action: PayloadAction<string[]>) => {
      const count = state.count
      if (count) _.set(count, "comments.finalization", action.payload)
    },
    setCountResults: (state, action: PayloadAction<CountResultsProps>) => {
      state.count.results = action.payload
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
  setCountComments,
  setCountPrepComments,
  setCountFinalComments,
  setCountResults,
  setCount,
  deleteCount,
} = countSlice.actions

export const selectCountType = (state: RootState) =>
  state.count.count.metadata?.type
export const selectCountStep = (state: RootState) => state.count.step
export const selectCountMembers = (state: RootState) =>
  state.count.count.members
export const selectCountMembersList = createSelector(
  selectCountMembers,
  (members) => {
    return _.values(members)
  },
)
export const selectAvailableMembersList = createSelector(
  [selectOrgMembers, selectCountMembers],
  (orgMembers, countMembers) => {
    const countMembersKeys = _.keys(countMembers)
    const availableOrgMembers = _.omit(orgMembers, countMembersKeys)
    return _.values(availableOrgMembers)
  },
)
export const selectCount = (state: RootState) => state.count.count
export const selectIsCountInvitePending = createSelector(
  [selectUserUuid, selectCountMembers],
  (userUuid, members) => {
    if (!!members) {
      const user = members[userUuid as string]
      return !!user && !user.isJoined
    } else {
      return false
    }
  },
)

export default countSlice.reducer
