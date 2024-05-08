import _ from "lodash"
import { formatCommaSeparatedNumber, formatLongDate } from "../../common/utils"
import { SearchItemProps, SearchListProps } from "../../components/searchBar"
import { RowData } from "../../components/table"
import { CountItemProps, CountResultsProps } from "../count/countSlice"
import { getMemberName } from "../org/orgUtils"
import { HistoryItemProps, HistoryItemResultsProps } from "./historySlice"
import { prepareSoloResultsTableColumns } from "../count/countUtils"
/*




*/
export function prepareHistorySearchList(
  list: HistoryItemProps[],
): SearchListProps {
  return list.map((item: HistoryItemProps) => {
    const id = item.uuid
    const name = formatLongDate(item.metadata.countStartTime)
    const members = item.members
    const organiser = members[item.metadata.organiser]
    const organiserName = getMemberName(organiser)
    const description = `Organizer - ${organiserName}`
    const searchItem: SearchItemProps = { id, name, description }
    return searchItem
  })
}
/*




*/
export function prepareHistoryResultsTableRows(results: CountResultsProps) {
  const rows: RowData[] = []

  _.forIn(results, (value, key) => {
    _.forIn(value, (value: CountItemProps, key) => {
      rows.push({
        id: key,
        name: value.name,
        unit: value.unit,
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
export function prepareHistoryResultsTableColumns() {
  return prepareSoloResultsTableColumns()
}
/*




*/
