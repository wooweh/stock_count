import { Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import Icon from "../../components/icon"
import VirtualizedTable from "../../components/table"
import { selectStock } from "../stock/stockSlice"
import {
  CountMemberResultsProps,
  CountMembersProps,
  CountResultsProps,
  CountTypes,
  selectCountMembers,
  selectCountResults,
  selectCountType,
  selectIsOrganiserFinalizing,
  selectIsStockCountCompleted,
  selectIsUserOnlyOrganiser,
  selectIsUserOrganiser,
} from "./countSlice"
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
  updateCountMetadata,
  updateCountStep,
} from "./countUtils"
import {
  MembersProps,
  selectOrgMembers,
} from "../org/orgSlice"
import { setUseCount, useCountStore } from "./count"
import Modal, { ModalActionProps } from "../../components/modal"
import { getTimeStamp } from "../../common/utils"
/*





*/
export function ReviewBody() {
  const theme = useTheme()

  const isOrganiser = useAppSelector(selectIsUserOrganiser)

  return (
    <Stack
      width={"100%"}
      height={"100%"}
      padding={theme.module[0]}
      alignItems={"space-between"}
      boxSizing={"border-box"}
      overflow={"hidden"}
    >
      {isOrganiser ? <OrganiserReviewBody /> : <CounterReviewBody />}
    </Stack>
  )
}
/*





*/
function OrganiserReviewBody() {
  const theme = useTheme()
  return (
    <>
      <Stack height={"95%"} gap={theme.module[4]} flexShrink={0}>
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
    <Stack
      width={"100%"}
      height={"100%"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Typography variant="h6">
        Organiser is {isFinalizing ? "finalizing" : "reviewing"} results
      </Typography>
    </Stack>
  )
}
/*





*/
function CounterSummary() {
  const theme = useTheme()
  const results = useAppSelector(selectCountResults) as CountResultsProps
  const counterUuids = _.keys(results)

  return (
    <Stack
      padding={theme.module[2]}
      boxSizing={"border-box"}
      borderRadius={theme.module[2]}
      boxShadow={theme.shadow.neo[1]}
      sx={{
        outline: `1px solid ${theme.scale.gray[7]}`,
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
                uuid={uuid}
                results={results[uuid]}
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
  const nameInitial = members[uuid].name[0]
  const surname = members[uuid].surname
  const fullName = `${nameInitial}. ${surname}`
  const step = members[uuid].step
  const isCounting = members[uuid].isCounting

  const action =
    step === "review" && isCounting
      ? "Reviewing"
      : step === "stockCount" && isCounting
      ? "Counting"
      : "Away"
  const actionColors = {
    Reviewing: theme.scale.green[6],
    Counting: theme.scale.orange[6],
    Away: theme.scale.red[6],
  }
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
        <Typography variant={"body2"}>{fullName}</Typography>
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
            {action}
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
    <Stack
      direction={"row"}
      gap={theme.module[3]}
      justifyContent={"center"}
      alignItems={"center"}
      paddingBottom={theme.module[3]}
      boxSizing={"border-box"}
    >
      <Icon variation={isStockCountCompleted ? "done" : "warning"} />
      <Typography variant={"body2"}>
        {isStockCountCompleted
          ? "Proceed to Finalization"
          : "Count still in progress"}
      </Typography>
    </Stack>
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
  console.log(countType)

  return (
    <Stack
      borderRadius={theme.module[2]}
      height={"60%"}
      overflow={"hidden"}
      sx={{ outline: `2px solid ${theme.scale.blue[9]}` }}
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

  const isStartingFinalization = useCountStore(
    (state: any) => state.isStartingFinalization,
  )

  function handleAccept() {
    updateCountMetadata({ finalizationStartTime: getTimeStamp() })
    updateCountStep("finalization", true)
    handleClose()
  }

  function handleClose() {
    setUseCount("isStartingFinalization", false)
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
      open={isStartingFinalization}
      heading={"Finalization"}
      body={
        <Stack gap={theme.module[4]}>
          <Typography textAlign={"center"}>
            You are about to enter count finalization. You will not be able to
            go back to the review stage or change count results.
          </Typography>
          <Typography textAlign={"center"}>
            Are you sure you want to proceed?
          </Typography>
        </Stack>
      }
      actions={actions}
      onClose={handleClose}
    />
  )
}
/*





*/
