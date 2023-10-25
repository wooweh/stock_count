import { Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useAppSelector } from "../../app/hooks"
import useTheme, { ThemeColors } from "../../common/useTheme"
import {
  calculateDuration,
  formatDuration,
  formatLongDate,
} from "../../common/utils"
import {
  Button,
  ToggleButtonGroup,
  ToggleButtonGroupOptionsProps,
} from "../../components/button"
import { PieChart, PieChartDataProps } from "../../components/chart"
import { downloadCSVTemplate } from "../../components/csvParser"
import VirtualizedTable from "../../components/table"
import {
  prepareSoloResultsTableColumns,
  prepareSoloResultsTableRows,
} from "../count/countUtils"
import {
  DataLineItem,
  DataLineItemProps,
  DataPill,
} from "../count/finalization"
import { MembersProps, selectOrgMembers } from "../org/orgSlice"
import { getMemberShortName, getMembersShortNames } from "../org/orgUtils"
import { selectStock } from "../stock/stockSlice"
import { HistoryUIState, setHistoryUI, useHistoryUI } from "./history"
import {
  HistoryItemCommentsProps,
  HistoryItemMetadataProps,
  HistoryItemProps,
  HistoryItemResultsProps,
  selectHistory,
} from "./historySlice"
/*




*/
export function Review() {
  const theme = useTheme()

  return (
    <Stack
      width={"100%"}
      height={"100%"}
      padding={`0 ${theme.module[2]}`}
      gap={theme.module[2]}
      boxSizing={"border-box"}
      overflow={"hidden"}
    >
      <Header />
      <Body />
      <ButtonTray />
    </Stack>
  )
}
/*




*/
function Header() {
  const theme = useTheme()

  return (
    <Stack
      width={"100%"}
      height={theme.module[6]}
      direction={"row"}
      flexShrink={0}
      justifyContent={"space-between"}
      alignItems={"center"}
      paddingLeft={theme.module[2]}
      boxSizing={"border-box"}
    >
      <Typography variant="h6" fontWeight={"bold"} color={theme.scale.gray[5]}>
        Count Review
      </Typography>
      <Button
        variation={"pill"}
        iconName={"cancel"}
        bgColor={theme.scale.gray[7]}
        onClick={() => setHistoryUI("reviewItemUuid", "")}
        iconSize={"small"}
        outlineColor={theme.scale.gray[6]}
        sx={{ padding: theme.module[3], boxShadow: theme.shadow.neo[3] }}
      />
    </Stack>
  )
}
/*




*/
function Body() {
  const theme = useTheme()

  const history = useAppSelector(selectHistory)

  const uuid = useHistoryUI((state: HistoryUIState) => state.reviewItemUuid)
  const sectionName = useHistoryUI(
    (state: HistoryUIState) => state.reviewSectionName,
  )

  const historyItem: HistoryItemProps = history[uuid]

  const sections = {
    details: <Details {...historyItem.metadata} />,
    comments: <Comments {...historyItem.comments} />,
    results: <Results {...historyItem.results} />,
  }

  return (
    <Stack
      width={"100%"}
      height={"100%"}
      gap={theme.module[2]}
      boxSizing={"border-box"}
      borderRadius={theme.module[3]}
      bgcolor={theme.scale.gray[9]}
      padding={theme.module[2]}
      sx={{
        outline: `1px solid ${theme.scale.gray[7]}`,
        outlineOffset: "-1px",
      }}
    >
      <Stack
        padding={theme.module[2]}
        boxSizing={"border-box"}
        borderRadius={`${theme.module[2]} ${theme.module[2]} 0 0`}
        bgcolor={theme.scale.gray[8]}
        sx={{
          outline: `1px solid ${theme.scale.gray[7]}`,
          outlineOffset: "-1px",
        }}
      >
        <Typography fontWeight={"bold"} textAlign={"center"}>
          {_.capitalize(sectionName)}
        </Typography>
      </Stack>
      <Stack width={"100%"} height={"100%"}>
        {sections[sectionName]}
      </Stack>
    </Stack>
  )
}
/*




*/
function Details(props: Required<HistoryItemMetadataProps>) {
  const theme = useTheme()

  return (
    <Stack
      width={"100%"}
      height={"100%"}
      paddingTop={theme.module[2]}
      boxSizing={"border-box"}
    >
      <DetailsList {...props} />
      <DurationChart {...props} />
    </Stack>
  )
}
/*




*/
function DetailsList(props: Required<HistoryItemMetadataProps>) {
  const members = useAppSelector(selectOrgMembers) as MembersProps

  const organizer = members[props.organiser]
  const counters = props.counters
  const countType = props.type
  const countDate = formatLongDate(props.countStartTime)
  const organizerName = getMemberShortName(organizer)
  const countersNames = getMembersShortNames(members, counters)
  const start = props.prepStartTime
  const end = props.finalSubmissionTime
  const totalDuration = calculateDuration(start, end)
  const durationLabel = formatDuration(totalDuration)

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
      label: "Organiser",
      iconName: "profile",
      data: <DataPill label={organizerName} color={"purple"} />,
    },
    {
      label: "Counters",
      iconName: "group",
      data: countersNames.map((name, index) => {
        return <DataPill label={name} key={index} color={"coral"} />
      }),
    },
    {
      label: "Duration",
      iconName: "time",
      data: <DataPill label={durationLabel} color={"green"} />,
    },
  ]

  return (
    <Stack width={"100%"}>
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

function DurationChart(props: Required<HistoryItemMetadataProps>) {
  const theme = useTheme()

  const prepStart = props.prepStartTime
  const countStart = props.countStartTime
  const reviewStart = props.reviewStartTime
  const finalStart = props.finalizationStartTime
  const finalEnd = props.finalSubmissionTime

  const prepDuration = calculateDuration(prepStart, countStart)
  const countDuration = calculateDuration(countStart, reviewStart)
  const reviewDuration = calculateDuration(reviewStart, finalStart)
  const finalizeDuration = calculateDuration(finalStart, finalEnd)

  const color = (color: ThemeColors) => theme.scale[color][6]

  const data: PieChartDataProps[] = [
    { name: "Prep", value: prepDuration, color: color("blue") },
    { name: "Count", value: countDuration, color: color("green") },
    { name: "Review", value: reviewDuration, color: color("gray") },
    { name: "Finalize", value: finalizeDuration, color: color("orange") },
  ]

  return <PieChart data={data} />
}
/*




*/
function Comments(props: HistoryItemCommentsProps) {
  const theme = useTheme()

  return (
    <Stack
      width={"100%"}
      height={"100%"}
      padding={theme.module[2]}
      boxSizing={"border-box"}
      gap={theme.module[4]}
    >
      <CommentBlock
        label="Preparation"
        color={theme.scale.blue[6]}
        comments={props.preparation}
      />
      <CommentBlock
        label="Finalization"
        color={theme.scale.orange[6]}
        comments={props.finalization}
      />
    </Stack>
  )
}
/*




*/
function CommentBlock({
  label,
  color,
  comments,
}: {
  label: string
  color: string
  comments: string[] | undefined
}) {
  const theme = useTheme()

  return (
    <Stack width={"100%"} padding={theme.module[2]} gap={theme.module[3]}>
      <Typography fontWeight={"bold"} color={color}>
        {label}
      </Typography>
      <Stack gap={theme.module[2]}>
        {!!comments ? (
          comments.map((comment, index) => (
            <Typography key={index}>{`${index + 1}. ${comment}`}</Typography>
          ))
        ) : (
          <Typography color={theme.scale.gray[5]}>No comments</Typography>
        )}
      </Stack>
    </Stack>
  )
}
/*




*/
function Results(props: Required<HistoryItemResultsProps>) {
  const theme = useTheme()

  const results = { results: props }
  const stock = useAppSelector(selectStock)

  const rows = prepareSoloResultsTableRows(results, stock)
  const columns = prepareSoloResultsTableColumns()

  return (
    <Stack width={"100%"} height={"100%"} justifyContent={"space-between"}>
      <VirtualizedTable rows={rows} columns={columns} />
      <Button
        variation={"modal"}
        label={"CSV Download"}
        iconName={"download"}
        outlineColor={theme.scale.gray[7]}
        bgColor={theme.scale.gray[8]}
        onClick={() => downloadCSVTemplate(rows)}
        sx={{ borderRadius: theme.module[2], boxShadow: "none" }}
      />
    </Stack>
  )
}
/*




*/
function ButtonTray() {
  const theme = useTheme()

  const handleClick = (section: string) => {
    setHistoryUI("reviewSectionName", section)
  }

  const options: ToggleButtonGroupOptionsProps[] = [
    {
      label: "Details",
      iconName: "list",
      onClick: () => handleClick("details"),
    },
    {
      label: "Comments",
      iconName: "comments",
      onClick: () => handleClick("comments"),
    },
    {
      label: "Resuls",
      iconName: "checklist",
      onClick: () => handleClick("results"),
    },
  ]

  return (
    <Stack
      width={"100%"}
      height={"min-content"}
      paddingTop={theme.module[3]}
      boxSizing={"border-box"}
    >
      <ToggleButtonGroup options={options} />
    </Stack>
  )
}
/*




*/
