import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useState } from "react"
import useTheme from "../../common/useTheme"
import { Input } from "../../components/control"
import Icon, { IconNames } from "../../components/icon"
import { ListGroup } from "../../components/list"
import { ListItem } from "../../components/listItem"
import Modal from "../../components/modal"
import { setOrgUI, useOrgUI } from "./org"
import { createOrg, joinOrg } from "./orgSliceUtils"
/*




*/
export function OrgSetup() {
  return (
    <>
      <OrgSetupActions />
      <CreateOrg />
      <JoinOrg />
    </>
  )
}
/*




*/
type ActionItemProps = {
  label: string
  description: string
  iconName: IconNames
  onChange: () => void
}
function OrgSetupActions() {
  const theme = useTheme()

  const actionItems: ActionItemProps[] = [
    {
      label: "Create org",
      description: "Create a new org for your team",
      iconName: "org",
      onChange: () => setOrgUI("isCreating", true),
    },
    {
      label: "Join org",
      description: "Join an existing org with a key",
      iconName: "group",
      onChange: () => setOrgUI("isJoining", true),
    },
  ]

  return (
    <Stack
      padding={theme.module[3]}
      width={"100%"}
      height={"100%"}
      boxSizing={"border-box"}
      justifyContent={"flex-start"}
    >
      <ListGroup>
        {actionItems.map((item: ActionItemProps, index) => (
          <ListItem
            label={item.label}
            description={item.description}
            primarySlot={<Icon variation={item.iconName} />}
            onChange={item.onChange}
            tappable
            key={index}
          />
        ))}
      </ListGroup>
    </Stack>
  )
}
/*




*/
function CreateOrg() {
  const theme = useTheme()
  const isCreating = useOrgUI((state: any) => state.isCreating)
  const [orgName, setOrgName] = useState("")

  function handleClose() {
    setOrgUI("isCreating", false)
  }

  function handleChange(event: any) {
    setOrgName(event.target.value)
  }

  function handleCreate() {
    createOrg(orgName)
    setOrgUI("isCreating", false)
  }

  return (
    <Modal
      open={isCreating}
      onClose={handleClose}
      heading="Create Organisation"
      body={
        <Stack
          width={"100%"}
          direction={"row"}
          alignItems={"center"}
          gap={theme.module[3]}
        >
          <Typography>Name:</Typography>
          <Input
            placeholder={"Organisation name"}
            onChange={handleChange}
            value={orgName}
            sx={{
              background: theme.scale.gray[8],
            }}
          />
        </Stack>
      }
      actions={[
        { iconName: "cancel", handleClick: handleClose },
        { iconName: "addOrg", handleClick: handleCreate },
      ]}
    />
  )
}
/*




*/
function JoinOrg() {
  const theme = useTheme()
  const isJoining = useOrgUI((state: any) => state.isJoining)
  const [inviteKey, setInviteKey] = useState("")

  function handleClose() {
    setOrgUI("isJoining", false)
  }

  function handleChange(event: any) {
    setInviteKey(event.target.value)
  }

  function handleJoin() {
    joinOrg(inviteKey)
    setOrgUI("isJoining", false)
  }

  return (
    <Modal
      open={isJoining}
      onClose={handleClose}
      heading="Join Organisation"
      body={
        <Stack
          width={"100%"}
          direction={"row"}
          alignItems={"center"}
          gap={theme.module[3]}
        >
          <Typography>Key:</Typography>
          <Input
            placeholder="Invite key"
            onChange={handleChange}
            value={inviteKey}
            sx={{
              background: theme.scale.gray[8],
            }}
          />
        </Stack>
      }
      actions={[
        { iconName: "cancel", handleClick: handleClose },
        { iconName: "joinGroup", handleClick: handleJoin },
      ]}
    />
  )
}
/*




*/
