import { Divider as MuiDivider } from "@mui/material"
import useTheme, { ThemeColors } from "../common/useTheme"

/*




*/
type DividerProps = {
  vertical?: boolean
  color?: ThemeColors
  variant?: "inset" | "middle" | "fullWidth"
  sx?: any
}
export function Divider(props: DividerProps) {
  const theme = useTheme()
  const styles = {
    borderColor: theme.scale[props.color ?? "gray"][6],
    ...props.sx,
  }
  return (
    <MuiDivider
      orientation={props.vertical ? "vertical" : "horizontal"}
      variant={props.variant ?? "middle"}
      flexItem
      sx={styles}
    />
  )
}
/*




*/
