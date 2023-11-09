import { Stack, Typography } from "@mui/material"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { ListItemOptionProps } from "../../components/listItem"
import { ManagedList } from "../../components/managedList"
import { SearchItemProps } from "../../components/searchBar"
import { setHistoryUI } from "./history"
import { selectHistoryList } from "./historySlice"
import {
  removeHistory,
  removeHistoryItem,
  removeHistoryItems,
} from "./historySliceUtils"
import { prepareHistorySearchList } from "./historyUtils"
/*




*/
export function HistoryList() {
  return (
    <Outer>
      <HistoryManagementList />
    </Outer>
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
    <Stack
      width={"100%"}
      height={"100%"}
      paddingBottom={theme.module[3]}
      boxSizing={"border-box"}
    >
      {children}
    </Stack>
  )
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
    <Stack
      width={"100%"}
      height={"100%"}
      justifyContent={"center"}
      alignItems={"center"}
    >
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
    </Stack>
  )
}
/*




*/
