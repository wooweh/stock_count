import { Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useLocation } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import useTheme, { ThemeColors } from "../../common/useTheme"
import {
  calculateDuration,
  formatDuration,
  formatLongDate,
} from "../../common/utils"
import { ErrorBoundary } from "../../components/errorBoundary"
import Icon, { IconNames } from "../../components/icon"
import Modal, { ModalActionProps } from "../../components/modal"
import { getMemberShortName } from "../org/orgUtils"
import {
  CountUIState,
  addCountUIArrayItem,
  editCountUIArrayItem,
  removeCountUIArrayItem,
  resetCountUI,
  setCountUI,
  useCountUI,
} from "./count"
import { CountMemberProps, CountMetadataProps } from "./countSlice"
import {
  selectCountMetadata,
  selectCountType,
  selectCountersList,
  selectOrganiser,
} from "./countSliceSelectors"
import { submitCount } from "./countSliceUtils"
import {
  CommentsList,
  PreparationItem as FinalizationItem,
  PreparationItemProps,
} from "./preparation"
/*




*/
export function FinalizationBody() {
  const location = useLocation()
  const countUIState = useCountUI((state) => state)
  const path = location.pathname

  return (
    <ErrorBoundary
      componentName="FinalizationBody"
      featurePath={path}
      state={{ featureUI: { ...countUIState } }}
    >
      <Outer>
        <FinalizationItems />
        <FinalizeCountConfirmation />
      </Outer>
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
  return (
    <Stack gap={theme.module[4]} height={"100%"}>
      {children}
    </Stack>
  )
}
/*




*/
type FinalizationItemsProps = PreparationItemProps
function FinalizationItems() {
  const comments = useCountUI((state) => state.finalComments)

  const props = {
    comments,
    handleAccept: (index: number, value: string) =>
      editCountUIArrayItem("finalComments", index, value),
    handleDelete: (value: string) =>
      removeCountUIArrayItem("finalComments", value),
  }

  const finalItems: FinalizationItemsProps[] = [
    {
      label: "Summary:",
      item: <CountSummary />,
    },
    {
      label: "Comments:",
      onClick: () => addCountUIArrayItem("finalComments", ""),
      item: <CommentsList {...props} />,
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
  const organiser = useAppSelector(selectOrganiser) as CountMemberProps
  const counters = useAppSelector(selectCountersList)
  const countType = useAppSelector(selectCountType)
  const metadata = useAppSelector(
    selectCountMetadata,
  ) as Required<CountMetadataProps>

  const countDate = formatLongDate(metadata.finalizationStartTime)
  const start = metadata.countStartTime
  const end = metadata.finalizationStartTime
  const countDuration = calculateDuration(start, end)
  const durationLabel = formatDuration(countDuration)
  const organiserName = getMemberShortName(organiser)

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
      data: <DataPill label={organiserName} color={"purple"} />,
    },
    {
      label: "Counters",
      iconName: "group",
      data: counters.map((counter) => {
        const counterName = getMemberShortName(counter)
        return (
          <DataPill label={counterName} key={counter.uuid} color={"coral"} />
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
  data: React.ReactNode
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
      bgcolor={theme.scale.gray[9]}
      boxSizing={"border-box"}
      sx={{
        outline: `2px solid ${
          props.color ? theme.scale[props.color][7] : theme.scale.gray[7]
        }`,
        outlineOffset: "-2px",
      }}
    >
      <Typography
        color={props.color ? theme.scale[props.color][5] : theme.scale.gray[4]}
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
  const isSubmittingFinalization = useCountUI(
    (state) => state.isSubmittingFinalization,
  )

  function handleAccept() {
    submitCount()
    resetCountUI()
  }

  function handleClose() {
    setCountUI("isSubmittingFinalization", false)
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
