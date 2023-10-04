import ButtonBase from "@mui/material/ButtonBase"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import {
  MouseEvent,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { useLongPress } from "use-long-press"
import useTheme from "../common/useTheme"
import { Button } from "./button"
import Icon, { IconNames } from "./icon"
import { ClickAwayListener } from "@mui/material"
import { selectShowNotification } from "../features/core/coreSlice"
/* 








*/
export const ListGroupContext = createContext(false)
/* 








*/
export type ListProps = {
  children: any
  gapScale?: number
  maxHeight?: string
}
export function List(props: ListProps) {
  const theme = useTheme()
  return (
    <Stack
      width={"100%"}
      height={"100%"}
      maxHeight={props.maxHeight ?? "100%"}
      boxSizing={"border-box"}
      justifyContent={"flex-start"}
      gap={theme.module[props.gapScale ?? 3]}
      sx={{
        overflowY: "scroll",
      }}
    >
      {props.children}
    </Stack>
  )
}
/*





*/
export type ListGroupProps = {
  label?: string
  description?: string
  primarySlot?: any
  secondarySlot?: any
  children?: any
}
export function ListGroup(props: ListGroupProps) {
  return (
    <ListGroupOuterWrapper>
      <ListGroupChildren {...props} />
    </ListGroupOuterWrapper>
  )
  /*





*/
  function ListGroupOuterWrapper(props: ListGroupProps) {
    const theme = useTheme()
    return (
      <Stack
        gap={theme.module[2]}
        boxSizing={"border-box"}
        sx={{
          width: "100%",
        }}
      >
        {props.children}
      </Stack>
    )
  }
}
/* 





*/
function ListGroupChildren(props: ListGroupProps) {
  const theme = useTheme()
  return (
    <ListGroupContext.Provider value={true}>
      <Stack
        gap={theme.module[0]}
        alignItems={"flex-start"}
        overflow={"hidden"}
        borderRadius={theme.module[3]}
        sx={{ width: "100%" }}
      >
        {props.children}
      </Stack>
    </ListGroupContext.Provider>
  )
}
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
      sx={props.sx}
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
    <Stack
      bgcolor={"none"}
      direction={"row"}
      boxSizing={"border-box"}
      justifyContent={"space-between"}
      gap={theme.module[4]}
      sx={{ width: "100%", zIndex: 0 }}
    >
      {props.children}
    </Stack>
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
        width: "50%",
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
          color={theme.scale.gray[4]}
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
  /*
  

*/
  function handleSelectionClick() {
    if (props.isSelecting) {
      if (!props.isSelected) props.onSelection()
      if (props.isSelected) props.onDeselection()
    }
  }
  /*
  
  
  */
  function handleLongPress() {
    if (!props.isSelecting) {
      props.onLongPress()
    }
  }
  /*
  
  
  */
  useEffect(() => {
    if (!props.isSelecting) setIsLongPressing(true)
    if (props.isSelecting)
      setTimeout(() => {
        setIsLongPressing(false)
      }, 500)
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

  return (
    props.show && (
      <Stack
        width={"100%"}
        height={"100%"}
        direction={"row"}
        bgcolor={theme.scale.gray[9]}
        boxSizing={"border-box"}
        position={"absolute"}
        borderRadius={theme.module[3]}
        justifyContent={"space-between"}
        alignItems={"center"}
        padding={`0 ${theme.module[5]}`}
      >
        {props.options.map((option: ListItemOptionProps, index: number) => {
          function onClick() {
            if (option.onClick) option.onClick()
          }

          return (
            <Button
              variation={"pill"}
              onClick={onClick}
              iconName={option.iconName}
              key={index}
            />
          )
        })}
        <Button
          variation={"pill"}
          onClick={() => props.setShow(false)}
          iconName={"cancel"}
          key={props.options.length}
        />
      </Stack>
    )
  )
}
/*





*/
