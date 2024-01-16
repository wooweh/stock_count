import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useState } from "react"
import { useLocation } from "react-router-dom"
import useTheme from "../../common/useTheme"
import { Button } from "../../components/button"
import { Divider } from "../../components/divider"
import { ErrorBoundary } from "../../components/errorBoundary"
import Icon, { IconNames } from "../../components/icon"
import { Window } from "../../components/surface"
import { generateCustomNotification } from "../core/coreUtils"
import { PromptInput } from "../core/home"
import { useOrgUI } from "./org"
import { createOrg, joinOrg } from "./orgSliceUtils"
import { getInviteKeyValidation } from "./orgUtils"
/*




*/
export function OrgSetup() {
  const location = useLocation()
  const orgUIState = useOrgUI((state) => state)
  const path = location.pathname

  return (
    <ErrorBoundary
      componentName={"OrgSetup"}
      featurePath={path}
      state={{ featureUI: { ...orgUIState } }}
    >
      <SetupOrgPrompt />
    </ErrorBoundary>
  )
}
/*




*/
export function SetupOrgPrompt() {
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
    <Window
      gap={theme.module[6]}
      maxWidth={theme.module[11]}
      padding={theme.module[5]}
      paddingTop={theme.module[6]}
    >
      <Icon variation="org" fontSize="large" color={theme.scale.green[7]} />
      <Window gap={theme.module[5]}>
        <Typography color={theme.scale.green[7]} variant="h5">
          Create Org
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
      </Window>
    </Window>
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
