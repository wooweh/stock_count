import { ClickAwayListener } from "@mui/material"
import ButtonBase from "@mui/material/ButtonBase"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import _ from "lodash"
import { MouseEvent, useContext, useEffect, useState } from "react"
import { useLongPress } from "use-long-press"
import useTheme from "../common/useTheme"
import { Button } from "./button"
import { Divider } from "./divider"
import Icon, { IconNames } from "./icon"
import { ListGroupContext } from "./list"
import { Slot, Window } from "./surface"
/* 








*/
type LabelProps = string
type DescriptionProps = string
type PrimarySlotProps = React.ReactElement
type SecondarySlotProps = React.ReactElement | undefined
type onChangeProps = any
type TappableProps = boolean
export type ListItemProps = {
  label: LabelProps
  description?: DescriptionProps
  primarySlot?: PrimarySlotProps
  noWrap?: boolean
  secondarySlot?: SecondarySlotProps
  tertiarySlot?: any
  onChange?: onChangeProps
  onLongPress?: any
  tappable?: TappableProps
  bgColor?: string
  sx?: any
}
export function ListItem(props: ListItemProps) {
  return (
    <ListItemOuterWrapper {...props}>
      <InnerWrapper {...props}>
        <Container {...props}>
          <PrimarySlot {...props}>{props.primarySlot}</PrimarySlot>
          <ItemBody {...props} />
        </Container>
        <SecondarySlot {...props}>{props.secondarySlot}</SecondarySlot>
      </InnerWrapper>
      <TertiarySlot>{props.tertiarySlot}</TertiarySlot>
      <TappableSurface {...props} />
    </ListItemOuterWrapper>
  )
}
/*




*/
function ListItemOuterWrapper(props: {
  children: any
  tappable?: TappableProps
  bgColor?: string
  sx?: any
}) {
  const theme = useTheme()
  const groupContext = useContext(ListGroupContext)
  return (
    <Stack
      position={"relative"}
      boxSizing={"border-box"}
      overflow={"hidden"}
      gap={theme.module[3]}
      borderRadius={!!groupContext ? undefined : theme.module[2]}
      bgcolor={props.bgColor ?? theme.scale.gray[9]}
      justifyContent={"center"}
      minHeight={theme.module[6]}
      width={"100%"}
      padding={theme.module[4]}
      sx={{
        outline: `2px solid ${theme.scale.gray[7]}`,
        outlineOffset: "-2px",
        ...props.sx,
      }}
    >
      {props.children}
    </Stack>
  )
}
/*





*/
function TertiarySlot(props: { children: any }) {
  return (
    !!props.children && (
      <Stack
        boxSizing={"border-box"}
        bgcolor={"none"}
        justifyContent={"center"}
      >
        {props.children}
      </Stack>
    )
  )
}
/*





*/
function InnerWrapper(props: { children: any }) {
  const theme = useTheme()
  return (
    <Slot
      bgcolor={"none"}
      justifyContent={"space-between"}
      gap={theme.module[4]}
      zIndex={0}
    >
      {props.children}
    </Slot>
  )
}
/*





*/
type ContainerProps = {
  label: LabelProps
  primarySlot?: PrimarySlotProps
  description?: DescriptionProps
  secondarySlot?: SecondarySlotProps
  children: React.ReactElement | React.ReactElement[]
}
function Container(props: ContainerProps) {
  const theme = useTheme()
  return !!props.label?.length || !!props.primarySlot || !!props.description ? (
    <Stack
      boxSizing={"border-box"}
      bgcolor={"none"}
      justifyContent={"start"}
      direction={"row"}
      gap={theme.module[4]}
      maxWidth={props.secondarySlot ? "70%" : "100%"}
      sx={{
        pointerEvents: "none",
      }}
    >
      {props.children}
    </Stack>
  ) : null
}
/*





*/
function PrimarySlot(props: { children: PrimarySlotProps | undefined }) {
  return !!props.children && <Slot width={"min-content"}>{props.children}</Slot>
}
/*





*/
function SecondarySlot(props: {
  label: LabelProps
  children: SecondarySlotProps
}) {
  const theme = useTheme()
  return !!props.children ? (
    <Stack
      boxSizing={"border-box"}
      bgcolor={"none"}
      alignItems={"flex-end"}
      justifyContent={"center"}
      minWidth={theme.module[7]}
      sx={{
        "&: hover": {
          filter: "brightness(1.15)",
        },
      }}
    >
      {props.children}
    </Stack>
  ) : undefined
}
/*





*/
function ItemBody(props: {
  label: LabelProps
  noWrap?: boolean
  description?: DescriptionProps
  secondarySlot?: SecondarySlotProps
}) {
  const theme = useTheme()
  return (
    !!props.label.length && (
      <Stack justifyContent={"center"} width={"100%"}>
        <Typography
          variant="body1"
          color={theme.scale.gray[3]}
          fontWeight={"bold"}
          maxWidth={props.noWrap ? `calc(${theme.module[8]} * 2)` : "100%"}
          noWrap={props.noWrap}
        >
          {props.label}
        </Typography>
        <Typography
          variant="body2"
          fontWeight={"bold"}
          color={theme.scale.gray[5]}
          maxWidth={props.secondarySlot ? theme.module[9] : "none"}
          noWrap
        >
          {props.description}
        </Typography>
      </Stack>
    )
  )
}
/*





*/
function TappableSurface(props: {
  tappable?: TappableProps
  onChange?: onChangeProps
  onLongPress?: any
}) {
  const bind = useLongPress((e: MouseEvent) => {
    if (props.onLongPress) {
      props.onLongPress()
    }
  })
  return !!props.tappable ? (
    <ButtonBase
      onClick={props.onChange}
      disableRipple
      {...bind()}
      sx={{
        background: "none",
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    />
  ) : null
}
/*





*/
export type ListItemOptionProps = {
  iconName: IconNames
  onClick?: Function
}
export type SelectableListItemWithOptionsProps = {
  label: string
  description: string
  iconName: IconNames
  options: ListItemOptionProps[]
  isSelecting: boolean
  isSelected: boolean
  onSelection: Function
  onDeselection: Function
  onLongPress: Function
}
export function SelectableListItemWithOptions(
  props: SelectableListItemWithOptionsProps,
) {
  const theme = useTheme()
  const [isLongPressing, setIsLongPressing] = useState(true)

  function handleSelectionClick() {
    if (props.isSelecting) {
      if (!props.isSelected) props.onSelection()
      if (props.isSelected) props.onDeselection()
    }
  }

  function handleLongPress() {
    if (!props.isSelecting) {
      props.onLongPress()
    }
  }

  useEffect(() => {
    if (!props.isSelecting) setIsLongPressing(true)
    if (props.isSelecting) _.delay(() => setIsLongPressing(false), 500)
  }, [props.isSelecting])

  return props.isSelecting ? (
    <Stack position={"relative"}>
      <ListItem
        label={props.label}
        description={props.description}
        primarySlot={
          <Icon variation={props.isSelected ? "checked" : "unchecked"} />
        }
        onChange={isLongPressing ? undefined : handleSelectionClick}
        tappable={true}
      />
    </Stack>
  ) : (
    <Stack
      borderRadius={3}
      sx={{
        outline: props.isSelected ? `2px solid ${theme.scale.blue[8]}` : "none",
      }}
    >
      <ListItemWithOptions
        label={props.label}
        description={props.description}
        iconName={props.iconName}
        options={props.options}
        onLongPress={handleLongPress}
      />
    </Stack>
  )
}
/*




*/
export type ListItemWithOptionsProps = {
  label: string
  description: string
  iconName: IconNames
  options: ListItemOptionProps[]
  onLongPress?: Function
}
export function ListItemWithOptions(props: ListItemWithOptionsProps) {
  const [showOptions, setShowOptions] = useState(false)

  return (
    <ClickAwayListener onClickAway={() => setShowOptions(false)}>
      <Stack position={"relative"}>
        <ListItem
          label={props.label}
          description={props.description}
          primarySlot={<Icon variation={props.iconName} />}
          secondarySlot={
            <Button
              variation={"pill"}
              iconName={"options"}
              onClick={() => setShowOptions(true)}
            />
          }
          onChange={() => setShowOptions(true)}
          onLongPress={props.onLongPress}
          tappable={true}
        />
        <ItemOptions
          show={showOptions}
          setShow={setShowOptions}
          options={props.options}
        />
      </Stack>
    </ClickAwayListener>
  )
}
/*




*/
type ItemOptionsProps = {
  show: boolean
  setShow: Function
  options: ListItemOptionProps[]
}
function ItemOptions(props: ItemOptionsProps) {
  const theme = useTheme()

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [handleDelete, setHandleDelete] = useState({ onDelete: new Function() })

  useEffect(() => {
    if (!props.show) setShowDeleteConfirmation(false)
  }, [props.show])

  return (
    props.show && (
      <Window
        bgcolor={theme.scale.gray[9]}
        position={"absolute"}
        borderRadius={theme.module[2]}
        sx={{
          outline: `2px solid ${theme.scale.gray[6]}`,
          outlineOffset: "-2px",
        }}
      >
        <Window
          direction={"row"}
          position={"relative"}
          borderRadius={theme.module[3]}
          justifyContent={"space-evenly"}
        >
          {props.options.map((option: ListItemOptionProps, index: number) => {
            const isDelete = option.iconName === "delete"
            function onClick() {
              if (option.onClick) {
                if (isDelete) {
                  setShowDeleteConfirmation(true)
                  setHandleDelete({ onDelete: option.onClick })
                } else {
                  option.onClick()
                  props.setShow(false)
                }
              }
            }

            return (
              <>
                <Button
                  variation={"pill"}
                  onClick={onClick}
                  iconName={option.iconName}
                  key={index}
                />
                {index !== props.options.length && <Divider vertical />}
              </>
            )
          })}
          <Button
            variation={"pill"}
            onClick={() => props.setShow(false)}
            iconName={"cancel"}
            key={props.options.length}
          />
          {showDeleteConfirmation && (
            <ItemOptionDeleteConfirmation
              setShowOptions={props.setShow}
              setShow={setShowDeleteConfirmation}
              onDelete={handleDelete.onDelete}
            />
          )}
        </Window>
      </Window>
    )
  )
}
/*





*/
type ItemOptionDeleteConfirmationProps = {
  onDelete: Function | undefined
  setShow: Function
  setShowOptions: Function
}
function ItemOptionDeleteConfirmation(
  props: ItemOptionDeleteConfirmationProps,
) {
  const theme = useTheme()

  function handleAccept() {
    !!props.onDelete && props.onDelete()
    props.setShow(false)
    props.setShowOptions(false)
  }

  function handleCancel() {
    props.setShow(false)
  }

  return (
    <Window
      position={"absolute"}
      left={0}
      direction={"row"}
      borderRadius={theme.module[2]}
      zIndex={100}
      justifyContent={"space-between"}
      padding={`0 ${theme.module[5]}`}
      bgcolor={theme.scale.gray[8]}
    >
      <Button variation="pill" iconName={"cancel"} onClick={handleCancel} />
      <Typography variant="body2" color={theme.scale.gray[5]}>
        Confirm Deletion
      </Typography>
      <Button variation="pill" iconName={"done"} onClick={handleAccept} />
    </Window>
  )
}
/*





*/
