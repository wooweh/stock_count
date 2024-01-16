import { createContext } from "react"
import useTheme from "../common/useTheme"
import { Slot, Window } from "./surface"
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
    <Window
      maxHeight={props.maxHeight ?? "100%"}
      justifyContent={"flex-start"}
      gap={theme.module[props.gapScale ?? 3]}
      sx={{
        overflowY: "scroll",
      }}
    >
      {props.children}
    </Window>
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
export const ListGroupContext = createContext(false)
export function ListGroup(props: ListGroupProps) {
  return (
    <ListGroupOuterWrapper>
      <ListGroupChildren {...props} />
    </ListGroupOuterWrapper>
  )
}
/*





*/
function ListGroupOuterWrapper(props: ListGroupProps) {
  const theme = useTheme()
  return <Slot gap={theme.module[2]}>{props.children}</Slot>
}
/* 





*/
function ListGroupChildren(props: ListGroupProps) {
  const theme = useTheme()
  return (
    <ListGroupContext.Provider value={true}>
      <Slot
        gap={theme.module[0]}
        alignItems={"flex-start"}
        overflow={"hidden"}
        borderRadius={theme.module[3]}
      >
        {props.children}
      </Slot>
    </ListGroupContext.Provider>
  )
}
/*





*/
