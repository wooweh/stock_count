import Stack from "@mui/material/Stack"
import useTheme from "../common/useTheme"
/*





*/
export function ProfileSurface({
  children,
}: {
  children: React.ReactElement | React.ReactElement[]
}) {
  const theme = useTheme()
  return (
    <Stack
      height={"100%"}
      width={"100%"}
      padding={theme.module[3]}
      boxSizing={"border-box"}
    >
      <Stack
        width={"100%"}
        height={"100%"}
        padding={theme.module[5]}
        boxSizing={"border-box"}
        justifyContent={"space-between"}
        bgcolor={theme.scale.gray[9]}
        borderRadius={theme.module[4]}
        gap={theme.module[5]}
      >
        {children}
      </Stack>
    </Stack>
  )
}
