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
import { useLocation } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { trimEmptyLines } from "../../common/utils"
import { Button } from "../../components/button"
import { Input } from "../../components/control"
import { ErrorBoundary } from "../../components/errorBoundary"
import { Fade } from "../../components/fade"
import Icon from "../../components/icon"
import Modal, { ModalActionProps } from "../../components/modal"
import { Slot, Window } from "../../components/surface"
import { selectOrgCountChecksList } from "../org/orgSliceSelectors"
import { selectIsUserAdmin } from "../user/userSliceSelectors"
import { resetCountUI, setCountUI, useCountUI } from "./count"
import { CountProps } from "./countSlice"
import { getCountFromDB } from "./countSliceRemote"
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
  updateCount,
  updateCountCheck,
  updateCountStep,
  updateUserCountMember,
} from "./countSliceUtils"
/*




*/
export function DashboardBody() {
  const location = useLocation()
  const countUIState = useCountUI((state) => state)
  const path = location.pathname

  return (
    <ErrorBoundary
      componentName="DashboardBody"
      featurePath={path}
      state={{ featureUI: { ...countUIState } }}
    >
      <Fade>
        <Outer>
          <Body />
          <ButtonTray />
          <PrepCheckList />
        </Outer>
      </Fade>
    </ErrorBoundary>
  )
}
/*




*/
function Outer({
  children,
}: {
  children: React.ReactElement | React.ReactElement[]
}) {
  return <Window justifyContent={"space-between"}>{children}</Window>
}
/*




*/
function Body() {
  const theme = useTheme()

  const isInvitePending = useAppSelector(selectIsCountInvitePending)
  const isAwayFromCount = useAppSelector(selectIsUserAwayFromCount)
  const isCountInProgress = useAppSelector(selectIsCountInProgress)

  return (
    <Window
      justifyContent={"center"}
      gap={theme.module[6]}
      paddingBottom={isCountInProgress ? theme.module[8] : 0}
    >
      {isInvitePending ? (
        <Invite />
      ) : isAwayFromCount ? (
        <Rejoin />
      ) : (
        <CountPrompt />
      )}
    </Window>
  )
}
/*




*/
function Invite() {
  const theme = useTheme()

  function handleAccept() {
    getCountFromDB()
      .then((count) => {
        const updatedCount: CountProps = count
        if (!!updatedCount) updateCount(updatedCount)
      })
      .then(() => {
        updateUserCountMember({ isCounting: true, isJoined: true })
        updateCountStep("stockCount", true)
      })
  }

  function handleDecline() {
    updateUserCountMember({ isDeclined: true })
  }

  const actions: NotificationActionProps[] = [
    {
      label: "Accept",
      handleClick: handleAccept,
      iconName: "done",
      color: theme.scale.green[5],
    },
    {
      label: "Decline",
      handleClick: handleDecline,
      iconName: "decline",
      color: theme.scale.red[5],
    },
  ]
  const MESSAGE = "You are invited to count"

  return <Notification message={MESSAGE} actions={actions} />
}
/*




*/
function Rejoin() {
  const theme = useTheme()
  const step = useAppSelector(selectUserCountMemberStep)

  function handleRejoin() {
    updateUserCountMember({ isCounting: true })
    updateCountStep(step, true)
  }

  const actions: NotificationActionProps[] = [
    {
      label: "Rejoin",
      handleClick: handleRejoin,
      iconName: "joinGroup",
      color: theme.scale.green[6],
    },
  ]
  const MESSAGE = "You have left a count"

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
type NotificationActionProps = ModalActionProps & {
  label: string
  color: string
}
type NotificationProps = {
  message: string
  actions: NotificationActionProps[]
}
function Notification(props: NotificationProps) {
  const theme = useTheme()
  const styles = {
    outline: `2px solid ${theme.scale.blue[7]}`,
    outlineOffset: "-2px",
  }

  return (
    <Stack
      gap={theme.module[4]}
      borderRadius={theme.module[4]}
      padding={theme.module[3]}
      boxSizing={"border-box"}
      bgcolor={theme.scale.blue[9]}
      width={"100%"}
      sx={styles}
    >
      <Slot gap={theme.module[4]} padding={theme.module[3]}>
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
      </Slot>
      {props.actions.map((action) => (
        <Button
          variation="profile"
          label={action.label}
          iconName={action.iconName}
          justifyCenter
          bgColor={theme.scale.gray[9]}
          color={action.color}
          outlineColor={action.color}
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

  const showButtons = isAdmin && !isCountInProgress

  return (
    showButtons && (
      <Window
        gap={theme.module[4]}
        height={"min-content"}
        overflow={"visible"}
        padding={theme.module[0]}
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
          id="count-new-count-button"
          variation={"profile"}
          label={"New Count"}
          iconName={"add"}
          iconColor={theme.scale.blue[6]}
          color={theme.scale.blue[6]}
          outlineColor={theme.scale.blue[7]}
          justifyCenter
          onClick={handleNewCount}
        />
      </Window>
    )
  )
}
/*




*/
function PrepCheckList() {
  const isManagingCheckList = useCountUI((state) => state.isManagingCheckList)
  const isEditingCheckList = useCountUI((state) => state.isEditingCheckList)

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
  const location = useLocation()
  const checkList = useAppSelector(selectOrgCountChecksList)
  const countUIState = useCountUI((state) => state)
  const path = location.pathname

  return (
    <ErrorBoundary
      componentName="CheckList"
      featurePath={path}
      state={{ featureUI: { ...countUIState } }}
    >
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
    </ErrorBoundary>
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

  const [isEditing, setIsEditing] = useState(!!countCheck.check ? false : true)
  const [check, setCheck] = useState(countCheck.check)

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
        width={"100%"}
        gap={isEditing ? theme.module[3] : 0}
        padding={theme.module[2]}
        paddingRight={0}
        boxSizing={"border-box"}
      >
        <Slot
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
        </Slot>
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

  const isEditingCheckList = useCountUI((state) => state.isEditingCheckList)

  function handleEdit() {
    if (!isEditingCheckList) {
      props.setIsEditing(true)
      setCountUI("isEditingCheckList", true)
    }
  }

  const inputStyles = {
    background: theme.scale.gray[props.isDisabled ? 7 : 8],
    color: theme.scale.gray[props.isDisabled ? 8 : 4],
    outline: `2px solid ${theme.scale.blue[7]}`,
    padding: theme.module[2],
    borderLeft: `${theme.module[2]} solid ${theme.scale.blue[7]}`,
  }
  const buttonStyles = {
    width: "100%",
    height: "105%",
    position: "absolute",
    zIndex: 100,
  }

  return (
    <Stack width={"100%"} position={"relative"}>
      {!props.isEditing && (
        <ButtonBase
          onClick={handleEdit}
          disableTouchRipple
          sx={buttonStyles}
          disableRipple
        />
      )}
      <Input
        onChange={(e: any) => props.setCheck(trimEmptyLines(e.target.value))}
        endAdornment={<EndAdornment show={props.isEditing} />}
        value={_.capitalize(props.check)}
        key={String(props.isDisabled)}
        disabled={props.isDisabled}
        sx={inputStyles}
        autoFocus
        multiline
      />
    </Stack>
  )
}
/*




*/
function EndAdornment({ show }: { show: boolean }) {
  const theme = useTheme()

  return (
    <Icon variation="edit" color={theme.scale.blue[6]} sx={{ fontSize: 15 }} />
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

  const styles = {
    margin: 0 + "!important",
    paddingRight: theme.module[6],
    boxSizing: "border-box",
    opacity: props.isActive ? 1 : 0,
    transition: `opacity ${props.isActive ? 250 : 750}ms ease-out`,
  }

  return (
    <Accordion expanded={props.isActive} sx={styles}>
      <AccordionSummary />
      <AccordionDetails>
        <Slot justifyContent={"space-evenly"}>
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
        </Slot>
      </AccordionDetails>
    </Accordion>
  )
}
/*




*/
