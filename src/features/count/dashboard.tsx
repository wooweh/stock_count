import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ButtonBase,
  ClickAwayListener,
  Stack,
  Typography,
  TypographyProps,
} from "@mui/material"
import _ from "lodash"
import { useState } from "react"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { trimEmptyLines } from "../../common/utils"
import { Button } from "../../components/button"
import { Input } from "../../components/control"
import Icon from "../../components/icon"
import Modal, { ModalActionProps } from "../../components/modal"
import { selectOrgCountChecksList } from "../org/orgSliceSelectors"
import { selectIsUserAdmin } from "../user/userSliceSelectors"
import { CountUIState, resetCountUI, setCountUI, useCountUI } from "./count"
import {
  selectIsCountInProgress,
  selectIsCountInvitePending,
  selectIsUserAwayFromCount,
  selectUserCountMemberStep,
} from "./countSliceSelectors"
import {
  createCountCheck,
  removeCountCheck,
  removeCountMembers,
  updateCountCheck,
  updateCountStep,
  updateUserCountMember,
} from "./countSliceUtils"
/*




*/
export function DashboardBody() {
  return (
    <Outer>
      <Body />
      <ButtonTray />
      <PrepCheckList />
    </Outer>
  )
}
/*




*/
function Outer({
  children,
}: {
  children: React.ReactElement | React.ReactElement[]
}) {
  return (
    <Stack width={"100%"} height={"100%"} justifyContent={"space-between"}>
      {children}
    </Stack>
  )
}
/*




*/
function Body() {
  const theme = useTheme()

  const isInvitePending = useAppSelector(selectIsCountInvitePending)
  const isAwayFromCount = useAppSelector(selectIsUserAwayFromCount)
  const isCountInProgress = useAppSelector(selectIsCountInProgress)

  return (
    <Stack
      width={"100%"}
      height={"100%"}
      justifyContent={"center"}
      gap={theme.module[6]}
      paddingBottom={isCountInProgress ? theme.module[8] : 0}
      boxSizing={"border-box"}
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
    // TODO: Count put on pause for all members until organiser updates count settings in manage count.
    // TODO: Add isDeclined property to userCountMember
    // updateUserCountMember({ isDeclined: true })
  }

  const MESSAGE = "You are invited to count"
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

  return <Notification message={MESSAGE} actions={actions} />
}
/*




*/
function Rejoin() {
  const step = useAppSelector(selectUserCountMemberStep)

  function handleRejoin() {
    updateUserCountMember({ isCounting: true })
    updateCountStep(step, true)
  }

  const MESSAGE = "You have left a count"
  const actions: NotificationActionProps[] = [
    {
      label: "Rejoin",
      handleClick: handleRejoin,
      iconName: "joinGroup",
    },
  ]

  return <Notification message={MESSAGE} actions={actions} />
}
/*




*/
function CountPrompt() {
  const theme = useTheme()

  const isAdmin = useAppSelector(selectIsUserAdmin)
  const isCountInProgress = useAppSelector(selectIsCountInProgress)

  const typographyProps: TypographyProps = {
    variant: "h6",
    color: theme.scale.gray[4],
    textAlign: "center",
  }

  return isCountInProgress ? (
    <Typography {...typographyProps}>Count in progress</Typography>
  ) : (
    <>
      <Typography {...typographyProps}>There are no counts pending</Typography>
      {isAdmin && (
        <Typography {...typographyProps}>
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
      bgcolor={theme.scale.blue[9]}
      sx={{
        outline: `2px solid ${theme.scale.blue[7]}`,
        outlineOffset: "-2px",
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
          bgColor={theme.scale.gray[9]}
          color={theme.scale.green[6]}
          outlineColor={theme.scale.green[7]}
          onClick={action.handleClick}
          key={action.label}
        />
      ))}
    </Stack>
  )
}
/*




*/
function ButtonTray() {
  const theme = useTheme()

  const isAdmin = useAppSelector(selectIsUserAdmin)
  const isCountInProgress = useAppSelector(selectIsCountInProgress)

  function handleNewCount() {
    updateCountStep("setup")
    removeCountMembers()
    resetCountUI()
  }

  return (
    isAdmin &&
    !isCountInProgress && (
      <Stack
        gap={theme.module[4]}
        overflow={"visible"}
        padding={theme.module[0]}
        boxSizing={"border-box"}
      >
        <Button
          variation={"profile"}
          label={"Manage Prep Checklist"}
          iconName={"checklist"}
          bgColor={theme.scale.gray[7]}
          outlineColor={theme.scale.gray[6]}
          justifyCenter
          onClick={() => setCountUI("isManagingCheckList", true)}
        />
        <Button
          variation={"profile"}
          label={"New Count"}
          iconName={"add"}
          iconColor={theme.scale.blue[6]}
          color={theme.scale.blue[6]}
          outlineColor={theme.scale.blue[7]}
          justifyCenter
          onClick={handleNewCount}
        />
      </Stack>
    )
  )
}
/*




*/
function PrepCheckList() {
  const isManagingCheckList = useCountUI(
    (state: CountUIState) => state.isManagingCheckList,
  )
  const isEditingCheckList = useCountUI(
    (state: CountUIState) => state.isEditingCheckList,
  )

  function handleClose() {
    setCountUI("isManagingCheckList", false)
    setCountUI("isEditingCheckList", false)
  }

  function handleAdd() {
    setCountUI("isEditingCheckList", true)
    createCountCheck()
  }

  const actions: ModalActionProps[] = [
    {
      iconName: "cancel",
      handleClick: handleClose,
      isDisabled: isEditingCheckList,
    },
    {
      iconName: "add",
      handleClick: handleAdd,
      isDisabled: isEditingCheckList,
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
    <Stack width={"100%"} gap={theme.module[1]}>
      {!!checkList.length ? (
        checkList.map((check: any) => (
          <CheckListItem countCheck={check} key={check.id} />
        ))
      ) : (
        <Typography textAlign={"center"} color={theme.scale.gray[5]}>
          No checks added
        </Typography>
      )}
    </Stack>
  )
}
/*




*/
type CountCheckProps = {
  id: string
  check: string
}
function CheckListItem({ countCheck }: { countCheck: CountCheckProps }) {
  const theme = useTheme()

  const [check, setCheck] = useState(countCheck.check)
  const [isEditing, setIsEditing] = useState(!!countCheck.check ? false : true)

  const isDisabled = !isEditing && !!countCheck.check
  const id = countCheck.id

  function handleAccept() {
    !!check ? updateCountCheck(id, check) : removeCountCheck(id)
    resetIsEditing()
  }

  function handleDelete() {
    removeCountCheck(id)
    resetIsEditing()
  }

  function handleCancel() {
    !!countCheck.check ? setCheck(countCheck.check) : removeCountCheck(id)
    resetIsEditing()
  }

  function handleClickAway() {
    !!check ? updateCountCheck(id, check) : removeCountCheck(id)
    isEditing && _.delay(resetIsEditing, 250)
  }

  function resetIsEditing() {
    setIsEditing(false)
    setCountUI("isEditingCheckList", false)
  }

  const dropdownActions: DropdownActionProps[] = [
    {
      iconName: "cancel",
      handleClick: handleCancel,
    },
    {
      iconName: "done",
      handleClick: handleAccept,
    },
  ]

  const checkListItemInputProps = {
    check,
    setCheck,
    isEditing,
    setIsEditing,
    isDisabled,
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Stack
        direction={"column"}
        width={"100%"}
        gap={isEditing ? theme.module[3] : 0}
        padding={theme.module[2]}
        paddingRight={0}
        boxSizing={"border-box"}
      >
        <Stack
          direction={"row"}
          width={"100%"}
          alignItems={"stretch"}
          gap={theme.module[3]}
          position={"relative"}
        >
          <CheckListItemInput {...checkListItemInputProps} />
          <Button
            variation={"pill"}
            onClick={handleDelete}
            iconName={"delete"}
          />
        </Stack>
        <ActionButtonDropdown actions={dropdownActions} isActive={isEditing} />
      </Stack>
    </ClickAwayListener>
  )
}
/*




*/
type CheckListItemInputProps = {
  check: string
  setCheck: (value: string) => void
  isEditing: boolean
  setIsEditing: (value: boolean) => void
  isDisabled: boolean
}
function CheckListItemInput(props: CheckListItemInputProps) {
  const theme = useTheme()

  const isEditingCheckList = useCountUI(
    (state: CountUIState) => state.isEditingCheckList,
  )

  function handleEdit() {
    if (!isEditingCheckList) {
      props.setIsEditing(true)
      setCountUI("isEditingCheckList", true)
    }
  }

  const buttonStyles = {
    width: "100%",
    height: "105%",
    position: "absolute",
    zIndex: 100,
  }

  const inputStyles = {
    background: theme.scale.gray[props.isDisabled ? 7 : 8],
    color: theme.scale.gray[props.isDisabled ? 8 : 4],
    outline: `2px solid ${theme.scale.blue[7]}`,
    padding: theme.module[2],
    borderLeft: `${theme.module[2]} solid ${theme.scale.blue[7]}`,
  }

  function EndAdornment() {
    return !props.isEditing ? (
      <Icon
        variation="edit"
        color={theme.scale.blue[6]}
        sx={{ fontSize: 15 }}
      />
    ) : undefined
  }

  return (
    <Stack width={"100%"} position={"relative"}>
      {!props.isEditing && (
        <ButtonBase
          disableRipple
          disableTouchRipple
          sx={buttonStyles}
          onClick={handleEdit}
        />
      )}
      <Input
        key={String(props.isDisabled)}
        disabled={props.isDisabled}
        autoFocus
        value={_.capitalize(props.check)}
        onChange={(e: any) => props.setCheck(trimEmptyLines(e.target.value))}
        multiline
        endAdornment={<EndAdornment />}
        sx={inputStyles}
      />
    </Stack>
  )
}
/*




*/
type DropdownActionProps = ModalActionProps
type ActionButtonDropdownProps = {
  actions: DropdownActionProps[]
  isActive: boolean
}
function ActionButtonDropdown(props: ActionButtonDropdownProps) {
  const theme = useTheme()

  function getButtonStyles(index: number) {
    return {
      padding: theme.module[3],
      opacity: props.isActive ? 1 : 0,
      transition: `opacity 250ms, transform ${
        props.isActive ? index * 150 + 150 : 150
      }ms`,
      transform: `scale(${props.isActive ? 1 : 0})`,
    }
  }

  return (
    <Accordion
      expanded={props.isActive}
      sx={{
        margin: 0 + "!important",
        paddingRight: theme.module[6],
        boxSizing: "border-box",
      }}
    >
      <AccordionSummary />
      <AccordionDetails>
        <Stack
          width={"100%"}
          direction={"row"}
          boxSizing={"border-box"}
          justifyContent={"space-evenly"}
        >
          {props.actions.map((action, index) => {
            return (
              <Button
                variation={"pill"}
                iconName={action.iconName}
                onClick={action.handleClick}
                key={action.iconName}
                bgColor={theme.scale.gray[8]}
                outlineColor={theme.scale.gray[6]}
                sx={getButtonStyles(index)}
              />
            )
          })}
        </Stack>
      </AccordionDetails>
    </Accordion>
  )
}
/*




*/
