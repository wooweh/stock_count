import { Stack, Typography } from "@mui/material"
import useTheme, { ThemeColors } from "../../common/useTheme"
import { Button } from "../../components/button"
import Icon from "../../components/icon"
import { setCountUI } from "./count"
import { CountTypeToggleButtons } from "./setup"

/*




*/
export function ManageCount() {
  return (
    <Outer>
      <Header />
      <Body />
      <UpdateCountButton />
    </Outer>
  )
}

/*




*/
function Outer({
  children,
}: {
  children: React.ReactElement | React.ReactElement[]
}) {
  const theme = useTheme()
  return (
    <Stack height={"100%"} gap={theme.module[5]}>
      {children}
    </Stack>
  )
}
/*




*/
function Header() {
  const theme = useTheme()
  return (
    <Stack
      width={"100%"}
      justifyContent={"center"}
      alignItems={"center"}
      position={"relative"}
      direction={"row"}
    >
      <Stack direction={"row"} gap={theme.module[3]} alignItems={"center"}>
        <Icon variation={"settings"} />
        <Typography variant="h6">Manage Count</Typography>
      </Stack>
      <Stack
        width={"100%"}
        position={"absolute"}
        right={0}
        alignItems={"flex-end"}
      >
        <Button
          variation={"pill"}
          iconName={"cancel"}
          bgColor={theme.scale.gray[9]}
          onClick={() => setCountUI("isManagingCount", false)}
          iconSize={"small"}
          outlineColor={theme.scale.red[7]}
          sx={{ padding: theme.module[3], boxShadow: theme.shadow.neo[3] }}
        />
      </Stack>
    </Stack>
  )
}
/*




*/
function Body() {
  const theme = useTheme()
  return (
    <Stack width={"100%"} gap={theme.module[5]}>
      <CountType />
      <CountTeam />
      <Transfers />
    </Stack>
  )
}
/*




*/
function CountType() {
  const theme = useTheme()
  return (
    <Stack width={"100%"} gap={theme.module[3]}>
      <Typography variant="h6">Count Type</Typography>
      <CountTypeToggleButtons />
    </Stack>
  )
}
/*




*/
type ActionProps = { action: string; color: ThemeColors }
function CountTeam() {
  const theme = useTheme()

  return (
    <Stack width={"100%"} gap={theme.module[2]}>
      <Typography variant="h6">Count Team</Typography>
      <CountTeamDescription />
      <CountTeamControls />
    </Stack>
  )
}
/*




*/
function CountTeamDescription() {
  const theme = useTheme()

  function Action(props: ActionProps) {
    return (
      <span style={{ color: theme.scale[props.color][5], fontWeight: "bold" }}>
        {props.action}
      </span>
    )
  }
  return (
    <Typography variant="body2" color={theme.scale.gray[4]}>
      You can <Action action={"add"} color={"blue"} /> or{" "}
      <Action action={"remove"} color={"red"} /> team members as well as{" "}
      <Action action={"transfer"} color={"orange"} /> removed members count{" "}
      <Action action={"results"} color={"green"} /> to another team member.
    </Typography>
  )
}
/*




*/
function CountTeamControls() {
  return <></>
}
/*




*/
function Transfers() {
  return <></>
}
/*




*/
function UpdateCountButton() {
  return <></>
}
/*




*/
