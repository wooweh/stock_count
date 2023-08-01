import { Typography } from "@mui/material"
import { Button } from "../../components/button"
import Stack from "@mui/material/Stack"
import Grid from "@mui/material/Unstable_Grid2"
import { useNavigate } from "react-router-dom"
import useTheme from "../../common/useTheme"
import Icon, { IconNames } from "../../components/icon"
import { routePaths } from "./core"
import { selectIsProfileComplete, selectIsUserAdmin } from "../user/userSlice"
import { useAppSelector } from "../../app/hooks"
import { selectIsOrgSetup } from "../organisation/organisationSlice"
import { selectIsSystemBooted } from "./coreSlice"
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
        onClick={() => navigate(routePaths.profile.path)}
        sx={{
          outline: `2px solid ${theme.scale.blue[5]} !important`,
        }}
      >
        <Icon
          variation={"profile"}
          fontSize={"large"}
          color={theme.scale.blue[5]}
        />
      </Button>
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
        onClick={() => navigate(routePaths.organisation.path)}
        sx={{
          outline: `2px solid ${theme.scale.blue[5]} !important`,
        }}
      >
        <Icon
          variation={"org"}
          fontSize={"large"}
          color={theme.scale.blue[5]}
        />
      </Button>
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
    { label: "New Count", icon: "add", path: routePaths.newCount.path },
    { label: "Stock", icon: "list", path: routePaths.stock.path },
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
                onClick={handleClick}
                animationDuration={150}
              >
                <Stack
                  width={"100%"}
                  direction={"row"}
                  gap={theme.module[5]}
                  alignItems={"center"}
                  padding={theme.module[2]}
                  boxSizing={"border-box"}
                >
                  <Stack
                    bgcolor={theme.scale.gray[9]}
                    borderRadius={theme.module[2]}
                    padding={theme.module[5]}
                  >
                    <Icon
                      color={theme.scale.gray[5]}
                      variation={button.icon}
                      fontSize="large"
                    />
                  </Stack>
                  <Stack>
                    <Typography color={theme.scale.gray[5]} variant="h5">
                      {button.label}
                    </Typography>
                  </Stack>
                </Stack>
              </Button>
            </Grid>
          )
        })}
      </Grid>
    </Stack>
  )
}
/*





*/
