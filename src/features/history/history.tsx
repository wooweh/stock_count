import { Stack } from "@mui/material"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
/*




*/
type UseHistoryState = {}
type UseHistoryKeys = keyof UseHistoryState
const initialState: UseHistoryState = {}
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
export function resetUseHistory() {
  useHistoryStore.setState(initialState)
}
/*




*/
export function History() {
  return <Stack>History</Stack>
}
/*




*/
