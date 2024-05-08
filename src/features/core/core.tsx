import { useLocation } from "react-router-dom"
import { ErrorBoundary } from "../../components/errorBoundary"
import { Window } from "../../components/surface"
import { signIn } from "../user/userAuth"
import { Bar } from "./bar"
import { DBListeners } from "./dbListeners"
import { Notifications } from "./notifications"
import { Pages } from "./pages"
/*




*/
export default function Core() {
  const location = useLocation()
  const path = location.pathname

  const isDev = import.meta.env.DEV
  if (isDev) {
    const email = import.meta.env.VITE_DEV_USER_EMAIL
    const password = import.meta.env.VITE_DEV_USER_PASSWORD
    signIn(email, password)
  }

  return (
    <ErrorBoundary componentName={"Core"} featurePath={path}>
      <Window justifyContent={"center"}>
        <Bar />
        <DBListeners />
        <Notifications />
        <Pages />
      </Window>
    </ErrorBoundary>
  )
}
