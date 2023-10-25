import { Stack } from "@mui/material"
import _ from "lodash"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { HistoryList } from "./historyList"
import useTheme from "../../common/useTheme"
import { Review } from "./review"
/*




*/
export type UseHistoryState = {
  isSelecting: boolean
  reviewItemUuid: string
  reviewSectionName: "details" | "comments" | "results"
  scrollIndex: number
  selectedItems: string[]
}
type UseHistoryKeys = keyof UseHistoryState
const initialState: UseHistoryState = {
  isSelecting: false,
  reviewItemUuid: "",
  reviewSectionName: "details",
  scrollIndex: 0,
  selectedItems: [],
}
export const useHistoryStore = create<UseHistoryState>()(
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

export function setUseHistory(path: UseHistoryKeys, value: any) {
  useHistoryStore.setState({ [path]: value })
}
export function addUseHistorySelectedItem(id: string) {
  const selectedItems = useHistoryStore.getState().selectedItems
  const index = _.indexOf(selectedItems, id)
  if (index === -1) {
    const newSelectedItems = [id, ...selectedItems]
    useHistoryStore.setState({ selectedItems: newSelectedItems })
  }
}
export function removeUseHistorySelectedItem(id: string) {
  const selectedItems = useHistoryStore.getState().selectedItems
  const indexToRemove = _.indexOf(selectedItems, id)
  const newSelectedItems = [...selectedItems]
  newSelectedItems.splice(indexToRemove, 1)
  useHistoryStore.setState({ selectedItems: newSelectedItems })
}
export function resetUseHistory() {
  useHistoryStore.setState(initialState)
}
/*




*/
export function History() {
  const isReviewing = useHistoryStore(
    (state: UseHistoryState) => state.reviewItemUuid,
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
      marginBottom={theme.module[2]}
      boxSizing={"border-box"}
    >
      {children}
    </Stack>
  )
}
/*




*/
