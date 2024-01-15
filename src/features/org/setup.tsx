import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useState } from "react"
import { useLocation } from "react-router-dom"
import useTheme from "../../common/useTheme"
import { Input } from "../../components/control"
import { ErrorBoundary } from "../../components/errorBoundary"
import Icon, { IconNames } from "../../components/icon"
import { ListGroup } from "../../components/list"
import { ListItem } from "../../components/listItem"
import Modal, { ModalActionProps } from "../../components/modal"
import { setOrgUI, useOrgUI } from "./org"
import { createOrg, joinOrg } from "./orgSliceUtils"
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
      <OrgSetupActions />
      <CreateOrg />
      <JoinOrg />
    </ErrorBoundary>
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
  const isCreating = useOrgUI((state) => state.isCreating)
  const [orgName, setOrgName] = useState("")

  function handleClose() {
    setOrgUI("isCreating", false)
  }

  function handleCreate() {
    createOrg(orgName)
    setOrgUI("isCreating", false)
  }

  const actions: ModalActionProps[] = [
    { iconName: "cancel", handleClick: handleClose },
    { iconName: "addOrg", handleClick: handleCreate },
  ]

  const createOrgBodyProps = {
    setOrgName,
    orgName,
  }

  return (
    <Modal
      open={isCreating}
      onClose={handleClose}
      heading="Create Organisation"
      body={<CreateOrgBody {...createOrgBodyProps} />}
      actions={actions}
    />
  )
}
/*




*/
type CreateOrgBodyProps = {
  setOrgName: Function
  orgName: string
}
function CreateOrgBody(props: CreateOrgBodyProps) {
  const theme = useTheme()
  const location = useLocation()

  const orgUIState = useOrgUI((state) => state)

  const path = location.pathname

  function handleChange(event: any) {
    props.setOrgName(event.target.value)
  }

  return (
    <ErrorBoundary
      componentName={"CreateOrgBody"}
      featurePath={path}
      state={{ component: { ...props }, featureUI: { ...orgUIState } }}
    >
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
          value={props.orgName}
          sx={{
            background: theme.scale.gray[8],
          }}
        />
      </Stack>
    </ErrorBoundary>
  )
}
/*




*/
function JoinOrg() {
  const isJoining = useOrgUI((state) => state.isJoining)
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

  const joinOrgBodyProps = {
    inviteKey,
    handleChange,
  }

  const actions: ModalActionProps[] = [
    { iconName: "cancel", handleClick: handleClose },
    { iconName: "joinGroup", handleClick: handleJoin },
  ]

  return (
    <Modal
      open={isJoining}
      onClose={handleClose}
      heading="Join Organisation"
      body={<JoinOrgBody {...joinOrgBodyProps} />}
      actions={actions}
    />
  )
}
/*




*/
type JoinOrgBodyProps = {
  handleChange: Function
  inviteKey: string
}
function JoinOrgBody(props: JoinOrgBodyProps) {
  const theme = useTheme()
  const location = useLocation()

  const orgUIState = useOrgUI((state) => state)

  const path = location.pathname

  return (
    <ErrorBoundary
      componentName={"JoinOrgBody"}
      featurePath={path}
      state={{ component: { ...props }, featureUI: { ...orgUIState } }}
    >
      <Stack
        width={"100%"}
        direction={"row"}
        alignItems={"center"}
        gap={theme.module[3]}
      >
        <Typography>Key:</Typography>
        <Input
          placeholder="Invite key"
          onChange={props.handleChange}
          value={props.inviteKey}
          sx={{
            background: theme.scale.gray[8],
          }}
        />
      </Stack>
    </ErrorBoundary>
  )
}
/*




*/
