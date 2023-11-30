import { Divider, Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useEffect, useState } from "react"
import { useAppSelector } from "../../app/hooks"
import useTheme, { ThemeColors } from "../../common/useTheme"
import { Button } from "../../components/button"
import { Select } from "../../components/control"
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
import { CountTypeToggleButtons, WarningBox } from "./setup"
/*




*/
export function ManageCount() {
  return (
    <Outer>
      <Header />
      <Body />
      <UpdateCountButton />
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
      gap={theme.module[5]}
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
      <WarningBox />
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
      <Typography variant="h6">Count Team</Typography>
      <CountTeamDescription />
      <CountTeamControls />
      <AddMembersButton />
      <Transfers />
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
      You can <Action action={"add"} color={"blue"} /> or{" "}
      <Action action={"remove"} color={"red"} /> team members as well as{" "}
      <Action action={"transfer"} color={"yellow"} /> removed members count{" "}
      <Action action={"results"} color={"green"} /> to another team member.
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
      bgColor={theme.scale.gray[9]}
      borderRadius={theme.module[2]}
      left={<Icon variation={leftIconName} />}
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
      sx={{
        outline: `2px solid ${theme.scale.gray[7]}`,
      }}
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
      maxHeight={theme.module[9]}
      overflow={"scroll"}
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

  const [isDeleteToggled, setIsDeleteToggled] = useState(false)
  const [isTransferToggled, setIsTransferToggled] = useState(false)

  useEffect(() => {
    if (isDeleteToggled) {
      addCountUIArrayItem("tempRemovedMemberUuids", props.uuid)
    } else {
      setIsTransferToggled(false)
      removeCountUIArrayItem("tempRemovedMemberUuids", props.uuid)
    }
  }, [isDeleteToggled])

  useEffect(() => {
    if (isTransferToggled) {
      setIsDeleteToggled(true)
      addCountUIKeyValuePair("tempResultsTransfers", { [props.uuid]: "" })
    } else {
      removeCountUIKeyValuePair("tempResultsTransfers", props.uuid)
    }
  }, [isTransferToggled])

  function handleToggleDelete() {
    setIsDeleteToggled(!isDeleteToggled)
  }

  function handleToggleTransfer() {
    setIsTransferToggled(!isTransferToggled)
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
              iconName={isDeleteToggled ? "checked" : "unchecked"}
              iconColor={theme.scale.red[6]}
              onClick={handleToggleDelete}
            />
            <Button
              variation={"pill"}
              iconName={isTransferToggled ? "checked" : "unchecked"}
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
      label="Add Members"
      bgColor={theme.scale.gray[9]}
      outlineColor={theme.scale.blue[7]}
      color={theme.scale.blue[5]}
      iconColor={theme.scale.blue[6]}
      justifyCenter
      sx={{ padding: theme.module[3] }}
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

  const availableTempMembers = _.remove(
    [...availableMembers],
    (member: MemberProps) => !tempAddedMemberUuids.includes(member.uuid),
  )
  const totalPotentialMembers =
    countMembers.length +
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
      setCountUI("isAddingTempMembers", false)
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
      bgcolor={theme.scale.gray[9]}
      borderRadius={theme.module[2]}
      padding={`${theme.module[2]} ${theme.module[3]}`}
      gap={theme.module[3]}
      sx={{ outline: `2px solid ${theme.scale.gray[7]}` }}
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
  const availableMembers = useAppSelector(selectAvailableCountersList)
  const currentCountersUuidList = useAppSelector(selectCountersUuidList)

  const countType: CountTypes = useCountUI(
    (state: CountUIState) => state.tempCountType,
  )
  const tempRemovedMemberUuids = useCountUI(
    (state: CountUIState) => state.tempRemovedMemberUuids,
  )
  const tempAddedMemberUuids = useCountUI(
    (state: CountUIState) => state.tempAddedMemberUuids,
  )

  const transferMembersUuids = useCountUI(
    (state: CountUIState) => state.tempResultsTransfers,
  )
  const availableMembersToTransferTo = _.remove(
    _.values(members),
    (member: MemberProps) =>
      (currentCountersUuidList.includes(member.uuid) ||
        tempAddedMemberUuids.includes(member.uuid)) &&
      !tempRemovedMemberUuids.includes(member.uuid),
  )

  const transferUuidsList = getTransferUuidsList()

  function getTransferUuidsList() {
    const list: string[][] = []
    _.forIn(transferMembersUuids, (value, key) => list.push([key, value]))
    return list
  }

  return (
    <Stack width={"100%"} gap={theme.module[0]}>
      {!!members &&
        transferUuidsList.map((uuidPair, index) => {
          const shortName = getMemberShortName(members[uuidPair[0]])
          return (
            <TransferControl
              key={index}
              memberShortName={shortName}
              memberUuid={uuidPair[0]}
              availableMembers={availableMembersToTransferTo}
              onSelectMember={alert}
            />
          )
        })}
    </Stack>
  )
}
/*




*/
type TransferControlProps = {
  memberShortName: string
  memberUuid: string
  availableMembers: MemberProps[]
  onSelectMember: (memberUuid: string) => void
}
function TransferControl(props: TransferControlProps) {
  const theme = useTheme()

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
            {props.memberShortName}
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
          padding={`${theme.module[2]} 0`}
        >
          <Icon variation={"transfer"} />
          <Select
            placeholder="Select recipient"
            options={["hi", "bye"]}
            onChange={() => null}
          />
        </Stack>
      }
    />
  )
}
/*




*/
function UpdateCountButton() {
  return <></>
}
/*




*/
