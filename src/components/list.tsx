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
import { Control, ControlNames } from "./control"
import Icon, { IconNames } from "./icon"
/* 








*/
export const ListGroupContext = createContext(false)
/* 








*/
export type ListProps = { children: React.ReactElement | React.ReactElement[] }
export function List(props: ListProps) {
  const theme = useTheme()
  return (
    <Stack
      width={"100%"}
      height={"100%"}
      boxSizing={"border-box"}
      justifyContent={"flex-start"}
      gap={theme.module[3]}
      sx={{
        overflowY: "scroll",
      }}
    >
      {props.children}
    </Stack>
  )
}
/*




LIST GROUP



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
/* 








*/
function ListGroupHeader(props: ListGroupProps) {
  const theme = useTheme()
  return !!props.label ? (
    <Stack
      flexShrink={0}
      alignItems={"flex-start"}
      bgcolor={"none"}
      paddingLeft={theme.module[2]}
    >
      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
        {props.label}
      </Typography>
      <Typography variant="body2">{props.description}</Typography>
    </Stack>
  ) : null
}
/*





*/
function ListGroupFooter(props: ListGroupProps) {
  const theme = useTheme()
  return !!props.primarySlot || !!props.secondarySlot ? (
    <Stack
      direction="row"
      gap={theme.module[4]}
      justifyContent="end"
      sx={{ width: "100%" }}
    >
      <Stack height={theme.module[5]} minWidth={theme.module[8]}>
        {props.primarySlot}
      </Stack>
      <Stack height={theme.module[5]} minWidth={theme.module[8]}>
        {props.secondarySlot}
      </Stack>
    </Stack>
  ) : null
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
      <ListGroupHeader {...props} />
      <ListGroupChildren {...props} />
      <ListGroupFooter {...props} />
    </ListGroupOuterWrapper>
  )
}
/*



LIST ITEM




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
  primarySlot: PrimarySlotProps
  secondarySlot?: SecondarySlotProps
  onChange?: onChangeProps
  onLongPress?: any
  tappable?: TappableProps
  hideBackground?: boolean
}

/*





*/
function ListItemOuterWrapper(props: {
  children: any
  tappable?: TappableProps
  hideBackground?: boolean
}) {
  const theme = useTheme()
  const groupContext = useContext(ListGroupContext)
  return (
    <Stack
      position={"relative"}
      boxSizing={"border-box"}
      overflow={"hidden"}
      gap={theme.module[3]}
      borderRadius={!!groupContext ? undefined : 3}
      bgcolor={props.hideBackground ? "none" : theme.scale.gray[9]}
      justifyContent={"center"}
      minHeight={theme.module[6]}
      sx={{
        width: "100%",
        padding: `${theme.module[4]} ${theme.module[4]}`,
      }}
    >
      {props.children}
    </Stack>
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
function PrimarySlot(props: { children: PrimarySlotProps }) {
  return !!props.children ? (
    <Stack boxSizing={"border-box"} bgcolor={"none"} justifyContent={"center"}>
      {props.children}
    </Stack>
  ) : null
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
  description?: DescriptionProps
  secondarySlot?: SecondarySlotProps
}) {
  const theme = useTheme()
  return !!props.label.length ? (
    <Stack justifyContent={"center"} width={"100%"}>
      <Typography
        variant="body1"
        color={theme.scale.gray[3]}
        maxWidth={`calc(${theme.module[8]} * 2)`}
        noWrap
      >
        {props.label}
      </Typography>
      <Typography
        variant="body2"
        color={theme.scale.gray[5]}
        maxWidth={props.secondarySlot ? theme.module[9] : "none"}
        noWrap
      >
        {props.description}
      </Typography>
    </Stack>
  ) : undefined
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



LIST ITEM MAIN




*/
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
      <TappableSurface {...props} />
    </ListItemOuterWrapper>
  )
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
  showOptions: boolean
  onOptionsClick: Function
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
        showOptions={props.showOptions}
        onOptionsClick={props.onOptionsClick}
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
  showOptions: boolean
  onOptionsClick: Function
  onLongPress?: Function
}
export function ListItemWithOptions(props: ListItemWithOptionsProps) {
  const [showOptions, setShowOptions] = useState(false)

  useEffect(() => {
    if (!props.showOptions && showOptions) setShowOptions(false)
    if (props.showOptions && !showOptions) setShowOptions(true)
  }, [props.showOptions, showOptions])

  return (
    <Stack position={"relative"}>
      <ListItem
        label={props.label}
        description={props.description}
        primarySlot={<Icon variation={props.iconName} />}
        secondarySlot={
          <Button variation={"icon"} onClick={props.onOptionsClick}>
            <Icon variation={"options"} />
          </Button>
        }
        onChange={props.onOptionsClick}
        onLongPress={props.onLongPress}
        tappable={true}
      />
      <ItemOptions show={showOptions} options={props.options} />
    </Stack>
  )
}
/*








*/
type ItemOptionsProps = {
  show: boolean
  options: ListItemOptionProps[]
}
function ItemOptions(props: ItemOptionsProps) {
  const theme = useTheme()

  return props.show ? (
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
          <Button variation={"icon"} onClick={onClick} key={index}>
            <Icon variation={option.iconName} fontSize={"medium"} />
          </Button>
        )
      })}
    </Stack>
  ) : undefined
}
/*



LIST FACTORY ITEM




*/
function ListFactoryItemIcon(props: ListFactoryItemProps) {
  return !!props.iconName ? <Icon variation={props.iconName} /> : null
}
/* 








*/
function ListFactoryItemControl(props: ListFactoryItemProps) {
  return props.controlName ? (
    <Control
      variation={props.controlName}
      onChange={props.onChange}
      value={props.value}
    />
  ) : undefined
}
/* 








*/
export type ListFactoryItemProps = {
  iconName: IconNames
  controlName?: ControlNames
  label: string
  description?: string
  value?: any
  onChange?: any
  tappable?: boolean
  hideBackground?: boolean
}
export function ListFactoryItem(props: ListFactoryItemProps) {
  return (
    <ListItem
      {...props}
      primarySlot={<ListFactoryItemIcon {...props} />}
      secondarySlot={
        props.controlName ? <ListFactoryItemControl {...props} /> : undefined
      }
    />
  )
}
/*





*/
export type ListFactoryProps = { items: ListFactoryItemProps[] }
export function ListFactory(props: ListFactoryProps) {
  return (
    <>
      {props.items.map((item: ListFactoryItemProps, index: number) => {
        return <ListFactoryItem key={index} {...item} />
      })}
    </>
  )
}

/*





*/
