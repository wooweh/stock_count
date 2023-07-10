import { CSSProperties } from "react"
import { SquareLoader } from "react-spinners"
import useTheme from "../common/useTheme"
import { Stack, Typography } from "@mui/material"
/*





*/
export function Loader({ narration }: { narration: string }) {
  const theme = useTheme()
  const styles: CSSProperties = {
    display: "block",
    borderRadius: theme.module[3],
    outline: `1px solid ${theme.scale.gray[7]}`,
    boxShadow: `0 0 15px 0px ${theme.scale.gray[7]}`,
  }
  const firstChar = narration.charAt(0).toUpperCase()
  const modifiedNarration = firstChar + narration.slice(1)
  return (
    <Stack gap={theme.module[5]} alignItems={"center"}>
      <SquareLoader
        color={theme.scale.gray[8]}
        loading={true}
        cssOverride={styles}
        speedMultiplier={0.75}
        size={100}
      />
      <Typography color={theme.scale.gray[6]} fontWeight={"light"} variant="h6">
        {modifiedNarration}...
      </Typography>
    </Stack>
  )
}
