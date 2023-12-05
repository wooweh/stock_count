import { Divider, Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useEffect, useMemo } from "react"
import { useAppSelector } from "../../app/hooks"
import useTheme, { ThemeColors } from "../../common/useTheme"
import { Button } from "../../components/button"
import { Select, SelectOptionProps } from "../../components/control"
import Icon, { IconNames } from "../../components/icon"
import { List } from "../../components/list"
import { ListItem } from "../../components/listItem"
import Modal, { ModalActionProps } from "../../components/modal"
import { Slot } from "../../components/surface"
import { generateCustomNotification } from "../core/coreUtils"
import { MemberProps, MembersProps } from "../org/orgSlice"
import { selectOrgMembers } from "../org/orgSliceSelectors"
import { getMemberName, getMemberShortName } from "../org/orgUtils"
import {
  CountUIState,
  addCountUIArrayItem,
  addCountUIKeyValuePair,
  removeCountUIArrayItem,
  removeCountUIKeyValuePair,
  removeCountUIKeyValuePairValue,
  setCountUI,
  useCountUI,
} from "./count"
import { CountTypes } from "./countSlice"
import {
  selectAvailableCountersList,
  selectCountMembersCountValueList,
  selectCountersList,
  selectCountersUuidList,
} from "./countSliceSelectors"
import { DataPill } from "./finalization"
import { CountTypeToggleButtons, WarningBox } from "./setup"
/*




*/
export function ManageCount() {
  return (
    <Outer>
      <Header />
      <Body />
      <UpdateCountButton />
      <UpdateCountConfirmation />
      <AddTempMembers />
    </Outer>
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
    <Stack
      gap={theme.module[4]}
      height={"100%"}
      bgcolor={theme.scale.gray[8]}
      position={"relative"}
    >
      {children}
    </Stack>
  )
}
/*




*/
function Header() {
  const theme = useTheme()
  return (
    <Stack>
      <Stack
        width={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        position={"relative"}
        direction={"row"}
      >
        <Stack direction={"row"} gap={theme.module[3]} alignItems={"center"}>
          <Icon variation={"settings"} />
          <Typography variant="h6">Manage Count</Typography>
        </Stack>
        <Stack
          width={"100%"}
          position={"absolute"}
          right={0}
          alignItems={"flex-end"}
        >
          <Button
            variation={"pill"}
            iconName={"cancel"}
            bgColor={theme.scale.gray[9]}
            onClick={() => setCountUI("isManagingCount", false)}
            iconSize={"small"}
            outlineColor={theme.scale.red[7]}
            sx={{ padding: theme.module[3], boxShadow: theme.shadow.neo[3] }}
          />
        </Stack>
      </Stack>
    </Stack>
  )
}
/*




*/
function Body() {
  const theme = useTheme()
  return (
    <Stack width={"100%"} gap={theme.module[5]}>
      <CountType />
      <CountTeam />
    </Stack>
  )
}
/*




*/
function CountType() {
  const theme = useTheme()
  return (
    <Stack width={"100%"} gap={theme.module[3]}>
      <Typography variant="h6">Count Type</Typography>
      <CountTypeToggleButtons />
    </Stack>
  )
}
/*




*/
type ActionProps = { action: string; color: ThemeColors }
function CountTeam() {
  const theme = useTheme()

  return (
    <Stack width={"100%"} gap={theme.module[3]}>
      <Slot justifyContent={"space-between"}>
        <Typography variant="h6">Count Team</Typography>
        <AddMembersButton />
      </Slot>
      <CountTeamDescription />
      <Stack maxHeight={"20rem"} overflow={"scroll"} gap={theme.module[3]}>
        <CountTeamControls />
        <Transfers />
      </Stack>
    </Stack>
  )
}
/*




*/
function CountTeamDescription() {
  const theme = useTheme()

  function Action(props: ActionProps) {
    return (
      <span style={{ color: theme.scale[props.color][5], fontWeight: "bold" }}>
        {props.action}
      </span>
    )
  }
  return (
    <Typography variant="body2" color={theme.scale.gray[4]}>
      <Action action={"Add"} color={"blue"} /> or{" "}
      <Action action={"remove"} color={"red"} /> counters and{" "}
      <Action action={"transfer"} color={"yellow"} /> counters{" "}
      <Action action={"results"} color={"green"} /> to another counter.
    </Typography>
  )
}
/*




*/
function CountTeamControls() {
  const theme = useTheme()

  return (
    <Slot direction={"column"} gap={theme.module[2]}>
      <ControlsHeader />
      <ControlsBody />
    </Slot>
  )
}
/*




*/

function ControlsHeader() {
  const theme = useTheme()
  const countType = useCountUI((state: CountUIState) => state.tempCountType)

  const leftIconName: IconNames =
    countType === "solo" ? "profile" : countType === "dual" ? "dual" : "group"
  const rightIcons: { name: IconNames; color: ThemeColors }[] = [
    { name: "list", color: "green" },
    { name: "delete", color: "red" },
    { name: "transfer", color: "yellow" },
  ]

  return (
    <CountTeamSlot
      left={
        <Slot width={"min-content"}>
          <Icon variation={leftIconName} />
          <Typography fontWeight={"bold"}>Counters</Typography>
        </Slot>
      }
      right={
        <CountTeamRightSlot>
          {rightIcons.map((icon) => (
            <Icon
              variation={icon.name}
              key={icon.name}
              color={theme.scale[icon.color][6]}
            />
          ))}
        </CountTeamRightSlot>
      }
    />
  )
}
/*




*/
function ControlsBody() {
  const theme = useTheme()
  const countMembers = useAppSelector(selectCountMembersCountValueList)
  const orgMembers = useAppSelector(selectOrgMembers) as MembersProps
  const tempAddedMemberUuids = useCountUI(
    (state: CountUIState) => state.tempAddedMemberUuids,
  )

  return (
    <Slot
      bgcolor={theme.scale.gray[9]}
      borderRadius={theme.module[2]}
      direction={"column"}
      gap={theme.module[0]}
    >
      {countMembers.map((member) => (
        <TeamMemberControls
          key={member.name}
          uuid={member.uuid}
          name={member.name}
          count={member.count}
        />
      ))}
      {!!tempAddedMemberUuids.length &&
        tempAddedMemberUuids.map((memberUuid) => (
          <TempAddedMemberControls
            name={getMemberShortName(orgMembers?.[memberUuid])}
            uuid={orgMembers?.[memberUuid].uuid}
            key={getMemberShortName(orgMembers?.[memberUuid])}
          />
        ))}
    </Slot>
  )
}
/*




*/
type TeamMemberControlsProps = {
  uuid: string
  name: string
  count: number
}
function TeamMemberControls(props: TeamMemberControlsProps) {
  const theme = useTheme()

  const tempRemovedMemberUuids = useCountUI(
    (state: CountUIState) => state.tempRemovedMemberUuids,
  )
  const tempResultsTransfers = useCountUI(
    (state: CountUIState) => state.tempResultsTransfers,
  )

  const isRemoved = useMemo(
    () => tempRemovedMemberUuids.includes(props.uuid),
    [props.uuid, tempRemovedMemberUuids],
  )
  const isTransferred = useMemo(
    () => _.keys(tempResultsTransfers).includes(props.uuid),
    [props.uuid, tempResultsTransfers],
  )

  console.log(isRemoved)
  console.log(isTransferred)

  function handleToggleDelete() {
    if (isRemoved) {
      removeCountUIArrayItem("tempRemovedMemberUuids", props.uuid)
      if (isTransferred) {
        removeCountUIKeyValuePair("tempResultsTransfers", props.uuid)
      }
    } else {
      addCountUIArrayItem("tempRemovedMemberUuids", props.uuid)
    }
  }

  function handleToggleTransfer() {
    if (isTransferred) {
      removeCountUIKeyValuePair("tempResultsTransfers", props.uuid)
    } else {
      addCountUIKeyValuePair("tempResultsTransfers", { [props.uuid]: "" })
      if (!isRemoved) {
        addCountUIArrayItem("tempRemovedMemberUuids", props.uuid)
      }
    }
  }

  return (
    <>
      <CountTeamSlot
        left={<Typography fontWeight={"bold"}>{props.name}</Typography>}
        right={
          <CountTeamRightSlot>
            <Typography color={theme.scale.green[6]} fontWeight={"bold"}>
              {props.count}
            </Typography>
            <Button
              variation={"pill"}
              iconName={isRemoved ? "checked" : "unchecked"}
              iconColor={theme.scale.red[6]}
              onClick={handleToggleDelete}
            />
            <Button
              variation={"pill"}
              iconName={isTransferred ? "checked" : "unchecked"}
              iconColor={theme.scale.yellow[6]}
              onClick={handleToggleTransfer}
            />
          </CountTeamRightSlot>
        }
      />
      <Divider
        sx={{
          width: "100%",
          borderColor: theme.scale.gray[7],
        }}
      />
    </>
  )
}
/*




*/
function TempAddedMemberControls({
  name,
  uuid,
}: {
  name: string
  uuid: string
}) {
  const theme = useTheme()

  function handleDelete() {
    removeCountUIArrayItem("tempAddedMemberUuids", uuid)
    removeCountUIKeyValuePairValue("tempResultsTransfers", uuid)
  }

  return (
    <>
      <CountTeamSlot
        bgColor={theme.scale.gray[9]}
        borderRadius={theme.module[2]}
        left={<Typography fontWeight={"bold"}>{name}</Typography>}
        right={
          <CountTeamRightSlot>
            <Typography
              variant="body2"
              color={theme.scale.blue[6]}
              fontWeight={"bold"}
            >
              Added
            </Typography>
            <Button
              variation={"pill"}
              iconName="delete"
              onClick={handleDelete}
            />
          </CountTeamRightSlot>
        }
      />
      <Divider
        sx={{
          width: "100%",
          borderColor: theme.scale.gray[7],
        }}
      />
    </>
  )
}
/*




*/
type CountTeamControlSlotProps = {
  left: React.ReactElement
  right: React.ReactElement
  bgColor?: string
  borderRadius?: string
  sx?: any
}
function CountTeamSlot(props: CountTeamControlSlotProps) {
  const theme = useTheme()
  return (
    <Slot
      justifyContent={"space-between"}
      bgcolor={props.bgColor ?? "none"}
      borderRadius={props.borderRadius}
      padding={`${theme.module[2]} ${theme.module[3]}`}
      sx={props.sx}
    >
      {props.left}
      {props.right}
    </Slot>
  )
}
/*




*/
function CountTeamRightSlot({ children }: { children: React.ReactElement[] }) {
  const theme = useTheme()
  return (
    <Stack
      direction={"row"}
      width={"50%"}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      {children.map((child, index) => (
        <Stack width={theme.module[6]} alignItems={"center"} key={index}>
          {child}
        </Stack>
      ))}
    </Stack>
  )
}
/*




*/
function AddMembersButton() {
  const theme = useTheme()

  function handleAdd() {
    setCountUI("isAddingTempMembers", true)
  }

  return (
    <Button
      variation={"pill"}
      onClick={handleAdd}
      iconName={"addMembers"}
      label="Add"
      bgColor={theme.scale.gray[9]}
      outlineColor={theme.scale.blue[7]}
      color={theme.scale.blue[5]}
      iconColor={theme.scale.blue[6]}
      justifyCenter
      sx={{ padding: `${theme.module[2]} ${theme.module[4]}` }}
    />
  )
}
/*




*/
function AddTempMembers() {
  const availableMembers = useAppSelector(selectAvailableCountersList)
  const countMembers = useAppSelector(selectCountersList)

  const countType = useCountUI((state: CountUIState) => state.tempCountType)
  const isAddingTempMembers = useCountUI(
    (state: CountUIState) => state.isAddingTempMembers,
  )
  const selectedMemberUuids = useCountUI(
    (state: any) => state.selectedMemberUuids,
  )
  const tempAddedMemberUuids = useCountUI(
    (state: any) => state.tempAddedMemberUuids,
  )
  const tempRemovedMemberUuids = useCountUI(
    (state: any) => state.tempRemovedMemberUuids,
  )
  const tempResultsTransfers = useCountUI(
    (state: any) => state.tempResultsTransfers,
  )

  const availableTempMembers = _.remove(
    [...availableMembers],
    (member: MemberProps) => !tempAddedMemberUuids.includes(member.uuid),
  )
  const totalPotentialMembers =
    countMembers.length +
    selectedMemberUuids.length +
    tempAddedMemberUuids.length -
    tempRemovedMemberUuids.length

  //TODO: Refactor into Count utils function to reuse in Manage feature
  const counterRequirements = {
    solo: {
      isMet: totalPotentialMembers === 1,
      verbose: "1 Counter",
    },
    dual: {
      isMet: totalPotentialMembers === 2,
      verbose: "2 Counters",
    },
    team: {
      isMet: totalPotentialMembers > 1,
      verbose: "At least 2 Counters",
    },
  }
  const requirement = counterRequirements[countType]
  const isRequirementMet = requirement.isMet
  const verbose = requirement.verbose
  const warningMessage = `${verbose} required for ${countType} count.`

  useEffect(() => {
    setCountUI("isCounterRequirementMet", isRequirementMet)
  }, [isRequirementMet])

  function handleClose() {
    setCountUI("selectedMemberUuids", [])
    setCountUI("isAddingTempMembers", false)
  }
  function handleAccept() {
    if (isRequirementMet) {
      handleClose()
      _.delay(
        () => setCountUI("tempAddedMemberUuids", selectedMemberUuids),
        150,
      )
    } else {
      generateCustomNotification("warning", warningMessage)
    }
  }

  const modalActions: ModalActionProps[] = [
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
      open={isAddingTempMembers}
      heading={"Add Counters"}
      body={
        !availableTempMembers.length ? (
          <Typography>No additional members available.</Typography>
        ) : (
          <MembersList
            isRequirementMet={isRequirementMet}
            warningMessage={warningMessage}
          />
        )
      }
      actions={modalActions}
      onClose={handleClose}
    />
  )
}
/*




*/
function MembersList({
  isRequirementMet,
  warningMessage,
}: {
  isRequirementMet: boolean
  warningMessage: string
}) {
  const availableMembers = useAppSelector(selectAvailableCountersList)

  const countType: CountTypes = useCountUI(
    (state: CountUIState) => state.tempCountType,
  )
  const selectedMemberUuids = useCountUI(
    (state: any) => state.selectedMemberUuids,
  )
  const tempAddedMemberUuids = useCountUI(
    (state: any) => state.tempAddedMemberUuids,
  )

  const availableMembersToAdd = _.remove(
    [...availableMembers],
    (member: MemberProps) => !tempAddedMemberUuids.includes(member.uuid),
  )
  const isTeamCount = countType === "team"

  return (
    <List>
      {availableMembersToAdd.map((member: MemberProps) => {
        const name = getMemberName(member)
        const isSelected = selectedMemberUuids.includes(member.uuid)
        const memberUuid = member.uuid

        function handleChange() {
          isSelected
            ? removeCountUIArrayItem("selectedMemberUuids", memberUuid)
            : isRequirementMet && !isTeamCount
            ? generateCustomNotification("warning", warningMessage)
            : addCountUIArrayItem("selectedMemberUuids", memberUuid)
        }

        return (
          <ListItem
            label={name}
            primarySlot={
              <Icon variation={isSelected ? "checked" : "unchecked"} />
            }
            onChange={handleChange}
            tappable
            key={name}
          />
        )
      })}
    </List>
  )
}
/*




*/
function Transfers() {
  const theme = useTheme()

  return (
    <Stack width={"100%"} gap={theme.module[3]}>
      <TransfersHeader />
      <TransfersBody />
    </Stack>
  )
}
/*




*/
function TransfersHeader() {
  const theme = useTheme()

  return (
    <Slot
      borderRadius={theme.module[2]}
      padding={`${theme.module[2]} ${theme.module[3]}`}
      gap={theme.module[3]}
    >
      <Icon variation={"transfer"} />
      <Typography fontWeight={"bold"}>Transfers</Typography>
    </Slot>
  )
}
/*




*/
function TransfersBody() {
  const theme = useTheme()
  const members = useAppSelector(selectOrgMembers)
  const currentCountersUuids = useAppSelector(selectCountersUuidList)

  const tempRemovedMemberUuids = useCountUI(
    (state: CountUIState) => state.tempRemovedMemberUuids,
  )
  const tempAddedMemberUuids = useCountUI(
    (state: CountUIState) => state.tempAddedMemberUuids,
  )
  const transferMembersUuids = useCountUI(
    (state: CountUIState) => state.tempResultsTransfers,
  )
  const availableMemberUuidsToTransferTo = _.remove(
    _.uniq([...currentCountersUuids, ...tempAddedMemberUuids]),
    (memberUuid) => !tempRemovedMemberUuids.includes(memberUuid),
  )

  const transferUuidsList = getTransferUuidsList()

  function getTransferUuidsList() {
    const list: string[][] = []
    _.forIn(transferMembersUuids, (value, key) => list.push([key, value]))
    return list
  }

  return (
    <Slot
      maxHeight={theme.module[9]}
      overflow={"scroll"}
      bgcolor={theme.scale.gray[9]}
      borderRadius={theme.module[2]}
      direction={"column"}
      gap={theme.module[0]}
    >
      {!!members &&
        transferUuidsList.map((uuidPair, index) => {
          return (
            <TransferControl
              key={index}
              fromMemberUuid={uuidPair[0]}
              toMemberUuid={uuidPair[1]}
              availableMemberUuids={availableMemberUuidsToTransferTo}
            />
          )
        })}
    </Slot>
  )
}
/*




*/
type TransferControlProps = {
  fromMemberUuid: string
  toMemberUuid: string
  availableMemberUuids: string[]
}
function TransferControl(props: TransferControlProps) {
  const theme = useTheme()
  const members = useAppSelector(selectOrgMembers) as MembersProps
  const fromShortName = getMemberShortName(members[props.fromMemberUuid])
  const toShortName = props.toMemberUuid
    ? getMemberShortName(members[props.toMemberUuid])
    : ""

  const options: SelectOptionProps[] = _.map(
    props.availableMemberUuids,
    (uuid) => ({
      label: getMemberShortName(members[uuid]),
      value: uuid,
    }),
  )

  function handleMemberSelect(value: string) {
    const toMemberUuid = value ?? ""
    addCountUIKeyValuePair("tempResultsTransfers", {
      [props.fromMemberUuid]: toMemberUuid,
    })
  }

  return (
    <CountTeamSlot
      bgColor={theme.scale.gray[9]}
      borderRadius={theme.module[2]}
      left={
        <Stack width={"35%"}>
          <Typography
            width={"100%"}
            fontWeight={"bold"}
            whiteSpace={"nowrap"}
            overflow={"hidden"}
            textOverflow={"ellipsis"}
          >
            {fromShortName}
          </Typography>
        </Stack>
      }
      right={
        <Stack
          width={"65%"}
          flexShrink={1}
          direction={"row"}
          gap={theme.module[4]}
          alignItems={"center"}
          justifyContent={"flex-end"}
          padding={`${theme.module[2]} 0`}
        >
          <Icon variation={"transfer"} />
          <Select
            value={toShortName}
            placeholder="Select recipient"
            options={options}
            onChange={handleMemberSelect}
            sx={{ width: "10rem" }}
          />
        </Stack>
      }
    />
  )
}
/*




*/
function UpdateCountButton() {
  const theme = useTheme()

  const isCounterRequirement = useCountUI(
    (state: CountUIState) => state.isCounterRequirementMet,
  )

  return (
    <Stack
      justifyContent={"flex-end"}
      height={"100%"}
      width={"100%"}
      flexShrink={1}
    >
      <WarningBox />
      <Button
        variation={"profile"}
        onClick={() => setCountUI("isUpdatingCount", true)}
        iconName={"done"}
        label="Update Count"
        color={theme.scale.green[6]}
        outlineColor={theme.scale.green[7]}
        disabled={!isCounterRequirement}
        justifyCenter
      />
    </Stack>
  )
}
/*




*/
function UpdateCountConfirmation() {
  const theme = useTheme()
  const isUpdatingCount = useCountUI(
    (state: CountUIState) => state.isUpdatingCount,
  )
  return (
    <Modal
      open={isUpdatingCount}
      heading="Update Count"
      body={<UpdateCountConfirmationBody />}
      actions={[
        {
          iconName: "cancel",
          handleClick: () => setCountUI("isUpdatingCount", false),
        },
        {
          iconName: "done",
          //TODO: Update count function
          handleClick: () => null,
        },
      ]}
      onClose={() => setCountUI("isUpdatingCount", false)}
    />
  )
}
/*




*/
function UpdateCountConfirmationBody() {
  const theme = useTheme()

  const addedUuids = useCountUI(
    (state: CountUIState) => state.tempAddedMemberUuids,
  )
  const removedUuids = useCountUI(
    (state: CountUIState) => state.tempRemovedMemberUuids,
  )
  const transferUuids = useCountUI(
    (state: CountUIState) => state.tempResultsTransfers,
  )

  const summaryProps = { addedUuids, removedUuids, transferUuids }

  console.log(summaryProps)

  return (
    <Stack width={"100%"} gap={theme.module[3]}>
      <Typography textAlign={"center"}>
        You are about to update the count. Confirm your changes before
        proceeding.
      </Typography>
      <Typography
        fontWeight={"bold"}
        color={theme.scale.blue[6]}
        textAlign={"center"}
      >
        Change Summary:
      </Typography>
      <ChangeSummary {...summaryProps} />
    </Stack>
  )
}
/*




*/
type SummaryProps = {
  addedUuids: string[]
  removedUuids: string[]
  transferUuids: { [key: string]: string }
}
function ChangeSummary(props: SummaryProps) {
  const theme = useTheme()
  const members = useAppSelector(selectOrgMembers) as MembersProps

  function Title({
    children,
    color,
    icon,
  }: {
    children: string
    color: ThemeColors
    icon: IconNames
  }) {
    return (
      <Slot gap={theme.module[3]}>
        <Icon variation={icon} color={theme.scale[color][6]} />
        <Typography color={theme.scale[color][5]} fontWeight={"bold"}>
          {_.capitalize(children)}
        </Typography>
      </Slot>
    )
  }

  return (
    <Stack
      gap={theme.module[3]}
      bgcolor={theme.scale.gray[8]}
      borderRadius={theme.module[2]}
      padding={theme.module[4]}
      boxShadow={theme.shadow.neo[1]}
      sx={{ outline: `1px solid ${theme.scale.gray[6]}` }}
    >
      <Stack gap={theme.module[2]}>
        <Title icon={"addMembers"} color={"green"}>
          Added:
        </Title>
        <Slot overflow={"scroll"} gap={theme.module[3]}>
          {_.map(props.addedUuids, (uuid) => (
            <DataPill key={uuid} label={getMemberShortName(members[uuid])} />
          ))}
        </Slot>
      </Stack>
      <Stack gap={theme.module[2]}>
        <Title icon={"delete"} color={"red"}>
          Removed:
        </Title>
        <Slot overflow={"scroll"} gap={theme.module[3]}>
          {_.map(props.removedUuids, (uuid) => (
            <DataPill key={uuid} label={getMemberShortName(members[uuid])} />
          ))}
        </Slot>
      </Stack>
      <Stack gap={theme.module[2]}>
        <Title icon={"transfer"} color={"yellow"}>
          Transferred:
        </Title>
        {_.toPairs(props.transferUuids).map(([key, value]) => (
          <Slot gap={theme.module[3]} key={key}>
            <DataPill key={key} label={getMemberShortName(members[key])} />
            <Typography fontWeight={"bold"}>to</Typography>
            <DataPill
              key={value}
              label={
                !!members[value]
                  ? getMemberShortName(members[value])
                  : "None selected"
              }
            />
          </Slot>
        ))}
        <Slot overflow={"scroll"}></Slot>
      </Stack>
    </Stack>
  )
}
/*




*/
