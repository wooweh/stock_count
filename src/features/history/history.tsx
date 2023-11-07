import { Stack } from "@mui/material"
import _ from "lodash"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { HistoryList } from "./historyList"
import useTheme from "../../common/useTheme"
import { Review } from "./review"
/*




*/
export type HistoryUIState = {
  isSelecting: boolean
  reviewItemUuid: string
  reviewSectionName: "details" | "comments" | "results"
  scrollIndex: number
  selectedItems: string[]
}
type HistoryUIKeys = keyof HistoryUIState
const initialState: HistoryUIState = {
  isSelecting: false,
  reviewItemUuid: "",
  reviewSectionName: "details",
  scrollIndex: 0,
  selectedItems: [],
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
export function addHistoryUISelectedItem(id: string) {
  const selectedItems = useHistoryUI.getState().selectedItems
  const index = _.indexOf(selectedItems, id)
  if (index === -1) {
    const newSelectedItems = [id, ...selectedItems]
    useHistoryUI.setState({ selectedItems: newSelectedItems })
  }
}
export function removeHistoryUISelectedItem(id: string) {
  const selectedItems = useHistoryUI.getState().selectedItems
  const indexToRemove = _.indexOf(selectedItems, id)
  const newSelectedItems = [...selectedItems]
  newSelectedItems.splice(indexToRemove, 1)
  useHistoryUI.setState({ selectedItems: newSelectedItems })
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
