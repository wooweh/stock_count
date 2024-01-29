import Stack, { StackProps } from "@mui/material/Stack"
import useTheme from "../common/useTheme"
/*





*/
export function ProfileWrapper({
  children,
}: {
  children: React.ReactElement | React.ReactElement[]
}) {
  const theme = useTheme()
  return (
    <Window
      padding={theme.module[4]}
      justifyContent={"space-between"}
      borderRadius={theme.module[4]}
      maxWidth={"700px"}
      gap={theme.module[5]}
      
    >
      {children}
    </Window>
  )
}
/*




*/
export function Window(props: StackProps) {
  const stackProps: StackProps = {
    width: "100%",
    height: "100%",
    boxSizing: "border-box",
    alignItems: "center",
    ...props,
  }

  return <Stack {...stackProps}>{props.children}</Stack>
}
/*




*/
export function Slot(props: StackProps) {
  const stackProps: StackProps = {
    width: "100%",
    boxSizing: "border-box",
    direction: "row",
    alignItems: "center",
    justifyContent: "center",
    ...props,
  }

  return <Stack {...stackProps}>{props.children}</Stack>
}
/*




*/
