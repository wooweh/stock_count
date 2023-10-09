import { Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { calculateDuration, formatLongDate } from "../../common/utils"
import {
  Button,
  ToggleButtonGroup,
  ToggleButtonGroupOptionsProps,
} from "../../components/button"
import {
  DataLineItem,
  DataLineItemProps,
  DataPill,
} from "../count/finalization"
import {
  MembersProps,
  selectOrgMembers,
} from "../organisation/organisationSlice"
import { UseHistoryState, setUseHistory, useHistoryStore } from "./history"
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
        onClick={() => setUseHistory("reviewItemUuid", "")}
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

  const uuid = useHistoryStore((state: UseHistoryState) => state.reviewItemUuid)
  const sectionName = useHistoryStore(
    (state: UseHistoryState) => state.reviewSectionName,
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
      boxShadow={theme.shadow.neo[2]}
      overflow={"hidden"}
      bgcolor={theme.scale.gray[9]}
      padding={theme.module[2]}
    >
      <Stack
        padding={theme.module[2]}
        boxSizing={"border-box"}
      >
        <Typography fontWeight={"bold"} textAlign={"center"}>
          {_.capitalize(sectionName)}
        </Typography>
      </Stack>
      {sections[sectionName]}
    </Stack>
  )
}
/*




*/
function Details(props: Required<HistoryItemMetadataProps>) {
  const theme = useTheme()

  const members = useAppSelector(selectOrgMembers) as MembersProps
  const organizer = members[props.organiser]

  const countDate = formatLongDate(props.countStartTime)
  const countType = props.type
  const organizerName = `${organizer.name[0]}. ${organizer.surname}`
  const countersNames = props.counters.map(
    (uuid) => `${members[uuid].name[0]}. ${members[uuid].surname}`,
  )
  const prepDuration = calculateDuration(
    props.prepStartTime,
    props.countStartTime,
  )
  const countDuration = calculateDuration(
    props.countStartTime,
    props.reviewStartTime,
  )
  const reviewDuration = calculateDuration(
    props.reviewStartTime,
    props.finalizationStartTime,
  )
  const finalizationDuration = calculateDuration(
    props.finalizationStartTime,
    props.finalSubmissionTime,
  )
  const totalDuration = calculateDuration(
    props.prepStartTime,
    props.finalSubmissionTime,
  )

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
      data: <DataPill label={countDuration} color={"green"} />,
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
function Comments(props: HistoryItemCommentsProps) {
  const theme = useTheme()
  return <Stack></Stack>
}
/*




*/
function Results(props: Required<HistoryItemResultsProps>) {
  const theme = useTheme()
  return <Stack></Stack>
}
/*




*/
function ButtonTray() {
  const theme = useTheme()

  const options: ToggleButtonGroupOptionsProps[] = [
    {
      label: "Details",
      iconName: "list",
      onClick: () => setUseHistory("reviewSectionName", "details"),
    },
    {
      label: "Comments",
      iconName: "copy",
      onClick: () => setUseHistory("reviewSectionName", "comments"),
    },
    {
      label: "Resuls",
      iconName: "checklist",
      onClick: () => setUseHistory("reviewSectionName", "results"),
    },
  ]

  return (
    <Stack width={"100%"} paddingTop={theme.module[3]} boxSizing={"border-box"}>
      <ToggleButtonGroup options={options} />
    </Stack>
  )
}
/*




*/
