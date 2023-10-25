import _ from "lodash"
import { v4 as uuidv4 } from "uuid"
import { store } from "../../app/store"
import { getTimeStamp } from "../../common/utils"
import {
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
  CountResultsProps,
  CountSteps,
  CountTypes,
  DeleteCountItemProps,
  deleteCount,
  deleteCountMember,
  deleteCountResultsItem,
  setCountChecks,
  setCountComments,
  setCountMember,
  setCountMembers,
  setCountMetaData,
  setCountResultsItem,
  setCountStep,
} from "./countSlice"
import { generateCustomNotification } from "../core/coreUtils"
/*




*/
export function updateCountStep(step: CountSteps, updateMember?: boolean) {
  store.dispatch(setCountStep({ step, updateMember: !!updateMember }))
}
/*




*/
export function updateCountComments(payload: Partial<CountCommentsProps>) {
  const prevComments = store.getState().count.count.comments
  const comments = prevComments ? { ...prevComments, ...payload } : payload

  if (prevComments) {
    store.dispatch(setCountComments({ comments, updateDB: true }))
  } else {
    store.dispatch(setCountComments({ comments, updateDB: true }))
  }
}
/*




*/
export function addCountResultItem(id: string, memberUuid: string) {
  const item = {
    id,
    useableCount: 0,
    damagedCount: 0,
    obsoleteCount: 0,
    memberUuid,
  }
  store.dispatch(setCountResultsItem({ item, memberUuid }))
}
/*




*/
export function updateCountResultItem(
  item: CountItemProps,
  memberUuid: string,
) {
  store.dispatch(setCountResultsItem({ item, memberUuid }))
}
/*




*/
export function removeCountResultsItem(id: string, memberUuid: string) {
  store.dispatch(deleteCountResultsItem({ id, memberUuid }))
}
/*




*/
export function createCountMembers() {
  const members = store.getState().count.count.members
  if (members) store.dispatch(setCountMembers({ members, updateDB: true }))
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
export function removeCountMembers() {
  store.dispatch(setCountMembers({ members: {}, updateDB: true }))
}
/*




*/
export function updateUserCountMember(payload: Partial<CountMemberProps>) {
  const userUuid = store.getState().user.user.uuid
  const members = store.getState().count.count.members
  if (members && userUuid) {
    const member = { ...members[userUuid], payload }
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
    const member = { ...members[memberUuid], payload }
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
    type: countType,
    organiser: organiserUuid,
    counters: counterUuids,
    prepStartTime,
  }
  store.dispatch(setCountMetaData({ metadata, updateDB: true }))
}
/*




*/
export function updateCountMetadata(payload: Partial<CountMetadataProps>) {
  const prevMetadata = store.getState().count.count.metadata
  if (prevMetadata) {
    const metadata = { ...prevMetadata, ...payload }
    store.dispatch(setCountMetaData({ metadata, updateDB: true }))
  }
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
export function submitCount() {
  const countResults = store.getState().count.count.results
  const metadata = store.getState().count.count
    .metadata as HistoryItemMetadataProps
  const comments = store.getState().count.count.comments

  if (!!countResults && !!metadata && !!comments) {
    const uuid = uuidv4()
    const results = prepareFinalResults(countResults)
    store.dispatch(setHistoryItem({ uuid, metadata, results, comments }))
    store.dispatch(setCountStep({ step: "dashboard", updateMember: false }))
    store.dispatch(deleteCount())
    generateCustomNotification("success", "Count submitted to History")
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
export function createCountCheck() {
  const id = uuidv4()
  const check = ""
  store.dispatch(setCountCheck({ id, check }))
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
export function removeCount() {
  store.dispatch(deleteCount())
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
  updateCountMetadata({ countStartTime })
  updateCountComments({ preparation: comments })
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
  updateCountMetadata({ finalizationStartTime: getTimeStamp() })
  updateCountStep("finalization", true)
}
/*




*/