import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAppSelector } from "../../app/hooks"
import {
  hideNotification,
  selectIsDarkmode,
  selectNotification,
  selectShowNotification,
} from "./coreSlice"

export function Notification() {
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
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={isDarkmode ? "dark" : "light"}
    />
  )
}
