import { v4 as uuidv4 } from "uuid"
import { store } from "../app/store"
import { NotificationProps, showNotification } from "../features/core/coreSlice"

/*





*/
export const generateModules = (
  start: number,
  count: number,
  ratio: number,
) => {
  return new Array(count + 1)
    .fill(true)
    .map(() => {
      start *= ratio
      return Math.round(start * count) / count
    })
    .map((module: any) => module + "rem")
}
/*









*/
type Notification = Omit<NotificationProps, "uuid">
type NotificationsProps = {
  deleteOrg: Notification
  createInvite: Notification
  deleteInvite: Notification
  deleteOrgMember: Notification
  inviteKeyCopied: Notification
}
type NotificationNames = keyof NotificationsProps
export function generateNotification(notification: NotificationNames) {
  const orgName = store.getState().organisation.org.name
  const NOTIFICATIONS: NotificationsProps = {
    deleteOrg: {
      type: "success",
      message: `${orgName} has been deleted.`,
    },
    createInvite: {
      type: "success",
      message: `Invite created.`,
    },
    deleteInvite: {
      type: "success",
      message: `Invite deleted.`,
    },
    deleteOrgMember: {
      type: "success",
      message: `Member removed from ${orgName}.`,
    },
    inviteKeyCopied: {
      type: "info",
      message: "Invite key copied to clipboard.",
    },
  }
  const payload: NotificationProps = {
    uuid: uuidv4(),
    type: NOTIFICATIONS[notification].type,
    message: NOTIFICATIONS[notification].message,
  }
  store.dispatch(showNotification(payload))
}
/*









*/
