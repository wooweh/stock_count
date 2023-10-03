import { ClickAwayListener, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Button } from "../../components/button"
import { Input } from "../../components/control"
import Icon from "../../components/icon"
import Modal, { ModalActionProps } from "../../components/modal"
import {
  deleteCountCheck,
  selectOrgCountChecksList,
  setCountCheck,
} from "../organisation/organisationSlice"
import { selectIsUserAdmin } from "../user/userSlice"
import { setUseCount, useCountStore } from "./count"
import {
  selectIsCountInvitePending,
  selectIsUserAwayFromCount,
  selectUserCountMemberStep,
} from "./countSlice"
import { updateCountStep, updateUserCountMember } from "./countUtils"
/*





*/
export function DashboardBody() {
  const theme = useTheme()
  return (
    <Stack width={"100%"} height={"100%"} justifyContent={"space-between"}>
      <Stack height={"100%"}>
        <Body />
      </Stack>
      <Stack gap={theme.module[4]}>
        <ButtonTray />
        <PrepCheckList />
      </Stack>
    </Stack>
  )
}
/*





*/
function ButtonTray() {
  const theme = useTheme()

  const isAdmin = useAppSelector(selectIsUserAdmin)

  return (
    isAdmin && (
      <>
        <Button
          variation={"profile"}
          label={"Manage Prep Checklist"}
          iconName={"checklist"}
          bgColor={theme.scale.gray[7]}
          outlineColor={theme.scale.gray[6]}
          justifyCenter
          onClick={() => setUseCount("isManagingCheckList", true)}
        />
        <Button
          variation={"profile"}
          label={"New Count"}
          iconName={"add"}
          iconColor={theme.scale.blue[5]}
          color={theme.scale.blue[5]}
          bgColor={theme.scale.blue[9]}
          outlineColor={theme.scale.blue[8]}
          justifyCenter
          onClick={() => updateCountStep("setup")}
        />
      </>
    )
  )
}
/*





*/
function Body() {
  const theme = useTheme()

  const isInvitePending = useAppSelector(selectIsCountInvitePending)
  const isAwayFromCount = useAppSelector(selectIsUserAwayFromCount)
  console.log(isInvitePending)

  return (
    <Stack
      width={"100%"}
      height={"100%"}
      justifyContent={"center"}
      gap={theme.module[6]}
    >
      {isInvitePending ? (
        <Invite />
      ) : isAwayFromCount ? (
        <Rejoin />
      ) : (
        <CountPrompt />
      )}
    </Stack>
  )
}
/*





*/
function Invite() {
  function handleAccept() {
    updateUserCountMember({ isCounting: true, isJoined: true })
    updateCountStep("stockCount", true)
  }

  function handleDecline() {
    // TODO
  }

  const actions: NotificationActionProps[] = [
    {
      label: "Accept",
      handleClick: handleAccept,
      iconName: "done",
    },
    {
      label: "Decline",
      handleClick: handleDecline,
      iconName: "cancel",
    },
  ]

  return <Notification message={"You are invited to count"} actions={actions} />
}
/*





*/
function Rejoin() {
  const step = useAppSelector(selectUserCountMemberStep)
  function handleJoin() {
    updateUserCountMember({ isCounting: true })
    updateCountStep(step, true)
  }

  const actions: NotificationActionProps[] = [
    {
      label: "Join Count",
      handleClick: handleJoin,
      iconName: "joinGroup",
    },
  ]

  return <Notification message={"You have left a count"} actions={actions} />
}
/*





*/
function CountPrompt() {
  const theme = useTheme()

  const isAdmin = useAppSelector(selectIsUserAdmin)

  return (
    <>
      <Typography
        variant={"h6"}
        color={theme.scale.gray[4]}
        textAlign={"center"}
      >
        There are no counts pending
      </Typography>
      {isAdmin && (
        <Typography
          variant={"h6"}
          color={theme.scale.gray[4]}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          Click + to setup a new count
        </Typography>
      )}
    </>
  )
}
/*





*/
type NotificationActionProps = ModalActionProps & { label: string }
type NotificationProps = {
  message: string
  actions: NotificationActionProps[]
}
function Notification(props: NotificationProps) {
  const theme = useTheme()

  return (
    <Stack
      gap={theme.module[4]}
      borderRadius={theme.module[4]}
      padding={theme.module[3]}
      boxSizing={"border-box"}
      bgcolor={theme.scale.blue[8]}
      sx={{
        outline: `1px solid ${theme.scale.blue[7]}`,
        outlineOffset: "-1px",
      }}
    >
      <Stack
        width={"100%"}
        direction={"row"}
        gap={theme.module[4]}
        alignItems={"center"}
        padding={theme.module[3]}
        boxSizing={"border-box"}
      >
        <Icon
          variation="notification"
          fontSize="large"
          color={theme.scale.blue[6]}
        />
        <Typography
          variant={"h6"}
          color={theme.scale.gray[4]}
          sx={{ paddingLeft: theme.module[3] }}
        >
          {props.message}
        </Typography>
      </Stack>
      {props.actions.map((action) => (
        <Button
          variation="profile"
          label={action.label}
          iconName={action.iconName}
          justifyCenter
          bgColor={theme.scale.gray[7]}
          onClick={action.handleClick}
          key={action.label}
        />
      ))}
    </Stack>
  )
}
/*





*/
function PrepCheckList() {
  const dispatch = useAppDispatch()

  const isManagingCheckList = useCountStore(
    (state: any) => state.isManagingCheckList,
  )

  function handleClose() {
    setUseCount("isManagingCheckList", false)
  }

  function handleAdd() {
    // TODO
    dispatch(setCountCheck({ id: uuidv4(), check: "" }))
  }

  const actions: ModalActionProps[] = [
    {
      iconName: "cancel",
      handleClick: handleClose,
    },
    {
      iconName: "add",
      handleClick: handleAdd,
    },
  ]

  return (
    <Modal
      open={isManagingCheckList}
      heading={"Manage Prep Checklist"}
      body={<CheckList />}
      actions={actions}
      onClose={handleClose}
    />
  )
}
/*





*/
function CheckList() {
  const theme = useTheme()
  const checkList = useAppSelector(selectOrgCountChecksList)

  return (
    <Stack width={"100%"} gap={theme.module[3]}>
      {!!checkList ? (
        checkList.map((check: any) => {
          return <CheckListItem check={check} key={check.id} />
        })
      ) : (
        <Typography>No checks added.</Typography>
      )}
    </Stack>
  )
}
/*





*/
function CheckListItem({ check }: { check: { id: string; check: string } }) {
  const theme = useTheme()
  const dispatch = useAppDispatch()

  const [value, setValue] = useState(check.check)
  const [isEditing, setIsEditing] = useState(false)

  const isDisabled = !isEditing && !!check.check

  function handleEdit() {
    setIsEditing(true)
  }

  function handleAccept() {
    setIsEditing(false)
    //TODO
    dispatch(setCountCheck({ id: check.id, check: value }))
  }

  function handleDelete() {
    setIsEditing(false)
    //TODO
    dispatch(deleteCountCheck(check.id))
  }

  return (
    <ClickAwayListener onClickAway={!!value ? handleAccept : handleDelete}>
      <Stack
        direction={"row"}
        width={"100%"}
        alignItems={"stretch"}
        gap={theme.module[2]}
      >
        <Input
          disabled={isDisabled}
          value={value}
          onChange={(e: any) => setValue(e.target.value)}
          multiline
          sx={{
            background: theme.scale.gray[isDisabled ? 7 : 8],
            color: theme.scale.gray[isDisabled ? 8 : 4],
            outline: `1px solid ${theme.scale.gray[6]}`,
            padding: theme.module[2],
          }}
        />
        <Button
          variation={"pill"}
          onClick={isDisabled ? handleEdit : handleAccept}
          iconName={isDisabled ? "edit" : "done"}
        />
        <Button variation={"pill"} onClick={handleDelete} iconName={"delete"} />
      </Stack>
    </ClickAwayListener>
  )
}
/*





*/
