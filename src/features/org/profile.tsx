import { ClickAwayListener } from "@mui/material"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import _ from "lodash"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { copyToClipboard } from "../../common/utils"
import { Button } from "../../components/button"
import { Input } from "../../components/control"
import Icon, { IconNames } from "../../components/icon"
import { List } from "../../components/list"
import {
  ListItem,
  ListItemOptionProps,
  ListItemWithOptions,
} from "../../components/listItem"
import Modal, { ModalActionProps } from "../../components/modal"
import { ProfileWrapper } from "../../components/surface"
import { selectIsUserAdmin } from "../user/userSliceSelectors"
import { setOrgUI, useOrgUI } from "./org"
import { InviteProps, MemberProps } from "./orgSlice"
import {
  selectOrgInvitesList,
  selectOrgName,
  selectOtherOrgMembersList,
} from "./orgSliceSelectors"
import {
  createInvite,
  leaveOrg,
  removeInvite,
  removeOrg,
  removeOrgMember,
  updateOrgMemberRole,
  updateOrgName,
} from "./orgSliceUtils"
import { getMemberName } from "./orgUtils"
/*




*/
export function OrgProfile() {
  return (
    <ProfileWrapper>
      <OrgNameHeader />
      <ButtonTray />
      <MembersList />
      <InvitesList />
      <NewInvite />
      <RemoveOrgConfirmation />
    </ProfileWrapper>
  )
}
/*




*/
function OrgNameHeader() {
  const theme = useTheme()

  const orgName = useAppSelector(selectOrgName) as string
  const isAdmin = useAppSelector(selectIsUserAdmin)

  const isEditing = useOrgUI((state: any) => state.isEditing)

  const [newOrgName, setNewOrgName] = useState("")

  useEffect(() => {
    setNewOrgName(orgName)
  }, [orgName])

  function handleEdit() {
    setOrgUI("isEditing", true)
  }

  function handleAccept() {
    setOrgUI("isEditing", false)
    if (!!newOrgName) updateOrgName(newOrgName)
  }

  return (
    <Stack width={"100%"} gap={theme.module[3]}>
      <ClickAwayListener onClickAway={() => setOrgUI("isEditing", false)}>
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
      </ClickAwayListener>
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

  function handleRemove() {
    setOrgUI("isRemoving", true)
  }

  const orgItems: OrgItems = [
    {
      iconName: "group",
      label: "Members",
      onClick: () => setOrgUI("isViewingMembers", true),
    },
    {
      iconName: "invite",
      label: "Invites",
      onClick: () => setOrgUI("isViewingInvites", true),
    },
    {
      iconName: "add",
      label: "New Invite",
      onClick: () => setOrgUI("isInviting", true),
    },
  ]

  return (
    <Stack
      height={"100%"}
      width={"100%"}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Stack
        width={"100%"}
        gap={theme.module[5]}
        paddingTop={theme.module[3]}
        alignItems={"center"}
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
    </Stack>
  )
}
/*




*/
function MembersList() {
  const members = useAppSelector(selectOtherOrgMembersList)
  const isViewingMembers = useOrgUI((state: any) => state.isViewingMembers)

  function handleClose() {
    setOrgUI("isViewingMembers", false)
  }

  const actions: ModalActionProps[] = [
    { iconName: "cancel", handleClick: handleClose },
  ]

  return (
    <Modal
      open={isViewingMembers}
      heading={"Members"}
      body={
        members?.length ? (
          <List gapScale={0}>
            {members.map((member: any, index: number) => {
              return <MemberListItem member={member} key={index} />
            })}
          </List>
        ) : (
          <Typography>No members have been added</Typography>
        )
      }
      actions={actions}
      onClose={handleClose}
    />
  )
}
/*




*/
function MemberListItem({ member }: { member: MemberProps }) {
  const isMemberAdmin = member.role === "admin"
  const role = isMemberAdmin ? "member" : "admin"
  const uuid = member.uuid

  const options: ListItemOptionProps[] = [
    {
      iconName: isMemberAdmin ? "profile" : "admin",
      onClick: () => updateOrgMemberRole(uuid, role),
    },
    {
      iconName: "delete",
      onClick: () => removeOrgMember(uuid),
    },
  ]
  const name = getMemberName(member)

  return (
    <ListItemWithOptions
      label={name}
      description={_.capitalize(member.role)}
      iconName={member.role === "admin" ? "admin" : "profile"}
      options={options}
    />
  )
}
/*




*/
function InvitesList() {
  const invites = useAppSelector(selectOrgInvitesList)
  const isViewingInvites = useOrgUI((state: any) => state.isViewingInvites)

  function handleClose() {
    setOrgUI("isViewingInvites", false)
  }

  const actions: ModalActionProps[] = [
    { iconName: "cancel", handleClick: handleClose },
  ]

  return (
    <Modal
      open={isViewingInvites}
      heading={"Invites"}
      body={
        invites.length ? (
          <List gapScale={0}>
            {invites.map((invite: any, index: number) => {
              return <InviteListItem invite={invite} key={index} />
            })}
          </List>
        ) : (
          <Typography>No pending invites</Typography>
        )
      }
      actions={actions}
      onClose={handleClose}
    />
  )
}
/*




*/
function InviteListItem({ invite }: { invite: InviteProps }) {
  const tempName = invite.tempName
  const key = invite.inviteKey

  const options: ListItemOptionProps[] = [
    {
      iconName: "copy",
      onClick: () => copyToClipboard(key, "inviteKeyCopied"),
    },
    {
      iconName: "delete",
      onClick: () => removeInvite(key),
    },
  ]

  return (
    <ListItemWithOptions
      label={tempName}
      description={key}
      iconName={"profile"}
      options={options}
    />
  )
}
/*




*/
function NewInvite() {
  const isInviting = useOrgUI((state: any) => state.isInviting)

  const [tempName, setTempName] = useState("")
  const [inviteKey, setInviteKey] = useState("")
  const [isCopied, setIsCopied] = useState(false)

  const name = !!tempName ? tempName : "Unnamed"

  useEffect(() => {
    if (isInviting) {
      setTempName("")
      setInviteKey(uuidv4())
    }
  }, [isInviting])

  useEffect(() => {
    if (isCopied) _.delay(() => setIsCopied(false), 2000)
  }, [isCopied])

  function handleClose() {
    setOrgUI("isInviting", false)
  }

  function handleAccept() {
    createInvite(inviteKey, name)
    setOrgUI("isInviting", false)
  }

  const inviteBodyProps: NewInviteBodyProps = {
    inviteKey,
    tempName,
    isCopied,
    setInviteKey,
    setTempName,
    setIsCopied,
  }

  const actions: ModalActionProps[] = [
    { iconName: "cancel", handleClick: handleClose },
    { iconName: "done", handleClick: handleAccept },
  ]

  return (
    <Modal
      open={isInviting}
      heading={"New Invite"}
      body={<NewInviteBody {...inviteBodyProps} />}
      actions={actions}
      onClose={handleClose}
    />
  )
}
/*




*/
type NewInviteBodyProps = {
  inviteKey: string
  tempName: string
  isCopied: boolean
  setInviteKey: Function
  setTempName: Function
  setIsCopied: Function
}
function NewInviteBody(props: NewInviteBodyProps) {
  const theme = useTheme()

  function handleChange(event: any) {
    props.setTempName(_.capitalize(event.target.value))
  }

  function handleCopy() {
    props.setIsCopied(true)
    copyToClipboard(props.inviteKey, "inviteKeyCopied")
  }

  return (
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
          value={props.tempName}
          sx={{
            background: theme.scale.gray[8],
          }}
        />
      </Stack>
      <ListItem
        label={props.inviteKey}
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
            iconName={props.isCopied ? "done" : "copy"}
          />
        }
        onChange={handleCopy}
        noWrap
        tappable
      />
    </Stack>
  )
}
/*




*/
function RemoveOrgConfirmation() {
  const isAdmin = useAppSelector(selectIsUserAdmin)
  const isRemoving = useOrgUI((state: any) => state.isRemoving)

  function handleAccept() {
    isAdmin ? removeOrg() : leaveOrg()
    setOrgUI("isRemoving", false)
  }

  function handleClose() {
    setOrgUI("isRemoving", false)
  }

  const actions: ModalActionProps[] = [
    { iconName: "cancel", handleClick: handleClose },
    { iconName: "done", handleClick: handleAccept },
  ]

  return (
    <Modal
      open={isRemoving}
      heading={(isAdmin ? "Delete" : "Leave") + " Organisation"}
      body={
        <Typography display={"flex"} justifyContent={"center"}>
          {"Are you sure you want to " +
            (isAdmin ? "delete" : "leave") +
            " your org?"}
        </Typography>
      }
      actions={actions}
      onClose={handleClose}
    />
  )
}
/*




*/
