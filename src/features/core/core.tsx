import { Stack } from "@mui/material"
import { useLocation } from "react-router-dom"
import { ErrorBoundary } from "../../components/errorBoundary"
import { Bar } from "./bar"
import { DBListeners } from "./dbListeners"
import { Notifications } from "./notifications"
import { Pages } from "./pages"
/*




*/
export default function Core() {
  const location = useLocation()
  const path = location.pathname

  return (
    <ErrorBoundary componentName={"Core"} featurePath={path}>
      <Stack width={"100vw"} height={"100vh"} alignItems={"center"}>
        <Bar />
        <DBListeners />
        <Notifications />
        <Pages />
      </Stack>
    </ErrorBoundary>
  )
}
