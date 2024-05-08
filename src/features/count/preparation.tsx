import { ClickAwayListener, Stack, Typography } from "@mui/material"
import _ from "lodash"
import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Button } from "../../components/button"
import { Input } from "../../components/control"
import { Divider } from "../../components/divider"
import { ErrorBoundary } from "../../components/errorBoundary"
import { Fade } from "../../components/fade"
import Icon from "../../components/icon"
import { List } from "../../components/list"
import { ListItem } from "../../components/listItem"
import Modal, { ModalActionProps } from "../../components/modal"
import { Window } from "../../components/surface"
import { selectOrgCountChecksList } from "../org/orgSliceSelectors"
import {
  addCountUIArrayItem,
  editCountUIArrayItem,
  removeCountUIArrayItem,
  resetCountUI,
  setCountUI,
  useCountUI,
} from "./count"
import { CountSteps } from "./countSlice"
import { selectIsUserJustOrganiser } from "./countSliceSelectors"
import { startCount } from "./countSliceUtils"
/*




*/
export function PreparationBody() {
  const location = useLocation()
  const countUIState = useCountUI((state) => state)
  const path = location.pathname

  return (
    <ErrorBoundary
      componentName="PreparationBody"
      featurePath={path}
      state={{ featureUI: { ...countUIState } }}
    >
      <Fade>
        <Outer>
          <PreparationItems />
          <StartCountConfirmation />
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
  const theme = useTheme()

  return <Window gap={theme.module[4]}>{children}</Window>
}
/*




*/
function PreparationItems() {
  const comments = useCountUI((state) => state.prepComments)

  const props = {
    comments,
    handleAccept: (index: number, value: string) =>
      editCountUIArrayItem("prepComments", index, value),
    handleDelete: (value: string) =>
      removeCountUIArrayItem("prepComments", value),
  }

  const prepItems: PreparationItemProps[] = [
    {
      label: "Checklist:",
      item: <Checklist />,
    },
    {
      label: "Comments:",
      onClick: () => addCountUIArrayItem("prepComments", ""),
      item: <CommentsList {...props} />,
    },
  ]

  return (
    <>
      {prepItems.map((item: PreparationItemProps, index: number) => (
        <React.Fragment key={item.label}>
          <PreparationItem {...item} key={item.label} />
          {index !== prepItems.length - 1 && <Divider variant={"fullWidth"} />}
        </React.Fragment>
      ))}
    </>
  )
}
/*




*/
export type PreparationItemProps = {
  label: string
  onClick?: any
  item: any
}
export function PreparationItem(props: PreparationItemProps) {
  const theme = useTheme()

  return (
    <Stack gap={theme.module[3]} height={"45%"} width={"100%"}>
      <Stack
        paddingLeft={theme.module[1]}
        paddingRight={theme.module[1]}
        direction={"row"}
        gap={theme.module[3]}
        justifyContent={"space-between"}
        alignItems={"center"}
        boxSizing={"border-box"}
      >
        <Typography
          fontSize={"large"}
          color={theme.scale.gray[4]}
          fontWeight={"bold"}
        >
          {props.label}
        </Typography>
        <Stack maxWidth={"50%"}>
          {!!props.onClick && (
            <Button
              variation={"pill"}
              iconName={"add"}
              label={"Add"}
              onClick={props.onClick}
              bgColor={theme.scale.gray[7]}
              outlineColor={theme.scale.gray[6]}
              boxShadowScale={5}
              sx={{ paddingRight: theme.module[4] }}
            />
          )}
        </Stack>
      </Stack>
      <Stack
        borderRadius={theme.module[2]}
        maxHeight={"100%"}
        boxSizing={"border-box"}
        overflow={"hidden"}
        boxShadow={theme.shadow.neo[0]}
        padding={`${theme.module[3]} 0`}
        paddingRight={theme.module[1]}
        sx={{
          outline: `1px solid ${theme.scale.gray[7]}`,
          outlineOffset: "-1px",
        }}
      >
        {props.item}
      </Stack>
    </Stack>
  )
}
/*




*/
function Checklist() {
  const theme = useTheme()
  const checks = useAppSelector(selectOrgCountChecksList)

  return !!checks.length ? (
    <List maxHeight={"100%"} gapScale={0}>
      {checks.map((check: { id: string; check: string }) => {
        return <CheckListItem check={check} key={check.id} />
      })}
    </List>
  ) : (
    <Typography textAlign={"center"} color={theme.scale.gray[5]}>
      No checks added
    </Typography>
  )
}
/*




*/
function CheckListItem({ check }: { check: { id: string; check: string } }) {
  const theme = useTheme()
  const satisfiedCheckUuids = useCountUI((state) => state.satisfiedCheckUuids)
  const isSatisfied = satisfiedCheckUuids.includes(check.id)

  function handleClick() {
    isSatisfied
      ? removeCountUIArrayItem("satisfiedCheckUuids", check.id)
      : addCountUIArrayItem("satisfiedCheckUuids", check.id)
  }

  const listItemStyles = {
    padding: theme.module[2],
    paddingLeft: theme.module[4],
    outline: "none",
  }

  return (
    <ListItem
      label={check.check}
      primarySlot={<Icon variation={isSatisfied ? "checked" : "unchecked"} />}
      tappable
      onChange={handleClick}
      bgColor={"transparant"}
      sx={listItemStyles}
      key={check.id}
    />
  )
}
/*




*/
type CommentsListProps = {
  comments: string[]
  handleAccept: (index: number, value: string) => void
  handleDelete: (value: string) => void
}
export function CommentsList(props: CommentsListProps) {
  const theme = useTheme()

  return (
    <List maxHeight={"100%"} gapScale={1}>
      {!!props.comments.length ? (
        props.comments.map((comment: string, index: number) => {
          return (
            <CommentListItem
              comment={comment}
              index={index}
              handleAccept={props.handleAccept}
              handleDelete={props.handleDelete}
              key={`${index} + ${comment}`}
            />
          )
        })
      ) : (
        <Stack width={"100%"} alignItems={"center"}>
          <Typography color={theme.scale.gray[5]}>No comments added</Typography>
        </Stack>
      )}
    </List>
  )
}
/*




*/
type CommentListProps = {
  comment: string
  index: number
  handleAccept: (index: number, value: string) => void
  handleDelete: (value: string) => void
}
function CommentListItem(props: CommentListProps) {
  const theme = useTheme()

  const [value, setValue] = useState(props.comment ?? "")
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (!isEditing && !props.comment) setIsEditing(true)
  }, [props.comment, isEditing])

  function handleEdit() {
    setIsEditing(true)
  }

  function handleAccept() {
    props.handleAccept(props.index, value)
    setIsEditing(false)
  }

  function handleDelete() {
    props.handleDelete(props.comment)
    setIsEditing(false)
  }

  function handleClickAway() {
    if (isEditing) {
      if (!props.comment && !value) {
        handleDelete()
      } else if (!!props.comment && !value) {
        setValue(props.comment)
      } else {
        handleAccept()
      }
      setIsEditing(false)
    }
  }

  const inputStyles = {
    background: theme.scale.gray[isEditing ? 7 : 8],
    color: theme.scale.gray[isEditing ? 4 : 8],
    padding: theme.module[2],
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Stack
        direction={"row"}
        width={"100%"}
        paddingLeft={theme.module[2]}
        boxSizing={"border-box"}
        alignItems={"stretch"}
        gap={theme.module[2]}
      >
        <Input
          disabled={!isEditing}
          value={value}
          onChange={(e: any) => setValue(_.capitalize(e.target.value))}
          placeholder={"New comment..."}
          multiline
          autoFocus
          sx={inputStyles}
        />
        <Button
          variation={"pill"}
          onClick={!isEditing ? handleEdit : handleAccept}
          iconName={!isEditing ? "edit" : "done"}
        />
        <Button variation={"pill"} onClick={handleDelete} iconName={"delete"} />
      </Stack>
    </ClickAwayListener>
  )
}
/*




*/
function StartCountConfirmation() {
  const theme = useTheme()

  const isOnlyOrganiser = useAppSelector(selectIsUserJustOrganiser)

  const comments = useCountUI((state) => state.prepComments)
  const checkUuids = useCountUI((state) => state.satisfiedCheckUuids)
  const isStartingCount = useCountUI((state) => state.isStartingCount)

  const step: CountSteps = isOnlyOrganiser ? "review" : "stockCount"

  function handleAccept() {
    startCount(checkUuids, comments, step)
    resetCountUI()
  }

  function handleClose() {
    setCountUI("isStartingCount", false)
  }

  const actions: ModalActionProps[] = [
    {
      iconName: "cancel",
      handleClick: handleClose,
    },
    {
      id: "count-start-confirmation-accept-button",
      iconName: "done",
      handleClick: handleAccept,
    },
  ]

  const START_MESSAGE =
    "You are about to start the count. Please read the following:"
  const DISCLAIMER = `Once the count has been started you will not be able 
  to go back to Setup or Preparation. You can change count type and manage 
  counters in the 'Manage' count option.`
  const PROCEED_MESSAGE = "Are you sure you want to proceed?"

  return (
    <Modal
      open={isStartingCount}
      heading={"Start Count"}
      body={
        <Stack gap={theme.module[4]} alignItems={"center"}>
          <Typography>{START_MESSAGE}</Typography>
          <Stack
            padding={theme.module[3]}
            borderRadius={theme.module[2]}
            boxSizing={"border-box"}
            bgcolor={theme.scale.red[7]}
            boxShadow={theme.shadow.neo[2]}
            sx={{ outline: `1px solid ${theme.scale.red[5]}` }}
          >
            <Typography
              variant={"body2"}
              fontWeight={"bold"}
              color={theme.scale.red[3]}
            >
              {DISCLAIMER}
            </Typography>
          </Stack>
          <Typography>{PROCEED_MESSAGE}</Typography>
        </Stack>
      }
      actions={actions}
      onClose={handleClose}
    />
  )
}
/*




*/
