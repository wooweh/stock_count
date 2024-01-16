import { Typography } from "@mui/material"
import { useLocation } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { ErrorBoundary } from "../../components/errorBoundary"
import { ListItemOptionProps } from "../../components/listItem"
import { ManagedList } from "../../components/managedList"
import { SearchItemProps } from "../../components/searchBar"
import { Window } from "../../components/surface"
import { setHistoryUI, useHistoryUI } from "./history"
import { selectHistoryList } from "./historySliceSelectors"
import {
  removeHistory,
  removeHistoryItem,
  removeHistoryItems,
} from "./historySliceUtils"
import { prepareHistorySearchList } from "./historyUtils"
/*




*/
export function HistoryList() {
  const location = useLocation()
  const historyUIState = useHistoryUI((state) => state)
  const path = location.pathname

  return (
    <ErrorBoundary
      componentName={"HistoryList"}
      featurePath={path}
      state={{ featureUI: { ...historyUIState } }}
    >
      <Outer>
        <HistoryManagementList />
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

  return <Window paddingBottom={theme.module[3]}>{children}</Window>
}
/*




*/
export function HistoryManagementList() {
  const historyList = useAppSelector(selectHistoryList)
  const historySearchList = prepareHistorySearchList(historyList)

  function getOptions(item: SearchItemProps) {
    const options: ListItemOptionProps[] = [
      {
        iconName: "visible",
        onClick: () => setHistoryUI("reviewItemUuid", item.id),
      },
      {
        iconName: "delete",
        onClick: () => removeHistoryItem(item.id),
      },
    ]
    return options
  }

  return (
    <ManagedList
      heading={"History List"}
      list={historySearchList}
      bulletIconName={"history"}
      onDeleteSelection={removeHistoryItems}
      onDeleteAll={removeHistory}
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
