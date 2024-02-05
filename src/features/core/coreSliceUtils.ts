import _ from "lodash"
import { store } from "../../app/store"
import { setCount } from "../count/countSlice"
import { setMemberStatus, setOrg } from "../org/orgSlice"
import { setStock } from "../stock/stockSlice"
import { setUser } from "../user/userSlice"
import {
  NotificationProps,
  setNotification,
  setShowNotification,
  setSystemStatus,
  toggleIsDarkmode,
  toggleIsMobile,
} from "./coreSlice"

/*




*/
export function setSystemIsBooting() {
  store.dispatch(setSystemStatus("isBooting"))
}
/*




*/
export function setSystemIsBooted() {
  store.dispatch(setSystemStatus("isBooted"))
}
/*




*/
export function setSystemNotBooted() {
  store.dispatch(setSystemStatus("notBooted"))
}
/*




*/
export function toggleDarkmode() {
  store.dispatch(toggleIsDarkmode())
}
/*




*/
export function toggleMobile(width: number) {
  const mobileWidth = 750
  const isMobile = store.getState().core.isMobile
  const toggleMobile =
    (width && width < mobileWidth && !isMobile) ||
    (width && width > mobileWidth && isMobile)
  if (toggleMobile) store.dispatch(toggleIsMobile())
}
/*




*/
export function showNotification(notificaiton: NotificationProps) {
  store.dispatch(setShowNotification(true))
  store.dispatch(setNotification(notificaiton))
  _.delay(() => resetShowNotification(), 250)
}
/*




*/
function resetShowNotification() {
  store.dispatch(setShowNotification(false))
  store.dispatch(setNotification(undefined))
}
/*




*/
export function resetSystem() {
  store.dispatch(setSystemStatus("notBooted"))
  store.dispatch(setMemberStatus("notJoined"))
  store.dispatch(setUser({ user: {}, updateDB: false }))
  store.dispatch(setOrg({ org: {}, updateDB: false }))
  store.dispatch(setStock({ stock: {}, updateDB: false }))
  store.dispatch(setCount({ count: {}, updateDB: false }))
}
/*




*/
