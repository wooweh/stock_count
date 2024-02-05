import { createSelector } from "@reduxjs/toolkit"
import _ from "lodash"
import { selectOrgMembers } from "../org/orgSliceSelectors"
import { getMemberShortName } from "../org/orgUtils"
import { StockItemProps, StockProps } from "../stock/stockSlice"
import { selectStock } from "../stock/stockSliceSelectors"
import { selectUserUuidString } from "../user/userSliceSelectors"
import {
  CountItemProps,
  CountMemberProps,
  CountMemberResultsProps,
  CountResultsProps,
  CountSteps,
  countSelector,
} from "./countSlice"

/*




*/
export const selectCountStep = createSelector(
  [countSelector],
  (count) => count.step,
)
/*




*/
export const selectCount = createSelector(
  [countSelector],
  (count) => count.count,
)
/*




*/
export const selectCountMetadata = createSelector(
  [selectCount],
  (count) => count.metadata,
)
/*




*/
export const selectIsManagingCount = createSelector(
  [selectCount],
  (count) => !!count.metadata?.isManaging,
)
/*




*/
export const selectCountType = createSelector(
  [selectCount],
  (count) => count.metadata?.type ?? "solo",
)
/*




*/
export const selectCountMembers = createSelector(
  [selectCount],
  (count) => count.members,
)
/*




*/
export const selectCountResults = createSelector(
  [selectCount],
  (count) => count.results,
)
/*




*/
export const selectIsStockCountCompleted = createSelector(
  [selectCountMembers],
  (members) => _.every(members, (value) => value.step === "review"),
)
/*
        
        
        
      
*/
export const selectUserCountMember = createSelector(
  [selectCountMembers, selectUserUuidString],
  (members, userUuid) => members?.[userUuid],
)
/*




*/
export const selectUserCountMemberStep = createSelector(
  [selectUserCountMember],
  (member) => member?.step ?? "dashboard",
)
/*
    
    
    
    
*/
export const selectIsUserAwayFromCount = createSelector(
  [selectUserCountMember],
  (member) => !!member?.isJoined && !member.isCounting,
)
/*
    
    
    
    
*/
const selectOrganiserUuidString = createSelector(
  [selectCountMetadata],
  (metadata) => metadata?.organiser as string,
)
/*
    
    
    
    
*/
export const selectOrganiser = createSelector(
  [selectCountMembers, selectOrganiserUuidString],
  (members, organiserUuid) => members?.[organiserUuid],
)
/*
    
    
    
    
*/
export const selectIsUserOrganiser = createSelector(
  [selectCountMetadata, selectUserUuidString],
  (metadata, userUuid) => metadata?.organiser === userUuid,
)
/*
        
        
        
        
*/
export const selectIsUserCounter = createSelector(
  [selectCountMetadata, selectUserUuidString],
  (metadata, userUuid) => !!metadata?.counters.includes(userUuid),
)
/*
        
        
        
        
*/
export const selectIsUserJustOrganiser = createSelector(
  [selectIsUserOrganiser, selectIsUserCounter],
  (isOrganiser, isCounter) => isOrganiser && !isCounter,
)
/*
           
           
           
           
*/
export const selectIsOrganiserFinalizing = createSelector(
  [selectOrganiser],
  (organiser) => organiser?.step === "finalization",
)
/*
                
                
                
                
*/
export const selectCounters = createSelector([selectCountMembers], (members) =>
  _.omitBy(members, (value) => !value.isCounter),
)
/*




*/
export type CountMembersWithResultsProps = {
  [key: string]: {
    name: string
    uuid: string
    count: number
  }
}
export const selectCountMembersCountValueList = createSelector(
  [selectCounters, selectCountResults],
  (members, results) => {
    const membersWithCountValues: CountMembersWithResultsProps = {}
    _.forIn(members, (value: CountMemberProps, key) => {
      const name = getMemberShortName(value)
      const countValue = results?.[key] ? Object.keys(results[key]).length : 0
      _.set(membersWithCountValues, `${key}.name`, name)
      _.set(membersWithCountValues, `${key}.uuid`, value.uuid)
      _.set(membersWithCountValues, `${key}.count`, countValue)
    })
    return _.values(membersWithCountValues)
  },
)
/*
                
                
                
                
*/
export const selectCountersList = createSelector([selectCounters], (counters) =>
  _.values(counters),
)
/*
                
                
                
                
*/
export const selectCountersUuidList = createSelector(
  [selectCounters],
  (counters) => _.keys(counters),
)
/*
                    
                    
                    
                    
*/
const selectAvailableCounters = createSelector(
  [selectOrgMembers, selectCountersUuidList],
  (orgMembers, counterUuids) => {
    return _.omit(orgMembers, counterUuids)
  },
)
/*
                    
                    
                    
                    
*/
export const selectAvailableCountersList = createSelector(
  [selectAvailableCounters],
  (counters) => _.values(counters),
)
/*
                        
                        
                        
                        
*/
export const selectIsCountInvitePending = createSelector(
  [selectUserCountMember],
  (user) => !!user && !user.isJoined && !user.isDeclined,
)
/*
                            
                            
                            
                            
*/
export const selectIsCountInProgress = createSelector(
  [selectCountMetadata],
  (metadata) =>
    !!metadata?.counters.length &&
    !!metadata?.organiser &&
    !!metadata?.countStartTime,
)
/*
                            
                            
                            
                            
*/
export const selectCountResultsStockIdsList = createSelector(
  [selectCountResults],
  (results) => getStockIdsFromResults(results),
)

function getStockIdsFromResults(
  results: CountResultsProps | undefined,
): string[] {
  const ids: string[] = []
  !!results &&
    _.forIn(results, (value, key) => {
      _.forIn(value, (value, key) => {
        if (!ids.includes(key)) ids.push(key)
      })
    })
  return ids
}
/*
                            
                            
                            
                            
*/
const selectUserCountResults = createSelector(
  [selectCountResults, selectUserUuidString],
  (results, userUuid) => results?.[userUuid],
)
/*
                            
                            
                            
                            
*/
export const selectIsUserCountResultsEmpty = createSelector(
  [selectUserCountResults],
  (results) => !results || _.isEmpty(results),
)
/*
                            
                            
                            
                            
*/
export const selectModifiedUserCountResults = createSelector(
  [selectUserCountResults, selectStock],
  (userResults, stock) => getModifiedUserCountResults(userResults, stock),
)

type ModifiedUserResultsProps = {
  [key: string]: CountItemProps & StockItemProps
}
function getModifiedUserCountResults(
  userResults: CountMemberResultsProps | undefined,
  stock: StockProps,
): ModifiedUserResultsProps {
  const modifiedUserResults = {}
  !!userResults &&
    _.forIn(userResults, (value, key) => {
      const name = _.get(stock[value.id], "name")
      const unit = _.get(stock[value.id], "unit")
      _.set(modifiedUserResults, `${key}`, { ...value, name, unit })
    })
  return modifiedUserResults
}
/*
                                
                                
                                
                                
*/
export const selectModifiedUserCountResultsList = createSelector(
  [selectModifiedUserCountResults],
  (results) => _.values(results),
)
/*
                                    
                                    
                                    
                                    
*/
export const selectRemainingDefaultStockList = createSelector(
  [selectStock, selectCountResultsStockIdsList],
  (stock, ids) => _.filter(stock, (value, key) => !ids.includes(key)),
)
/*
                                        
                                        
                                        
                                        
*/
export const selectUserCountResultsIdsList = createSelector(
  [selectUserCountResults],
  (results) => _.keys(results),
)
/*
                                        
                                        
                                        
                                        
*/
export const selectRemainingDualStockList = createSelector(
  [selectStock, selectUserCountResultsIdsList],
  (stock, ids) => {
    return _.filter(stock, (value, key) => !ids.includes(key))
  },
)
/*
                                            
                                            
                                            
                                            
*/
export const selectRemainingStockList = createSelector(
  [
    selectCountType,
    selectRemainingDefaultStockList,
    selectRemainingDualStockList,
  ],
  (countType, defaultList, dualList) => {
    return countType === "dual" ? dualList : defaultList
  },
)
/*
                                            
                                            
                                            
                                            
*/
const COUNTING_STEPS: CountSteps[] = ["stockCount", "review", "finalization"]
export const selectIsUserCounting = createSelector(selectCountStep, (step) =>
  COUNTING_STEPS.includes(step),
)
/*




*/
