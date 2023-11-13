import Stack from "@mui/material/Stack"
import { createContext } from "react"
import useTheme from "../common/useTheme"
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
