import { Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useEffect, useRef, useState } from "react"
import { Virtuoso } from "react-virtuoso"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Button } from "../../components/button"
import Icon from "../../components/icon"
import {
  ListItemOptionProps,
  SelectableListItemWithOptions,
} from "../../components/listItem"
import { ScrollToTop } from "../../components/scrollToTop"
import { SearchBar, SearchListProps } from "../../components/searchBar"
import {
  addUseHistorySelectedItem,
  removeUseHistorySelectedItem,
  setUseHistory,
  useHistoryStore,
} from "./history"
import {
  deleteHistory,
  deleteHistoryItem,
  selectHistoryIdList,
  selectHistoryList,
  selectHistorySearchList,
} from "./historySlice"
/*





*/
export function HistoryList() {
  const theme = useTheme()
  return (
    <Stack width={"100%"} height={"100%"} gap={theme.module[4]}>
      <Stack
        width={"100%"}
        height={"100%"}
        gap={theme.module[2]}
        padding={`0 ${theme.module[2]}`}
        boxSizing={"border-box"}
      >
        <Header />
        <Body />
      </Stack>
    </Stack>
  )
}
/*





*/
function Header() {
  const theme = useTheme()

  const historyList = useAppSelector(selectHistoryList)
  const isSelecting = useHistoryStore((state: any) => state.isSelecting)

  return (
    !!historyList.length && (
      <Stack width={"100%"} height={theme.module[6]} flexShrink={0}>
        {isSelecting ? <HistorySelectionBar /> : <HistorySearchBar />}
      </Stack>
    )
  )
}
/*





*/
function HistorySearchBar() {
  const theme = useTheme()
  const historySearchList = useAppSelector(selectHistorySearchList)

  function handleSelect(item: any) {
    const index = _.findIndex(
      historySearchList,
      (historyItem) => historyItem.id === item.id,
    )
    setUseHistory("scrollIndex", index)
  }

  function formatResult(item: SearchListProps) {
    return (
      <Stack>
        <Typography>{item.name}</Typography>
        <Typography color={theme.scale.gray[5]}>{item.description}</Typography>
      </Stack>
    )
  }

  return (
    <SearchBar
      heading={"Count History"}
      list={historySearchList}
      searchKeys={["name", "description"]}
      handleSelect={handleSelect}
      formatResult={formatResult}
    />
  )
}
/*





*/
function HistorySelectionBar() {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const selectedItems = useHistoryStore((state: any) => state.selectedItems)
  const historyIdList = useAppSelector(selectHistoryIdList)

  const isAllSelected =
    !!selectedItems.length && historyIdList.length === selectedItems.length

  function handleSelectAll() {
    setUseHistory("selectedItems", historyIdList)
  }

  function handleDelete() {
    if (isAllSelected) {
      dispatch(deleteHistory({ updateDB: true }))
    } else {
      _.forEach(selectedItems, (id) =>
        dispatch(deleteHistoryItem({ uuid: id })),
      )
    }
    setUseHistory("selectedItems", [])
    setUseHistory("isSelecting", false)
  }

  function handleBack() {
    setUseHistory("selectedItems", [])
    setUseHistory("isSelecting", false)
  }

  return (
    <Stack
      height={"100%"}
      width={"100%"}
      direction={"row"}
      padding={`0 ${theme.module[3]}`}
      boxSizing={"border-box"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Stack
        width={theme.module[7]}
        direction={"row"}
        gap={theme.module[4]}
        alignItems={"center"}
      >
        <Button
          variation={"pill"}
          onClick={handleBack}
          iconName={"backArrow"}
        />
        <Typography>{selectedItems.length}</Typography>
      </Stack>
      <Button
        variation={"pill"}
        label={"Select All"}
        onClick={handleSelectAll}
        bgColor={theme.scale.gray[7]}
      />
      <Stack width={theme.module[7]} alignItems={"flex-end"}>
        <Button variation={"pill"} iconName={"delete"} onClick={handleDelete} />
      </Stack>
    </Stack>
  )
}
/*





*/
function Body() {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const historySearchList = useAppSelector(selectHistorySearchList)
  const scrollIndex = useHistoryStore((state: any) => state.scrollIndex)
  const isSelecting = useHistoryStore((state: any) => state.isSelecting)
  const selectedItems = useHistoryStore((state: any) => state.selectedItems)
  const virtuoso: any = useRef(null)

  const [showScrollToTop, setShowScrollToTop] = useState(false)

  useEffect(() => {
    if (isSelecting && !selectedItems.length)
      setUseHistory("isSelecting", false)
  }, [isSelecting, selectedItems])

  useEffect(() => {
    virtuoso.current &&
      virtuoso.current.scrollToIndex({
        index: scrollIndex,
        behavior: "smooth",
        align: "top",
      })
  }, [virtuoso, scrollIndex])

  function handleScrollToTopClick() {
    setUseHistory("scrollIndex", 1)
    setTimeout(() => {
      setUseHistory("scrollIndex", 0)
    }, 50)
  }

  return !historySearchList.length ? (
    <Stack
      width={"100%"}
      height={"100%"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Typography variant="h6" color={theme.scale.gray[5]}>
        No counts in history
      </Typography>
    </Stack>
  ) : (
    <Stack
      width={"100%"}
      height={"100%"}
      padding={theme.module[2]}
      boxSizing={"border-box"}
      borderRadius={theme.module[3]}
      boxShadow={theme.shadow.neo[2]}
      position={"relative"}
      sx={{
        outline: `1px solid ${theme.scale.gray[7]}`,
      }}
    >
      <Stack
        width={"100%"}
        height={"100%"}
        gap={theme.module[3]}
        justifyContent={"center"}
        alignItems={"center"}
        borderRadius={theme.module[3]}
        overflow={"hidden"}
      >
        <Virtuoso
          ref={virtuoso}
          totalCount={historySearchList.length}
          atTopThreshold={100}
          atTopStateChange={(isAtTop) => setShowScrollToTop(!isAtTop)}
          style={{
            height: "100%",
            width: "100%",
            borderRadius: theme.module[3],
          }}
          itemContent={(index) => {
            const item = historySearchList[index]
            const options: ListItemOptionProps[] = [
              {
                iconName: "visible",
                onClick: () => setUseHistory("reviewItemUuid", item.id),
              },
              {
                iconName: "delete",
                onClick: () => dispatch(deleteHistoryItem({ uuid: item.id })),
              },
            ]
            return (
              <Stack padding={theme.module[0]} boxSizing={"border-box"}>
                <SelectableListItemWithOptions
                  label={item.name}
                  description={item.description}
                  iconName={"history"}
                  options={options}
                  onLongPress={() => {
                    setUseHistory("isSelecting", true)
                    addUseHistorySelectedItem(item.id)
                  }}
                  onSelection={() => addUseHistorySelectedItem(item.id)}
                  onDeselection={() => removeUseHistorySelectedItem(item.id)}
                  isSelecting={isSelecting}
                  isSelected={_.find(selectedItems, (id) => id === item.id)}
                />
              </Stack>
            )
          }}
        />
      </Stack>
      {showScrollToTop && <ScrollToTop onClick={handleScrollToTopClick} />}
    </Stack>
  )
}
/*





*/
