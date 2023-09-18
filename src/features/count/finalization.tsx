import { Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { calculateDuration, formatLongDate } from "../../common/utils"
import Icon, { IconNames } from "../../components/icon"
import {
  addUseCountFinalComment,
  editUseCountFinalComment,
  removeUseCountFinalComment,
  setUseCount,
  useCountStore,
} from "./count"
import {
  CountMetadataProps,
  selectCountMetadata,
  selectCountType,
  selectCountersList,
  selectOrganiser,
} from "./countSlice"
import {
  CommentsList,
  PreparationItem as FinalizationItem,
  PreparationItemProps,
} from "./preparation"
import Modal, { ModalActionProps } from "../../components/modal"
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
  const metadata = useAppSelector(selectCountMetadata) as CountMetadataProps

  const countDate = formatLongDate(metadata.finalizationStartTime as string)
  const countDuration = calculateDuration("1694427482985", "1694527483256")

  const organiserFullName = `${organiser.name[0]}. ${organiser.surname}`

  const countDataItems: CountDataLineItemProps[] = [
    {
      label: "Date",
      iconName: "date",
      data: <DataPill label={countDate} />,
    },
    {
      label: "Type",
      iconName: "clipboard",
      data: <DataPill label={_.capitalize(countType)} />,
    },
    {
      label: "Duration",
      iconName: "time",
      data: <DataPill label={countDuration} />,
    },
    {
      label: "Organiser",
      iconName: "profile",
      data: <DataPill label={organiserFullName} />,
    },
    {
      label: "Counters",
      iconName: "group",
      data: counters.map((counter) => {
        const counterFullName = `${organiser.name[0]}. ${organiser.surname}`
        return <DataPill label={counterFullName} key={counter.uuid} />
      }),
    },
  ]

  return (
    <Stack width={"100%"} height={"100%"}>
      {countDataItems.map((item: CountDataLineItemProps) => (
        <CountDataLineItem
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
type CountDataLineItemProps = {
  label: string
  iconName: IconNames
  data: any
}
function CountDataLineItem(props: CountDataLineItemProps) {
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
      <Typography width={75} flexShrink={0}>
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
}
function DataPill(props: DataPillProps) {
  const theme = useTheme()

  return (
    <Stack
      direction={"row"}
      justifyContent={"center"}
      padding={`${theme.module[2]} ${theme.module[3]}`}
      borderRadius={theme.module[2]}
      bgcolor={theme.scale.gray[9]}
      boxSizing={"border-box"}
      sx={{ outline: `1px solid ${theme.scale.gray[7]}` }}
    >
      <Typography noWrap variant="body2" fontWeight={"bold"}>
        {props.label}
      </Typography>
    </Stack>
  )
}
/*





*/
function FinalizeCountConfirmation() {
  const theme = useTheme()

  const isSubmittingFinalization = useCountStore(
    (state: any) => state.isSubmittingFinalization,
  )

  function handleAccept() {
    // TODO: Function to prepare results for submission
    // TODO: History reducer to add count info to history
    handleClose()
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
          {/* <Stack
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
              Once the count has been finalized you will not be able to edit any
              
            </Typography>
          </Stack> */}
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
