// import Input from "@mui/material/InputBase"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { makeSentenceCase } from "../../common/utils"
import { Button } from "../../components/button"
import { Input } from "../../components/control"
import Icon, { IconNames } from "../../components/icon"
import {
  List,
  ListGroup,
  ListItem,
  ListItemOptionProps,
  ListItemWithOptions,
} from "../../components/list"
import { Loader } from "../../components/loader"
import Modal from "../../components/modal"
import { ProfileSurface } from "../../components/profileSurface"
import { CompleteProfilePrompt } from "../core/home"
import { generateNotification } from "../core/notifications"
import {
  selectIsProfileComplete,
  selectIsUserAdmin,
  selectUser,
} from "../user/userSlice"
import {
  InviteProps,
  MemberProps,
  createInvite,
  createOrg,
  deleteInvite,
  deleteOrg,
  deleteOrgMember,
  joinOrg,
  leaveOrg,
  selectIsJoining,
  selectIsOrgSetup,
  selectOrg,
  selectOrgInvitesList,
  selectOtherOrgMembersList,
  selectOrgName,
  setOrgMember,
  setOrgName,
} from "./organisationSlice"
/*





*/
type UseOrgState = {
  isRemoving: boolean
  isEditing: boolean
  isJoining: boolean
  isCreating: boolean
  isInviting: boolean
  idViewingOptions: string | false
  isViewingMembers: boolean
  isViewingInvites: boolean
}
type UseOrgKeys = keyof UseOrgState
const initialState: UseOrgState = {
  isRemoving: false,
  isEditing: false,
  isJoining: false,
  isCreating: false,
  isInviting: false,
  idViewingOptions: false,
  isViewingMembers: false,
  isViewingInvites: false,
}
const useOrgStore = create<UseOrgState>()(
  persist(
    (set) => ({
      ...initialState,
    }),
    {
      name: "organisation-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

function setUseOrg(path: UseOrgKeys, value: boolean | string) {
  useOrgStore.setState({ [path]: value })
}

export function resetUseOrg() {
  useOrgStore.setState(initialState)
}
/*





*/
export function Organisation() {
  const isProfileComplete = useAppSelector(selectIsProfileComplete)
  const isOrgSetup = useAppSelector(selectIsOrgSetup)
  const isJoiningOrg = useAppSelector(selectIsJoining)

  return isProfileComplete ? (
    isJoiningOrg ? (
      <Loader narration={"joining organisation..."} />
    ) : isOrgSetup ? (
      <OrgProfile />
    ) : (
      <OrgSetup />
    )
  ) : (
    <CompleteProfilePrompt />
  )
}
/*





*/
function OrgProfile() {
  return (
    <ProfileSurface>
      <OrgNameHeader />
      <ButtonTray />
      <RemoveOrgConfirmation />
      <MembersList />
      <InvitesList />
      <NewInvite />
    </ProfileSurface>
  )
}
/*





*/
function OrgNameHeader() {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const orgName = useAppSelector(selectOrgName) as string
  const isAdmin = useAppSelector(selectIsUserAdmin)
  const isEditing = useOrgStore((state: any) => state.isEditing)
  const [newOrgName, setNewOrgName] = useState(orgName)
  /*
  
  
  */
  useEffect(() => {
    setNewOrgName(orgName)
  }, [orgName])
  /*
  
  
  */
  function handleEdit() {
    setUseOrg("isEditing", true)
  }
  /*
  
  
  */
  function handleAccept() {
    setUseOrg("isEditing", false)
    if (!!newOrgName) dispatch(setOrgName(newOrgName))
  }
  /*
  
  
  */
  return (
    <Stack width={"100%"} gap={theme.module[3]}>
      <Stack direction={"row"} alignItems={"center"} gap={theme.module[5]}>
        <Input
          disabled={!isEditing}
          value={newOrgName}
          onChange={(event: any) => setNewOrgName(event.target.value)}
          sx={{
            fontSize: "1.25rem",
            background: theme.scale.gray[isEditing ? 8 : 9],
            color: theme.scale.gray[isEditing ? 4 : 8],
            fontWeight: "bold",
          }}
        />
        {isAdmin && (
          <Button
            variation={"pill"}
            onClick={isEditing ? handleAccept : handleEdit}
            iconName={isEditing ? "done" : "edit"}
          />
        )}
      </Stack>
      <Stack
        direction={"row"}
        gap={theme.module[3]}
        paddingLeft={theme.module[2]}
      >
        <Icon
          variation={isAdmin ? "admin" : "profile"}
          color={theme.scale.gray[5]}
        />
        <Typography color={theme.scale.gray[5]}>
          {isAdmin ? "Admin" : "Member"}
        </Typography>
      </Stack>
    </Stack>
  )
}
/*





*/
type OrgItems = { iconName: IconNames; label: string; onClick: Function }[]
function ButtonTray() {
  const theme = useTheme()
  const isAdmin = useAppSelector(selectIsUserAdmin)
  /*
  
  
  */
  function handleRemove() {
    setUseOrg("isRemoving", true)
  }
  /*
  
  
  */
  const orgItems: OrgItems = [
    {
      iconName: "group",
      label: "Members",
      onClick: () => setUseOrg("isViewingMembers", true),
    },
    {
      iconName: "invite",
      label: "Invites",
      onClick: () => setUseOrg("isViewingInvites", true),
    },
    {
      iconName: "add",
      label: "New Invite",
      onClick: () => setUseOrg("isInviting", true),
    },
  ]

  return (
    <>
      <Stack
        width={"100%"}
        height={"100%"}
        gap={theme.module[5]}
        paddingTop={theme.module[3]}
        boxSizing={"border-box"}
      >
        {isAdmin &&
          orgItems.map((item: any, index: number) => {
            return (
              <Button
                variation={"profile"}
                label={item.label}
                iconName={item.iconName}
                onClick={item.onClick}
                key={index}
              />
            )
          })}
      </Stack>
      <Button
        variation={"profile"}
        onClick={handleRemove}
        iconName={isAdmin ? "delete" : "leave"}
        justifyCenter
      />
    </>
  )
}
/*





*/
function MembersList() {
  const members = useAppSelector(selectOtherOrgMembersList)
  const isViewingMembers = useOrgStore((state: any) => state.isViewingMembers)
  /*
  
  
  */
  function handleClose() {
    setUseOrg("isViewingMembers", false)
    setUseOrg("idViewingOptions", false)
  }
  /*
  
  
  */
  return (
    <Modal
      open={isViewingMembers}
      heading={"Members"}
      body={
        members?.length ? (
          <List>
            {members.map((member: any, index: number) => {
              return <MemberListItem member={member} key={index} />
            })}
          </List>
        ) : (
          <Typography>No members have been added</Typography>
        )
      }
      show="actions"
      actions={[{ iconName: "cancel", handleClick: handleClose }]}
      onClose={handleClose}
    />
  )
}
/*





*/
function MemberListItem({ member }: { member: MemberProps }) {
  const dispatch = useAppDispatch()
  const idViewingOptions = useOrgStore((state) => state.idViewingOptions)
  const isMemberAdmin = member.role === "admin"
  /*
  

*/
  function handleAssignRole() {
    dispatch(
      setOrgMember({
        ...member,
        role: isMemberAdmin ? "member" : "admin",
      }),
    )
  }
  /*
  
  
  */
  function handleDelete() {
    dispatch(deleteOrgMember(member.uuid))
  }
  /*

  
  */
  const options: ListItemOptionProps[] = [
    {
      iconName: isMemberAdmin ? "profile" : "admin",
      onClick: handleAssignRole,
    },
    {
      iconName: "delete",
      onClick: handleDelete,
    },
    {
      iconName: "cancel",
      onClick: () => setUseOrg("idViewingOptions", false),
    },
  ]

  return (
    <ListItemWithOptions
      label={`${member.name} ${member.surname}`}
      description={makeSentenceCase(member.role)}
      iconName={member.role === "admin" ? "admin" : "profile"}
      options={options}
      showOptions={member.uuid === idViewingOptions}
      onOptionsClick={() => setUseOrg("idViewingOptions", member.uuid)}
    />
  )
}
/*





*/
function InvitesList() {
  const invites = useAppSelector(selectOrgInvitesList) as InviteProps[]
  const isViewingInvites = useOrgStore((state: any) => state.isViewingInvites)
  /*
  
  
  */
  function handleClose() {
    setUseOrg("isViewingInvites", false)
    setUseOrg("idViewingOptions", false)
  }
  /*
  
  
  */
  return (
    <Modal
      open={isViewingInvites}
      heading={"Invites"}
      body={
        invites?.length ? (
          <List>
            {invites.map((invite: InviteProps, index: number) => {
              return <InviteListItem invite={invite} key={index} />
            })}
          </List>
        ) : (
          <Typography>No pending invites</Typography>
        )
      }
      show="actions"
      actions={[{ iconName: "cancel", handleClick: handleClose }]}
      onClose={handleClose}
    />
  )
}
/*





*/
function InviteListItem({ invite }: { invite: InviteProps }) {
  const dispatch = useAppDispatch()
  const idViewingOptions = useOrgStore((state) => state.idViewingOptions)
  /*
  

*/
  function handleCopy() {
    navigator.clipboard
      .writeText(invite.inviteKey)
      .then(() => generateNotification("inviteKeyCopied"))
  }
  /*


*/
  function handleDelete() {
    dispatch(deleteInvite(invite.inviteKey))
  }
  /*

  
  */
  const options: ListItemOptionProps[] = [
    {
      iconName: "copy",
      onClick: handleCopy,
    },
    {
      iconName: "delete",
      onClick: handleDelete,
    },
    {
      iconName: "cancel",
      onClick: () => setUseOrg("idViewingOptions", false),
    },
  ]

  return (
    <ListItemWithOptions
      label={invite.tempName}
      description={invite.inviteKey}
      iconName={"profile"}
      options={options}
      showOptions={idViewingOptions === invite.inviteKey}
      onOptionsClick={() => setUseOrg("idViewingOptions", invite.inviteKey)}
    />
  )
}
/*





*/
function NewInvite() {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const isInviting = useOrgStore((state: any) => state.isInviting)
  const [tempName, setTempName] = useState("")
  const [inviteKey, setInviteKey] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  /*
  
  
  */
  function handleChange(event: any) {
    setTempName(event.target.value)
  }
  /*
  
  
  */
  function handleClose() {
    setUseOrg("isInviting", false)
  }
  /*
  
  
  */
  function handleAccept() {
    dispatch(
      createInvite({
        inviteKey: inviteKey,
        tempName: !!tempName ? tempName : "Unnamed",
      }),
    )
    setUseOrg("isInviting", false)
  }
  /*
  
  
  */
  function handleCopy() {
    setIsCopied(true)
    navigator.clipboard
      .writeText(inviteKey)
      .then(() => generateNotification("inviteKeyCopied"))
  }
  /*
  
  
  */
  useEffect(() => {
    if (isInviting) {
      setTempName("")
      setInviteKey(String(uuidv4()))
    }
  }, [isInviting])

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    }
  }, [isCopied])

  return (
    <Modal
      open={isInviting}
      heading={"New Invite"}
      body={
        <Stack width={"100%"} gap={theme.module[4]}>
          <Stack
            width={"100%"}
            direction={"row"}
            alignItems={"center"}
            paddingLeft={theme.module[2]}
            gap={theme.module[3]}
            boxSizing={"border-box"}
          >
            <Typography>Name:</Typography>
            <Input
              placeholder={"(optional)"}
              onChange={handleChange}
              value={tempName}
              sx={{
                background: theme.scale.gray[8],
              }}
            />
          </Stack>
          <ListItem
            label={inviteKey}
            primarySlot={
              <Icon
                variation={"key"}
                fontSize={"small"}
                color={theme.scale.gray[5]}
              />
            }
            secondarySlot={
              <Button
                variation={"pill"}
                onClick={handleCopy}
                iconName={isCopied ? "done" : "copy"}
              />
            }
            onChange={handleCopy}
            tappable
          />
        </Stack>
      }
      show="actions"
      actions={[
        { iconName: "cancel", handleClick: handleClose },
        { iconName: "done", handleClick: handleAccept },
      ]}
      onClose={handleClose}
    />
  )
}
/*





*/
function RemoveOrgConfirmation() {
  const dispatch = useAppDispatch()
  const org = useAppSelector(selectOrg)
  const isAdmin = useAppSelector(selectIsUserAdmin)
  const isRemoving = useOrgStore((state: any) => state.isRemoving)
  /*
  
  
  */
  function handleAccept() {
    dispatch(isAdmin ? deleteOrg(org) : leaveOrg(org.uuid as string))
    setUseOrg("isRemoving", false)
  }
  /*
  
  
  */
  function handleClose() {
    setUseOrg("isRemoving", false)
  }
  /*
  
  
  */
  return (
    <Modal
      open={isRemoving}
      heading={(isAdmin ? "Delete" : "Leave") + " Organisation"}
      body={
        <Typography display={"flex"} justifyContent={"center"}>
          {"Are you sure you want to " +
            (isAdmin ? "delete" : "leave") +
            " your organisation?"}
        </Typography>
      }
      show="actions"
      actions={[
        { iconName: "cancel", handleClick: handleClose },
        { iconName: "done", handleClick: handleAccept },
      ]}
      onClose={handleClose}
    />
  )
}
/*





*/
function OrgSetup() {
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
      show="actions"
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
      show="actions"
      actions={[
        { iconName: "cancel", handleClick: handleClose },
        { iconName: "joinGroup", handleClick: handleJoin },
      ]}
    />
  )
}
/*





*/
