import _ from "lodash"
import { formatCommaSeparatedNumber } from "../../common/utils"
import { ColumnData, ColumnGroupData, RowData } from "../../components/table"
import { MembersProps } from "../org/orgSlice"
import { StockProps } from "../stock/stockSlice"
import { CountItemProps, CountResultsProps } from "./countSlice"
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
    const counterName = `${members[key].firstName[0]}. ${members[key].lastName}`
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
    const counterName = `${members[counterUuid].firstName[0]}. ${members[counterUuid].lastName}`
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
