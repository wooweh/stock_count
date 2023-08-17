import ClickAwayListener from "@mui/base/ClickAwayListener"
import { Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useEffect, useRef, useState } from "react"
import { ReactSearchAutocomplete } from "react-search-autocomplete"
import { Virtuoso } from "react-virtuoso"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import Animation from "../../components/animation"
import { Button } from "../../components/button"
import { Input } from "../../components/control"
import { CSVParser, downloadCSVTemplate } from "../../components/csvParser"
import Icon from "../../components/icon"
import {
  ListItemOptionProps,
  SelectableListItemWithOptions,
} from "../../components/list"
import Modal, { ModalActionProps } from "../../components/modal"
import VirtualizedTable, { ColumnData } from "../../components/table"
import {
  StockItemProps,
  deleteStock,
  deleteStockItem,
  selectStockIdList,
  selectStockList,
  setStock,
  setStockItem,
} from "./stockSlice"
/*





*/
type IsEditingProps = false | StockItemProps
type UseStockState = {
  isAdding: boolean
  isEditing: IsEditingProps
  isUploading: boolean
  isSelecting: boolean
  idViewingOptions: string | false
  scrollIndex: number
  selectedItems: string[]
}
type UseStockKeys = keyof UseStockState
const initialState: UseStockState = {
  isAdding: false,
  isEditing: false,
  isUploading: false,
  isSelecting: false,
  idViewingOptions: false,
  scrollIndex: 0,
  selectedItems: [],
}
const useStockStore = create<UseStockState>()(
  persist(
    (set) => ({
      ...initialState,
    }),
    { name: "stock-storage", storage: createJSONStorage(() => sessionStorage) },
  ),
)

function setUseStock(path: UseStockKeys, value: any) {
  useStockStore.setState({ [path]: value })
}
function addUseStockSelectedItem(id: string) {
  const selectedItems = useStockStore.getState().selectedItems
  const index = _.indexOf(selectedItems, id)
  if (index === -1) {
    const newSelectedItems = [id, ...selectedItems]
    useStockStore.setState({ selectedItems: newSelectedItems })
  }
}
function removeUseStockSelectedItem(id: string) {
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
      <Header />
      <Body />
      <ButtonTray />
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
function Header() {
  const theme = useTheme()
  const stockList = useAppSelector(selectStockList)
  const isSelecting = useStockStore((state: any) => state.isSelecting)

  return stockList.length ? (
    <Stack
      width={"100%"}
      height={`calc(${theme.module[6]} * 1.25)`}
      position={"relative"}
    >
      {isSelecting ? <SelectionBar /> : <SearchBar />}
    </Stack>
  ) : undefined
}
/*





*/
function SearchBar() {
  const theme = useTheme()
  const [isSearching, setIsSearching] = useState(false)
  const stockList = useAppSelector(selectStockList)
  /*


*/
  function handleIconClick() {
    setIsSearching(!isSearching)
  }
  /*
  

  */
  function handleClickAway() {
    setIsSearching(false)
  }
  /*


*/
  function handleSelect(item: StockItemProps) {
    const index = _.findIndex(
      stockList,
      (stockItem) => stockItem.id === item.id,
    )
    setUseStock("scrollIndex", index)
    setIsSearching(false)
  }
  /*


*/
  function formatResult(item: StockItemProps) {
    return (
      <Stack>
        <Typography>{item.name}</Typography>
        <Typography color={theme.scale.gray[5]}>{item.description}</Typography>
      </Stack>
    )
  }
  /*


*/
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Stack
        width={"100%"}
        height={"100%"}
        direction={"row"}
        padding={`0 ${theme.module[4]}`}
        boxSizing={"border-box"}
        justifyContent={"flex-end"}
        alignItems={"center"}
        position={"absolute"}
        zIndex={10}
      >
        <Animation
          from={{ width: "0%", opacity: 0 }}
          to={{ width: "100%", opacity: 1 }}
          duration={125}
          start={isSearching}
        >
          {isSearching ? (
            <ReactSearchAutocomplete
              items={stockList}
              onSelect={handleSelect}
              fuseOptions={{ threshold: 0.4, keys: ["name", "description"] }}
              formatResult={formatResult}
              showClear={false}
              autoFocus
              styling={{
                border: `1px solid ${theme.scale.gray[6]}`,
                backgroundColor: theme.scale.gray[7],
                color: theme.scale.gray[4],
                iconColor: theme.scale.gray[5],
                lineColor: theme.scale.gray[5],
              }}
            />
          ) : undefined}
        </Animation>
        <Stack
          position={"absolute"}
          justifyContent={"flex-end"}
          paddingBottom={"1px"}
        >
          <Button
            variation={"pill"}
            iconName={isSearching ? "cancel" : "search"}
            onClick={handleIconClick}
            outlineColor={theme.scale.gray[7]}
            bgColor={theme.scale.gray[9]}
            iconSize={"small"}
            sx={{ padding: theme.module[3] }}
          />
        </Stack>
      </Stack>
    </ClickAwayListener>
  )
}
/*





*/
function SelectionBar() {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const selectedItems = useStockStore((state: any) => state.selectedItems)
  const stockIdList = useAppSelector(selectStockIdList)

  const isAllSelected =
    !!selectedItems.length && stockIdList.length === selectedItems.length
  /*
  
  
  */
  function handleSelectAll() {
    setUseStock("selectedItems", stockIdList)
  }
  /*
  
  
  */
  function handleDelete() {
    if (isAllSelected) {
      dispatch(deleteStock())
    } else {
      _.forEach(selectedItems, (id) => dispatch(deleteStockItem(id)))
    }
    setUseStock("selectedItems", [])
    setUseStock("isSelecting", false)
  }
  /*
  
  
  */
  function handleBack() {
    setUseStock("selectedItems", [])
    setUseStock("isSelecting", false)
  }
  /*
  
  
  */
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
  const stockList = useAppSelector(selectStockList)
  const scrollIndex = useStockStore((state: any) => state.scrollIndex)
  const isSelecting = useStockStore((state: any) => state.isSelecting)
  const idViewingOptions = useStockStore((state: any) => state.idViewingOptions)
  const selectedItems = useStockStore((state: any) => state.selectedItems)
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

  return (
    <Stack
      width={"100%"}
      height={"100%"}
      padding={theme.module[3]}
      boxSizing={"border-box"}
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
        {!stockList.length ? (
          <>
            <Typography variant="h5" color={theme.scale.gray[5]}>
              Click <Icon variation="add" fontSize="small" /> to add a stock
              item
            </Typography>
            <Typography variant="h5" color={theme.scale.gray[5]}>
              or <Icon variation="upload" fontSize="small" /> to upload CSV
              stock list
            </Typography>
          </>
        ) : (
          <Virtuoso
            ref={virtuoso}
            style={{
              height: "100%",
              width: "100%",
              borderRadius: theme.module[3],
            }}
            totalCount={stockList.length}
            itemContent={(index) => {
              const item = stockList[index]
              const options: ListItemOptionProps[] = [
                {
                  iconName: "edit",
                  onClick: () => setUseStock("isEditing", item),
                },
                {
                  iconName: "delete",
                  onClick: () => dispatch(deleteStockItem(item.id)),
                },
                {
                  iconName: "cancel",
                  onClick: () => setUseStock("idViewingOptions", false),
                },
              ]
              return (
                <Stack padding={theme.module[0]} boxSizing={"border-box"}>
                  <SelectableListItemWithOptions
                    label={item.name}
                    description={item.description}
                    iconName={"stock"}
                    options={options}
                    showOptions={idViewingOptions === item.id}
                    onOptionsClick={() =>
                      setUseStock("idViewingOptions", item.id)
                    }
                    onLongPress={() => {
                      setUseStock("idViewingOptions", false)
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
        )}
      </Stack>
    </Stack>
  )
}
/*





*/
function ButtonTray() {
  const theme = useTheme()
  /*
  
  
  */
  function handleAddClick() {
    setUseStock("isAdding", true)
  }
  /*
  
  
  */
  function handleIsUploading() {
    setUseStock("isUploading", true)
  }
  /*
  
  
  */
  return (
    <Stack
      width={"100%"}
      direction={"row"}
      gap={theme.module[4]}
      padding={theme.module[4]}
      boxSizing={"border-box"}
    >
      <Button
        variation={"profile"}
        iconName={"add"}
        onClick={handleAddClick}
        bgColor={theme.scale.gray[9]}
        justifyCenter
      />
      <Button
        variation={"profile"}
        iconName={"upload"}
        onClick={handleIsUploading}
        bgColor={theme.scale.gray[9]}
        justifyCenter
      />
    </Stack>
  )
}
/*





*/
function AddItem() {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const isAdding = useStockStore((state: any) => state.isAdding)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [id, setId] = useState("")

  const inputs = [
    {
      label: "Code",
      value: id,
      onChange: (event: any) => setId(event.target.value),
    },
    {
      label: "Name",
      value: name,
      onChange: (event: any) => setName(event.target.value),
    },
    {
      label: "Descr.",
      value: description,
      onChange: (event: any) => setDescription(event.target.value),
    },
  ]
  /*
  
  
  */
  function handleAccept(event: any) {
    if (id && name) {
      dispatch(
        setStockItem({
          id: id,
          name: name,
          description: description,
        }),
      )
      setUseStock("isAdding", false)
      setTimeout(() => {
        setId("")
        setName("")
        setDescription("")
      }, 250)
    } else {
    }
  }
  /*
  
  
  */
  function handleClose(event: any) {
    setUseStock("isAdding", false)
  }
  /*
  
  
  */
  return (
    <Modal
      open={isAdding}
      heading={"Add Stock Item"}
      body={
        <Stack
          width={"100%"}
          padding={theme.module[3]}
          boxSizing={"border-box"}
          gap={theme.module[4]}
        >
          <Stack width={"100%"} alignItems={"center"} gap={theme.module[3]}>
            {inputs.map((input: (typeof inputs)[number], index: number) => {
              return (
                <Stack
                  width={"100%"}
                  direction={"row"}
                  alignItems={"center"}
                  key={index}
                >
                  <Typography width={theme.module[7]}>
                    {input.label}:
                  </Typography>
                  <Input
                    value={input.value}
                    onChange={input.onChange}
                    sx={{
                      background: theme.scale.gray[8],
                    }}
                  />
                </Stack>
              )
            })}
          </Stack>
        </Stack>
      }
      show={"actions"}
      actions={[
        { iconName: "cancel", handleClick: handleClose },
        { iconName: "done", handleClick: handleAccept },
      ]}
      onClose={handleClose}
    />
  )
}
/*





*/
function UploadItems() {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const isUploading = useStockStore((state: any) => state.isUploading)
  const [data, setData]: any = useState([])
  /*
  
  
  */
  function handleAccept() {
    const stockList = {}
    _.forEach(data, (item) => _.set(stockList, item.id, item))
    dispatch(setStock(stockList))
    handleClose()
  }
  /*
  
  
  */
  function handleClose() {
    setUseStock("isUploading", false)
  }
  /*
  
  
  */
  function handleOnComplete(results: StockItemProps[]) {
    setData(results)
  }
  /*
  
  
  */
  function handleDownload() {
    const data = [{ id: "", name: "", description: "" }]
    downloadCSVTemplate(data)
  }
  /*
  
  
  */
  useEffect(() => {
    if (!isUploading && data.length) setTimeout(() => setData([]), 1000)
  }, [isUploading, data])

  const columns: ColumnData[] = [
    {
      width: "min-content",
      label: "ID",
      dataKey: "id",
    },
    {
      width: "min-content",
      label: "Name",
      dataKey: "name",
    },
    {
      width: "min-content",
      label: "Description",
      dataKey: "description",
    },
  ]

  const modalActions: ModalActionProps[] = [
    { iconName: "cancel", handleClick: handleClose },
  ]
  if (data.length)
    modalActions.push({ iconName: "done", handleClick: handleAccept })

  return (
    <Modal
      open={isUploading}
      heading={"Upload Stock List"}
      body={
        <Stack
          width={"100%"}
          boxSizing={"border-box"}
          justifyContent={"center"}
        >
          {!data.length ? (
            <Stack width={"100%"} gap={theme.module[4]}>
              <CSVParser onComplete={handleOnComplete} />
              <Button
                variation={"modal"}
                label={"CSV Template"}
                iconName={"download"}
                bgColor={theme.scale.gray[7]}
                onClick={handleDownload}
              />
            </Stack>
          ) : (
            <Stack
              width={"100%"}
              gap={theme.module[3]}
              justifyContent={"flex-start"}
            >
              <Typography>Item count: {data.length}</Typography>
              <VirtualizedTable rows={data} columns={columns} />
            </Stack>
          )}
        </Stack>
      }
      show={"actions"}
      actions={modalActions}
      onClose={handleClose}
    />
  )
}
/*





*/
function EditItem() {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const isEditing = useStockStore((state: any) => state.isEditing)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [id, setId] = useState("")

  useEffect(() => {
    if (!!isEditing) {
      setId(isEditing.id)
      setName(isEditing.name)
      setDescription(isEditing.description)
    }
  }, [isEditing])

  const inputs = [
    {
      label: "Code",
      value: id,
      onChange: (event: any) => setId(event.target.value),
    },
    {
      label: "Name",
      value: name,
      onChange: (event: any) => setName(event.target.value),
    },
    {
      label: "Descr.",
      value: description,
      onChange: (event: any) => setDescription(event.target.value),
    },
  ]
  /*
  
  
  */
  function handleAccept(event: any) {
    if (id && name) {
      dispatch(
        setStockItem({
          id: id,
          name: name,
          description: description,
        }),
      )
      handleClose()
    }
  }
  /*
  
  
  */
  function handleClose() {
    setUseStock("isEditing", false)
    setUseStock("idViewingOptions", false)
  }
  /*
  
  
  */
  return (
    <Modal
      open={!!isEditing}
      heading={"Edit Stock Item"}
      body={
        <Stack
          width={"100%"}
          padding={theme.module[3]}
          boxSizing={"border-box"}
          gap={theme.module[4]}
        >
          <Stack width={"100%"} alignItems={"center"} gap={theme.module[3]}>
            {inputs.map((input: (typeof inputs)[number], index: number) => {
              return (
                <Stack
                  width={"100%"}
                  direction={"row"}
                  alignItems={"center"}
                  key={index}
                >
                  <Typography width={theme.module[7]}>
                    {input.label}:
                  </Typography>
                  <Input
                    onChange={input.onChange}
                    value={input.value}
                    sx={{
                      background: theme.scale.gray[8],
                    }}
                  />
                </Stack>
              )
            })}
          </Stack>
        </Stack>
      }
      show="actions"
      actions={[
        { iconName: "cancel", handleClick: handleClose },
        { iconName: "done", handleClick: handleAccept },
      ]}
      onClose={handleClose}
    />
  )
}
/*





*/
