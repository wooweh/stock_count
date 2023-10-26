import _ from "lodash"
import { store } from "../../app/store"
import {
  HistoryProps,
  deleteHistory,
  deleteHistoryItem,
  setHistory,
} from "./historySlice"
/*




*/
export function updateHistory(history: HistoryProps) {
  store.dispatch(setHistory(history))
}
/*




*/
export function removeHistory() {
  store.dispatch(deleteHistory())
}
/*




*/
export function removeHistoryItems(uuids: string[]) {
  _.forEach(uuids, (uuid) => store.dispatch(deleteHistoryItem({ uuid })))
}
/*




*/
export function removeHistoryItem(uuid: string) {
  store.dispatch(deleteHistoryItem({ uuid }))
}
/*




*/
