import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Input } from "../../components/control"
import Icon, { IconNames } from "../../components/icon"
import { ListGroup, ListItem } from "../../components/list"
import Modal from "../../components/modal"
import { selectUser } from "../user/userSlice"
import { setUseOrg } from "./organisation"
import { createOrg, joinOrg } from "./organisationSlice"
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
      label: "Create organisation",
      description: "Create a new organisation for your team",
      iconName: "org",
      onChange: () => setUseOrg("isCreating", true),
    },
    {
      label: "Join organisation",
      description: "Join an existing organisation with a key",
      iconName: "group",
      onChange: () => setUseOrg("isJoining", true),
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
  const isCreating = useOrgStore((state: any) => state.isCreating)
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const user = useAppSelector(selectUser)
  const [orgName, setOrgName] = useState("")
  /*
  
  
  */
  function handleClose() {
    setUseOrg("isCreating", false)
  }
  /*
  
  
  */
  function handleChange(event: any) {
    setOrgName(event.target.value)
  }
  /*
  
  
  */
  function handleCreate() {
    dispatch(
      createOrg({
        name: orgName,
        uuid: uuidv4(),
        members: {
          [user.uuid as string]: {
            name: user.name ?? "name",
            surname: user.surname ?? "surname",
            role: "admin",
            uuid: user.uuid as string,
          },
        },
      }),
    )
    setUseOrg("isCreating", false)
  }
  /*
  
  
  */
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
  const dispatch = useAppDispatch()
  const isJoining = useOrgStore((state: any) => state.isJoining)
  const [inviteKey, setInviteKey] = useState("")
  /*
  
  
  */
  function handleClose() {
    setUseOrg("isJoining", false)
  }
  /*
  
  
  */
  function handleChange(event: any) {
    setInviteKey(event.target.value)
  }
  /*
  
  
  */
  function handleJoin() {
    dispatch(joinOrg(inviteKey))
    setUseOrg("isJoining", false)
  }
  /*
  
  
  */
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
