import { ref, remove, set } from "firebase/database"
import _ from "lodash"
import { store } from "../../app/store"
import { dbReal } from "../../remote"
import { getDBPath } from "../../remote/dbPaths"
import { HistoryItemProps } from "./historySlice"
/* 





*/
export function deleteHistoryOnDB() {
  const orgUuid = store.getState().org.org.uuid
  if (orgUuid) {
    const dbPath = getDBPath.history(orgUuid).history
    remove(ref(dbReal, dbPath)).catch((error) => {
      console.log(error)
    })
  }
}
/* 





*/
export function setHistoryItemOnDB(item: HistoryItemProps) {
  const orgUuid = store.getState().org.org.uuid
  const countUuid = item.uuid
  if (orgUuid) {
    const dbPath = getDBPath.history(orgUuid).historyItem(countUuid).item
    set(ref(dbReal, dbPath), item).catch((error) => {
      console.log(error)
    })
  }
}
/* 





*/
export function deleteHistoryItemOnDB(uuid: string) {
  const orgUuid = store.getState().org.org.uuid
  if (orgUuid) {
    const dbPath = getDBPath.history(orgUuid).historyItem(uuid).item
    remove(ref(dbReal, dbPath)).catch((error) => {
      console.log(error)
    })
  }
}
/* 





*/
