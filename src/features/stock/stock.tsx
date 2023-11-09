import { Stack } from "@mui/material"
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
}
type StockUIKeys = keyof StockUIState
const initialState: StockUIState = {
  isAdding: false,
  isEditing: false,
  isUploading: false,
  isSelecting: false,
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
      bgcolor={theme.scale.gray[8]}
      boxSizing={"border-box"}
    >
      {children}
    </Stack>
  )
}
/*




*/
