import { Divider, Typography } from "@mui/material"
import Stack from "@mui/material/Stack"
import Grid from "@mui/material/Unstable_Grid2/Grid2"
import _ from "lodash"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Button } from "../../components/button"
import { Input } from "../../components/control"
import Icon, { IconNames } from "../../components/icon"
import { selectIsOrgSetup, selectOrgName } from "../org/orgSliceSelectors"
import { createOrg, joinOrg } from "../org/orgSliceUtils"
import { getInviteKeyValidation } from "../org/orgUtils"
import { selectIsProfileComplete, selectIsUserAdmin } from "../user/userSliceSelectors"
import { updateUserName } from "../user/userSliceUtils"
import { generateCustomNotification } from "./coreUtils"
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
      <SetupOrgPrompt />
    )
  ) : (
    <CompleteProfilePrompt />
  )
}
/*




*/
export function CompleteProfilePrompt() {
  const theme = useTheme()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  const isProfileDetailsComplete = !!firstName && !!lastName
  const INCOMPLETE_DETAILS_MESSAGE = "Please complete your name and surname."

  function handleClick() {
    if (isProfileDetailsComplete) {
      updateUserName(firstName, lastName)
    } else {
      generateCustomNotification("error", INCOMPLETE_DETAILS_MESSAGE)
    }
  }

  return (
    <Stack
      height={"100%"}
      alignItems={"center"}
      justifyContent={"space-between"}
      maxWidth={theme.module[11]}
      width={"100%"}
      padding={theme.module[5]}
      paddingTop={theme.module[6]}
      boxSizing={"border-box"}
    >
      <Stack
        width={"100%"}
        height={"100%"}
        gap={theme.module[6]}
        alignItems={"center"}
      >
        <Icon
          variation="profile"
          fontSize="large"
          color={theme.scale.blue[7]}
        />
        <Typography color={theme.scale.blue[7]} variant="h5">
          Complete your profile
        </Typography>
        <PromptInput
          placeholder={"Name"}
          value={_.capitalize(firstName)}
          onChange={setFirstName}
        />
        <PromptInput
          placeholder={"Surname"}
          value={_.capitalize(lastName)}
          onChange={setLastName}
        />
      </Stack>
      <Button
        variation={"profile"}
        label={"Complete"}
        iconName={"done"}
        iconColor={theme.scale.blue[6]}
        outlineColor={theme.scale.gray[6]}
        onClick={handleClick}
        justifyCenter
      />
    </Stack>
  )
}
/*




*/
type PromptInputProps = {
  placeholder: string
  value: string
  onChange: Function
}
function PromptInput(props: PromptInputProps) {
  const [placeholder, setPlacehoder] = useState(props.placeholder ?? "")

  const inputProps = {
    style: {
      textAlign: "center",
    },
  }
  const styles = {
    fontSize: "1.125rem",
    fontWeight: "medium",
    height: "3.5rem",
  }

  return (
    <Input
      value={props.value}
      placeholder={placeholder}
      onFocus={() => setPlacehoder("")}
      onBlur={() => setPlacehoder(props.placeholder ?? "")}
      inputProps={inputProps}
      sx={styles}
      onChange={(event: any) => props.onChange(event.target.value)}
    />
  )
}
/*




*/
function SetupOrgPrompt() {
  const theme = useTheme()

  const [orgName, setOrgName] = useState("")
  const [inviteKey, setInviteKey] = useState("")

  const SUCCESS_MESSAGE = "You can view your org in the menu."

  function handleCreateOrg() {
    createOrg(orgName)
    generateCustomNotification("success", SUCCESS_MESSAGE)
  }
  async function handleJoinOrg() {
    const status = await joinOrg(inviteKey)
    if (status.isJoined) generateCustomNotification("success", SUCCESS_MESSAGE)
  }

  const isInviteKeyValid = getInviteKeyValidation(inviteKey)

  return (
    <Stack
      height={"100%"}
      width={"100%"}
      gap={theme.module[6]}
      alignItems={"center"}
      maxWidth={theme.module[11]}
      padding={theme.module[5]}
      paddingTop={theme.module[6]}
      boxSizing={"border-box"}
    >
      <Icon variation="org" fontSize="large" color={theme.scale.green[7]} />
      <Stack
        height={"100%"}
        width={"100%"}
        gap={theme.module[5]}
        alignItems={"center"}
      >
        <Typography color={theme.scale.green[7]} variant="h5">
          Setup Org
        </Typography>
        <OrgSetupPromptAction
          placeholder={"Org Name"}
          value={orgName}
          onInputChange={setOrgName}
          actionIconName={"done"}
          actionLabel="Create"
          onActionClick={handleCreateOrg}
          disabled={!orgName}
          key={"create"}
        />
        <Divider
          sx={{
            width: "100%",
            borderColor: theme.scale.gray[7],
            paddingTop: theme.module[3],
          }}
        />
        <Typography color={theme.scale.green[7]} variant="h5">
          Join Org
        </Typography>
        <OrgSetupPromptAction
          placeholder={"Org invite key"}
          value={inviteKey}
          onInputChange={setInviteKey}
          actionIconName={"done"}
          actionLabel="Join"
          onActionClick={handleJoinOrg}
          disabled={!isInviteKeyValid}
          key={"join"}
        />
      </Stack>
    </Stack>
  )
}
/*




*/
type OrgSetupPromptActionProps = {
  value: string
  placeholder: string
  actionIconName: IconNames
  actionLabel: string
  onActionClick: Function
  onInputChange: Function
  disabled: boolean
}
function OrgSetupPromptAction(props: OrgSetupPromptActionProps) {
  const theme = useTheme()
  return (
    <Stack gap={theme.module[5]} width={"100%"}>
      <PromptInput
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onInputChange}
      />
      <Button
        variation={"profile"}
        label={props.actionLabel}
        iconName={props.actionIconName}
        color={theme.scale.gray[5]}
        iconColor={!props.disabled ? theme.scale.green[6] : theme.scale.gray[5]}
        outlineColor={theme.scale.gray[6]}
        justifyCenter
        disabled={!!props.disabled}
        onClick={props.onActionClick}
      />
    </Stack>
  )
}
/*




*/
type HomeButton = {
  label: string
  color?: string
  icon: IconNames
  iconColor?: string
  bgColor?: string
  outlineColor?: string
  path: string
}
function HomeButtons() {
  const theme = useTheme()
  const navigate = useNavigate()

  const orgName = useAppSelector(selectOrgName)
  const isAdmin = useAppSelector(selectIsUserAdmin)

  const adminButtons: HomeButton[] = [
    {
      label: "Count",
      icon: "list",
      iconColor: theme.scale.blue[7],
      outlineColor: theme.scale.blue[8],
      bgColor: theme.scale.blue[9],
      path: routePaths.count.path,
    },
    {
      label: "Stock",
      icon: "stock",
      iconColor: theme.scale.green[7],
      outlineColor: theme.scale.green[8],
      bgColor: theme.scale.green[9],
      path: routePaths.stock.path,
    },
    {
      label: "History",
      icon: "history",
      iconColor: theme.scale.yellow[7],
      outlineColor: theme.scale.yellow[8],
      bgColor: theme.scale.yellow[9],
      path: routePaths.history.path,
    },
  ]
  const memberButtons = [adminButtons[0]]
  const buttons = isAdmin ? adminButtons : memberButtons

  return (
    <Stack
      height={"100%"}
      width={theme.module[10]}
      paddingTop={theme.module[2]}
      paddingBottom={theme.module[5]}
      boxSizing={"border-box"}
    >
      <Stack
        direction={"row"}
        width={"100%"}
        height={"18.75%"}
        minHeight={theme.module[8]}
        gap={theme.module[4]}
        justifyContent={"center"}
        alignItems={"center"}
        boxSizing={"border-box"}
      >
        <Button
          variation="profile"
          label={orgName}
          iconName="org"
          bgColor={theme.scale.gray[9]}
          iconColor={theme.scale.gray[5]}
          color={theme.scale.gray[5]}
          outlineColor={theme.scale.gray[6]}
          iconSize="large"
          onClick={() => navigate(routePaths.org.path)}
          justifyCenter
          animationDuration={150}
        />
      </Stack>
      <Stack width={"100%"} height={"75%"} justifyContent={"start"}>
        <Grid container spacing={4}>
          {buttons.map((button: HomeButton, index: number) => {
            return (
              <Grid width={"100%"} key={index}>
                <Button
                  variation={"home"}
                  label={button.label}
                  bgColor={button.bgColor}
                  color={button.color}
                  iconName={button.icon}
                  iconColor={button.iconColor}
                  outlineColor={button.outlineColor}
                  onClick={() => navigate(button.path)}
                  animationDuration={150}
                />
              </Grid>
            )
          })}
        </Grid>
      </Stack>
    </Stack>
  )
}
/*




*/
