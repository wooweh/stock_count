import { Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useEffect, useReducer, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { Virtuoso } from "react-virtuoso"
import useTheme from "../common/useTheme"
import { Button } from "../components/button"
import {
  ListItemOptionProps,
  SelectableListItemWithOptions,
} from "../components/listItem"
import { ScrollToTop } from "../components/scrollToTop"
import {
  SearchBar,
  SearchItemProps,
  SearchListProps,
} from "../components/searchBar"
import { ErrorBoundary } from "./errorBoundary"
import { IconNames } from "./icon"
import Modal, { ModalActionProps } from "./modal"
import { Window } from "./surface"
/*




*/
type ManagedListStateProps = {
  selectedItems: string[]
}
type ManagedListActionProps = {
  type: ManagedListActionsTypes
  id?: string
  ids?: string[]
}
type ManagedListDispatch = React.Dispatch<ManagedListActionProps>
type ManagedListActionsTypes = "add" | "remove" | "set" | "clear"
function manageSelectedItems(
  state: ManagedListStateProps,
  action: ManagedListActionProps,
) {
  const id = action.id
  const ids = action.ids

  switch (action.type) {
    case "set":
      if (ids) return { ...state, selectedItems: [...ids] }
    case "clear":
      return { ...state, selectedItems: [] }
    case "add":
      if (id) return addSelectedItem(state, id)
    case "remove":
      if (id) return removeSelectedItem(state, id)
  }
}
/*




*/
function addSelectedItem(state: any, id: string) {
  const selectedItems = [...state.selectedItems]
  const index = _.indexOf(selectedItems, id)
  if (index === -1) {
    return {
      ...state,
      selectedItems: [id, ...selectedItems],
    }
  } else {
    return state
  }
}
/*




*/
function removeSelectedItem(state: any, id: string) {
  const selectedItems = [...state.selectedItems]
  const indexToRemove = _.indexOf(selectedItems, id)
  const newSelectedItems = [...selectedItems]
  newSelectedItems.splice(indexToRemove, 1)
  return {
    ...state,
    selectedItems: newSelectedItems,
  }
}
/*




*/
export type ManagedListProps = {
  heading: string
  list: SearchListProps
  bulletIconName: IconNames
  onDeleteSelection: (itemIds: string[]) => void
  onDeleteAll: () => void
  options: (item: SearchItemProps) => ListItemOptionProps[]
  emptyListPlaceholder: React.FunctionComponent
}
export function ManagedList(props: ManagedListProps) {
  const location = useLocation()

  const [isDeletingSelection, setIsDeletingSelection] = useState(false)
  const [isDeletingAll, setIsDeletingAll] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)
  const [scrollIndex, setScrollIndex] = useState(0)
  const [state, dispatch] = useReducer(manageSelectedItems, {
    selectedItems: [],
  })

  const path = location.pathname
  const selectedItems = state.selectedItems
  const headerProps: HeaderProps = {
    ...props,
    selectedItems,
    dispatch,
    isSelecting,
    setIsSelecting,
    setScrollIndex,
    setIsDeletingAll,
    setIsDeletingSelection,
  }
  const bodyProps: BodyProps = {
    ...headerProps,
    scrollIndex,
    setScrollIndex,
  }

  const isOpen = isDeletingAll || isDeletingSelection
  const onAccept = handleAccept
  function handleAccept() {
    isDeletingAll ? props.onDeleteAll() : props.onDeleteSelection(selectedItems)
    handleCancel()
  }

  const onCancel = handleCancel
  function handleCancel() {
    setIsDeletingAll(false)
    setIsDeletingSelection(false)
    setIsSelecting(false)
    dispatch({ type: "clear" })
  }

  const deleteConfirmationProps: DeleteConfirmationProps = {
    isOpen,
    onAccept,
    onCancel,
    setIsSelecting,
  }

  return (
    <ErrorBoundary
      componentName="ManagedList"
      featurePath={path}
      state={{ component: { ...props } }}
    >
      <Outer>
        <Header {...headerProps} />
        <Body {...bodyProps} />
        <DeleteConfirmation {...deleteConfirmationProps} />
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
    <Window gap={theme.module[2]} padding={`0 ${theme.module[2]}`}>
      {children}
    </Window>
  )
}
/*




*/
type HeaderProps = ManagedListProps & {
  selectedItems: string[]
  dispatch: ManagedListDispatch
  isSelecting: boolean
  setIsSelecting: any
  setScrollIndex: any
  setIsDeletingSelection: any
  setIsDeletingAll: any
}
function Header(props: HeaderProps) {
  const theme = useTheme()

  function handleSelect(item: SearchItemProps) {
    const selectedItem = item
    const index = _.findIndex(
      props.list,
      (listItem) => listItem.id === selectedItem.id,
    )
    props.setScrollIndex(index)
  }

  const showHeader = !!props.list.length

  return (
    showHeader && (
      <Stack width={"100%"} height={theme.module[6]} flexShrink={0}>
        {props.isSelecting ? (
          <SelectionBar {...props} />
        ) : (
          <SearchBar
            heading={props.heading}
            list={props.list}
            onSelect={handleSelect}
          />
        )}
      </Stack>
    )
  )
}
/*




*/
type SelectionBarProps = HeaderProps
function SelectionBar(props: SelectionBarProps) {
  const theme = useTheme()

  const isAllSelected =
    !!props.selectedItems.length &&
    props.list.length === props.selectedItems.length

  function handleSelectAll() {
    const ids: string[] = []
    _.forEach(props.list, (item) => {
      ids.push(item.id)
    })
    props.dispatch({ type: "set", ids })
  }

  function handleDelete() {
    isAllSelected
      ? props.setIsDeletingAll(true)
      : props.setIsDeletingSelection(true)
  }

  function handleBack() {
    props.dispatch({ type: "clear" })
    props.setIsSelecting(false)
  }

  return (
    <Window
      direction={"row"}
      padding={`0 ${theme.module[3]}`}
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
        <Typography>{props.selectedItems.length}</Typography>
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
    </Window>
  )
}
/*




*/
type BodyProps = ManagedListProps & {
  scrollIndex: number
  setScrollIndex: any
  isSelecting: boolean
  setIsSelecting: any
  selectedItems: string[]
  dispatch: ManagedListDispatch
}
function Body(props: BodyProps) {
  const theme = useTheme()

  const [showScrollToTop, setShowScrollToTop] = useState(false)

  const virtuoso: any = useRef(null)

  const isSelectionClear = props.isSelecting && !props.selectedItems.length

  useEffect(() => {
    if (isSelectionClear) props.setIsSelecting(false)
  }, [isSelectionClear])

  useEffect(() => {
    virtuoso.current &&
      virtuoso.current.scrollToIndex({
        index: props.scrollIndex,
        behavior: "smooth",
        align: "top",
      })
  }, [virtuoso, props.scrollIndex])

  function handleScrollToTopClick() {
    props.setScrollIndex(1)
    _.delay(() => props.setScrollIndex(0), 50)
  }

  return !props.list.length ? (
    <props.emptyListPlaceholder />
  ) : (
    <Window
      padding={theme.module[1]}
      borderRadius={theme.module[3]}
      boxShadow={theme.shadow.neo[2]}
      position={"relative"}
      sx={{
        outline: `1px solid ${theme.scale.gray[7]}`,
      }}
    >
      <Window
        gap={theme.module[3]}
        borderRadius={theme.module[3]}
        overflow={"hidden"}
      >
        <Virtuoso
          ref={virtuoso}
          totalCount={props.list.length}
          atTopThreshold={100}
          atTopStateChange={(isAtTop) => setShowScrollToTop(!isAtTop)}
          style={{
            height: "100%",
            width: "100%",
            borderRadius: theme.module[3],
          }}
          itemContent={(index) => {
            const item = props.list[index]
            const id = item.id
            const options = props.options(item)
            const isSelected = !!_.find(
              props.selectedItems,
              (selectedId) => selectedId === item.id,
            )

            return (
              <Stack
                id={`history-list-item-${index}`}
                padding={theme.module[0]}
                boxSizing={"border-box"}
              >
                <SelectableListItemWithOptions
                  label={item.name}
                  description={item.description}
                  iconName={props.bulletIconName}
                  options={options}
                  onLongPress={() => {
                    props.setIsSelecting(true)
                    props.dispatch({ type: "add", id })
                  }}
                  onSelection={() => props.dispatch({ type: "add", id })}
                  onDeselection={() => props.dispatch({ type: "remove", id })}
                  isSelecting={props.isSelecting}
                  isSelected={isSelected}
                />
              </Stack>
            )
          }}
        />
      </Window>
      {showScrollToTop && <ScrollToTop onClick={handleScrollToTopClick} />}
    </Window>
  )
}
/*




*/
type DeleteConfirmationProps = {
  setIsSelecting: Function
  onAccept: Function
  onCancel: Function
  isOpen: boolean
}
function DeleteConfirmation(props: DeleteConfirmationProps) {
  const actions: ModalActionProps[] = [
    { iconName: "cancel", handleClick: props.onCancel },
    { iconName: "done", handleClick: props.onAccept },
  ]

  return (
    <Modal
      open={props.isOpen}
      heading={"Confirm Deletion"}
      body={<Typography>Continue with deletion?</Typography>}
      onClose={props.onCancel}
      actions={actions}
    />
  )
}
/*




*/
