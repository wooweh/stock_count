import { Stack } from "@mui/material"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import useTheme from "../../common/useTheme"
import { HistoryList } from "./historyList"
import { Review } from "./review"
/*




*/
export type HistoryUIState = {
  reviewItemUuid: string
  reviewSectionName: "details" | "comments" | "results"
}
type HistoryUIKeys = keyof HistoryUIState
const initialState: HistoryUIState = {
  reviewItemUuid: "",
  reviewSectionName: "details",
}
export const useHistoryUI = create<HistoryUIState>()(
  persist(
    (set) => ({
      ...initialState,
    }),
    {
      name: "history-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export function setHistoryUI(path: HistoryUIKeys, value: any) {
  useHistoryUI.setState({ [path]: value })
}
export function resetHistoryUI() {
  useHistoryUI.setState(initialState)
}
/*




*/
export function History() {
  const isReviewing = useHistoryUI(
    (state: HistoryUIState) => state.reviewItemUuid,
  )
  return <Outer>{!!isReviewing ? <Review /> : <HistoryList />}</Outer>
}
/*





*/
function Outer({ children }: { children: any }) {
  const theme = useTheme()

  return (
    <Stack
      width={"100%"}
      height={"100%"}
      padding={theme.module[3]}
      bgcolor={theme.scale.gray[8]}
      paddingBottom={theme.module[2]}
      boxSizing={"border-box"}
    >
      {children}
    </Stack>
  )
}
/*




*/
