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
  selectCountMembers,
  selectCountResults,
  selectIsStockCountCompleted,
} from "./countSlice"
import {
  prepareSoloResultsTableColumnGroups,
  prepareSoloResultsTableColumns,
  prepareSoloResultsTableRows,
} from "./countUtils"
/*





*/
export function ReviewBody() {
  const theme = useTheme()
  return (
    <Stack
      width={"100%"}
      height={"100%"}
      padding={theme.module[0]}
      alignItems={"space-between"}
      boxSizing={"border-box"}
    >
      <Stack height={"100%"} gap={theme.module[4]}>
        <ReviewResultsTable />
        <CounterSummary />
      </Stack>
      <ProceedMessage />
    </Stack>
  )
}
/*





*/
function CounterSummary() {
  const theme = useTheme()
  const results = useAppSelector(selectCountResults) as CountResultsProps
  const counterIds = _.keys(results)

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
        {counterIds.map((id) => {
          return <CounterSummaryItem id={id} results={results[id]} key={id} />
        })}
      </Stack>
    </Stack>
  )
}
/*





*/
function CounterSummaryItem({
  id,
  results,
}: {
  id: string
  results: CountMemberResultsProps
}) {
  const theme = useTheme()
  const members = useAppSelector(selectCountMembers) as CountMembersProps
  const countValue = `${_.keys(results).length} items`
  const nameInitial = members[id].name[0]
  const surname = members[id].surname
  const fullName = `${nameInitial}. ${surname}`
  const step = members[id].step
  const action =
    step === "review"
      ? "Reviewing"
      : step === "stockCount"
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
      justifyContent={"space-between"}
      padding={theme.module[1]}
      boxSizing={"border-box"}
    >
      <Stack direction={"row"} gap={theme.module[2]} alignItems={"center"}>
        <Icon
          variation={"profile"}
          fontSize={"small"}
          color={theme.scale.blue[6]}
        />
        <Typography variant={"body2"}>{fullName}</Typography>
      </Stack>
      <Stack direction={"row"} gap={theme.module[4]}>
        <Stack direction={"row"} gap={theme.module[2]} alignItems={"center"}>
          <Icon variation={"stock"} fontSize={"small"} />
          <Typography variant={"body2"}>{countValue}</Typography>
        </Stack>
        <Stack direction={"row"} gap={theme.module[2]} alignItems={"center"}>
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
  const stock = useAppSelector(selectStock)

  const rows = prepareSoloResultsTableRows(results, stock)
  const columns = prepareSoloResultsTableColumns()
  const columnGroups = prepareSoloResultsTableColumnGroups()

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
