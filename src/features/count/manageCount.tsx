import { Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useEffect, useMemo } from "react"
import { useLocation } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import useTheme, { ThemeColors } from "../../common/useTheme"
import { Button } from "../../components/button"
import { Select, SelectOptionProps } from "../../components/control"
import { ErrorBoundary } from "../../components/errorBoundary"
import Icon, { IconNames } from "../../components/icon"
import { List } from "../../components/list"
import { ListItem } from "../../components/listItem"
import Modal, { ModalActionProps } from "../../components/modal"
import { Slot, Window } from "../../components/surface"
import { generateCustomNotification } from "../core/coreUtils"
import { MemberProps, MembersProps } from "../org/orgSlice"
import { selectOrgMembers } from "../org/orgSliceSelectors"
import { getMemberName, getMemberShortName } from "../org/orgUtils"
import { selectUserUuidString } from "../user/userSliceSelectors"
import {
  addCountUIArrayItem,
  addCountUIKeyValuePair,
  removeCountUIArrayItem,
  removeCountUIKeyValuePair,
  removeCountUIKeyValuePairValue,
  resetCountUI,
  setCountUI,
  useCountUI,
} from "./count"
import { CountTypes } from "./countSlice"
import {
  selectAvailableCountersList,
  selectCountMembersCountValueList,
  selectCountType,
  selectCountersList,
  selectCountersUuidList,
  selectIsUserOrganiser,
} from "./countSliceSelectors"
import {
  updateCountMetadata,
  updateCountStep,
  updateManagedCount,
} from "./countSliceUtils"
import { getCountHeadCountRequirement } from "./countUtils"
import { DataPill } from "./finalization"
import { CountTypeToggleButtons, WarningBox } from "./setup"
/*




*/
export function ManageCount() {
  const theme = useTheme()
  const location = useLocation()
  const countUIState = useCountUI((state) => state)
  const path = location.pathname

  return (
    <ErrorBoundary
      componentName="ManageCount"
      featurePath={path}
      state={{ featureUI: { ...countUIState } }}
    >
      <Outer>
        <Stack height={"80%"} gap={theme.module[3]}>
          <Header />
          <Body />
        </Stack>
        <UpdateCountButton />
        <UpdateCountConfirmation />
        <AddTempMembers />
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
    <Stack
      gap={theme.module[4]}
      height={"100%"}
      bgcolor={theme.scale.gray[8]}
      justifyContent={"space-between"}
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
      <Slot position={"relative"}>
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
            onClick={resetCountUI}
            iconSize={"small"}
            outlineColor={theme.scale.red[7]}
            sx={{ padding: theme.module[3], boxShadow: theme.shadow.neo[3] }}
          />
        </Stack>
      </Slot>
    </Stack>
  )
}
/*




*/
function Body() {
  const theme = useTheme()

  return (
    <Window height={"70%"} gap={theme.module[5]}>
      <CountType />
      <CountTeam />
    </Window>
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
    <Stack width={"100%"} height={"100%"} gap={theme.module[3]}>
      <Slot justifyContent={"space-between"}>
        <Typography variant="h6">Count Team</Typography>
        <AddMembersButton />
      </Slot>
      <CountTeamDescription />
      <Window
        overflow={"auto"}
        gap={theme.module[4]}
        borderRadius={theme.module[3]}
        padding={theme.module[1]}
        sx={{ outline: `1px solid ${theme.scale.gray[6]}` }}
      >
        <Stack width={"100%"} gap={theme.module[3]}>
          <CountTeamControls />
          <Transfers />
        </Stack>
      </Window>
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
      <Action action={"Remove"} color={"red"} /> members,{" "}
      <Action action={"transfer results"} color={"yellow"} />, and{" "}
      <Action action={"add"} color={"blue"} /> new members.
    </Typography>
  )
}
/*




*/
function CountTeamControls() {
  const theme = useTheme()

  return (
    <Slot height={"100%"} direction={"column"} gap={theme.module[2]}>
      <ControlsHeader />
      <ControlsBody />
    </Slot>
  )
}
/*




*/

function ControlsHeader() {
  const theme = useTheme()
  const countType = useCountUI((state) => state.tempCountType)

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
        <Slot width={"min-content"} gap={theme.module[2]}>
          <Icon variation={leftIconName} />
          <Typography fontWeight={"medium"}>Counters</Typography>
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
  const tempAddedMemberUuids = useCountUI((state) => state.tempAddedMemberUuids)

  return (
    <Slot
      bgcolor={theme.scale.gray[9]}
      borderRadius={theme.module[2]}
      direction={"column"}
      height={"100%"}
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
    (state) => state.tempRemovedMemberUuids,
  )
  const tempResultsTransfers = useCountUI((state) => state.tempResultsTransfers)

  const isRemoved = useMemo(
    () => tempRemovedMemberUuids.includes(props.uuid),
    [props.uuid, tempRemovedMemberUuids],
  )
  const isTransferred = useMemo(
    () => _.keys(tempResultsTransfers).includes(props.uuid),
    [props.uuid, tempResultsTransfers],
  )

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

  const isTransferDisabled = !props.count

  return (
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
            disabled={isTransferDisabled}
            variation={"pill"}
            iconName={isTransferred ? "checked" : "unchecked"}
            iconColor={theme.scale.yellow[6]}
            onClick={handleToggleTransfer}
          />
        </CountTeamRightSlot>
      }
    />
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
          <Button variation={"pill"} iconName="delete" onClick={handleDelete} />
        </CountTeamRightSlot>
      }
    />
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

  const styles = {
    outline: `1px solid ${theme.scale.gray[8]}`,
    outlineOffset: "-1px",
    ...props.sx,
  }

  return (
    <Slot
      justifyContent={"space-between"}
      bgcolor={props.bgColor ?? "none"}
      borderRadius={props.borderRadius}
      padding={`${theme.module[2]} ${theme.module[3]}`}
      sx={styles}
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

  const countMembers = useAppSelector(selectCountersList)

  const tempCountType = useCountUI((state) => state.tempCountType)
  const selectedMemberUuids = useCountUI((state) => state.selectedMemberUuids)
  const tempAddedMemberUuids = useCountUI((state) => state.tempAddedMemberUuids)
  const tempRemovedMemberUuids = useCountUI(
    (state) => state.tempRemovedMemberUuids,
  )

  const potentialHeadCount =
    countMembers.length +
    selectedMemberUuids.length +
    tempAddedMemberUuids.length -
    tempRemovedMemberUuids.length

  const requirement = getCountHeadCountRequirement(
    potentialHeadCount,
    tempCountType,
  )
  const isDisabled = requirement.isMet

  function handleAdd() {
    setCountUI("isAddingTempMembers", true)
  }

  return (
    <Button
      disabled={isDisabled}
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

  const countType = useCountUI((state) => state.tempCountType)
  const isAddingTempMembers = useCountUI((state) => state.isAddingTempMembers)
  const selectedMemberUuids = useCountUI((state) => state.selectedMemberUuids)
  const tempAddedMemberUuids = useCountUI((state) => state.tempAddedMemberUuids)
  const tempRemovedMemberUuids = useCountUI(
    (state) => state.tempRemovedMemberUuids,
  )

  const availableTempMembers = _.remove(
    [...availableMembers],
    (member: MemberProps) => !tempAddedMemberUuids.includes(member.uuid),
  )
  const potentialHeadCount =
    countMembers.length +
    selectedMemberUuids.length +
    tempAddedMemberUuids.length -
    tempRemovedMemberUuids.length

  const requirement = getCountHeadCountRequirement(
    potentialHeadCount,
    countType,
  )
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

  const addTempMembersBodyProps = {
    isRequirementMet,
    warningMessage,
    isAvailableTempMembers: !!availableTempMembers.length,
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
      body={<AddTempMembersBody {...addTempMembersBodyProps} />}
      actions={modalActions}
      onClose={handleClose}
    />
  )
}
/*




*/
type AddTempMembersBodyProps = {
  isRequirementMet: boolean
  warningMessage: string
  isAvailableTempMembers: boolean
}
function AddTempMembersBody(props: AddTempMembersBodyProps) {
  const location = useLocation()
  const countUIState = useCountUI((state) => state)
  const path = location.pathname

  return (
    <ErrorBoundary
      componentName="AddTempMembersBody"
      featurePath={path}
      state={{ featureUI: { ...countUIState }, component: { ...props } }}
    >
      {props.isAvailableTempMembers ? (
        <MembersList
          isRequirementMet={props.isRequirementMet}
          warningMessage={props.warningMessage}
        />
      ) : (
        <Typography>No additional members available.</Typography>
      )}
    </ErrorBoundary>
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

  const countType: CountTypes = useCountUI((state) => state.tempCountType)
  const selectedMemberUuids = useCountUI((state) => state.selectedMemberUuids)
  const tempAddedMemberUuids = useCountUI((state) => state.tempAddedMemberUuids)

  const availableMembersToAdd = _.remove(
    [...availableMembers],
    (member: MemberProps) => !tempAddedMemberUuids.includes(member.uuid),
  )
  const isTeamCount = countType === "team"

  return (
    <List gapScale={0}>
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
      justifyContent={"flex-start"}
      padding={`${theme.module[2]} ${theme.module[3]}`}
      gap={theme.module[2]}
    >
      <Icon variation={"transfer"} />
      <Typography fontWeight={"medium"}>Transfers</Typography>
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
    (state) => state.tempRemovedMemberUuids,
  )
  const tempAddedMemberUuids = useCountUI((state) => state.tempAddedMemberUuids)
  const transferMembersUuids = useCountUI((state) => state.tempResultsTransfers)
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

  return !!transferUuidsList.length ? (
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
              key={uuidPair[0]}
              fromMemberUuid={uuidPair[0]}
              toMemberUuid={uuidPair[1]}
              availableMemberUuids={availableMemberUuidsToTransferTo}
            />
          )
        })}
    </Slot>
  ) : (
    <Slot paddingTop={theme.module[3]}>
      <Typography textAlign={"center"} color={theme.scale.gray[5]}>
        No transfers added
      </Typography>
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
            emptyOptionsValue={"add members"}
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

  const countMembers = useAppSelector(selectCountersList)
  const countType = useAppSelector(selectCountType)

  const tempCountType = useCountUI((state) => state.tempCountType)
  const selectedMemberUuids = useCountUI((state) => state.selectedMemberUuids)
  const tempAddedMemberUuids = useCountUI((state) => state.tempAddedMemberUuids)
  const tempResultsTransfers = useCountUI((state) => state.tempResultsTransfers)
  const tempRemovedMemberUuids = useCountUI(
    (state) => state.tempRemovedMemberUuids,
  )

  const isAllTransfersAllocated = !_.values(tempResultsTransfers).includes("")
  const potentialHeadCount =
    countMembers.length +
    selectedMemberUuids.length +
    tempAddedMemberUuids.length -
    tempRemovedMemberUuids.length

  const requirement = getCountHeadCountRequirement(
    potentialHeadCount,
    tempCountType,
  )
  const isDataSafe = !!_.keys(tempResultsTransfers).length
    ? isAllTransfersAllocated
    : true
  const noChanges =
    !tempAddedMemberUuids.length &&
    !tempRemovedMemberUuids.length &&
    countType === tempCountType
  const isDisabled = !requirement.isMet || !isDataSafe || noChanges

  function handleClick() {
    setCountUI("isUpdatingCount", true)
    updateCountMetadata({ isManaging: true }, true)
  }

  return (
    <Window flexShrink={0} height={"min-content"}>
      <WarningBox />
      <Button
        variation={"profile"}
        onClick={handleClick}
        iconName={"done"}
        label="Update Count"
        color={theme.scale.green[6]}
        outlineColor={theme.scale.green[7]}
        disabled={isDisabled}
        justifyCenter
      />
    </Window>
  )
}
/*




*/
function UpdateCountConfirmation() {
  const userUuid = useAppSelector(selectUserUuidString)
  const isUserOrganiser = useAppSelector(selectIsUserOrganiser)

  const countType = useCountUI((state) => state.tempCountType)
  const addedMembers = useCountUI((state) => state.tempAddedMemberUuids)
  const removedMembers = useCountUI((state) => state.tempRemovedMemberUuids)
  const transferredMembers = useCountUI((state) => state.tempResultsTransfers)
  const isUpdatingCount = useCountUI((state) => state.isUpdatingCount)

  const isRemovingOrganiser =
    isUserOrganiser && removedMembers.includes(userUuid)

  function handleAccept() {
    updateManagedCount(
      countType,
      addedMembers,
      removedMembers,
      transferredMembers,
    )
    resetCountUI()
    isRemovingOrganiser && updateCountStep("review")
  }

  function handleCancel() {
    setCountUI("isUpdatingCount", false)
  }

  const actions: ModalActionProps[] = [
    { iconName: "cancel", handleClick: handleCancel },
    { iconName: "done", handleClick: handleAccept },
  ]

  return (
    <Modal
      open={isUpdatingCount}
      heading="Update Count"
      body={<UpdateCountConfirmationBody />}
      actions={actions}
      onClose={handleCancel}
    />
  )
}
/*




*/

function UpdateCountConfirmationBody() {
  const theme = useTheme()
  const location = useLocation()

  const countUIState = useCountUI((state) => state)
  const addedUuids = useCountUI((state) => state.tempAddedMemberUuids)
  const removedUuids = useCountUI((state) => state.tempRemovedMemberUuids)
  const transferUuids = useCountUI((state) => state.tempResultsTransfers)
  const countType = useCountUI((state) => state.tempCountType)

  const summaryProps = {
    addedUuids,
    removedUuids,
    transferUuids,
    countType,
  }
  const path = location.pathname

  const CONFIRMATION_MESSAGE =
    "You are about to update the count. Confirm your changes before proceeding."

  return (
    <ErrorBoundary
      componentName="UpdateCountConfirmationBody"
      featurePath={path}
      state={{ featureUI: { ...countUIState }, component: { ...summaryProps } }}
    >
      <Stack width={"100%"} gap={theme.module[3]}>
        <Typography textAlign={"center"}>{CONFIRMATION_MESSAGE}</Typography>
        <Typography
          fontWeight={"bold"}
          color={theme.scale.blue[6]}
          textAlign={"center"}
        >
          Change Summary:
        </Typography>
        <ChangeSummary {...summaryProps} />
      </Stack>
    </ErrorBoundary>
  )
}
/*




*/
type SummaryProps = {
  addedUuids: string[]
  removedUuids: string[]
  transferUuids: { [key: string]: string }
  countType: CountTypes
}
function ChangeSummary(props: SummaryProps) {
  const theme = useTheme()
  const members = useAppSelector(selectOrgMembers) as MembersProps
  const currentCountType = useAppSelector(selectCountType)
  const isCountTypeChanged = currentCountType !== props.countType

  return (
    <Stack
      gap={theme.module[3]}
      bgcolor={theme.scale.gray[8]}
      borderRadius={theme.module[2]}
      padding={theme.module[4]}
      boxShadow={theme.shadow.neo[1]}
      sx={{ outline: `1px solid ${theme.scale.gray[6]}` }}
    >
      {!!isCountTypeChanged && (
        <Stack gap={theme.module[2]}>
          <Title icon={"transfer"} color={"yellow"}>
            Count Type:
          </Title>
          <Slot justifyContent={"flex-start"} gap={theme.module[3]}>
            <DataPill key={1} label={_.capitalize(currentCountType)} />
            <Typography fontWeight={"bold"}>to</Typography>
            <DataPill key={2} label={_.capitalize(props.countType)} />
          </Slot>
        </Stack>
      )}
      {!!props.addedUuids.length && (
        <Stack gap={theme.module[2]}>
          <Title icon={"addMembers"} color={"green"}>
            Added:
          </Title>
          <Slot
            justifyContent={"flex-start"}
            overflow={"scroll"}
            gap={theme.module[3]}
          >
            {_.map(props.addedUuids, (uuid) => (
              <DataPill key={uuid} label={getMemberShortName(members[uuid])} />
            ))}
          </Slot>
        </Stack>
      )}
      {!!props.removedUuids.length && (
        <Stack gap={theme.module[2]}>
          <Title icon={"delete"} color={"red"}>
            Removed:
          </Title>
          <Slot
            justifyContent={"flex-start"}
            overflow={"scroll"}
            gap={theme.module[3]}
          >
            {_.map(props.removedUuids, (uuid) => (
              <DataPill key={uuid} label={getMemberShortName(members[uuid])} />
            ))}
          </Slot>
        </Stack>
      )}
      {!!props.transferUuids.length && (
        <Stack gap={theme.module[2]}>
          <Title icon={"transfer"} color={"yellow"}>
            Transferred:
          </Title>
          {_.toPairs(props.transferUuids).map(([key, value]) => (
            <Slot justifyContent={"flex-start"} gap={theme.module[3]} key={key}>
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
        </Stack>
      )}
    </Stack>
  )
}
/*




*/
function Title({
  children,
  color,
  icon,
}: {
  children: string
  color: ThemeColors
  icon: IconNames
}) {
  const theme = useTheme()

  return (
    <Slot gap={theme.module[3]} justifyContent={"flex-start"}>
      <Icon variation={icon} color={theme.scale[color][6]} />
      <Typography color={theme.scale[color][5]} fontWeight={"bold"}>
        {_.capitalize(children)}
      </Typography>
    </Slot>
  )
}
