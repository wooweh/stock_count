import { v4 as uuidv4 } from "uuid"
import { store } from "../../app/store"
import { setCountCheck } from "./../organisation/organisationSlice"
/*




*/
export function createCountCheck() {
  const id = uuidv4()
  const check = ""
  store.dispatch(setCountCheck({ id, check }))
}
/*




*/
export function updateCountCheck() {}
/*




*/
export function removeCountCheck() {}
/*




*/
