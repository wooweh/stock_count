import _ from "lodash"
import { store } from "../../app/store"
import {
  StockItemProps,
  StockProps,
  deleteStock,
  deleteStockItem,
  setStock,
  setStockItem,
} from "./stockSlice"
/*




*/
export function updateStock(stock: StockProps, updateDB: boolean = false) {
  store.dispatch(setStock({ stock, updateDB }))
}
/*




*/
export function removeStock() {
  store.dispatch(deleteStock())
}
/*




*/
export function removeStockItems(ids: string[]) {
  _.forEach(ids, (id) => store.dispatch(deleteStockItem({ id })))
}
/*




*/
export function removeStockItem(id: string) {
  store.dispatch(deleteStockItem({ id }))
}
/*




*/
export function updateStockItem(id: string, name: string, description: string) {
  store.dispatch(
    setStockItem({
      id,
      name,
      description,
    }),
  )
}
/*




*/
export function uploadStockList(data: StockItemProps[]) {
  const stockList = {}
  _.forEach(data, (item) => _.set(stockList, item.id, item))
  store.dispatch(setStock({ stock: stockList, updateDB: true }))
}
/*




*/
