import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Slide, ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAppSelector } from "../../app/hooks"
import {
  selectIsDarkmode,
  selectNotification,
  selectShowNotification,
} from "./coreSlice"
/*




*/
export function Notifications() {
  const notification = useAppSelector(selectNotification)
  const showNotification = useAppSelector(selectShowNotification)
  const isDarkmode = useAppSelector(selectIsDarkmode)

  useEffect(() => {
    if (showNotification && notification) {
      const notificationType = notification.type
      const notify = () => toast[notificationType](notification.message)
      notify()
    }
  }, [showNotification, notification])

  const AUTO_CLOSE = 2000

  return (
    <ToastContainer
      position="bottom-center"
      autoClose={AUTO_CLOSE}
      hideProgressBar={true}
      newestOnTop={true}
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
/*




*/
