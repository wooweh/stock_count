import { SearchItemProps, SearchListProps } from "../../components/searchBar"
import { StockItemProps } from "./stockSlice"
/*




*/
export function prepareStockSearchList(list: StockItemProps[]): SearchListProps {
  return list.map((item: StockItemProps) => {
    const { id, name, unit } = item
    const description = unit
    const searchItem: SearchItemProps = { id, name, description }
    return searchItem
  })
}
/*




*/