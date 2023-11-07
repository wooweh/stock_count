import { Stack, Typography } from "@mui/material"
import { CSSProperties } from "react"
import { SquareLoader } from "react-spinners"
import useTheme from "../common/useTheme"
import Icon from "./icon"
/*





*/
export function Loader({ narration }: { narration: string }) {
  const theme = useTheme()
  const styles: CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.module[3],
    outline: `1px solid ${theme.scale.gray[7]}`,
    boxShadow: `0 0 10px 0px ${theme.scale.blue[7]}`,
  }
  const firstChar = narration.charAt(0).toUpperCase()
  const modifiedNarration = firstChar + narration.slice(1)
  return (
    <Stack
      width={"100%"}
      height={"100%"}
      flexShrink={0}
      top={0}
      bgcolor={theme.scale.gray[9]}
      position={"absolute"}
      justifyContent={"center"}
      alignContent={"center"}
      zIndex={100}
      gap={theme.module[6]}
      alignItems={"center"}
    >
      <SquareLoader
        color={theme.scale.gray[9]}
        loading={true}
        cssOverride={styles}
        speedMultiplier={0.75}
        size={150}
      >
        <Icon
          variation="stock"
          fontSize="large"
          color={theme.scale.blue[8]}
          sx={{ transform: "scale(1.5)" }}
        />
      </SquareLoader>
      <Typography color={theme.scale.blue[8]} variant="h6">
        {modifiedNarration} ...
      </Typography>
    </Stack>
  )
}
