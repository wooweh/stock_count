import _ from "lodash"
import "react-toastify/dist/ReactToastify.css"
import { IUseNetworkState } from "react-use/lib/useNetworkState"
import { v4 as uuidv4 } from "uuid"
import { store } from "../../app/store"
import { ThemeColors } from "../../common/useTheme"
import { IconNames } from "../../components/icon"
import { NotificationProps, NotificationTypes } from "./coreSlice"
import { showNotification } from "./coreSliceUtils"
import { Route } from "./pages"
/*




*/
export type GetRoutePathsReturnProps = {
  [key: string]: {
    path: string
    name: string
  }
}
export function getRoutePaths(routes: Route[]): GetRoutePathsReturnProps {
  const paths: GetRoutePathsReturnProps = {}

  routes.forEach((obj: any) => {
    const { name, path } = obj
    const keyName = _.replace(
      name.toLowerCase(),
      / ([a-z])/g,
      (match: any, char: string) => char.toUpperCase(),
    )
    paths[keyName] = { name: name, path: path }
  })
  return paths
}
/*




*/
export type getNetworkStateAttributesReturnProps = {
  isWifi: boolean
  isOnline: boolean
  status: "slow" | "medium" | "fast" | "offline"
  statusColor: ThemeColors
  iconName: IconNames
}
export function getNetworkStateAttributes(
  networkState: IUseNetworkState,
): getNetworkStateAttributesReturnProps {
  const downlink = networkState.downlink ?? 0
  const isWifi = networkState.type === "wifi"
  const isOnline = networkState.online ?? false
  const iconName = isWifi ? "wifi" : "cellular"
  const status = isOnline
    ? downlink < 1
      ? "slow"
      : downlink >= 1 && downlink < 10
      ? "medium"
      : "fast"
    : "offline"
  const statusColor = !isOnline
    ? "gray"
    : status === "slow"
    ? "red"
    : status === "medium"
    ? "orange"
    : "green"

  return {
    isWifi,
    isOnline,
    status,
    statusColor,
    iconName,
  }
}
/*




*/
type Notification = Omit<NotificationProps, "uuid">
type NotificationsProps = {
  deleteOrg: Notification
  leaveOrg: Notification
  createInvite: Notification
  deleteInvite: Notification
  deleteOrgMember: Notification
  inviteKeyCopied: Notification
  passwordReset: Notification
  passwordChange: Notification
  incorrectPassword: Notification
  tooManyFailedAttempts: Notification
  incorrectEmail: Notification
  invalidEmail: Notification
  newPasswordNotConfirmed: Notification
  newPasswordNotUnique: Notification
  newPasswordNotValid: Notification
  incompleteProfileDetails: Notification
  noFileChosen: Notification
}
export type NotificationNames = keyof NotificationsProps
export function generateNotification(notification: NotificationNames) {
  const orgName = store.getState().org.org.name
  const NOTIFICATIONS: NotificationsProps = {
    deleteOrg: {
      type: "success",
      message: `Organisation deleted.`,
    },
    leaveOrg: {
      type: "success",
      message: `You have left the Organisation.`,
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
    passwordChange: {
      type: "success",
      message: "Your password has been changed.",
    },
    inviteKeyCopied: {
      type: "info",
      message: "Invite key copied to clipboard.",
    },
    passwordReset: {
      type: "info",
      message: "Check your email for password reset link.",
    },
    newPasswordNotConfirmed: {
      type: "warning",
      message: "Ensure new password is confirmed.",
    },
    newPasswordNotUnique: {
      type: "warning",
      message: "Ensure new password is different.",
    },
    newPasswordNotValid: {
      type: "warning",
      message: "Ensure new password meets check criteria.",
    },
    incorrectPassword: {
      type: "error",
      message: "Password is incorrect.",
    },
    tooManyFailedAttempts: {
      type: "error",
      message: "Account temporarily disabled, try again later.",
    },
    incorrectEmail: {
      type: "error",
      message: "Email incorrect or unregistered.",
    },
    invalidEmail: {
      type: "error",
      message: "Email invalid.",
    },
    incompleteProfileDetails: {
      type: "error",
      message: "Complete all profile details.",
    },
    noFileChosen: {
      type: "error",
      message: "Choose a file for upload.",
    },
  }
  const type = NOTIFICATIONS[notification].type
  const message = NOTIFICATIONS[notification].message
  const payload = prepareNotificationPayload(type, message)
  showNotification(payload)
}
/*




*/
export async function generateCustomNotification(
  type: NotificationTypes,
  message: string,
) {
  const payload = prepareNotificationPayload(type, message)
  showNotification(payload)
}
/*




*/
export function prepareNotificationPayload(
  type: NotificationTypes,
  message: string,
): NotificationProps {
  const uuid = uuidv4()
  const payload: NotificationProps = { uuid, type, message }
  return payload
}
/*




*/
export async function generateErrorNotification(errorCode: string) {
  console.log("error", errorCode)
  if (errorCode === "auth/wrong-password")
    generateNotification("incorrectPassword")
  if (errorCode === "auth/user-not-found")
    generateNotification("incorrectEmail")
  if (errorCode === "auth/invalid-email") generateNotification("invalidEmail")
  if (errorCode === "auth/too-many-requests")
    generateNotification("tooManyFailedAttempts")
}
/*




*/
