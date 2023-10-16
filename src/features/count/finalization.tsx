import { Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import useTheme, { ThemeColors } from "../../common/useTheme"
import {
  calculateDuration,
  formatDuration,
  formatLongDate,
} from "../../common/utils"
import Icon, { IconNames } from "../../components/icon"
import Modal, { ModalActionProps } from "../../components/modal"
import { generateCustomNotification } from "../core/notifications"
import {
  addUseCountFinalComment,
  editUseCountFinalComment,
  removeUseCountFinalComment,
  resetUseCount,
  setUseCount,
  useCountStore,
} from "./count"
import {
  CountMetadataProps,
  deleteCount,
  selectCountMetadata,
  selectCountType,
  selectCountersList,
  selectOrganiser,
} from "./countSlice"
import { submitCount, updateCountStep } from "./countUtils"
import {
  CommentsList,
  PreparationItem as FinalizationItem,
  PreparationItemProps,
} from "./preparation"
/*





*/
export function FinalizationBody() {
  const theme = useTheme()

  return (
    <Stack gap={theme.module[4]} height={"100%"}>
      <FinalizationItems />
      <FinalizeCountConfirmation />
    </Stack>
  )
}
/*





*/
type FinalizationItemsProps = PreparationItemProps
function FinalizationItems() {
  const comments = useCountStore((state) => state.finalComments)
  const finalItems: FinalizationItemsProps[] = [
    {
      label: "Summary:",
      item: <CountSummary />,
    },
    {
      label: "Comments:",
      onClick: () => addUseCountFinalComment(""),
      item: (
        <CommentsList
          comments={comments}
          handleAccept={editUseCountFinalComment}
          handleDelete={removeUseCountFinalComment}
        />
      ),
    },
  ]
  return (
    <>
      {finalItems.map((item: FinalizationItemsProps) => (
        <FinalizationItem {...item} key={item.label} />
      ))}
    </>
  )
}
/*





*/
function CountSummary() {
  const organiser = useAppSelector(selectOrganiser)
  const counters = useAppSelector(selectCountersList)
  const countType = useAppSelector(selectCountType)
  const metadata = useAppSelector(
    selectCountMetadata,
  ) as Required<CountMetadataProps>

  const countDate = formatLongDate(metadata.finalizationStartTime)
  const countDuration = calculateDuration(
    metadata.countStartTime,
    metadata.finalizationStartTime,
  )
  const durationLabel = formatDuration(countDuration)
  const organiserFullName = `${organiser.name[0]}. ${organiser.surname}`

  const dataItems: DataLineItemProps[] = [
    {
      label: "Date",
      iconName: "date",
      data: <DataPill label={countDate} color={"blue"} />,
    },
    {
      label: "Type",
      iconName: "clipboard",
      data: <DataPill label={_.capitalize(countType)} color={"orange"} />,
    },
    {
      label: "Duration",
      iconName: "time",
      data: <DataPill label={durationLabel} color={"green"} />,
    },
    {
      label: "Organiser",
      iconName: "profile",
      data: <DataPill label={organiserFullName} color={"purple"} />,
    },
    {
      label: "Counters",
      iconName: "group",
      data: counters.map((counter) => {
        const counterFullName = `${counter.name[0]}. ${counter.surname}`
        return (
          <DataPill
            label={counterFullName}
            key={counter.uuid}
            color={"coral"}
          />
        )
      }),
    },
  ]

  return (
    <Stack width={"100%"} height={"100%"}>
      {dataItems.map((item: DataLineItemProps) => (
        <DataLineItem
          label={item.label}
          iconName={item.iconName}
          data={item.data}
          key={item.label}
        />
      ))}
    </Stack>
  )
}
/*





*/
export type DataLineItemProps = {
  label: string
  iconName: IconNames
  data: any
}
export function DataLineItem(props: DataLineItemProps) {
  const theme = useTheme()

  return (
    <Stack
      width={"100%"}
      direction={"row"}
      gap={theme.module[4]}
      alignItems={"center"}
      padding={`${theme.module[0]} 0 ${theme.module[0]} ${theme.module[3]}`}
      boxSizing={"border-box"}
    >
      <Icon variation={props.iconName} />
      <Typography width={"50%"} flexShrink={1}>
        {props.label}
        {":"}
      </Typography>
      <Stack
        direction={"row"}
        gap={theme.module[3]}
        overflow={"scroll"}
        width={"100%"}
        padding={theme.module[0]}
        boxSizing={"border-box"}
        sx={{ overflowX: "scroll", overflowY: "visible" }}
      >
        {props.data}
      </Stack>
    </Stack>
  )
}
/*





*/
type DataPillProps = {
  label: string
  color?: ThemeColors
}
export function DataPill(props: DataPillProps) {
  const theme = useTheme()

  return (
    <Stack
      direction={"row"}
      justifyContent={"center"}
      padding={`${theme.module[2]} ${theme.module[3]}`}
      borderRadius={theme.module[2]}
      bgcolor={props.color ? theme.scale[props.color][8] : theme.scale.gray[9]}
      boxSizing={"border-box"}
      sx={{
        outline: `1px solid ${
          props.color ? theme.scale[props.color][7] : theme.scale.gray[7]
        }`,
      }}
    >
      <Typography
        color={props.color ? theme.scale[props.color][3] : theme.scale.gray[4]}
        noWrap
        variant="body2"
        fontWeight={"bold"}
      >
        {props.label}
      </Typography>
    </Stack>
  )
}
/*





*/
function FinalizeCountConfirmation() {
  const theme = useTheme()
  const dispatch = useAppDispatch()

  const isSubmittingFinalization = useCountStore(
    (state: any) => state.isSubmittingFinalization,
  )

  function handleAccept() {
    submitCount()
    updateCountStep("dashboard")
    resetUseCount()
    handleClose()
    dispatch(deleteCount())
    generateCustomNotification("success", "Count submitted to History")
  }

  function handleClose() {
    setUseCount("isSubmittingFinalization", false)
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
      open={isSubmittingFinalization}
      heading={"Submit Results"}
      body={
        <Stack gap={theme.module[4]} alignItems={"center"}>
          <Typography>You are about to finalize the count.</Typography>
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
