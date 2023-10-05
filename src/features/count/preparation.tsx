import { ClickAwayListener, Stack, Typography } from "@mui/material"
import { useState } from "react"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { getTimeStamp } from "../../common/utils"
import { Button } from "../../components/button"
import { Input } from "../../components/control"
import Icon from "../../components/icon"
import { ListItem } from "../../components/listItem"
import { List } from "../../components/list"
import Modal, { ModalActionProps } from "../../components/modal"
import { selectOrgCountChecksList } from "../organisation/organisationSlice"
import {
  addUseCountPrepComment,
  addUseCountSatisfiedCheckUuid,
  editUseCountPrepComment,
  removeUseCountPrepComment,
  removeUseCountSatisfiedCheckUuid,
  setUseCount,
  useCountStore,
} from "./count"
import {
  createCountChecks,
  createCountMembers,
  updateCountComments,
  updateCountMetadata,
  updateCountStep,
} from "./countUtils"
import _ from "lodash"
import { CountSteps, selectIsUserOnlyOrganiser } from "./countSlice"
/*





*/
export function PreparationBody() {
  const theme = useTheme()

  return (
    <Stack gap={theme.module[4]} height={"100%"}>
      <PreparationItems />
      <StartCountConfirmation />
    </Stack>
  )
}
/*





*/
function PreparationItems() {
  const comments = useCountStore((state) => state.prepCommments)
  const prepItems: PreparationItemProps[] = [
    {
      label: "Checklist:",
      item: <Checklist />,
    },
    {
      label: "Comments:",
      onClick: () => addUseCountPrepComment(""),
      item: (
        <CommentsList
          comments={comments}
          handleAccept={editUseCountPrepComment}
          handleDelete={removeUseCountPrepComment}
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
    <Stack gap={theme.module[3]} maxHeight={"47.5%"}>
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
        sx={{
          outline: `1px solid ${theme.scale.gray[7]}`,
          padding: `${theme.module[3]} 0`,
          paddingRight: theme.module[1],
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
  const checks = useAppSelector(selectOrgCountChecksList)

  return (
    <List maxHeight={"100%"} gapScale={0}>
      {!!checks &&
        checks.map((check: { id: string; check: string }) => {
          return <CheckListItem check={check} key={check.id} />
        })}
    </List>
  )
}
/*





*/
function CheckListItem({ check }: { check: { id: string; check: string } }) {
  const theme = useTheme()
  const satisfiedCheckUuids = useCountStore(
    (state) => state.satisfiedCheckUuids,
  )
  const isSatisfied = satisfiedCheckUuids.includes(check.id)

  function handleClick() {
    isSatisfied
      ? removeUseCountSatisfiedCheckUuid(check.id)
      : addUseCountSatisfiedCheckUuid(check.id)
  }

  return (
    <ListItem
      label={check.check}
      primarySlot={<Icon variation={isSatisfied ? "checked" : "unchecked"} />}
      tappable
      onChange={handleClick}
      bgColor={"transparant"}
      sx={{
        padding: theme.module[2],
        paddingLeft: theme.module[4],
      }}
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

  const isDisabled = !isEditing && !!props.comment

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
          sx={{
            background: theme.scale.gray[isDisabled ? 8 : 7],
            color: theme.scale.gray[isDisabled ? 8 : 4],
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
function StartCountConfirmation() {
  const theme = useTheme()

  const isOnlyOrganiser = useAppSelector(selectIsUserOnlyOrganiser)

  const isStartingCount = useCountStore((state: any) => state.isStartingCount)
  const satisfiedCheckUuids = useCountStore(
    (state) => state.satisfiedCheckUuids,
  )
  const prepCommments = useCountStore((state) => state.prepCommments)

  const step: CountSteps = isOnlyOrganiser ? "review" : "stockCount"

  function handleAccept() {
    createCountMembers()
    createCountChecks(satisfiedCheckUuids)
    updateCountComments({ preparation: prepCommments })
    updateCountStep(step, true)
    updateCountMetadata({ countStartTime: getTimeStamp() })
    setUseCount("isStartingCount", false)
  }

  function handleClose() {
    setUseCount("isStartingCount", false)
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

  return (
    <Modal
      open={isStartingCount}
      heading={"Start Count"}
      body={
        <Stack gap={theme.module[4]} alignItems={"center"}>
          <Typography>You are about to start the count.</Typography>
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
              Once the count has been started you will not be able to edit any
              information in Setup or Preparation.
            </Typography>
          </Stack>
          <Typography>Are you sure you want to proceed?</Typography>
        </Stack>
      }
      actions={actions}
      onClose={handleClose}
    />
  )
}
/*





*/
