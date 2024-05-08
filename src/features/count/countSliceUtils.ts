import _ from "lodash"
import { v4 as uuidv4 } from "uuid"
import { store } from "../../app/store"
import { getTimeStamp } from "../../common/utils"
import { generateCustomNotification } from "../core/coreUtils"
import {
  HistoryItemMembersProps,
  HistoryItemMetadataProps,
  setHistoryItem,
} from "../history/historySlice"
import {
  CountChecksProps,
  MembersProps,
  deleteCountCheck,
  setCountCheck,
} from "../org/orgSlice"
import {
  CountCheckProps,
  CountCommentsProps,
  CountItemProps,
  CountMemberProps,
  CountMemberResultsProps,
  CountMembersProps,
  CountMetadataProps,
  CountProps,
  CountResultsProps,
  CountSteps,
  CountTypes,
  deleteCount,
  deleteCountMember,
  deleteCountResultsItem,
  setCount,
  setCountChecks,
  setCountComments,
  setCountMember,
  setCountMemberResults,
  setCountMembers,
  setCountMetaData,
  setCountResults,
  setCountResultsItem,
  setCountStep,
} from "./countSlice"
import { StockItemProps } from "../stock/stockSlice"
/*




*/
export function updateCountStep(step: CountSteps, updateMember?: boolean) {
  store.dispatch(setCountStep({ step, updateMember: !!updateMember }))
}
/*




*/
export function updateCountComments(
  payload: Partial<CountCommentsProps>,
  updateDB: boolean = false,
) {
  const prevComments = store.getState().count.count.comments
  const comments = prevComments ? { ...prevComments, ...payload } : payload
  store.dispatch(setCountComments({ comments, updateDB }))
}
/*




*/
export function updateCountResults(payload: CountResultsProps) {
  store.dispatch(setCountResults(payload))
}
/*




*/
export function updateCountMemberResults(
  memberUuid: string,
  results: CountMemberResultsProps,
) {
  store.dispatch(setCountMemberResults({ memberUuid, results }))
}
/*




*/
export function addCountResultItem(
  stockItem: StockItemProps,
  memberUuid: string,
) {
  const item = {
    ...stockItem,
    useableCount: 0,
    damagedCount: 0,
    obsoleteCount: 0,
  }
  store.dispatch(setCountResultsItem({ item, memberUuid, updateDB: true }))
}
/*




*/
export function updateCountResultItem(
  item: CountItemProps,
  memberUuid: string,
  updateDB: boolean = true,
) {
  store.dispatch(setCountResultsItem({ item, memberUuid, updateDB }))
}
/*




*/
export function removeCountResultsItem(
  id: string,
  memberUuid: string,
  updateDB: boolean = true,
) {
  store.dispatch(deleteCountResultsItem({ id, memberUuid, updateDB }))
}
/*




*/
export function createCountMembers() {
  const members = store.getState().count.count.members
  if (members) {
    store.dispatch(setCountMembers({ members, updateDB: true }))
  }
}
/*




*/
export function prepareCountMembers(memberUuids: string[]) {
  const userUuid = store.getState().user.user.uuid as string
  const orgMembers = store.getState().org.org.members as MembersProps
  const members = prepareCountMembersPayload(memberUuids, userUuid, orgMembers)
  store.dispatch(setCountMembers({ members, updateDB: false }))
}
/*




*/
export function prepareCountMembersPayload(
  memberUuids: string[],
  userUuid: string,
  orgMembers: MembersProps,
): CountMembersProps {
  const user = _.pick(orgMembers, userUuid)
  const members = _.pick(orgMembers, memberUuids)
  const selectedMembers = { ...members, ...user }
  const countMembers: CountMembersProps = {}

  _.forIn(selectedMembers, (value, key) => {
    const isOrganiser = key === userUuid
    const isJoined = isOrganiser
    const isCounter = memberUuids.includes(key)
    const isCounting = isOrganiser
    const step = isOrganiser ? "setup" : "dashboard"
    const countMember: CountMemberProps = {
      ..._.omit(value, "role"),
      isOrganiser,
      isCounter,
      isCounting,
      isJoined,
      step,
    }
    _.set(countMembers, key, countMember)
  })
  return countMembers
}
/*




*/
export function updateCountMembers(
  members: CountMembersProps,
  updateDB: boolean = false,
) {
  store.dispatch(setCountMembers({ members, updateDB }))
}
/*




*/
export function removeCountMembers() {
  store.dispatch(setCountMembers({ members: {}, updateDB: true }))
}
/*




*/
export function updateUserCountMember(payload: Partial<CountMemberProps>) {
  const userUuid = store.getState().user.user.uuid
  const members = store.getState().count.count.members
  if (members && userUuid) {
    const member = { ...members[userUuid], ...payload }
    store.dispatch(setCountMember({ member, updateDB: true }))
  }
}
/*




*/
export function updateCountMember(
  memberUuid: string,
  payload: Partial<CountMemberProps>,
) {
  const members = store.getState().count.count.members
  if (members) {
    const member = { ...members[memberUuid], ...payload }
    store.dispatch(setCountMember({ member, updateDB: false }))
  }
}
/*




*/
export function removeCountMember(uuid: string) {
  store.dispatch(deleteCountMember({ uuid }))
}
/*




*/
export function createCountMetadata(
  countType: CountTypes,
  counterUuids: string[],
) {
  const organiserUuid = store.getState().user.user.uuid as string
  const prepStartTime = getTimeStamp()
  const metadata = {
    isManaging: false,
    type: countType,
    organiser: organiserUuid,
    counters: counterUuids,
    prepStartTime,
  }
  store.dispatch(setCountMetaData({ metadata, updateDB: true }))
}
/*




*/
export function updateCountMetadata(
  payload: Partial<CountMetadataProps>,
  updateDB: boolean = false,
) {
  const prevMetadata = store.getState().count.count.metadata
  const metadata = (
    prevMetadata ? { ...prevMetadata, ...payload } : payload
  ) as CountMetadataProps
  store.dispatch(setCountMetaData({ metadata, updateDB }))
}
/*




*/
export function createCountChecks(satisfiedCheckUuids: string[]) {
  const countChecks = store.getState().org.org.countChecks
  if (countChecks) {
    const checks = createCountChecksPayload(countChecks, satisfiedCheckUuids)
    store.dispatch(setCountChecks({ checks, updateDB: true }))
  }
}
/*




*/
export function createCountChecksPayload(
  checks: CountChecksProps,
  satisfiedCheckUuids: string[],
) {
  const countChecks: CountCheckProps[] = []
  _.forIn(checks, (value, key) => {
    countChecks.push({
      check: value,
      isChecked: satisfiedCheckUuids.includes(key),
    })
  })
  return countChecks
}
/*




*/
export function createCountCheck() {
  const id = uuidv4()
  const check = ""
  store.dispatch(setCountCheck({ id, check }))
}
/*




*/
export function updateCountChecks(
  checks: CountCheckProps[],
  updateDB: boolean = false,
) {
  store.dispatch(setCountChecks({ checks, updateDB }))
}
/*




*/
export function updateCountCheck(id: string, check: string) {
  store.dispatch(setCountCheck({ id, check }))
}
/*




*/
export function removeCountCheck(id: string) {
  store.dispatch(deleteCountCheck({ id }))
}
/*




*/
export function submitCount() {
  const countResults = store.getState().count.count.results
  const metadata = store.getState().count.count
    .metadata as HistoryItemMetadataProps
  const countComments = store.getState().count.count.comments
  const countMembers = store.getState().count.count.members
  if (!!countResults && !!metadata && !!countMembers) {
    const uuid = uuidv4()
    const results = prepareFinalResults(countResults)
    const comments = { ...countComments }
    const members = prepareFinalMembers(countMembers)
    store.dispatch(
      setHistoryItem({ uuid, metadata, results, comments, members }),
    )
    store.dispatch(setCountStep({ step: "dashboard", updateMember: false }))
    store.dispatch(deleteCount({ updateDB: true }))
    generateCustomNotification("success", "Count submitted to History.")
  } else {
    generateCustomNotification("error", "No results to submit.")
  }
}
/*




*/
export function prepareFinalResults(results: CountResultsProps) {
  let finalResults: CountMemberResultsProps = {}
  _.forIn(results, (value, key) => {
    finalResults = { ...finalResults, ...value }
  })
  return finalResults
}
/*




*/
export function prepareFinalMembers(
  members: CountMembersProps,
): HistoryItemMembersProps {
  const finalMembers = {}
  _.forIn(members, (value, key) => {
    const finalMember = _.pick(value, ["uuid", "firstName", "lastName"])
    _.set(finalMembers, key, finalMember)
  })
  return finalMembers
}
/*




*/
export function removeCount(updateDB: boolean = true) {
  store.dispatch(deleteCount({ updateDB }))
  store.dispatch(setCountStep({ step: "dashboard", updateMember: false }))
}
/*




*/
export function startCount(
  checkUuids: string[],
  comments: string[],
  step: CountSteps,
) {
  const countStartTime = getTimeStamp()
  createCountMembers()
  updateCountStep(step, true)
  createCountChecks(checkUuids)
  updateCountMetadata({ countStartTime }, true)
  updateCountComments({ preparation: comments }, true)
}
/*




*/
export function leaveCount() {
  updateUserCountMember({ isCounting: false })
  updateCountStep("dashboard")
}
/*




*/
export function completeReview() {
  updateCountMetadata({ finalizationStartTime: getTimeStamp() }, true)
  updateCountStep("finalization", true)
}
/*




*/
export function updateCount(count: CountProps, updateDB: boolean = false) {
  store.dispatch(setCount({ count, updateDB }))
}
/*




*/
export function updateManagedCount(
  countType: CountTypes,
  addedMembers: string[],
  removedMembers: string[],
  transferredMembers: { [key: string]: string },
) {
  const count = store.getState().count.count
  const orgMembers = store.getState().org.org.members!
  const members = count.members!
  const results = count.results!
  const metadata = count.metadata!
  const currentCountType = metadata.type
  const isCurrentCountTypeChangedFromDualtoTeam =
    currentCountType === "dual" && countType !== "team"

  const updatedMembers: CountMembersProps = prepareManagedCountMembers(
    members,
    orgMembers,
    addedMembers,
    removedMembers,
  )
  const updatedResults: CountResultsProps = prepareManagedCountResults(
    results,
    addedMembers,
    removedMembers,
    transferredMembers,
    isCurrentCountTypeChangedFromDualtoTeam,
  )
  const updatedMetadata: CountMetadataProps = prepareManagedCountMetatdata(
    metadata,
    updatedMembers,
    countType,
  )
  const updatedCount: CountProps = {
    ...count,
    results: updatedResults,
    members: updatedMembers,
    metadata: updatedMetadata,
  }

  store.dispatch(setCount({ count: updatedCount, updateDB: true }))
}
/*




*/
export function prepareManagedCountMembers(
  members: CountMembersProps,
  orgMembers: MembersProps,
  addedMembers: string[],
  removedMembers: string[],
) {
  const updatedMembers: CountMembersProps = { ...members }
  if (!!addedMembers.length) {
    _.forEach(addedMembers, (memberUuid) => {
      const isOrganiser = !!members[memberUuid]?.isOrganiser
      const orgMember = orgMembers![memberUuid]
      const member = _.omit(orgMember, "role")
      const countMember: CountMemberProps = {
        ...member,
        isOrganiser: isOrganiser,
        isCounter: true,
        isJoined: isOrganiser,
        isCounting: isOrganiser,
        step: isOrganiser ? "review" : "dashboard",
      }
      _.set(updatedMembers, memberUuid, countMember)
    })
  }
  if (!!removedMembers.length) {
    _.forEach(removedMembers, (memberUuid) => {
      const isOrganiser = members[memberUuid].isOrganiser
      if (isOrganiser) {
        const member = members[memberUuid]
        const countMember: CountMemberProps = {
          ...member,
          isCounter: false,
          step: "review",
        }
        _.set(updatedMembers, memberUuid, countMember)
      } else {
        _.unset(updatedMembers, memberUuid)
      }
    })
  }
  return updatedMembers
}
/*




*/
export function prepareManagedCountResults(
  results: CountResultsProps,
  addedMembers: string[] = [],
  removedMembers: string[] = [],
  transferredMembers: { [key: string]: string } = {},
  isCurrentCountTypeChangedFromDualtoTeam: boolean,
) {
  const updatedResults: CountResultsProps = { ...results }
  if (isCurrentCountTypeChangedFromDualtoTeam) {
    const memberUuidList = _.keys(results)
    const memberOneResults = { ...results[memberUuidList[0]] }
    const memberTwoResults = { ...results[memberUuidList[1]] }
    _.forEach(memberTwoResults, (item, itemId) => {
      if (itemId in memberOneResults) {
        _.unset(memberTwoResults, itemId)
      }
    })
    _.set(updatedResults, memberUuidList[1], memberTwoResults)
  }
  if (!!addedMembers.length) {
    _.forEach(addedMembers, (memberUuid) => {
      _.set(updatedResults, memberUuid, {})
    })
  }
  if (removedMembers.length) {
    _.forEach(removedMembers, (memberUuid) => {
      _.unset(updatedResults, memberUuid)
    })
  }
  if (!_.isEmpty(transferredMembers)) {
    _.forEach(transferredMembers, (newMemberUuid, oldMemberUuid) => {
      _.set(updatedResults, newMemberUuid, _.get(results, oldMemberUuid))
    })
  }
  return updatedResults
}
/*




*/
export function prepareManagedCountMetatdata(
  metadata: CountMetadataProps,
  updatedMembers: CountMembersProps,
  countType: CountTypes,
) {
  const counters = _.keys(
    _.pickBy(updatedMembers, (member) => member.isCounter),
  )
  const type = countType
  const updatedMetadata: CountMetadataProps = {
    ...metadata,
    type,
    counters,
    isManaging: false,
  }

  return updatedMetadata
}
/*




*/
