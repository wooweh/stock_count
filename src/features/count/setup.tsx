import { Stack, Typography } from "@mui/material"
import { useEffect } from "react"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Button, ToggleButtonGroup } from "../../components/button"
import Icon from "../../components/icon"
import { List } from "../../components/list"
import { ListItem } from "../../components/listItem"
import Modal, { ModalActionProps } from "../../components/modal"
import { generateCustomNotification } from "../core/coreUtils"
import { MemberProps } from "../org/orgSlice"
import { getMemberName, getMemberShortName } from "../org/orgUtils"
import {
  addCountUISelectedMemberUuid,
  removeCountUISelectedMemberUuid,
  setCountUI,
  useCountUI,
} from "./count"
import {
  CountMemberProps,
  CountTypes,
  selectAvailableCountersList,
  selectCounters,
  selectCountersList,
  selectCountersUuidList,
} from "./countSlice"
import {
  prepareCountMembers,
  removeCountMember,
  removeCountMembers,
  updateCountMember,
} from "./countSliceUtils"
/*




*/
export function SetupBody() {
  const theme = useTheme()
  const counterUuids = useAppSelector(selectCountersUuidList)
  const countType = useCountUI((state: any) => state.tempCountType)
  const isSolo = countType === "solo"

  const COUNT_TYPE_DESCRIPTIONS: any = {
    solo: "Solo: A single counter will count the entire stock holding.",
    dual: "Dual: Two counters will each count the entire stock holding and compare results.",
    team: "Team: Two or more counters will together count the entire stock holding.",
  }

  useEffect(() => {
    setCountUI("selectedMemberUuids", counterUuids)
  }, [counterUuids])

  function handleCountTypeSelect(value: any) {
    setCountUI("tempCountType", value)
    setCountUI("selectedMemberUuids", [])
    removeCountMembers()
  }

  const options: SetupOptionProps[] = [
    {
      label: "Count Type",
      description: COUNT_TYPE_DESCRIPTIONS[countType ?? "solo"],
      control: (
        <ToggleButtonGroup
          initialAlignment={"Solo"}
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
      ),
    },
    {
      label: "Choose Team",
      description: `Select the ${
        isSolo ? "member" : "members"
      } to perform the count.`,
      control: (
        <Button
          variation={"profile"}
          label={`Add ${isSolo ? "Counter" : "Counters"}`}
          iconName={"addMembers"}
          onClick={() => setCountUI("isAddingMembers", true)}
          bgColor={theme.scale.gray[7]}
          outlineColor={theme.scale.gray[6]}
          justifyCenter
        />
      ),
    },
    {
      label: "Team",
      control: <CountersList />,
    },
  ]

  return (
    <Stack height={"100%"} gap={theme.module[5]}>
      {options.map((option: SetupOptionProps) => (
        <SetupOption
          label={option.label}
          description={option.description}
          control={option.control}
          key={option.label}
        />
      ))}
      <AddMembers />
      <WarningBox />
    </Stack>
  )
}
/*




*/
function WarningBox() {
  const theme = useTheme()
  const countType = useCountUI((state: any) => state.tempCountType)
  const isCounterRequirementMet = useCountUI(
    (state: any) => state.isCounterRequirementMet,
  )

  return (
    !isCounterRequirementMet &&
    countType && (
      <Stack
        height={"100%"}
        width={"100%"}
        direction={"row"}
        gap={theme.module[3]}
        paddingBottom={theme.module[4]}
        justifyContent={"center"}
        alignItems={"flex-end"}
      >
        <Icon variation={"warning"} />
        <Typography variant={"body2"}>
          Required number of counters not chosen.
        </Typography>
      </Stack>
    )
  )
}
/*




*/
function AddMembers() {
  const availableMembers = useAppSelector(selectAvailableCountersList)
  const countType: CountTypes = useCountUI((state: any) => state.tempCountType)
  const isAddingMembers = useCountUI((state: any) => state.isAddingMembers)
  const selectedMemberUuids = useCountUI(
    (state: any) => state.selectedMemberUuids,
  )

  const counterRequirement = {
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
  const requirement = counterRequirement[countType ? countType : "solo"]
  console.log(countType)
  console.log(requirement)
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
      setTimeout(() => prepareCountMembers(selectedMemberUuids), 150)
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
    !!countType && (
      <Modal
        open={isAddingMembers}
        heading={"Add Counters"}
        body={
          !availableMembers.length ? (
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

  const countType: CountTypes = useCountUI((state: any) => state.tempCountType)
  const selectedMemberUuids = useCountUI(
    (state: any) => state.selectedMemberUuids,
  )

  const isTeamCount = countType === "team"

  return (
    <List>
      {availableMembers.map((member: MemberProps) => {
        const name = getMemberName(member)
        const selected = selectedMemberUuids.includes(member.uuid)
        return (
          <ListItem
            label={name}
            primarySlot={
              <Icon variation={selected ? "checked" : "unchecked"} />
            }
            onChange={() =>
              selected
                ? removeCountUISelectedMemberUuid(member.uuid)
                : isRequirementMet && !isTeamCount
                ? generateCustomNotification("warning", warningMessage)
                : addCountUISelectedMemberUuid(member.uuid)
            }
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
  const counter = useAppSelector(selectCounters)
  console.log(counter)

  return (
    <Stack
      boxShadow={theme.shadow.neo[1]}
      padding={theme.module[3]}
      borderRadius={theme.module[3]}
    >
      <List gapScale={1} maxHeight={theme.module[9]}>
        {counters.length ? (
          counters.map((counter: CountMemberProps) => {
            const isOrganiser = counter.isOrganiser
            const uuid = counter.uuid

            function handleDelete() {
              if (isOrganiser) {
                updateCountMember(uuid, { isCounter: false })
              } else {
                removeCountMember(uuid)
              }
              removeCountUISelectedMemberUuid(uuid)
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
          <Stack width={"100%"} padding={theme.module[3]} alignItems={"center"}>
            <Typography color={theme.scale.gray[5]}>
              No counters chosen
            </Typography>
          </Stack>
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
    <Stack gap={theme.module[3]} boxSizing={"border-box"}>
      <Stack paddingLeft={theme.module[1]}>
        <Typography
          fontSize={"large"}
          color={theme.scale.gray[4]}
          fontWeight={"bold"}
        >
          {props.label}
        </Typography>
      </Stack>
      <Stack>{props.control}</Stack>
      {!!props.description && (
        <Stack paddingLeft={theme.module[1]}>
          <Typography color={theme.scale.gray[5]} fontWeight={"bold"}>
            {props.description}
          </Typography>
        </Stack>
      )}
    </Stack>
  )
}
/*




*/
