import { ClickAwayListener, Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { Virtuoso } from "react-virtuoso"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { formatCommaSeparatedNumber } from "../../common/utils"
import { Button } from "../../components/button"
import { Input } from "../../components/control"
import { ErrorBoundary } from "../../components/errorBoundary"
import { Fade } from "../../components/fade"
import Icon, { IconNames } from "../../components/icon"
import { ListItem } from "../../components/listItem"
import Modal, { ModalActionProps } from "../../components/modal"
import { SearchBar, SearchItemProps } from "../../components/searchBar"
import { Slot, Window } from "../../components/surface"
import { StockItemProps } from "../stock/stockSlice"
import { selectStock } from "../stock/stockSliceSelectors"
import { prepareStockSearchList } from "../stock/stockUtils"
import {
  selectUserUuid,
  selectUserUuidString,
} from "../user/userSliceSelectors"
import { COUNT_STOCK_ITEM_DEFAULT, setCountUI, useCountUI } from "./count"
import { CountItemProps } from "./countSlice"
import {
  selectModifiedUserCountResults,
  selectModifiedUserCountResultsList,
  selectRemainingStockList,
} from "./countSliceSelectors"
import {
  addCountResultItem,
  removeCountResultsItem,
  updateCountResultItem,
} from "./countSliceUtils"
/*




*/
export function StockCountBody() {
  const location = useLocation()
  const countUIState = useCountUI((state) => state)
  const path = location.pathname

  return (
    <ErrorBoundary
      componentName="StockCountBody"
      featurePath={path}
      state={{ featureUI: { ...countUIState } }}
    >
      <Fade>
        <Outer>
          <Body />
          <AddStockItemButton />
          <RecordStockItemCount />
        </Outer>
      </Fade>
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

  return <Window gap={theme.module[3]}>{children}</Window>
}
/*




*/
function Body() {
  const theme = useTheme()

  return (
    <Window gap={theme.module[2]}>
      <SearchControls />
      <CountSheet />
    </Window>
  )
}
/*




*/
function SearchControls() {
  const isAddingStockItem = useCountUI((state) => state.isAddingStockItem)

  return isAddingStockItem ? <AddStockItemSearchBar /> : <CountSearchBar />
}
/*




*/
export type StockSearchKeys = keyof StockItemProps
function CountSearchBar() {
  const countList = useAppSelector(selectModifiedUserCountResultsList)

  function handleSelect(item: SearchItemProps) {
    const index = _.findIndex(
      countList,
      (countItem) => countItem.id === item.id,
    )
    setCountUI("scrollIndex", index)
  }

  const list = prepareStockSearchList(countList)

  return (
    <Slot>
      <SearchBar
        heading={"Count Sheet"}
        list={list}
        onSelect={handleSelect}
        placeholder={"Search count sheet"}
      />
    </Slot>
  )
}
/*




*/
function AddStockItemSearchBar() {
  const theme = useTheme()

  const userUuid = useAppSelector(selectUserUuid) as string
  const stockList = useAppSelector(selectRemainingStockList)
  const stock = useAppSelector(selectStock)

  function handleSelect(item: SearchItemProps) {
    const id = item.id
    const stockItem: StockItemProps = {
      ...stock[id],
    }
    addCountResultItem(stockItem, userUuid)
    setCountUI("currentStockItem", {
      ...COUNT_STOCK_ITEM_DEFAULT,
      ...stockItem,
    })
    setCountUI("isAddingStockItem", false)
  }

  function handleClickAway() {
    setCountUI("isAddingStockItem", false)
  }

  const list = prepareStockSearchList(stockList)

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Stack
        width={"100%"}
        direction={"row"}
        gap={theme.module[3]}
        position={"relative"}
      >
        <SearchBar
          isOpen
          list={list}
          onSelect={handleSelect}
          borderColor={theme.scale.blue[6]}
          placeholder={"Search stock items"}
        />
        <Stack
          justifyContent={"center"}
          position={"absolute"}
          right={2}
          top={9}
          zIndex={20}
        >
          <Button
            variation={"pill"}
            bgColor={theme.scale.gray[9]}
            iconSize={"small"}
            iconName={"cancel"}
            outlineColor={theme.scale.red[8]}
            onClick={() => setCountUI("isAddingStockItem", false)}
            sx={{ padding: theme.module[3] }}
          />
        </Stack>
      </Stack>
    </ClickAwayListener>
  )
}
/*




*/
function CountSheet() {
  const theme = useTheme()
  const countList = useAppSelector(selectModifiedUserCountResultsList)
  const scrollIndex = useCountUI((state) => state.scrollIndex)
  const virtuoso: any = useRef(null)

  useEffect(() => {
    virtuoso.current &&
      virtuoso.current.scrollToIndex({
        index: scrollIndex,
        behavior: "smooth",
        align: "top",
      })
  }, [virtuoso, scrollIndex])

  return (
    <Window
      gap={theme.module[3]}
      justifyContent={"center"}
      borderRadius={theme.module[3]}
      padding={theme.module[1]}
      overflow={"hidden"}
      boxShadow={theme.shadow.neo[1]}
    >
      {!countList.length ? (
        <Typography variant="h6" color={theme.scale.gray[5]}>
          Click + to add a count item
        </Typography>
      ) : (
        <Virtuoso
          ref={virtuoso}
          style={{
            height: "100%",
            width: "100%",
            borderRadius: theme.module[3],
          }}
          totalCount={countList.length}
          itemContent={(index) => {
            const item = countList[index]
            return <CountSheetListItem item={item} />
          }}
        />
      )}
    </Window>
  )
}
/*




*/
function CountSheetListItem({ item }: { item: CountItemProps }) {
  const theme = useTheme()

  function handleOptionsClick() {
    setCountUI("currentStockItem", item)
  }

  const countData =
    !!item.damagedCount || !!item.useableCount || !!item.obsoleteCount

  const listItemStyles = {
    padding: theme.module[4],
    paddingRight: theme.module[2],
    outline: countData ? "none" : `3px solid ${theme.scale.red[8]}`,
    outlineOffset: countData ? 0 : -3,
    boxShadow: countData ? "none" : `0 0 45px -5px ${theme.scale.red[8]} inset`,
  }

  return (
    <Stack padding={theme.module[0]} boxSizing={"border-box"}>
      <ListItem
        label={item.name}
        description={item.unit}
        primarySlot={<Icon variation={"stock"} color={theme.scale.blue[7]} />}
        secondarySlot={
          <Button
            variation={"pill"}
            iconName={"options"}
            onClick={handleOptionsClick}
          />
        }
        tertiarySlot={<CountItemInfoDisplay item={item} />}
        onChange={handleOptionsClick}
        sx={listItemStyles}
        tappable
      />
    </Stack>
  )
}
/*




*/
function CountItemInfoDisplay({ item }: { item: CountItemProps }) {
  const theme = useTheme()
  const isZeroCount =
    !item.useableCount && !item.damagedCount && !item.obsoleteCount

  return (
    <Stack direction={"row"} gap={theme.module[5]} alignItems={"center"}>
      <Stack direction={"row"} gap={theme.module[3]}>
        <Icon variation={"useable"} fontSize={"small"} />
        <Typography
          variant={"body2"}
          fontWeight={"bold"}
          color={theme.scale.green[6]}
        >
          {formatCommaSeparatedNumber(item.useableCount)}
        </Typography>
      </Stack>
      <Stack direction={"row"} gap={theme.module[3]}>
        <Icon variation={"damaged"} fontSize={"small"} />
        <Typography
          variant={"body2"}
          fontWeight={"bold"}
          color={theme.scale.red[5]}
        >
          {formatCommaSeparatedNumber(item.damagedCount)}
        </Typography>
      </Stack>
      <Stack direction={"row"} gap={theme.module[3]}>
        <Icon variation={"obsolete"} fontSize={"small"} />
        <Typography
          variant={"body2"}
          fontWeight={"bold"}
          color={theme.scale.gray[5]}
        >
          {formatCommaSeparatedNumber(item.obsoleteCount)}
        </Typography>
      </Stack>
      {isZeroCount && (
        <Slot
          justifyContent={"flex-end"}
          paddingRight={theme.module[4]}
          gap={theme.module[2]}
        >
          <Icon variation={"warning"} fontSize={"small"} />
          <Typography variant={"caption"} color={theme.scale.red[5]}>
            No count
          </Typography>
        </Slot>
      )}
    </Stack>
  )
}
/*




*/
function AddStockItemButton() {
  const theme = useTheme()
  const isAddingStockItem = useCountUI((state) => state.isAddingStockItem)

  function handleClick() {
    setCountUI("isAddingStockItem", true)
  }

  return (
    <Button
      id="count-add-item-button"
      disabled={isAddingStockItem}
      variation={"profile"}
      label={"Add Item"}
      iconName={"add"}
      iconColor={theme.scale.blue[7]}
      color={theme.scale.blue[7]}
      outlineColor={theme.scale.blue[7]}
      boxShadowScale={5}
      onClick={handleClick}
      justifyCenter
    />
  )
}
/*




*/
function RecordStockItemCount() {
  const memberUuid = useAppSelector(selectUserUuid) as string
  const currentStockItem = useCountUI((state) => state.currentStockItem)
  const [isOpen, setIsOpen] = useState(false)

  const id = currentStockItem.id

  useEffect(() => {
    if (!!id) setIsOpen(true)
  }, [id])

  function handleAccept() {
    updateCountResultItem(currentStockItem, memberUuid)
    handleClose()
  }

  function handleClose() {
    setIsOpen(false)
    _.delay(() => setCountUI("currentStockItem", COUNT_STOCK_ITEM_DEFAULT), 250)
  }

  const actions: ModalActionProps[] = [
    {
      iconName: "cancel",
      handleClick: handleClose,
    },
    {
      id: "count-item-record-accept-button",
      iconName: "done",
      handleClick: handleAccept,
    },
  ]

  return (
    <Modal
      open={isOpen}
      heading={"Record Item Count"}
      body={<RecordStockItemCountBody handleClose={handleClose} />}
      actions={actions}
      onClose={handleClose}
      sx={{
        height: "100%",
      }}
    />
  )
}
/*




*/
function RecordStockItemCountBody({ handleClose }: { handleClose: Function }) {
  const theme = useTheme()
  const location = useLocation()

  const userUuid = useAppSelector(selectUserUuidString)
  const stock = useAppSelector(selectModifiedUserCountResults)

  const countUIState = useCountUI((state) => state)
  const currentStockItem = useCountUI((state) => state.currentStockItem)

  const path = location.pathname

  function handleDelete() {
    handleClose()
    _.delay(() => removeCountResultsItem(currentStockItem.id, userUuid), 250)
  }

  return (
    <ErrorBoundary
      componentName="RecordStockItemCountBody"
      featurePath={path}
      state={{ featureUI: { ...countUIState } }}
    >
      <Stack
        height={"100%"}
        width={"100%"}
        gap={theme.module[5]}
        justifyContent={"space-between"}
        paddingBottom={theme.module[3]}
        boxSizing={"border-box"}
      >
        {!!currentStockItem.id && (
          <>
            <StockItemDetails stockItem={currentStockItem} />
            <CountData />
            <Button
              variation={"profile"}
              color={theme.scale.red[6]}
              outlineColor={theme.scale.red[7]}
              iconName={"delete"}
              label={"Remove Item"}
              onClick={handleDelete}
              boxShadowScale={4}
              justifyCenter
            />
          </>
        )}
      </Stack>
    </ErrorBoundary>
  )
}
/*




*/
function StockItemDetails({ stockItem }: { stockItem: CountItemProps }) {
  const theme = useTheme()

  return (
    <Stack
      gap={theme.module[3]}
      paddingLeft={theme.module[0]}
      boxSizing={"border-box"}
    >
      <Stack direction={"row"} gap={theme.module[5]}>
        <Typography
          variant={"h6"}
          fontWeight={"bold"}
          width={theme.module[6]}
          color={theme.scale.gray[5]}
        >
          Name:
        </Typography>
        <Typography variant={"h6"} fontWeight={"bold"}>
          {stockItem.name}
        </Typography>
      </Stack>
      <Stack direction={"row"} gap={theme.module[5]}>
        <Typography
          variant={"h6"}
          fontWeight={"bold"}
          width={theme.module[6]}
          color={theme.scale.gray[5]}
        >
          Unit:
        </Typography>
        <Typography
          variant={"h6"}
          fontWeight={"bold"}
          color={theme.scale.gray[4]}
        >
          {stockItem.unit}
        </Typography>
      </Stack>
    </Stack>
  )
}
/*




*/
function CountData() {
  const theme = useTheme()

  const stock = useAppSelector(selectModifiedUserCountResults)

  const currentStockItem = useCountUI((state) => state.currentStockItem)

  const { id, useableCount, damagedCount, obsoleteCount } = currentStockItem

  function updateCurrentStockItem(
    countCatagory: keyof CountItemProps,
    count: number,
  ) {
    setCountUI("currentStockItem", {
      ...currentStockItem,
      [countCatagory]: count,
    })
  }

  const stockItem = stock[id]

  useEffect(() => {
    if (!!id) setCountUI("currentStockItem", stockItem)
  }, [stockItem])

  const inputs: StockItemCountInputProps[] = [
    {
      label: "Useable",
      count: useableCount,
      setCount: (count: number) =>
        updateCurrentStockItem("useableCount", count),
      iconName: "useable",
      color: theme.scale.green[5],
      outlineColor: theme.scale.green[7],
    },
    {
      label: "Damaged",
      count: damagedCount,
      setCount: (count: number) =>
        updateCurrentStockItem("damagedCount", count),
      iconName: "damaged",
      color: theme.scale.red[4],
      outlineColor: theme.scale.red[6],
    },
    {
      label: "Obsolete",
      count: obsoleteCount,
      setCount: (count: number) =>
        updateCurrentStockItem("obsoleteCount", count),
      iconName: "obsolete",
      color: theme.scale.gray[3],
      outlineColor: theme.scale.gray[5],
    },
  ]

  return (
    <Stack
      width={"100%"}
      height={"100%"}
      boxShadow={theme.shadow.neo[4]}
      borderRadius={theme.module[3]}
      sx={{
        outline: `1px solid ${theme.scale.gray[6]}`,
        outlineOffset: "-1px",
      }}
    >
      <Stack
        width={"100%"}
        padding={`${theme.module[2]} ${theme.module[3]} ${theme.module[1]} ${theme.module[3]}`}
        boxSizing={"border-box"}
        bgcolor={theme.scale.gray[8]}
        borderRadius={`${theme.module[3]} ${theme.module[3]} 0 0`}
        boxShadow={theme.shadow.neo[3]}
      >
        <Typography
          variant={"h6"}
          color={theme.scale.gray[4]}
          fontWeight={"bold"}
        >
          Count Data
        </Typography>
      </Stack>
      <Stack
        width={"100%"}
        padding={theme.module[4]}
        justifyContent={"space-evenly"}
        height={"100%"}
        boxSizing={"border-box"}
        gap={theme.module[5]}
      >
        {inputs.map((input: StockItemCountInputProps) => (
          <StockItemCountInput {...input} key={input.label} />
        ))}
      </Stack>
    </Stack>
  )
}
/*




*/
type StockItemCountInputProps = {
  label: string
  count: number
  iconName: IconNames
  outlineColor: string
  color: string
  setCount: any
}
function StockItemCountInput(props: StockItemCountInputProps) {
  const theme = useTheme()

  const [isEditing, setIsEditing] = useState(false)

  const commonStyles = {
    paddingRight: theme.module[3],
    outline: `2px solid ${props.outlineColor}`,
    fontSize: "large",
  }
  const inputProps = isEditing
    ? {
        id: `count-item-${_.lowerCase(props.label)}-editable-input`,
        key: "isEditing",
        autoFocus: true,
        value: !!props.count ? props.count : "",
        onChange: (e: any) => props.setCount(Number(e.target.value)),
        onBlur: () => setIsEditing(false),
        isNumber: true,
        sx: { ...commonStyles },
      }
    : {
        id: `count-item-${_.lowerCase(props.label)}-readonly-input`,
        key: "notEditing",
        value: formatCommaSeparatedNumber(props.count),
        onChange: () => undefined,
        onFocus: () => setIsEditing(true),
        readOnly: true,
        sx: {
          ...commonStyles,
          color: `${props.color} !important`,
          background: theme.scale.gray[8],
          fontWeight: "bold",
        },
      }

  const inputWidth =
    props.count < 10000
      ? theme.module[7]
      : props.count > 999999
      ? `calc(${theme.module[7]} * 1.5)`
      : `calc(${theme.module[7]} * 1.25)`

  return (
    <Slot justifyContent={"space-between"}>
      <Slot
        gap={theme.module[4]}
        height={"100%"}
        justifyContent={"flex-start"}
        flexShrink={2}
      >
        <Icon fontSize="large" variation={props.iconName} />
        <Typography
          variant={"h6"}
          fontWeight={"bold"}
          color={theme.scale.gray[4]}
        >
          {props.label}:
        </Typography>
      </Slot>
      <Stack width={inputWidth}>
        <Input {...inputProps} />
      </Stack>
    </Slot>
  )
}
/*




*/
