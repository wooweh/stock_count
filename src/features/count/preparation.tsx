import { ClickAwayListener, Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useState } from "react"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Button } from "../../components/button"
import { Input } from "../../components/control"
import Icon from "../../components/icon"
import { List } from "../../components/list"
import { ListItem } from "../../components/listItem"
import Modal, { ModalActionProps } from "../../components/modal"
import { selectOrgCountChecksList } from "../org/orgSliceSelectors"
import {
  CountUIState,
  addCountUIPrepComment,
  addCountUISatisfiedCheckUuid,
  editCountUIPrepComment,
  removeCountUIPrepComment,
  removeCountUISatisfiedCheckUuid,
  setCountUI,
  useCountUI,
} from "./count"
import { CountSteps } from "./countSlice"
import { selectIsUserJustOrganiser } from "./countSliceSelectors"
import { startCount } from "./countSliceUtils"
/*




*/
export function PreparationBody() {
  return (
    <Outer>
      <PreparationItems />
      <StartCountConfirmation />
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
  const theme = useTheme()

  return (
    <Stack gap={theme.module[4]} height={"100%"}>
      {children}
    </Stack>
  )
}
/*




*/
function PreparationItems() {
  const comments = useCountUI((state) => state.prepComments)
  const prepItems: PreparationItemProps[] = [
    {
      label: "Checklist:",
      item: <Checklist />,
    },
    {
      label: "Comments:",
      onClick: () => addCountUIPrepComment(""),
      item: (
        <CommentsList
          comments={comments}
          handleAccept={editCountUIPrepComment}
          handleDelete={removeCountUIPrepComment}
        />
      ),
    },
  ]

  return (
    <>
      {prepItems.map((item: PreparationItemProps) => (
        <PreparationItem {...item} key={item.label} />
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
    <Stack gap={theme.module[3]} height={"47.5%"}>
      <Stack
        paddingLeft={theme.module[1]}
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
      ? removeCountUISatisfiedCheckUuid(check.id)
      : addCountUISatisfiedCheckUuid(check.id)
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
export function CommentsList({
  comments,
  handleAccept,
  handleDelete,
}: {
  comments: string[]
  handleAccept: any
  handleDelete: any
}) {
  const theme = useTheme()

  return (
    <List maxHeight={"100%"} gapScale={1}>
      {!!comments.length ? (
        comments.map((comment: string, index: number) => {
          return (
            <CommentListItem
              comment={comment}
              index={index}
              handleAccept={handleAccept}
              handleDelete={handleDelete}
              key={`${comment} ${index}`}
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
  handleAccept: any
  handleDelete: any
}
function CommentListItem(props: CommentListProps) {
  const theme = useTheme()

  const [value, setValue] = useState(props.comment)
  const [isEditing, setIsEditing] = useState(false)

  function handleEdit() {
    setIsEditing(true)
  }

  function handleAccept() {
    props.handleAccept(props.index, value)
    setIsEditing(false)
  }

  function handleDelete() {
    props.handleDelete(props.index)
    setIsEditing(false)
  }

  const isDisabled = !isEditing && !!props.comment
  const inputStyles = {
    background: theme.scale.gray[isDisabled ? 8 : 7],
    color: theme.scale.gray[isDisabled ? 8 : 4],
    padding: theme.module[2],
  }

  return (
    <ClickAwayListener onClickAway={!!value ? handleAccept : handleDelete}>
      <Stack
        direction={"row"}
        width={"100%"}
        paddingLeft={theme.module[2]}
        boxSizing={"border-box"}
        alignItems={"stretch"}
        gap={theme.module[2]}
      >
        <Input
          disabled={isDisabled}
          value={value}
          onChange={(e: any) => setValue(_.capitalize(e.target.value))}
          placeholder={"New comment..."}
          multiline
          autoFocus
          sx={inputStyles}
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
function StartCountConfirmation() {
  const theme = useTheme()

  const isOnlyOrganiser = useAppSelector(selectIsUserJustOrganiser)

  const comments = useCountUI((state: CountUIState) => state.prepComments)
  const checkUuids = useCountUI(
    (state: CountUIState) => state.satisfiedCheckUuids,
  )
  const isStartingCount = useCountUI(
    (state: CountUIState) => state.isStartingCount,
  )

  const step: CountSteps = isOnlyOrganiser ? "review" : "stockCount"

  function handleAccept() {
    startCount(checkUuids, comments, step)
    setCountUI("isStartingCount", false)
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
            sx={{
              outline: `1px solid ${theme.scale.red[5]}`,
            }}
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
