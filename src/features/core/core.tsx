import { Bar } from "./bar"
import { DBListeners } from "./dbListeners"
import { Notifications } from "./notifications"
import { Pages } from "./pages"
/*




*/
export default function Core() {
  return (
    <>
      <Bar />
      <DBListeners />
      <Notifications />
      <Pages />
    </>
  )
}
