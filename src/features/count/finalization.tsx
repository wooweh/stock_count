import { Stack, Typography } from "@mui/material"
import _ from "lodash"
import React from "react"
import { useLocation } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import useTheme, { ThemeColors } from "../../common/useTheme"
import {
  calculateDuration,
  formatDuration,
  formatLongDate,
} from "../../common/utils"
import { Divider } from "../../components/divider"
import { ErrorBoundary } from "../../components/errorBoundary"
import { Fade } from "../../components/fade"
import Icon, { IconNames } from "../../components/icon"
import Modal, { ModalActionProps } from "../../components/modal"
import { Slot, Window } from "../../components/surface"
import { getMemberShortName } from "../org/orgUtils"
import {
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
      <Fade>
        <Outer>
          <FinalizationItems />
          <FinalizeCountConfirmation />
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
      {finalItems.map((item: FinalizationItemsProps, index: number) => (
        <React.Fragment key={item.label}>
          <FinalizationItem {...item} key={item.label} />
          {index !== finalItems.length - 1 && <Divider variant={"fullWidth"} />}
        </React.Fragment>
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
    <Window width={"100%"} height={"100%"} overflow={"auto"}>
      {dataItems.map((item: DataLineItemProps) => (
        <DataLineItem
          label={item.label}
          iconName={item.iconName}
          data={item.data}
          key={item.label}
        />
      ))}
    </Window>
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
    <Slot
      gap={theme.module[5]}
      padding={`${theme.module[0]} 0 ${theme.module[0]} ${theme.module[3]}`}
    >
      <Slot
        gap={theme.module[3]}
        width={theme.module[9]}
        justifyContent={"flex-start"}
      >
        <Icon variation={props.iconName} />
        <Typography width={"50%"} flexShrink={1}>
          {props.label}
          {":"}
        </Typography>
      </Slot>
      <Slot
        gap={theme.module[3]}
        justifyContent={"flex-start"}
        padding={theme.module[0]}
        sx={{ overflowX: "scroll", overflowY: "visible" }}
      >
        {props.data}
      </Slot>
    </Slot>
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
  const styles = {
    outline: `2px solid ${
      props.color ? theme.scale[props.color][7] : theme.scale.gray[7]
    }`,
    outlineOffset: "-2px",
  }

  return (
    <Stack
      direction={"row"}
      justifyContent={"center"}
      padding={`${theme.module[2]} ${theme.module[3]}`}
      borderRadius={theme.module[2]}
      bgcolor={theme.scale.gray[9]}
      boxSizing={"border-box"}
      sx={styles}
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
      id: "count-finalize-submit-accept-button",
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
