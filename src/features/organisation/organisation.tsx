import Input from "@mui/material/InputBase"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { createContext, useContext, useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Button } from "../../components/button"
import { Control } from "../../components/control"
import Icon, { IconNames } from "../../components/icon"
import { List, ListFactory, ListGroup, ListItem } from "../../components/list"
import Modal from "../../components/modal"
import { ProfileSurface } from "../../components/profileSurface"
import { selectIsUserAdmin, selectUser } from "../user/userSlice"
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
  selectOrgInvites,
  selectOrgMembers,
  selectOrgName,
  selectOrgUuid,
  setOrgMemberRole,
  setOrgName,
} from "./organisationSlice"
import { Loader } from "../../components/loader"
import { showNotification } from "../core/coreSlice"
import { generateNotification } from "../../common/utils"
/*





*/
type OrganisationContextProps = {
  isRemoving?: boolean
  setIsRemoving?: any
  isEditing?: boolean
  setIsEditing?: any
  isJoining?: boolean
  setIsJoining?: any
  isCreating?: boolean
  setIsCreating?: any
  isInviting?: boolean
  setIsInviting?: any
  isViewingMembers?: boolean
  setIsViewingMembers?: any
  isViewingInvites?: boolean
  setIsViewingInvites?: any
}
const OrganisationContext = createContext({})

export function Organisation() {
  const orgUuid = useAppSelector(selectOrgUuid)
  const isJoiningOrg = useAppSelector(selectIsJoining)
  const [isRemoving, setIsRemoving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isInviting, setIsInviting] = useState(false)
  const [isViewingMembers, setIsViewingMembers] = useState(false)
  const [isViewingInvites, setIsViewingInvites] = useState(false)
  const [context, setContext] = useState({
    isRemoving: isRemoving,
    setIsRemoving: setIsRemoving,
    isEditing: isEditing,
    setIsEditing: setIsEditing,
    isJoining: isJoining,
    setIsJoining: setIsJoining,
    isCreating: isCreating,
    isInviting: isInviting,
    setIsInviting: setIsInviting,
    setIsCreating: setIsCreating,
    isViewingMembers: isViewingMembers,
    setIsViewingMembers: setIsViewingMembers,
    isViewingInvites: isViewingInvites,
    setIsViewingInvites: setIsViewingInvites,
  })

  useEffect(() => {
    setContext({
      isRemoving: isRemoving,
      setIsRemoving: setIsRemoving,
      isEditing: isEditing,
      setIsEditing: setIsEditing,
      isJoining: isJoining,
      setIsJoining: setIsJoining,
      isCreating: isCreating,
      setIsCreating: setIsCreating,
      isInviting: isInviting,
      setIsInviting: setIsInviting,
      isViewingMembers: isViewingMembers,
      setIsViewingMembers: setIsViewingMembers,
      isViewingInvites: isViewingInvites,
      setIsViewingInvites: setIsViewingInvites,
    })
  }, [
    isRemoving,
    isEditing,
    isJoining,
    isCreating,
    isViewingMembers,
    isViewingInvites,
    isInviting,
  ])

  return (
    <OrganisationContext.Provider value={context}>
      {isJoiningOrg ? (
        <Loader narration={"joining organisation"} />
      ) : !!orgUuid ? (
        <OrgProfile />
      ) : (
        <OrgSetup />
      )}
    </OrganisationContext.Provider>
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

  const orgName = useAppSelector(selectOrgName)
  const isAdmin = useAppSelector(selectIsUserAdmin)
  const context: OrganisationContextProps = useContext(OrganisationContext)
  const [newOrgName, setNewOrgName] = useState(orgName)
  /*
  
  
  */
  useEffect(() => {
    setNewOrgName(orgName)
  }, [orgName])
  /*
  
  
  */
  function handleEdit() {
    context.setIsEditing(true)
  }
  /*
  
  
  */
  function handleAccept() {
    context.setIsEditing(false)
    if (!!newOrgName) dispatch(setOrgName(newOrgName))
  }
  /*
  
  
  */
  return (
    <Stack width={"100%"} gap={theme.module[3]}>
      <Stack direction={"row"} alignItems={"center"} gap={theme.module[5]}>
        <Control
          variation={"input"}
          disabled={!context.isEditing}
          value={newOrgName}
          onChange={(event: any) => setNewOrgName(event.target.value)}
          sx={{
            fontSize: "1.25rem",
            background: theme.scale.gray[context.isEditing ? 8 : 9],
            color: theme.scale.gray[context.isEditing ? 4 : 8],
            fontWeight: "bold",
          }}
        />
        {isAdmin ? (
          <Button
            variation={"icon"}
            onClick={context.isEditing ? handleAccept : handleEdit}
          >
            <Icon variation={context.isEditing ? "done" : "edit"} />
          </Button>
        ) : undefined}
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
  const context: OrganisationContextProps = useContext(OrganisationContext)
  /*
  
  
  */
  function handleRemove() {
    context.setIsRemoving(true)
  }
  /*
  
  
  */
  const orgItems: OrgItems = [
    {
      iconName: "group",
      label: "Members",
      onClick: () => context.setIsViewingMembers(true),
    },
    {
      iconName: "invite",
      label: "Invites",
      onClick: () => context.setIsViewingInvites(true),
    },
    {
      iconName: "add",
      label: "New Invite",
      onClick: () => context.setIsInviting(true),
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
        {isAdmin
          ? orgItems.map((item: any, index: number) => {
              return (
                <Button
                  variation={"profile"}
                  onClick={item.onClick}
                  key={index}
                >
                  <Stack
                    width={"100%"}
                    height={"100%"}
                    direction={"row"}
                    alignItems={"center"}
                    alignContent={"center"}
                    gap={theme.module[4]}
                  >
                    <Icon variation={item.iconName} fontSize={"large"} />
                    <Typography variant="h6" color={theme.scale.gray[4]}>
                      {item.label}
                    </Typography>
                  </Stack>
                </Button>
              )
            })
          : undefined}
      </Stack>
      <Button variation={"profile"} onClick={handleRemove}>
        <Icon variation={isAdmin ? "delete" : "leave"} fontSize={"large"} />
      </Button>
    </>
  )
}
/*





*/
function MembersList() {
  const theme = useTheme()
  const members = useAppSelector(selectOrgMembers)
  const context: OrganisationContextProps = useContext(OrganisationContext)
  /*
  
  
  */
  function handleClose() {
    context.setIsViewingMembers(false)
  }
  /*
  
  
  */
  return (
    <Modal
      open={context.isViewingMembers as boolean}
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
      footer={
        <Stack direction={"row"} gap={theme.module[4]} width={"100%"}>
          <Button variation={"modal"} onClick={handleClose}>
            <Icon variation={"cancel"} />
          </Button>
        </Stack>
      }
      onClose={handleClose}
    />
  )
}
/*





*/
function MemberListItem({ member }: { member: MemberProps }) {
  const dispatch = useAppDispatch()
  const isMemberAdmin = member.role === "admin"
  /*
  

*/
  function handleAssignRole() {
    dispatch(
      setOrgMemberRole({
        uuid: member.uuid as string,
        role: isMemberAdmin ? "member" : "admin",
      }),
    )
  }
  /*
  
  
  */
  function handleDelete() {
    dispatch(deleteOrgMember(member.uuid as string))
  }
  /*

  
  */
  const options: OptionProps[] = [
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
    },
  ]

  return (
    <ListItemBase
      label={`${member.name} ${member.surname}`}
      description={member.role}
      iconName={member.role === "admin" ? "admin" : "profile"}
      options={options}
    />
  )
}
/*





*/
function InvitesList() {
  const theme = useTheme()
  const invites = useAppSelector(selectOrgInvites) as InviteProps[]
  const context: OrganisationContextProps = useContext(OrganisationContext)
  /*
  
  
  */
  function handleClose() {
    context.setIsViewingInvites(false)
  }
  /*
  
  
  */
  return (
    <Modal
      open={context.isViewingInvites as boolean}
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
      footer={
        <Stack direction={"row"} gap={theme.module[4]} width={"100%"}>
          <Button variation={"modal"} onClick={handleClose}>
            <Icon variation={"cancel"} />
          </Button>
        </Stack>
      }
      onClose={handleClose}
    />
  )
}
/*





*/
function InviteListItem({ invite }: { invite: InviteProps }) {
  const dispatch = useAppDispatch()
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
  const options: OptionProps[] = [
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
    },
  ]

  return (
    <ListItemBase
      label={invite.tempName}
      description={invite.inviteKey}
      iconName={"profile"}
      options={options}
    />
  )
}
/*





*/
type OptionProps = {
  iconName: IconNames
  onClick?: Function
}
type ListItemBaseProps = {
  label: string
  description: string
  iconName: IconNames
  options: OptionProps[] | undefined
}
function ListItemBase(props: ListItemBaseProps) {
  const theme = useTheme()
  const [showOptions, setShowOptions] = useState(false)
  /*
  

*/
  function handleClick() {
    setShowOptions(true)
  }
  /*


*/
  const listItemProps = props.options
    ? {
        secondarySlot: (
          <Button variation={"icon"} onClick={handleClick}>
            <Icon variation={"options"} />
          </Button>
        ),
        onChange: handleClick,
        tappable: true,
      }
    : {}

  return (
    <Stack position={"relative"}>
      <ListItem
        label={props.label}
        description={props.description}
        primarySlot={<Icon variation={props.iconName} />}
        {...listItemProps}
      />
      {showOptions ? (
        <Stack
          width={"100%"}
          height={"100%"}
          direction={"row"}
          bgcolor={theme.scale.gray[9]}
          boxSizing={"border-box"}
          position={"absolute"}
          borderRadius={theme.module[3]}
          justifyContent={"space-between"}
          alignItems={"center"}
          padding={`0 ${theme.module[5]}`}
        >
          {props.options
            ? props.options.map((option: OptionProps, index: number) => {
                /*
                 */
                function onClick() {
                  if (option.onClick) option.onClick()
                  setShowOptions(false)
                }
                /*
                 */
                return (
                  <Button variation={"icon"} onClick={onClick} key={index}>
                    <Icon variation={option.iconName} fontSize={"medium"} />
                  </Button>
                )
              })
            : undefined}
        </Stack>
      ) : undefined}
    </Stack>
  )
}
/*





*/
function NewInvite() {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const context: OrganisationContextProps = useContext(OrganisationContext)
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
    context.setIsInviting(false)
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
    context.setIsInviting(false)
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
    if (context.isInviting) {
      setTempName("")
      setInviteKey(String(uuidv4()))
    }
  }, [context.isInviting])

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    }
  }, [isCopied])

  return (
    <Modal
      open={context.isInviting as boolean}
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
            <Control
              variation={"input"}
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
              <Button variation={"icon"} onClick={handleCopy}>
                <Icon
                  variation={isCopied ? "done" : "copy"}
                  fontSize={"small"}
                />
              </Button>
            }
            onChange={handleCopy}
            tappable
          />
        </Stack>
      }
      footer={
        <Stack direction={"row"} gap={theme.module[4]} width={"100%"}>
          <Button variation={"modal"} onClick={handleClose}>
            <Icon variation={"cancel"} />
          </Button>
          <Button variation={"modal"} onClick={handleAccept}>
            <Icon variation={"done"} />
          </Button>
        </Stack>
      }
      onClose={handleClose}
    />
  )
}
/*





*/
function RemoveOrgConfirmation() {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const isAdmin = useAppSelector(selectIsUserAdmin)
  const context: OrganisationContextProps = useContext(OrganisationContext)
  /*
  
  
  */
  function handleAccept() {
    dispatch(isAdmin ? deleteOrg() : leaveOrg())
    context.setIsRemoving(false)
  }
  /*
  
  
  */
  function handleClose() {
    context.setIsRemoving(false)
  }
  /*
  
  
  */
  return (
    <Modal
      open={context.isRemoving as boolean}
      heading={(isAdmin ? "Delete" : "Leave") + " Organisation"}
      body={
        <Typography display={"flex"} justifyContent={"center"}>
          {"Are you sure you want to " +
            (isAdmin ? "delete" : "leave") +
            " your organisation?"}
        </Typography>
      }
      footer={
        <Stack direction={"row"} gap={theme.module[4]} width={"100%"}>
          <Button variation={"modal"} onClick={handleClose}>
            <Icon variation={"cancel"} />
          </Button>
          <Button variation={"modal"} onClick={handleAccept}>
            <Icon variation={"done"} />
          </Button>
        </Stack>
      }
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
function OrgSetupActions() {
  const context: OrganisationContextProps = useContext(OrganisationContext)
  const theme = useTheme()
  return (
    <Stack
      padding={theme.module[3]}
      width={"100%"}
      height={"100%"}
      boxSizing={"border-box"}
    >
      <List>
        <ListGroup>
          <ListFactory
            items={[
              {
                label: "Create organisation",
                description: "Create a new organisation for your team",
                iconName: "add",
                tappable: true,
                onChange: () => context.setIsCreating(true),
              },
              {
                label: "Join organisation",
                description: "Join an existing organisation with a key",
                iconName: "group",
                tappable: true,
                onChange: () => context.setIsJoining(true),
              },
            ]}
          />
        </ListGroup>
      </List>
    </Stack>
  )
}
/*





*/
function CreateOrg() {
  const context: OrganisationContextProps = useContext(OrganisationContext)
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const user = useAppSelector(selectUser)
  const [orgName, setOrgName] = useState("")
  /*
  
  
  */
  function handleClose() {
    context.setIsCreating(false)
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
    context.setIsCreating(false)
  }
  /*
  
  
  */
  return (
    <Modal
      open={context.isCreating as boolean}
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
          <Control
            variation={"input"}
            placeholder={"Organisation name"}
            onChange={handleChange}
            value={orgName}
            sx={{
              background: theme.scale.gray[8],
            }}
          />
        </Stack>
      }
      footer={
        <Button variation={"modal"} onClick={handleCreate}>
          Create
        </Button>
      }
    />
  )
}
/*





*/
function JoinOrg() {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const context: OrganisationContextProps = useContext(OrganisationContext)
  const [inviteKey, setInviteKey] = useState("")
  /*
  
  
  */
  function handleClose() {
    context.setIsJoining(false)
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
    context.setIsJoining(false)
  }
  /*
  
  
  */
  return (
    <Modal
      open={context.isJoining as boolean}
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
            fullWidth={true}
            placeholder="Invite key"
            onChange={handleChange}
            value={inviteKey}
            sx={{
              background: theme.scale.gray[8],
            }}
          />
        </Stack>
      }
      footer={
        <Button variation={"modal"} onClick={handleJoin}>
          Join
        </Button>
      }
    />
  )
}
/*





*/
