import { ButtonBase, Stack } from "@mui/material"
import useTheme from "../common/useTheme"
import Icon from "./icon"
import { Button } from "./button"

/*




*/
type ScrollToTopProps = {
  onClick: () => void
}
export function ScrollToTop(props: ScrollToTopProps) {
  const theme = useTheme()

  return (
    <Button
      variation="pill"
      onClick={props.onClick}
      sx={{
        position: "absolute",
        bottom: theme.module[4],
        right: theme.module[4],
        width: theme.module[6],
        height: theme.module[6],
        background: theme.scale.gray[7],
        borderRadius: theme.module[8],
        boxShadow: theme.shadow.std[3],
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        outline: `2px solid ${theme.scale.gray[6]} !important`,
        transform: "scale(1)",
      }}
      iconName={"scrollToTop"}
    />
  )
}
/*




*/
