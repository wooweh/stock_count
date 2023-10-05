import { ClickAwayListener, Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useEffect, useRef, useState } from "react"
import { Virtuoso } from "react-virtuoso"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { formatCommaSeparatedNumber } from "../../common/utils"
import { Button } from "../../components/button"
import { Input } from "../../components/control"
import Icon, { IconNames } from "../../components/icon"
import { ListItem } from "../../components/listItem"
import Modal, { ModalActionProps } from "../../components/modal"
import { SearchBar } from "../../components/searchBar"
import { StockItemProps } from "../stock/stockSlice"
import { selectUserUuid } from "../user/userSlice"
import { setUseCount, useCountStore } from "./count"
import {
  CountItemProps,
  CountTypes,
  SelectCountMemberResultsListProps,
  SelectCountMemberResultsProps,
  selectCountType,
  selectRemainingDualStockList,
  selectRemainingStockList,
  selectUserCountResults,
  selectUserCountResultsList,
} from "./countSlice"
import { removeCountResultsItem, updateCountResultItem } from "./countUtils"
/*





*/
export function StockCountBody() {
  const theme = useTheme()

  return (
    <Stack
      height={"100%"}
      gap={theme.module[4]}
      paddingBottom={theme.module[1]}
      boxSizing={"border-box"}
    >
      <Stack height={"100%"} gap={theme.module[2]}>
        <SearchControls />
        <CountSheet />
      </Stack>
      <AddStockItemButton />
      <RecordStockItemCount />
    </Stack>
  )
}
/*





*/
function SearchControls() {
  const isAddingStockItem = useCountStore(
    (state: any) => state.isAddingStockItem,
  )

  return isAddingStockItem ? <AddStockItemSearchBar /> : <CountSearchBar />
}
/*





*/
function CountSearchBar() {
  const theme = useTheme()
  const countList = useAppSelector(selectUserCountResultsList)

  function handleSelect(item: CountItemProps & StockItemProps) {
    const index = _.findIndex(
      countList,
      (countItem) => countItem.id === item.id,
    )
    setUseCount("scrollIndex", index)
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
    <Stack width={"100%"}>
      <SearchBar
        heading={"Count Sheet:"}
        list={countList}
        searchKeys={["name", "description"]}
        handleSelect={handleSelect}
        formatResult={formatResult}
        placeholder={"Search count sheet"}
      />
    </Stack>
  )
}
/*





*/
function AddStockItemSearchBar() {
  const theme = useTheme()

  const userUuid = useAppSelector(selectUserUuid) as string
  const remainingStockList = useAppSelector(selectRemainingStockList)
  const remainingDualStockList = useAppSelector(selectRemainingDualStockList)
  const countType = useAppSelector(selectCountType) as CountTypes

  const list =
    countType === "dual" ? remainingDualStockList : remainingStockList

  const resultPayload = {
    useableCount: 0,
    damagedCount: 0,
    obsoleteCount: 0,
    memberUuid: userUuid,
  }

  function handleSelect(item: any) {
    updateCountResultItem({ id: item.id, ...resultPayload })
    setUseCount("isAddingStockItem", false)
    setUseCount("currentlyViewedStockItemId", item.id)
  }

  function handleClickAway() {
    setUseCount("isAddingStockItem", false)
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
          searchKeys={["name", "description"]}
          handleSelect={handleSelect}
          formatResult={formatResult}
          borderColor={theme.scale.blue[6]}
          placeholder={"Search stock items"}
        />
        <Stack
          justifyContent={"center"}
          position={"absolute"}
          right={2}
          top={8}
          zIndex={20}
        >
          <Button
            variation={"pill"}
            bgColor={theme.scale.gray[9]}
            iconSize={"small"}
            iconName={"cancel"}
            onClick={() => setUseCount("isAddingStockItem", false)}
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
  const countList = useAppSelector(
    selectUserCountResultsList,
  ) as SelectCountMemberResultsListProps

  const scrollIndex = useCountStore((state: any) => state.scrollIndex)

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
    <Stack
      width={"100%"}
      height={"100%"}
      gap={theme.module[3]}
      justifyContent={"center"}
      alignItems={"center"}
      borderRadius={theme.module[3]}
      boxSizing={"border-box"}
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
    </Stack>
  )
}
/*





*/
function CountSheetListItem({
  item,
}: {
  item: StockItemProps & CountItemProps
}) {
  const theme = useTheme()

  function handleOptionsClick() {
    setUseCount("currentlyViewedStockItemId", item.id)
  }

  const countData =
    !!item.damagedCount || !!item.useableCount || !!item.obsoleteCount

  return (
    <Stack padding={theme.module[0]} boxSizing={"border-box"}>
      <ListItem
        label={item.name}
        description={item.description}
        primarySlot={<Icon variation={"stock"} color={theme.scale.blue[7]} />}
        secondarySlot={
          <Button
            variation={"pill"}
            iconName={"options"}
            onClick={handleOptionsClick}
          />
        }
        tertiarySlot={<CountItemInfoDisplay item={item} />}
        tappable
        onChange={handleOptionsClick}
        sx={{
          padding: theme.module[4],
          paddingRight: theme.module[2],
          outline: countData ? "none" : `3px solid ${theme.scale.red[8]}`,
          outlineOffset: countData ? 0 : -3,
          boxShadow: countData
            ? "none"
            : `0 0 45px -5px ${theme.scale.red[8]} inset`,
        }}
      />
    </Stack>
  )
}
/*





*/
function CountItemInfoDisplay({
  item,
}: {
  item: StockItemProps & CountItemProps
}) {
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
        <Stack
          direction={"row"}
          width={"100%"}
          justifyContent={"flex-end"}
          paddingRight={theme.module[4]}
          boxSizing={"border-box"}
          gap={theme.module[2]}
        >
          <Icon variation={"warning"} fontSize={"small"} />
          <Typography variant={"caption"} color={theme.scale.red[5]}>
            No count
          </Typography>
        </Stack>
      )}
    </Stack>
  )
}
/*





*/
function AddStockItemButton() {
  const theme = useTheme()

  function handleClick() {
    setUseCount("isAddingStockItem", true)
  }

  return (
    <Button
      variation={"profile"}
      label={"Add Item"}
      iconName={"add"}
      iconColor={theme.scale.blue[6]}
      color={theme.scale.blue[7]}
      outlineColor={theme.scale.blue[8]}
      boxShadowScale={5}
      bgColor={theme.scale.blue[9]}
      onClick={handleClick}
      justifyCenter
    />
  )
}
/*





*/
function RecordStockItemCount() {
  const memberUuid = useAppSelector(selectUserUuid) as string

  const useableCount = useCountStore(
    (state: any) => state.currentlyViewedStockItemUseableCount,
  )
  const damagedCount = useCountStore(
    (state: any) => state.currentlyViewedStockItemDamagedCount,
  )
  const obsoleteCount = useCountStore(
    (state: any) => state.currentlyViewedStockItemObsoleteCount,
  )
  const id = useCountStore((state: any) => state.currentlyViewedStockItemId)

  const [isOpen, setIsOpen] = useState(false)

  const resultItemPayload = {
    id,
    useableCount,
    damagedCount,
    obsoleteCount,
    memberUuid,
  }

  useEffect(() => {
    if (!!id) setIsOpen(true)
  }, [id])

  function handleAccept() {
    updateCountResultItem(resultItemPayload)
    handleClose()
  }

  function handleClose() {
    setIsOpen(false)
    setTimeout(() => {
      setUseCount("currentlyViewedStockItemId", false)
    }, 250)
  }

  const actions: ModalActionProps[] = [
    {
      iconName: "cancel",
      handleClick: handleClose,
    },
    {
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
    />
  )
}
/*





*/
function RecordStockItemCountBody({ handleClose }: { handleClose: Function }) {
  const theme = useTheme()

  const memberUuid = useAppSelector(selectUserUuid)
  const stock: SelectCountMemberResultsProps = useAppSelector(
    selectUserCountResults,
  )

  const id = useCountStore((state: any) => state.currentlyViewedStockItemId)
  const useableCount = useCountStore(
    (state: any) => state.currentlyViewedStockItemUseableCount,
  )
  const damagedCount = useCountStore(
    (state: any) => state.currentlyViewedStockItemDamagedCount,
  )
  const obsoleteCount = useCountStore(
    (state: any) => state.currentlyViewedStockItemObsoleteCount,
  )

  const stockItem = stock[id as string]

  useEffect(() => {
    if (!!stockItem) {
      setUseCount(
        "currentlyViewedStockItemUseableCount",
        stockItem.useableCount,
      )
      setUseCount(
        "currentlyViewedStockItemDamagedCount",
        stockItem.damagedCount,
      )
      setUseCount(
        "currentlyViewedStockItemObsoleteCount",
        stockItem.obsoleteCount,
      )
    }
  }, [stockItem])

  function handleDeleteClick() {
    handleClose()
    setTimeout(() => {
      removeCountResultsItem({ memberUuid, id })
    }, 250)
  }

  function setUseableCount(count: number) {
    setUseCount("currentlyViewedStockItemUseableCount", count)
  }

  function setDamagedCount(count: number) {
    setUseCount("currentlyViewedStockItemDamagedCount", count)
  }

  function setObsoleteCount(count: number) {
    setUseCount("currentlyViewedStockItemObsoleteCount", count)
  }

  const inputs: StockItemCountInputProps[] = [
    {
      label: "Useable",
      count: useableCount,
      setCount: setUseableCount,
      iconName: "useable",
      color: theme.scale.green[5],
      outlineColor: theme.scale.green[7],
    },
    {
      label: "Damaged",
      count: damagedCount,
      setCount: setDamagedCount,
      iconName: "damaged",
      color: theme.scale.red[4],
      outlineColor: theme.scale.red[6],
    },
    {
      label: "Obsolete",
      count: obsoleteCount,
      setCount: setObsoleteCount,
      iconName: "obsolete",
      color: theme.scale.gray[3],
      outlineColor: theme.scale.gray[5],
    },
  ]

  return (
    <Stack width={"100%"} gap={theme.module[4]} justifyContent={"flex-start"}>
      {!!stockItem && (
        <>
          <Stack
            gap={theme.module[2]}
            paddingLeft={theme.module[0]}
            boxSizing={"border-box"}
          >
            <Stack direction={"row"} gap={theme.module[3]}>
              <Typography
                fontWeight={"bold"}
                width={theme.module[6]}
                color={theme.scale.gray[5]}
              >
                Name:
              </Typography>
              <Typography fontWeight={"bold"}>{stockItem.name}</Typography>
            </Stack>
            <Stack direction={"row"} gap={theme.module[3]}>
              <Typography
                fontWeight={"bold"}
                width={theme.module[6]}
                color={theme.scale.gray[5]}
              >
                Unit:
              </Typography>
              <Typography fontWeight={"bold"} color={theme.scale.gray[4]}>
                {stockItem.description}
              </Typography>
            </Stack>
          </Stack>
          <Stack
            width={"100%"}
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
              <Typography color={theme.scale.gray[4]} fontWeight={"bold"}>
                Count Data
              </Typography>
            </Stack>
            <Stack
              width={"100%"}
              padding={theme.module[4]}
              boxSizing={"border-box"}
              gap={theme.module[3]}
            >
              {inputs.map((input: StockItemCountInputProps) => (
                <StockItemCountInput {...input} key={input.label} />
              ))}
            </Stack>
          </Stack>
          <Button
            variation={"profile"}
            color={theme.scale.red[6]}
            outlineColor={theme.scale.red[7]}
            iconName={"delete"}
            label={"Remove Item"}
            bgColor={theme.scale.red[9]}
            onClick={handleDeleteClick}
            boxShadowScale={4}
            justifyCenter
          />
        </>
      )}
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

  return (
    <Stack
      width={"100%"}
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Stack
        direction={"row"}
        gap={theme.module[4]}
        width={"100%"}
        height={"100%"}
        flexShrink={2}
      >
        <Icon variation={props.iconName} />
        <Typography fontWeight={"bold"} color={theme.scale.gray[4]}>
          {props.label}:
        </Typography>
      </Stack>
      <Stack
        width={
          props.count < 10000
            ? theme.module[7]
            : props.count > 999999
            ? `calc(${theme.module[7]} * 1.5)`
            : `calc(${theme.module[7]} * 1.25)`
        }
      >
        {isEditing ? (
          <Input
            value={!!props.count ? props.count : ""}
            onChange={(e: any) => props.setCount(Number(e.target.value))}
            onBlur={() => setIsEditing(false)}
            isNumber
            sx={{
              paddingRight: theme.module[3],
              outline: `2px solid ${props.outlineColor}`,
            }}
          />
        ) : (
          <Input
            value={formatCommaSeparatedNumber(props.count)}
            onChange={() => undefined}
            onFocus={() => setIsEditing(true)}
            readOnly
            sx={{
              color: `${props.color} !important`,
              background: theme.scale.gray[8],
              outline: `2px solid ${props.outlineColor}`,
              paddingRight: theme.module[3],
              fontWeight: "bold",
            }}
          />
        )}
      </Stack>
    </Stack>
  )
}
/*





*/
