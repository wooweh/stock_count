import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Slide, ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { v4 as uuidv4 } from "uuid"
import { useAppSelector } from "../../app/hooks"
import { store } from "../../app/store"
import {
  NotificationProps,
  hideNotification,
  selectIsDarkmode,
  selectNotification,
  selectShowNotification,
  showNotification,
} from "./coreSlice"
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
type NotificationNames = keyof NotificationsProps
export function generateNotification(notification: NotificationNames) {
  const orgName = store.getState().organisation.org.name
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
  const payload: NotificationProps = {
    uuid: uuidv4(),
    type: NOTIFICATIONS[notification].type,
    message: NOTIFICATIONS[notification].message,
  }
  store.dispatch(showNotification(payload))
}
/*





*/
export async function generateErrorNotification(errorCode: string) {
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

export function Notifications() {
  const dispatch = useDispatch()
  const notification = useAppSelector(selectNotification)
  const showNotification = useAppSelector(selectShowNotification)
  const isDarkmode = useAppSelector(selectIsDarkmode)

  const AUTO_CLOSE = 2000
  useEffect(() => {
    if (showNotification && notification) {
      dispatch(hideNotification())
      const notificationType = notification.type
      const notify = () => toast[notificationType](notification.message)
      notify()
    }
  }, [showNotification, dispatch, notification])

  return (
    <ToastContainer
      position="bottom-center"
      autoClose={AUTO_CLOSE}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      closeButton={false}
      pauseOnFocusLoss
      transition={Slide}
      draggable
      pauseOnHover
      theme={isDarkmode ? "dark" : "light"}
    />
  )
}
