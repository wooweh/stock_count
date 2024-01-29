import { Stack } from "@mui/material"
import { useLocation } from "react-router-dom"
import { ErrorBoundary } from "../../components/errorBoundary"
import { Bar } from "./bar"
import { DBListeners } from "./dbListeners"
import { Notifications } from "./notifications"
import { Pages } from "./pages"
import { Window } from "../../components/surface"
/*




*/
export default function Core() {
  const location = useLocation()
  const path = location.pathname

  return (
    <ErrorBoundary componentName={"Core"} featurePath={path}>
      <Window justifyContent={"center"} bgcolor={"blue"}>
        <Bar />
        <DBListeners />
        <Notifications />
        <Pages />
      </Window>
    </ErrorBoundary>
  )
}
