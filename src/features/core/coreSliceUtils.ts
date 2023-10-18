import { store } from "../../app/store"
import { setCount } from "../count/countSlice"
import { setMemberStatus, setOrg } from "../organisation/organisationSlice"
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
  const mobileWidth = 1000
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
  setTimeout(() => {
    store.dispatch(setShowNotification(false))
    store.dispatch(setNotification(undefined))
  }, 250)
}
/*




*/
export function resetSystem() {
  setSystemNotBooted()
  store.dispatch(setMemberStatus("notJoined"))
  store.dispatch(setUser({}))
  store.dispatch(setOrg({}))
  store.dispatch(setStock({ stock: {}, updateDB: false }))
  store.dispatch(setCount({}))
}
/*




*/