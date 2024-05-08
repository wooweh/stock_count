import { Stack, Typography } from "@mui/material"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Button } from "../../components/button"
import { ListItemOptionProps } from "../../components/listItem"
import { ManagedList } from "../../components/managedList"
import { SearchItemProps } from "../../components/searchBar"
import { setStockUI, useStockUI } from "./stock"
import { selectStockList } from "./stockSliceSelectors"
import {
  removeStock,
  removeStockItem,
  removeStockItems,
} from "./stockSliceUtils"
import { prepareStockSearchList } from "./stockUtils"
import { ErrorBoundary } from "../../components/errorBoundary"
import { useLocation } from "react-router-dom"
import { Slot, Window } from "../../components/surface"
/*




*/
export function StockList() {
  const location = useLocation()
  const stockUIState = useStockUI((state) => state)
  const path = location.pathname

  return (
    <ErrorBoundary
      componentName={"StockList"}
      featurePath={path}
      state={{ featureUI: { ...stockUIState } }}
    >
      <Outer>
        <StockManagementList />
        <ButtonTray />
      </Outer>
    </ErrorBoundary>
  )
}
/*




*/
function Outer({
  children,
}: {
  children: React.ReactElement | React.ReactElement[]
}) {
  const theme = useTheme()

  return (
    <Window gap={theme.module[4]} bgcolor={theme.scale.gray[8]}>
      {children}
    </Window>
  )
}
/*




*/
export function StockManagementList() {
  const stockList = useAppSelector(selectStockList)
  const stockSearchList = prepareStockSearchList(stockList)

  function getOptions(item: SearchItemProps) {
    const options: ListItemOptionProps[] = [
      {
        iconName: "edit",
        onClick: () => setStockUI("isEditing", item),
      },
      {
        iconName: "delete",
        onClick: () => removeStockItem(item.id),
      },
    ]
    return options
  }

  return (
    <ManagedList
      heading={"Stock List"}
      list={stockSearchList}
      bulletIconName={"stock"}
      onDeleteSelection={removeStockItems}
      onDeleteAll={removeStock}
      options={getOptions}
      emptyListPlaceholder={EmptyListPlaceholder}
    />
  )
}
/*




*/
function EmptyListPlaceholder() {
  const theme = useTheme()

  return (
    <Window justifyContent={"center"}>
      <Typography variant="h6" color={theme.scale.gray[5]}>
        Click + to add a stock item
      </Typography>
      <Typography
        variant="h6"
        color={theme.scale.gray[5]}
        sx={{ display: "flex", alignItems: "center" }}
      >
        or upload a CSV stock list
      </Typography>
    </Window>
  )
}
/*




*/
function ButtonTray() {
  const theme = useTheme()

  function handleAdd() {
    setStockUI("isAdding", true)
  }

  function handleUpload() {
    setStockUI("isUploading", true)
  }

  return (
    <Slot gap={theme.module[4]} padding={theme.module[2]}>
      <Button
        variation={"profile"}
        iconName={"add"}
        onClick={handleAdd}
        bgColor={theme.scale.gray[7]}
        outlineColor={theme.scale.gray[6]}
        justifyCenter
      />
      <Button
        id="stock-upload-button"
        variation={"profile"}
        iconName={"upload"}
        onClick={handleUpload}
        bgColor={theme.scale.gray[7]}
        outlineColor={theme.scale.gray[6]}
        justifyCenter
      />
    </Slot>
  )
}
/*




*/
