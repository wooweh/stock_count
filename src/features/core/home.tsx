import { Typography } from "@mui/material"
import Stack from "@mui/material/Stack"
import Grid from "@mui/material/Unstable_Grid2"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Button } from "../../components/button"
import Icon, { IconNames } from "../../components/icon"
import { selectIsOrgSetup } from "../organisation/organisationSlice"
import { selectIsProfileComplete, selectIsUserAdmin } from "../user/userSlice"
import { routePaths } from "./pages"
/*





*/
export function Home() {
  const isProfileComplete = useAppSelector(selectIsProfileComplete)
  const isOrgSetup = useAppSelector(selectIsOrgSetup)

  return isProfileComplete ? (
    isOrgSetup ? (
      <HomeButtons />
    ) : (
      <OrgSetupPrompt />
    )
  ) : (
    <CompleteProfilePrompt />
  )
}
/*





*/
export function CompleteProfilePrompt() {
  const theme = useTheme()
  const navigate = useNavigate()

  return (
    <Stack
      gap={theme.module[5]}
      alignItems={"center"}
      width={theme.module[10]}
      paddingBottom={theme.module[6]}
    >
      <Typography color={theme.scale.gray[4]} variant="h4">
        Complete
      </Typography>
      <Typography color={theme.scale.gray[4]} variant="h4">
        your
      </Typography>
      <Button
        variation={"profile"}
        label={"Profile"}
        iconName={"profile"}
        iconColor={theme.scale.blue[5]}
        outlineColor={theme.scale.blue[5]}
        onClick={() => navigate(routePaths.profile.path)}
        justifyCenter
      />
    </Stack>
  )
}
/*





*/
function OrgSetupPrompt() {
  const theme = useTheme()
  const navigate = useNavigate()
  return (
    <Stack
      gap={theme.module[5]}
      alignItems={"center"}
      width={theme.module[10]}
      paddingBottom={theme.module[6]}
    >
      <Typography color={theme.scale.gray[4]} variant="h4">
        Create or Join
      </Typography>
      <Typography color={theme.scale.gray[4]} variant="h4">
        your
      </Typography>
      <Button
        variation={"profile"}
        label={"Organisation"}
        iconName={"org"}
        iconColor={theme.scale.blue[5]}
        outlineColor={theme.scale.blue[5]}
        justifyCenter
        onClick={() => navigate(routePaths.organisation.path)}
      />
    </Stack>
  )
}
/*





*/
type HomeButton = {
  label: string
  icon: IconNames
  path: string
}
function HomeButtons() {
  const theme = useTheme()
  const navigate = useNavigate()
  const isAdmin = useAppSelector(selectIsUserAdmin)

  const adminButtons: HomeButton[] = [
    { label: "Count", icon: "list", path: routePaths.count.path },
    { label: "Stock", icon: "stock", path: routePaths.stock.path },
    { label: "History", icon: "history", path: routePaths.history.path },
    { label: "Analysis", icon: "timeline", path: routePaths.analysis.path },
  ]
  const memberButtons = [adminButtons[0]]

  const buttons = isAdmin ? adminButtons : memberButtons

  return (
    <Stack width={theme.module[10]} paddingBottom={theme.module[6]}>
      <Grid container spacing={4}>
        {buttons.map((button: HomeButton, index: number) => {
          function handleClick() {
            navigate(button.path)
          }

          return (
            <Grid width={"100%"} key={index}>
              <Button
                variation={"home"}
                label={button.label}
                iconName={button.icon}
                onClick={handleClick}
                animationDuration={150}
              />
            </Grid>
          )
        })}
      </Grid>
    </Stack>
  )
}
/*





*/
