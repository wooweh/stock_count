import Stack from "@mui/material/Stack"
import { OnRefChangeType } from "react-resize-detector/build/types/types"
import useTheme from "../common/useTheme"
/*





*/
type ContainerProps = {
  children: React.ReactElement | React.ReactElement[]
  resizeRef: OnRefChangeType
}
export default function Container(props: ContainerProps) {
  const theme = useTheme()

  return (
    <Stack
      id={"pages_container"}
      ref={props.resizeRef}
      width={"100vw"}
      height={"100vh"}
      minHeight={"710px"}
      minWidth={"350px"}
      paddingTop={theme.module[6]}
      bgcolor={theme.scale.gray[9]}
      bottom={0}
      alignItems="center"
      justifyContent="center"
      boxSizing={"border-box"}
      overflow={"scroll"}
    >
      {props.children}
    </Stack>
  )
}
