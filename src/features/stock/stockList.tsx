import { Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useEffect, useRef, useState } from "react"
import { Virtuoso } from "react-virtuoso"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Button } from "../../components/button"
import {
  ListItemOptionProps,
  SelectableListItemWithOptions,
} from "../../components/listItem"
import { ScrollToTop } from "../../components/scrollToTop"
import { SearchBar } from "../../components/searchBar"
import {
  addUseStockSelectedItem,
  removeUseStockSelectedItem,
  setUseStock,
  useStockStore,
} from "./stock"
import {
  StockItemProps,
  selectStockIdList,
  selectStockList,
} from "./stockSlice"
import {
  removeStock,
  removeStockItem,
  removeStockItems,
} from "./stockSliceUtils"
/*




*/
export function StockList() {
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
      <ButtonTray />
    </Stack>
  )
}
/*




*/
function Header() {
  const theme = useTheme()
  const stockList = useAppSelector(selectStockList)
  const isSelecting = useStockStore((state: any) => state.isSelecting)

  return (
    !!stockList.length && (
      <Stack width={"100%"} height={theme.module[6]} flexShrink={0}>
        {isSelecting ? <StockSelectionBar /> : <StockSearchBar />}
      </Stack>
    )
  )
}
/*




*/
function StockSearchBar() {
  const theme = useTheme()
  const stockList = useAppSelector(selectStockList)

  function handleSelect(item: StockItemProps) {
    const index = _.findIndex(
      stockList,
      (stockItem) => stockItem.id === item.id,
    )
    setUseStock("scrollIndex", index)
  }

  function formatResult(item: StockItemProps) {
    return (
      <Stack>
        <Typography>{item.name}</Typography>
        <Typography color={theme.scale.gray[5]}>{item.description}</Typography>
      </Stack>
    )
  }

  return (
    <SearchBar
      heading={"Stock List:"}
      list={stockList}
      searchKeys={["name", "description"]}
      handleSelect={handleSelect}
      formatResult={formatResult}
    />
  )
}
/*




*/
function StockSelectionBar() {
  const theme = useTheme()
  const selectedItems = useStockStore((state: any) => state.selectedItems)
  const stockIdList = useAppSelector(selectStockIdList)

  const isAllSelected =
    !!selectedItems.length && stockIdList.length === selectedItems.length

  function handleSelectAll() {
    setUseStock("selectedItems", stockIdList)
  }

  function handleDelete() {
    if (isAllSelected) {
      removeStock()
    } else {
      removeStockItems(selectedItems)
    }
    setUseStock("selectedItems", [])
    setUseStock("isSelecting", false)
  }

  function handleBack() {
    setUseStock("selectedItems", [])
    setUseStock("isSelecting", false)
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

  const stockList = useAppSelector(selectStockList)

  const scrollIndex = useStockStore((state: any) => state.scrollIndex)
  const isSelecting = useStockStore((state: any) => state.isSelecting)
  const selectedItems = useStockStore((state: any) => state.selectedItems)

  const [showScrollToTop, setShowScrollToTop] = useState(false)

  const virtuoso: any = useRef(null)

  useEffect(() => {
    if (isSelecting && !selectedItems.length) setUseStock("isSelecting", false)
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
    setUseStock("scrollIndex", 1)
    setTimeout(() => {
      setUseStock("scrollIndex", 0)
    }, 50)
  }

  return !stockList.length ? (
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
          totalCount={stockList.length}
          atTopThreshold={100}
          atTopStateChange={(isAtTop) => setShowScrollToTop(!isAtTop)}
          style={{
            height: "100%",
            width: "100%",
            borderRadius: theme.module[3],
          }}
          itemContent={(index) => {
            const item = stockList[index]
            const id = item.id
            const options: ListItemOptionProps[] = [
              {
                iconName: "edit",
                onClick: () => setUseStock("isEditing", item),
              },
              {
                iconName: "delete",
                onClick: () => removeStockItem(id),
              },
            ]
            return (
              <Stack padding={theme.module[0]} boxSizing={"border-box"}>
                <SelectableListItemWithOptions
                  label={item.name}
                  description={item.description}
                  iconName={"stock"}
                  options={options}
                  onLongPress={() => {
                    setUseStock("isSelecting", true)
                    addUseStockSelectedItem(item.id)
                  }}
                  onSelection={() => addUseStockSelectedItem(item.id)}
                  onDeselection={() => removeUseStockSelectedItem(item.id)}
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
function ButtonTray() {
  const theme = useTheme()

  function handleAddClick() {
    setUseStock("isAdding", true)
  }

  function handleIsUploading() {
    setUseStock("isUploading", true)
  }

  return (
    <Stack
      width={"100%"}
      direction={"row"}
      gap={theme.module[4]}
      padding={theme.module[2]}
      boxSizing={"border-box"}
    >
      <Button
        variation={"profile"}
        iconName={"add"}
        onClick={handleAddClick}
        bgColor={theme.scale.gray[7]}
        justifyCenter
      />
      <Button
        variation={"profile"}
        iconName={"upload"}
        onClick={handleIsUploading}
        bgColor={theme.scale.gray[7]}
        justifyCenter
      />
    </Stack>
  )
}
/*




*/
