import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit"
import _ from "lodash"
import { RootState } from "../../app/store"
import { UpdateDB, selectUserUuid } from "../user/userSlice"
import { selectOrgMembers } from "../organisation/organisationSlice"
import { StockItemProps, selectStock } from "../stock/stockSlice"

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
  checks?: CountCheckProps[]
}
export type CountMetadataProps = {
  type?: CountTypes
  prepStartTime?: string
  countStartTime?: string
  reviewStartTime?: string
  finalizationStartTime?: string
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
export type SelectCountMemberResultsProps = {
  [key: string]: CountItemProps & StockItemProps
}
export type SelectCountMemberResultsListProps = (CountItemProps &
  StockItemProps)[]

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
  name: string
  surname: string
  isOrganiser: boolean
  isCounter: boolean
  isJoined: boolean
  isCounting: boolean
  step: CountSteps
}
export type SetCountMemberProps = UpdateDB & { member: CountMemberProps }
export type SetCountMembersProps = UpdateDB & { members: CountMembersProps }
export type SetCountChecksProps = UpdateDB & { checks: CountCheckProps[] }
export type SetCountMetadataProps = UpdateDB & { metadata: CountMetadataProps }
export type SetCountCommentsProps = UpdateDB & { comments: CountCommentsProps }
export type SetCountStep = { step: CountSteps; updateMember: boolean }
export type DeleteCountItemProps = {
  memberUuid: string
  id: string
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
    setCountStep: (state, action: PayloadAction<SetCountStep>) => {
      state.step = action.payload.step
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
      const stockId = action.payload.id
      const countItem = _.omit(action.payload, ["memberUuid"])
      const count = state.count
      if (count) _.set(count, `results.${memberUuid}.${stockId}`, countItem)
    },
    deleteCountResultsItem: (
      state,
      action: PayloadAction<DeleteCountItemProps>,
    ) => {
      const memberUuid = action.payload.memberUuid
      const stockId = action.payload.id
      const results = state.count.results
      if (results) delete results[memberUuid][stockId]
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
  setCount,
  deleteCount,
} = countSlice.actions

export const selectCount = (state: RootState) => state.count.count
export const selectCountMetadata = (state: RootState) =>
  state.count.count.metadata
export const selectCountType = (state: RootState) =>
  state.count.count.metadata?.type
export const selectCountStep = (state: RootState) => state.count.step
export const selectCountChecks = (state: RootState) => state.count.count.checks
export const selectCountComments = (state: RootState) =>
  state.count.count.comments
export const selectCountMembers = (state: RootState) =>
  state.count.count.members
export const selectCountResults = (state: RootState) =>
  state.count.count.results
export const selectIsCountInProgress = createSelector(
  selectCount,
  (count) => count,
)
export const selectIsStockCountCompleted = createSelector(
  selectCountMembers,
  (members) => {
    return _.every(members, (value) => {
      return value.step === "review"
    })
  },
)
export const selectUserCountMember = createSelector(
  [selectCountMembers, selectUserUuid],
  (members, userUuid) => {
    if (members) {
      return members[userUuid]
    }
  },
)
export const selectUserCountMemberStep = createSelector(
  selectUserCountMember,
  (member) => {
    if (member) {
      const step = member.step
      return step
    } else {
      return "dashboard"
    }
  },
)
export const selectIsUserAwayFromCount = createSelector(
  selectUserCountMember,
  (member) => {
    if (member) {
      return member.isJoined && !member.isCounting
    } else {
      return false
    }
  },
)
export const selectOrganiser = createSelector(selectCountMembers, (members) => {
  const organiser: CountMemberProps[] = []
  _.forIn(members, (value: CountMemberProps, key) => {
    if (value.isOrganiser) {
      organiser.push(value)
    }
  })
  return organiser[0]
})
export const selectIsUserOrganiser = createSelector(
  selectUserCountMember,
  (user) => user?.isOrganiser,
)
export const selectIsUserOnlyOrganiser = createSelector(
  selectUserCountMember,
  (user) => user?.isOrganiser && user.isCounter,
)
export const selectCounters = createSelector(selectCountMembers, (members) => {
  const counters: CountMembersProps = {}
  _.forIn(members, (value: CountMemberProps, key) => {
    if (value.isCounter) {
      counters[key] = value
    }
  })
  return counters
})
export const selectCountersList = createSelector(selectCounters, (members) => {
  return _.values(members)
})
export const selectCountersUuidList = createSelector(
  selectCounters,
  (members) => {
    return _.keys(members)
  },
)
export const selectAvailableCountersList = createSelector(
  [selectOrgMembers, selectCounters],
  (orgMembers, counters) => {
    const countMembersKeys = _.keys(counters)
    const availableOrgMembers = _.omit(orgMembers, countMembersKeys)
    return _.values(availableOrgMembers)
  },
)
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
export const selectCountResultsStockIdsList = createSelector(
  selectCountResults,
  (results) => {
    const ids: string[] = []
    _.forIn(results, (value, key) => {
      _.forIn(value, (value, key) => {
        if (!ids.includes(key)) ids.push(key)
      })
    })
    return ids
  },
)
export const selectRemainingStockList = createSelector(
  [selectStock, selectCountResultsStockIdsList],
  (stock, ids) => {
    return _.filter(stock, (value, key) => !ids.includes(key))
  },
)
export const selectUserCountResults = createSelector(
  [selectCountResults, selectUserUuid, selectStock],
  (results, userUuid, stock) => {
    const modifiedUserResults = {} as SelectCountMemberResultsProps
    if (!!results) {
      const userResults = { ...results[userUuid] }
      _.forIn(userResults, (value, key) => {
        const name = _.get(stock[value.id], "name")
        const description = _.get(stock[value.id], "description")
        _.set(modifiedUserResults, `${key}`, { ...value })
        _.set(modifiedUserResults, `${key}.name`, name)
        _.set(modifiedUserResults, `${key}.description`, description)
      })
    }
    return modifiedUserResults
  },
)
export const selectUserCountResultsList = createSelector(
  selectUserCountResults,
  (results) => {
    return _.values(results)
  },
)
export const selectIsUserCounting = createSelector(selectCountStep, (step) => {
  const countingSteps: CountSteps[] = ["stockCount", "review", "finalization"]
  return countingSteps.includes(step)
})
// export const selectCountDuration = createSelector(
//   selectCountMetadata,
//   (metadata) => {
//     if (!!metadata) {
//       const startTime = new Date(metadata.countStartTime)
//       const endTime = new Date(metadata.finalizationStartTime)
//       const duration = endTime - startTime
//       return duration
//     }
//   },
// )

export default countSlice.reducer
