import { formatLongDate } from "../../common/utils"
import { SearchItemProps, SearchListProps } from "../../components/searchBar"
import { getMemberName } from "../org/orgUtils"
import { HistoryItemProps } from "./historySlice"
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
