import _ from "lodash"
import { store } from "../../app/store"
import { formatCommaSeparatedNumber, getTimeStamp } from "../../common/utils"
import { ColumnData, ColumnGroupData, RowData } from "../../components/table"
import {
  CountChecksProps,
  MembersProps,
} from "../org/orgSlice"
import { StockProps } from "../stock/stockSlice"
import { v4 as uuidv4 } from "uuid"
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
  SetCountResultsItemProps,
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
import {
  HistoryItemCommentsProps,
  HistoryItemMetadataProps,
  HistoryItemProps,
  HistoryItemResultsProps,
  setHistoryItem,
} from "../history/historySlice"
/*





*/
export function updateCountStep(step: CountSteps, updateMember?: boolean) {
  store.dispatch(setCountStep({ step, updateMember: !!updateMember }))
}
/*





*/
export function updateCountComments(payload: Partial<CountCommentsProps>) {
  const prevComments = store.getState().count.count.comments
  if (prevComments) {
    const comments = updateCountCommentsPayload(prevComments, payload)
    store.dispatch(setCountComments({ comments, updateDB: true }))
  } else {
    store.dispatch(setCountComments({ comments: payload, updateDB: true }))
  }
}
/*





*/
export function updateCountCommentsPayload(
  prevComments: CountCommentsProps,
  payload: Partial<CountCommentsProps>,
) {
  const comments = { ...prevComments, ...payload }
  return comments
}
/*





*/
export function updateCountResultItem(payload: SetCountResultsItemProps) {
  store.dispatch(setCountResultsItem(payload))
}
/*





*/
export function removeCountResultsItem(payload: DeleteCountItemProps) {
  store.dispatch(deleteCountResultsItem(payload))
}
/*
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
  const userUuid = store.getState().user.user.uuid as string
  const members = store.getState().count.count.members
  if (members) {
    const userMember = members[userUuid]
    const member = updateCountMemberPayload(userMember, payload)
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
    const member = updateCountMemberPayload(members[memberUuid], payload)
    store.dispatch(setCountMember({ member, updateDB: false }))
  }
}
/*





*/
export function updateCountMemberPayload(
  member: CountMemberProps,
  payload: Partial<CountMemberProps>,
): CountMemberProps {
  const updatedMember = { ...member, ...payload }
  return updatedMember
}
/*





*/
export function removeCountMember(memberUuid: string) {
  store.dispatch(deleteCountMember(memberUuid))
}
/*





*/
export function createCountMetadata(
  countType: CountTypes,
  counterUuids: string[],
) {
  const organiserUuid = store.getState().user.user.uuid as string
  const prepStartTime = getTimeStamp()
  const metadata = createCountMetadataPayload({
    type: countType,
    organiser: organiserUuid,
    counters: counterUuids,
    prepStartTime,
  })
  store.dispatch(setCountMetaData({ metadata, updateDB: true }))
}
/*





*/
export function createCountMetadataPayload(
  metadata: CountMetadataProps,
): CountMetadataProps {
  return { ...metadata }
}
/*





*/
export function updateCountMetadata(payload: Partial<CountMetadataProps>) {
  const metadata = store.getState().count.count.metadata
  if (metadata) {
    const updatedMetadata = updateCountMetadataPayload(metadata, payload)
    store.dispatch(
      setCountMetaData({ metadata: updatedMetadata, updateDB: true }),
    )
  }
}
/*





*/
export function updateCountMetadataPayload(
  metadata: CountMetadataProps,
  payload: Partial<CountMetadataProps>,
): CountMetadataProps {
  return { ...metadata, ...payload }
}
/*





*/
export function createCountChecks(satisfiedCheckUuids: string[]) {
  const checks = store.getState().org.org.countChecks
  if (checks) {
    const countChecks = createCountChecksPayload(checks, satisfiedCheckUuids)
    store.dispatch(setCountChecks({ checks: countChecks, updateDB: true }))
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
export function prepareSoloResultsTableRows(
  results: CountResultsProps,
  stock: StockProps,
): RowData[] {
  const rows: RowData[] = []

  _.forIn(results, (value, key) => {
    _.forIn(value, (value: CountItemProps, key) => {
      rows.push({
        id: key,
        name: stock[key].name,
        description: stock[key].description,
        useable: formatCommaSeparatedNumber(value.useableCount),
        damaged: formatCommaSeparatedNumber(value.damagedCount),
        obsolete: formatCommaSeparatedNumber(value.obsoleteCount),
      })
    })
  })

  return rows
}
/*





*/
export function prepareDualResultsTableRows(
  results: CountResultsProps,
  stock: StockProps,
): RowData[] {
  const rowsObject = {}
  const memberCountList = _.values(results)

  _.forIn(results, (value, key) => {
    const counterUuid = key
    _.forIn(value, (value: CountItemProps, key) => {
      const useableDiff = Math.abs(
        memberCountList[0][key].useableCount -
          memberCountList[1][key].useableCount,
      )
      const damagedDiff = Math.abs(
        memberCountList[0][key].damagedCount -
          memberCountList[1][key].damagedCount,
      )
      const obsoleteDiff = Math.abs(
        memberCountList[0][key].obsoleteCount -
          memberCountList[1][key].obsoleteCount,
      )
      const setInstructions = {
        [`${key}.id`]: key,
        [`${key}.name`]: stock[key].name,
        [`${key}.description`]: stock[key].description,
        [`${key}.useable_${counterUuid}`]: formatCommaSeparatedNumber(
          value.useableCount,
        ),
        [`${key}.damaged_${counterUuid}`]: formatCommaSeparatedNumber(
          value.damagedCount,
        ),
        [`${key}.obsolete_${counterUuid}`]: formatCommaSeparatedNumber(
          value.obsoleteCount,
        ),
        [`${key}.useable_diff`]: formatCommaSeparatedNumber(useableDiff),
        [`${key}.damaged_diff`]: formatCommaSeparatedNumber(damagedDiff),
        [`${key}.obsolete_diff`]: formatCommaSeparatedNumber(obsoleteDiff),
      }

      _.forIn(setInstructions, (value, key) => {
        _.set(rowsObject, key, value)
      })
    })
  })
  return _.values(rowsObject)
}
/*





*/
export function prepareTeamResultsTableRows(
  results: CountResultsProps,
  stock: StockProps,
  members: MembersProps,
): RowData[] {
  const rows: RowData[] = []

  _.forIn(results, (value, key) => {
    const counterName = `${members[key].name[0]}. ${members[key].surname}`
    _.forIn(value, (value: CountItemProps, key) => {
      rows.push({
        id: key,
        name: stock[key].name,
        description: stock[key].description,
        useable: formatCommaSeparatedNumber(value.useableCount),
        damaged: formatCommaSeparatedNumber(value.damagedCount),
        obsolete: formatCommaSeparatedNumber(value.obsoleteCount),
        counterName,
      })
    })
  })

  return rows
}
/*





*/
export function prepareSoloResultsTableColumns(): ColumnData[] {
  const columnIds = [
    "id",
    "name",
    "description",
    "useable",
    "damaged",
    "obsolete",
  ]
  const columns: ColumnData[] = []
  _.forEach(columnIds, (columnId, index) => {
    columns.push({
      label: _.capitalize(columnId),
      dataKey: columnId,
      width: "min-content",
      align: index > 2 ? "right" : "left",
    })
  })
  return columns
}
/*





*/
export function prepareDualResultsTableColumns(
  results: CountResultsProps,
): ColumnData[] {
  const columnIds = ["id", "name", "description"]
  const counterIds = _.keys(results)
  _.forEach(counterIds, (counterId) => {
    columnIds.push(`useable_${counterId}`)
    columnIds.push(`damaged_${counterId}`)
    columnIds.push(`obsolete_${counterId}`)
  })
  columnIds.push("useable_diff", "damaged_diff", "obsolete_diff")

  const columns: ColumnData[] = []
  _.forEach(columnIds, (columnId, index) => {
    columns.push({
      label: _.capitalize(columnId.split("_")[0]),
      dataKey: columnId,
      width: "min-content",
      align: index > 2 ? "right" : "left",
    })
  })
  return columns
}
/*





*/
export function prepareTeamResultsTableColumns(): ColumnData[] {
  const columnIds = [
    "id",
    "name",
    "description",
    "useable",
    "damaged",
    "obsolete",
    "counterName",
  ]
  const columns: ColumnData[] = []
  _.forEach(columnIds, (columnId, index) => {
    const label = columnId === "counterName" ? "Name" : _.capitalize(columnId)
    columns.push({
      label,
      dataKey: columnId,
      width: "min-content",
      align: index < 2 || index === columnIds.length - 1 ? "left" : "right",
    })
  })
  return columns
}
/*





*/
export function prepareSoloResultsTableColumnGroups(): ColumnGroupData[] {
  const columnGroups: ColumnGroupData[] = [
    { label: "Stock Item", colSpan: 3 },
    { label: "Results", colSpan: 3 },
  ]
  return columnGroups
}
/*





*/
export function prepareDualResultsTableColumnGroups(
  results: CountResultsProps,
  members: MembersProps,
): ColumnGroupData[] {
  const columnGroups: ColumnGroupData[] = [{ label: "Stock Item", colSpan: 3 }]
  const counterUuids = _.keys(results)
  _.forEach(counterUuids, (counterUuid) => {
    const counterName = `${members[counterUuid].name[0]}. ${members[counterUuid].surname}`
    columnGroups.push({
      label: counterName,
      colSpan: 3,
    })
  })
  columnGroups.push({
    label: "Differences",
    colSpan: 3,
  })
  return columnGroups
}
/*





*/
export function prepareTeamResultsTableColumnGroups(): ColumnGroupData[] {
  const columnGroups: ColumnGroupData[] = [
    { label: "Stock Item", colSpan: 3 },
    { label: "Results", colSpan: 3 },
    { label: "Counters", colSpan: 1 },
  ]
  return columnGroups
}
/*





*/
export function submitCount() {
  const results = store.getState().count.count.results
  const metadata = store.getState().count.count
    .metadata as HistoryItemMetadataProps
  const comments = store.getState().count.count.comments
  if (!!results && !!metadata && !!comments) {
    const finalResults = prepareFinalResults(results)
    const payload = prepareSubmissionPayload(finalResults, metadata, comments)
    store.dispatch(setHistoryItem({ ...payload }))
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
export function prepareSubmissionPayload(
  results: HistoryItemResultsProps,
  metadata: HistoryItemMetadataProps,
  comments: HistoryItemCommentsProps,
): HistoryItemProps {
  const uuid = uuidv4()

  const payload = {
    uuid,
    metadata,
    results,
    comments,
  }
  return payload
}
/*





*/
