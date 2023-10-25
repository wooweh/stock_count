import _ from "lodash"
import { store } from "../../app/store"
import { deleteHistory, deleteHistoryItem } from "./historySlice"
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
