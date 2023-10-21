import { Typography } from "@mui/material"
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
import { selectIsOrgSetup } from "../org/orgSlice"
import { createOrg, joinOrg } from "../org/orgSliceUtils"
import { getInviteKeyValidation } from "../org/orgUtils"
import { selectIsProfileComplete, selectIsUserAdmin } from "../user/userSlice"
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
        <Typography color={theme.scale.gray[6]} variant="h5">
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
        iconColor={theme.scale.blue[5]}
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
  const theme = useTheme()
  const [placeholder, setPlacehoder] = useState(props.placeholder ?? "")

  return (
    <Input
      value={props.value}
      placeholder={placeholder}
      onFocus={() => setPlacehoder("")}
      onBlur={() => setPlacehoder(props.placeholder ?? "")}
      inputProps={{
        style: {
          textAlign: "center",
        },
      }}
      sx={{
        fontSize: "1.125rem",
        fontWeight: "medium",
        height: "3.5rem",
      }}
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
      <Icon variation="org" fontSize="large" color={theme.scale.gray[5]} />
      <Typography color={theme.scale.gray[6]} variant="h5">
        Setup your Org
      </Typography>
      <Stack
        height={"100%"}
        width={"100%"}
        gap={theme.module[5]}
        alignItems={"center"}
      >
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
        <Typography
          color={theme.scale.gray[6]}
          fontWeight={"bold"}
          variant="h5"
        >
          OR
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
