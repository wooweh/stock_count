import { createSelector } from "@reduxjs/toolkit"
import _ from "lodash"
import { StockItemProps, StockProps } from "../stock/stockSlice"
import { selectStock } from "../stock/stockSliceSelectors"
import { selectUserUuidString } from "../user/userSliceSelectors"
import {
  CountItemProps,
  CountMemberResultsProps,
  CountResultsProps,
  CountSteps,
  SelectCountMemberResultsProps,
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
export const selectCountType = createSelector(
  [selectCount],
  (count) => count.metadata?.type,
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
  [selectUserCountMember],
  (user) => !!user?.isOrganiser,
)
/*
        
        
        
        
*/
export const selectIsUserOnlyOrganiser = createSelector(
  [selectUserCountMember],
  (user) => user?.isOrganiser && !user.isCounter,
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
const selectCountMembersUuidList = createSelector(
  [selectCountMembers],
  (members) => _.keys(members),
)
/*
                    
                    
                    
                    
*/
const selectAvailableCounters = createSelector(
  [selectCountMembers, selectCountMembersUuidList],
  (orgMembers, counterUuids) => _.omit(orgMembers, counterUuids),
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
  (user) => !!user && !user.isJoined,
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
export const selectRemainingStockList = createSelector(
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
const COUNTING_STEPS: CountSteps[] = ["stockCount", "review", "finalization"]
export const selectIsUserCounting = createSelector(selectCountStep, (step) =>
  COUNTING_STEPS.includes(step),
)
/*




*/
