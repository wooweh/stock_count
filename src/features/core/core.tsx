import { Stack } from "@mui/material"
import { Bar } from "./bar"
import { DBListeners } from "./dbListeners"
import { Notifications } from "./notifications"
import { Pages } from "./pages"
/*




*/
export default function Core() {
  return (
    <Stack width={"100vw"} height={"100vh"} alignItems={"center"}>
      <Bar />
      <DBListeners />
      <Notifications />
      <Pages />
    </Stack>
  )
}
