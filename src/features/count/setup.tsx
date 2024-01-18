import { Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Button, ToggleButtonGroup } from "../../components/button"
import { ErrorBoundary } from "../../components/errorBoundary"
import Icon from "../../components/icon"
import { List } from "../../components/list"
import { ListItem } from "../../components/listItem"
import Modal, { ModalActionProps } from "../../components/modal"
import { Slot } from "../../components/surface"
import { generateCustomNotification } from "../core/coreUtils"
import { MemberProps } from "../org/orgSlice"
import { getMemberName, getMemberShortName } from "../org/orgUtils"
import {
  addCountUIArrayItem,
  removeCountUIArrayItem,
  setCountUI,
  useCountUI,
} from "./count"
import { CountMemberProps, CountTypes } from "./countSlice"
import {
  selectAvailableCountersList,
  selectCountType,
  selectCountersList,
  selectCountersUuidList,
} from "./countSliceSelectors"
import {
  prepareCountMembers,
  removeCountMember,
  removeCountMembers,
} from "./countSliceUtils"
/*




*/
export function SetupBody() {
  const theme = useTheme()
  const location = useLocation()
  const countUIState = useCountUI((state) => state)
  const path = location.pathname

  return (
    <ErrorBoundary
      componentName="SetupBody"
      featurePath={path}
      state={{ featureUI: { ...countUIState } }}
    >
      <Outer>
        <Stack width={"100%"} gap={theme.module[5]}>
          <SetupOptions />
          <AddMembers />
        </Stack>
        <WarningBox />
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
      height={"100%"}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      {children}
    </Stack>
  )
}
/*




*/
function SetupOptions() {
  const counterUuids = useAppSelector(selectCountersUuidList)

  const countType = useCountUI((state) => state.tempCountType)
  const selectedMemberUuids = useCountUI((state) => state.selectedMemberUuids)

  const COUNT_TYPE_DESCRIPTIONS: any = {
    solo: "Solo: A single counter will count the entire stock holding.",
    dual: "Dual: Two counters will each count the entire stock holding and compare results.",
    team: "Team: Two or more counters will together count the entire stock holding.",
  }
  const isSolo = countType === "solo"
  const chooseTeamDescription = `Select the ${
    isSolo ? "member" : "members"
  } to perform the count.`

  useEffect(() => {
    if (!selectedMemberUuids.length)
      setCountUI("selectedMemberUuids", counterUuids)
  }, [counterUuids, selectedMemberUuids])

  const options: SetupOptionProps[] = [
    {
      label: "Count Type",
      description: COUNT_TYPE_DESCRIPTIONS[countType ?? "solo"],
      control: <CountTypeToggleButtons onTypeSelect={removeCountMembers} />,
    },
    {
      label: "Choose Team",
      description: chooseTeamDescription,
      control: <ChooseTeamButton isSolo={isSolo} />,
    },
    {
      label: "Team",
      control: <CountersList />,
    },
  ]
  return options.map((option: SetupOptionProps) => (
    <SetupOption
      label={option.label}
      description={option.description}
      control={option.control}
      key={option.label}
    />
  ))
}
/*




*/
type ChooseTeamButtonProps = {
  isSolo?: boolean
}
function ChooseTeamButton(props: ChooseTeamButtonProps) {
  const theme = useTheme()

  return (
    <Button
      variation={"profile"}
      label={`Add ${props.isSolo ? "Counter" : "Counters"}`}
      iconName={"addMembers"}
      color={theme.scale.blue[6]}
      iconColor={theme.scale.blue[6]}
      onClick={() => setCountUI("isAddingMembers", true)}
      outlineColor={theme.scale.blue[6]}
      justifyCenter
    />
  )
}
/*




*/
type CountTypeToggleButtonsProps = {
  onTypeSelect?: () => void
}
export function CountTypeToggleButtons(props: CountTypeToggleButtonsProps) {
  const countType = useAppSelector(selectCountType)
  const tempCountType = useCountUI((state) => state.tempCountType)

  useEffect(() => {
    setCountUI("tempCountType", countType)
  }, [countType])

  function handleCountTypeSelect(value: any) {
    setCountUI("tempCountType", value)
    setCountUI("selectedMemberUuids", [])
    !!props.onTypeSelect && props.onTypeSelect()
  }

  return (
    <ToggleButtonGroup
      initialAlignment={_.capitalize(tempCountType)}
      options={[
        {
          label: "Solo",
          iconName: "profile",
          onClick: () => handleCountTypeSelect("solo"),
        },
        {
          label: "Dual",
          iconName: "dual",
          onClick: () => handleCountTypeSelect("dual"),
        },
        {
          label: "Team",
          iconName: "group",
          onClick: () => handleCountTypeSelect("team"),
        },
      ]}
    />
  )
}
/*




*/
export function WarningBox() {
  const theme = useTheme()

  const countType = useCountUI((state) => state.tempCountType)
  const isCounterRequirementMet = useCountUI(
    (state) => state.isCounterRequirementMet,
  )

  return (
    !isCounterRequirementMet &&
    countType && (
      <Slot
        gap={theme.module[3]}
        paddingBottom={theme.module[4]}
        alignItems={"flex-end"}
      >
        <Icon variation={"warning"} />
        <Typography variant={"body2"}>
          Required number of counters not chosen.
        </Typography>
      </Slot>
    )
  )
}
/*




*/
function AddMembers() {
  const availableMembers = useAppSelector(selectAvailableCountersList)

  const countType = useCountUI((state) => state.tempCountType)
  const isAddingMembers = useCountUI((state) => state.isAddingMembers)
  const selectedMemberUuids = useCountUI((state) => state.selectedMemberUuids)

  //TODO: Refactor into Count utils function to reuse in Manage feature
  const counterRequirements = {
    solo: {
      isMet: selectedMemberUuids.length === 1,
      verbose: "1 Counter",
    },
    dual: {
      isMet: selectedMemberUuids.length === 2,
      verbose: "2 Counters",
    },
    team: {
      isMet: selectedMemberUuids.length > 1,
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
    setCountUI("isAddingMembers", false)
  }
  function handleAccept() {
    if (isRequirementMet) {
      setCountUI("isAddingMembers", false)
      _.delay(() => prepareCountMembers(selectedMemberUuids), 150)
    } else {
      generateCustomNotification("warning", warningMessage)
    }
  }

  const addMembersBodyProps = {
    isRequirementMet,
    warningMessage,
    isAvailableTempMembers: !!availableMembers.length,
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
      open={isAddingMembers}
      heading={"Add Counters"}
      body={<AddMembersBody {...addMembersBodyProps} />}
      actions={modalActions}
      onClose={handleClose}
    />
  )
}
/*




*/
type AddMembersBodyProps = {
  isRequirementMet: boolean
  warningMessage: string
  isAvailableTempMembers: boolean
}
function AddMembersBody(props: AddMembersBodyProps) {
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

  const isTeamCount = countType === "team"

  return (
    <List gapScale={0}>
      {availableMembers.map((member: MemberProps) => {
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
function CountersList() {
  const theme = useTheme()
  const counters = useAppSelector(selectCountersList)

  return (
    <Stack
      width={"100%"}
      boxShadow={theme.shadow.neo[1]}
      padding={theme.module[2]}
      boxSizing={"border-box"}
      borderRadius={theme.module[3]}
    >
      <List gapScale={1} maxHeight={theme.module[9]}>
        {counters.length ? (
          counters.map((counter: CountMemberProps) => {
            const uuid = counter.uuid

            function handleDelete() {
              removeCountMember(uuid)
              removeCountUIArrayItem("selectedMemberUuids", uuid)
            }

            const name = getMemberShortName(counter)

            return (
              <ListItem
                label={name}
                noWrap
                primarySlot={<Icon variation={"profile"} />}
                bgColor={theme.scale.gray[9]}
                secondarySlot={
                  <Button
                    variation={"pill"}
                    iconName={"delete"}
                    onClick={handleDelete}
                  />
                }
                sx={{ padding: theme.module[2], paddingLeft: theme.module[4] }}
                key={name}
              />
            )
          })
        ) : (
          <Slot padding={theme.module[3]}>
            <Typography color={theme.scale.gray[5]}>
              No counters chosen
            </Typography>
          </Slot>
        )}
      </List>
    </Stack>
  )
}
/*




*/
type SetupOptionProps = {
  label: string
  description?: string
  control: any
}
function SetupOption(props: SetupOptionProps) {
  const theme = useTheme()

  return (
    <Stack gap={theme.module[3]}>
      <Stack paddingLeft={theme.module[1]}>
        <Typography
          fontSize={"large"}
          color={theme.scale.gray[4]}
          fontWeight={"bold"}
        >
          {props.label}
        </Typography>
      </Stack>
      <Slot>{props.control}</Slot>
      {!!props.description && (
        <Slot paddingLeft={theme.module[1]}>
          <Typography
            color={theme.scale.gray[5]}
            fontWeight={"bold"}
            width={"100%"}
            textAlign={"left"}
          >
            {props.description}
          </Typography>
        </Slot>
      )}
    </Stack>
  )
}
/*




*/
