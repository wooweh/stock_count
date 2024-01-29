import { Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useLocation } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { ErrorBoundary } from "../../components/errorBoundary"
import { Fade } from "../../components/fade"
import Icon from "../../components/icon"
import Modal, { ModalActionProps } from "../../components/modal"
import { Slot, Window } from "../../components/surface"
import VirtualizedTable from "../../components/table"
import { MembersProps } from "../org/orgSlice"
import { selectOrgMembers } from "../org/orgSliceSelectors"
import { getMemberShortName } from "../org/orgUtils"
import { selectStock } from "../stock/stockSliceSelectors"
import { setCountUI, useCountUI } from "./count"
import {
  CountMemberResultsProps,
  CountMembersProps,
  CountResultsProps,
  CountTypes,
} from "./countSlice"
import {
  selectCountMembers,
  selectCountResults,
  selectCountType,
  selectCountersUuidList,
  selectIsOrganiserFinalizing,
  selectIsStockCountCompleted,
  selectIsUserOrganiser,
} from "./countSliceSelectors"
import { completeReview } from "./countSliceUtils"
import {
  prepareDualResultsTableColumnGroups,
  prepareDualResultsTableColumns,
  prepareDualResultsTableRows,
  prepareSoloResultsTableColumnGroups,
  prepareSoloResultsTableColumns,
  prepareSoloResultsTableRows,
  prepareTeamResultsTableColumnGroups,
  prepareTeamResultsTableColumns,
  prepareTeamResultsTableRows,
} from "./countUtils"
/*




*/
export function ReviewBody() {
  const location = useLocation()
  const countUIState = useCountUI((state) => state)
  const path = location.pathname

  return (
    <ErrorBoundary
      componentName="ReviewBody"
      featurePath={path}
      state={{ featureUI: { ...countUIState } }}
    >
      <Fade>
        <Outer>
          <Body />
        </Outer>
      </Fade>
    </ErrorBoundary>
  )
}
/*




*/
function Outer({ children }: { children: React.ReactElement }) {
  const theme = useTheme()

  return (
    <Window padding={theme.module[0]} alignItems={"space-between"}>
      {children}
    </Window>
  )
}
/*




*/
function Body() {
  const isOrganiser = useAppSelector(selectIsUserOrganiser)

  return isOrganiser ? <OrganiserReviewBody /> : <CounterReviewBody />
}
/*




*/
function OrganiserReviewBody() {
  const theme = useTheme()

  return (
    <>
      <Stack height={"100%"} gap={theme.module[4]}>
        <ReviewResultsTable />
        <CounterSummary />
      </Stack>
      <ProceedMessage />
      <ReviewCompletionConirmation />
    </>
  )
}
/*




*/
function CounterReviewBody() {
  const isFinalizing = useAppSelector(selectIsOrganiserFinalizing)

  return (
    <Window justifyContent={"center"}>
      <Typography variant="h6">
        Organiser is {isFinalizing ? "finalizing" : "reviewing"} results
      </Typography>
    </Window>
  )
}
/*




*/
function CounterSummary() {
  const theme = useTheme()
  const results = useAppSelector(selectCountResults)!
  const counterUuids = useAppSelector(selectCountersUuidList)

  return (
    <Stack
      padding={theme.module[2]}
      boxSizing={"border-box"}
      borderRadius={theme.module[2]}
      boxShadow={theme.shadow.neo[1]}
      sx={{
        outline: `2px solid ${theme.scale.gray[7]}`,
      }}
    >
      <Stack
        gap={theme.module[0]}
        overflow={"scroll"}
        maxHeight={theme.module[8]}
      >
        {counterUuids.length ? (
          counterUuids.map((uuid) => {
            return (
              <CounterSummaryItem
                results={results[uuid]}
                uuid={uuid}
                key={uuid}
              />
            )
          })
        ) : (
          <Typography color={theme.scale.gray[5]} textAlign={"center"}>
            No data
          </Typography>
        )}
      </Stack>
    </Stack>
  )
}
/*




*/
function CounterSummaryItem({
  uuid,
  results,
}: {
  uuid: string
  results: CountMemberResultsProps
}) {
  const theme = useTheme()

  const members = useAppSelector(selectCountMembers) as CountMembersProps

  const countValue = `${_.keys(results).length} items`
  const name = getMemberShortName(members[uuid])
  const step = members[uuid].step
  const isCounting = members[uuid].isCounting
  const isDeclined = members[uuid].isDeclined

  const actionColors = {
    reviewing: theme.scale.green[6],
    counting: theme.scale.orange[6],
    away: theme.scale.gray[5],
    declined: theme.scale.red[5],
  }
  const action =
    step === "review" && isCounting
      ? "reviewing"
      : step === "stockCount" && isCounting
      ? "counting"
      : isDeclined
      ? "declined"
      : "away"
  const actionColor = actionColors[action]

  return (
    <Stack
      direction={"row"}
      padding={theme.module[1]}
      boxSizing={"border-box"}
      justifyContent={"space-between"}
    >
      <Stack
        direction={"row"}
        gap={theme.module[2]}
        alignItems={"center"}
        width={"7.25rem"}
      >
        <Icon
          variation={"profile"}
          fontSize={"small"}
          color={theme.scale.blue[6]}
        />
        <Typography textOverflow={"ellipsis"} noWrap variant={"body2"}>
          {name}
        </Typography>
      </Stack>
      <Stack
        direction={"row"}
        gap={theme.module[4]}
        justifyContent={"space-between"}
      >
        <Stack
          direction={"row"}
          width={"5.5rem"}
          gap={theme.module[2]}
          alignItems={"center"}
        >
          <Icon variation={"stock"} fontSize={"small"} />
          <Typography variant={"body2"}>{countValue}</Typography>
        </Stack>
        <Stack
          direction={"row"}
          width={"6rem"}
          gap={theme.module[2]}
          alignItems={"center"}
        >
          <Icon variation={"step"} fontSize={"small"} color={actionColor} />
          <Typography variant={"body2"} fontWeight={"bold"} color={actionColor}>
            {_.capitalize(action)}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  )
}
/*




*/
function ProceedMessage() {
  const theme = useTheme()
  const isStockCountCompleted = useAppSelector(selectIsStockCountCompleted)

  return (
    <Slot gap={theme.module[3]} paddingBottom={theme.module[3]}>
      <Icon variation={isStockCountCompleted ? "done" : "warning"} />
      <Typography variant={"body2"}>
        {isStockCountCompleted
          ? "Proceed to Finalization"
          : "Count still in progress"}
      </Typography>
    </Slot>
  )
}
/*




*/
function ReviewResultsTable() {
  const theme = useTheme()

  const results = useAppSelector(selectCountResults) as CountResultsProps
  const members = useAppSelector(selectOrgMembers) as MembersProps
  const countType = useAppSelector(selectCountType) as CountTypes
  const stock = useAppSelector(selectStock)

  const tableData = {
    solo: {
      rows: () => prepareSoloResultsTableRows(results, stock),
      columns: () => prepareSoloResultsTableColumns(),
      columnGroups: () => prepareSoloResultsTableColumnGroups(),
    },
    dual: {
      rows: () => prepareDualResultsTableRows(results, stock),
      columns: () => prepareDualResultsTableColumns(results),
      columnGroups: () => prepareDualResultsTableColumnGroups(results, members),
    },
    team: {
      rows: () => prepareTeamResultsTableRows(results, stock, members),
      columns: () => prepareTeamResultsTableColumns(),
      columnGroups: () => prepareTeamResultsTableColumnGroups(),
    },
  }

  const rows = tableData[countType].rows()
  const columns = tableData[countType].columns()
  const columnGroups = tableData[countType].columnGroups()

  return (
    <Stack
      borderRadius={theme.module[2]}
      height={"60%"}
      overflow={"hidden"}
      sx={{ outline: `2px solid ${theme.scale.gray[7]}` }}
    >
      <VirtualizedTable
        rows={rows}
        columns={columns}
        columnGroups={columnGroups}
      />
    </Stack>
  )
}
/*




*/
function ReviewCompletionConirmation() {
  const theme = useTheme()

  const isStartingFinalization = useCountUI(
    (state) => state.isStartingFinalization,
  )

  function handleAccept() {
    completeReview()
    setCountUI("isStartingFinalization", false)
  }

  function handleClose() {
    setCountUI("isStartingFinalization", false)
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

  const DISCLAIMER =
    "You are about to enter count finalization. You will not be able to go back to the review stage or change count results."
  const PROCEED_MESSAGE = "Are you sure you want to proceed?"

  return (
    <Modal
      open={isStartingFinalization}
      heading={"Finalization"}
      body={
        <Stack gap={theme.module[4]}>
          <Typography textAlign={"center"}>{DISCLAIMER}</Typography>
          <Typography textAlign={"center"}>{PROCEED_MESSAGE}</Typography>
        </Stack>
      }
      actions={actions}
      onClose={handleClose}
    />
  )
}
/*




*/
