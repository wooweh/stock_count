import { Stack } from "@mui/material"
import _ from "lodash"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import useTheme from "../../common/useTheme"
import { AddItem } from "./addItem"
import { EditItem } from "./editItem"
import { StockList } from "./stockList"
import { StockItemProps } from "./stockSlice"
import { UploadItems } from "./uploadItems"
/*




*/
type IsEditingProps = false | StockItemProps
type StockUIState = {
  isAdding: boolean
  isEditing: IsEditingProps
  isUploading: boolean
  isSelecting: boolean
  scrollIndex: number
  selectedItems: string[]
}
type StockUIKeys = keyof StockUIState
const initialState: StockUIState = {
  isAdding: false,
  isEditing: false,
  isUploading: false,
  isSelecting: false,
  scrollIndex: 0,
  selectedItems: [],
}
export const useStockUI = create<StockUIState>()(
  persist(
    (set) => ({
      ...initialState,
    }),
    { name: "stock-storage", storage: createJSONStorage(() => sessionStorage) },
  ),
)

export function setStockUI(path: StockUIKeys, value: any) {
  useStockUI.setState({ [path]: value })
}
export function addStockUISelectedItem(id: string) {
  const selectedItems = useStockUI.getState().selectedItems
  const index = _.indexOf(selectedItems, id)
  if (index === -1) {
    const newSelectedItems = [id, ...selectedItems]
    useStockUI.setState({ selectedItems: newSelectedItems })
  }
}
export function removeStockUISelectedItem(id: string) {
  const selectedItems = useStockUI.getState().selectedItems
  const indexToRemove = _.indexOf(selectedItems, id)
  const newSelectedItems = [...selectedItems]
  newSelectedItems.splice(indexToRemove, 1)
  useStockUI.setState({ selectedItems: newSelectedItems })
}
export function resetStockUI() {
  useStockUI.setState(initialState)
}
/*




*/
export function Stock() {
  return (
    <Outer>
      <StockList />
      <AddItem />
      <UploadItems />
      <EditItem />
    </Outer>
  )
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
      boxSizing={"border-box"}
    >
      {children}
    </Stack>
  )
}
/*




*/
