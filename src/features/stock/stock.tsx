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
type UseStockState = {
  isAdding: boolean
  isEditing: IsEditingProps
  isUploading: boolean
  isSelecting: boolean
  scrollIndex: number
  selectedItems: string[]
}
type UseStockKeys = keyof UseStockState
const initialState: UseStockState = {
  isAdding: false,
  isEditing: false,
  isUploading: false,
  isSelecting: false,
  scrollIndex: 0,
  selectedItems: [],
}
export const useStockStore = create<UseStockState>()(
  persist(
    (set) => ({
      ...initialState,
    }),
    { name: "stock-storage", storage: createJSONStorage(() => sessionStorage) },
  ),
)

export function setUseStock(path: UseStockKeys, value: any) {
  useStockStore.setState({ [path]: value })
}
export function addUseStockSelectedItem(id: string) {
  const selectedItems = useStockStore.getState().selectedItems
  const index = _.indexOf(selectedItems, id)
  if (index === -1) {
    const newSelectedItems = [id, ...selectedItems]
    useStockStore.setState({ selectedItems: newSelectedItems })
  }
}
export function removeUseStockSelectedItem(id: string) {
  const selectedItems = useStockStore.getState().selectedItems
  const indexToRemove = _.indexOf(selectedItems, id)
  const newSelectedItems = [...selectedItems]
  newSelectedItems.splice(indexToRemove, 1)
  useStockStore.setState({ selectedItems: newSelectedItems })
}
export function resetUseStock() {
  useStockStore.setState(initialState)
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
