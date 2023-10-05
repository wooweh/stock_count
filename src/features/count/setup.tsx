import { Stack, Typography } from "@mui/material"
import _ from "lodash"
import { useEffect } from "react"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Button } from "../../components/button"
import { Select } from "../../components/control"
import Icon from "../../components/icon"
import { ListItem } from "../../components/listItem"
import { List } from "../../components/list"
import Modal, { ModalActionProps } from "../../components/modal"
import { generateCustomNotification } from "../core/notifications"
import { MemberProps } from "../organisation/organisationSlice"
import {
  addUseCountSelectedMemberUuid,
  removeUseCountSelectedMemberUuid,
  setUseCount,
  useCountStore,
} from "./count"
import {
  CountMemberProps,
  CountTypes,
  selectAvailableCountersList,
  selectCountersList,
  selectCountersUuidList,
} from "./countSlice"
import {
  prepareCountMembers,
  removeCountMember,
  removeCountMembers,
  updateCountMember,
} from "./countUtils"
/*





*/
export function SetupBody() {
  const theme = useTheme()

  const counterUuids = useAppSelector(selectCountersUuidList)

  const countType = useCountStore((state: any) => state.tempCountType)
  const isSolo = countType === "solo"

  const countTypes: any = {
    solo: "A single counter will count the entire stock holding.",
    dual: "Two counters will each count the entire stock holding and compare results.",
    team: "Two or more counters will together count the entire stock holding.",
  }

  useEffect(() => {
    setUseCount("selectedMemberUuids", counterUuids)
  }, [counterUuids])

  function handleCountTypeSelect(value: any) {
    setUseCount("tempCountType", value)
    setUseCount("selectedMemberUuids", [])
    removeCountMembers()
  }

  const options: SetupOptionProps[] = [
    {
      label: "Count Type",
      description: countTypes[countType] ?? "",
      control: (
        <Select
          value={countType}
          onChange={handleCountTypeSelect}
          options={_.keys(countTypes)}
          placeholder="Choose Count Type"
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
          onClick={() => setUseCount("isAddingMembers", true)}
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
  const setupOptions = countType ? options : [options[0]]

  return (
    <Stack height={"100%"} gap={theme.module[5]}>
      {setupOptions.map((option: SetupOptionProps) => (
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

  const countType = useCountStore((state: any) => state.tempCountType)
  const isCounterRequirementMet = useCountStore(
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
  const countType: CountTypes = useCountStore(
    (state: any) => state.tempCountType,
  )
  const isAddingMembers = useCountStore((state: any) => state.isAddingMembers)
  const selectedMemberUuids = useCountStore(
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
  const isRequirementMet = requirement.isMet
  const verbose = requirement.verbose
  const warningMessage = `${verbose} required for ${countType} count.`

  useEffect(() => {
    setUseCount("isCounterRequirementMet", isRequirementMet)
  }, [isRequirementMet])

  function handleClose() {
    setUseCount("selectedMemberUuids", [])
    setUseCount("isAddingMembers", false)
  }
  function handleAccept() {
    if (isRequirementMet) {
      setUseCount("isAddingMembers", false)
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
  const countType: CountTypes = useCountStore(
    (state: any) => state.tempCountType,
  )
  const availableMembers = useAppSelector(selectAvailableCountersList)
  const selectedMemberUuids = useCountStore(
    (state: any) => state.selectedMemberUuids,
  )

  const isTeamCount = countType === "team"

  return (
    <List>
      {availableMembers.map((member: MemberProps) => {
        const fullname = `${member.name} ${member.surname}`
        const selected = selectedMemberUuids.includes(member.uuid)
        return (
          <ListItem
            label={fullname}
            primarySlot={
              <Icon variation={selected ? "checked" : "unchecked"} />
            }
            onChange={() =>
              selected
                ? removeUseCountSelectedMemberUuid(member.uuid)
                : isRequirementMet && !isTeamCount
                ? generateCustomNotification("warning", warningMessage)
                : addUseCountSelectedMemberUuid(member.uuid)
            }
            tappable
            key={fullname}
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
      boxShadow={theme.shadow.neo[1]}
      padding={theme.module[3]}
      borderRadius={theme.module[3]}
    >
      <List gapScale={1} maxHeight={theme.module[9]}>
        {counters.length ? (
          counters.map((counter: CountMemberProps) => {
            const isOrganiser = counter.isOrganiser
            const fullname = `${counter.name} ${counter.surname}`

            function handleDelete() {
              if (isOrganiser) {
                updateCountMember(counter.uuid, { isCounter: false })
              } else {
                removeCountMember(counter.uuid)
              }
              removeUseCountSelectedMemberUuid(counter.uuid)
            }

            return (
              <ListItem
                label={fullname}
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
                key={fullname}
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
          <Typography color={theme.scale.gray[5]}>
            {props.description}
          </Typography>
        </Stack>
      )}
    </Stack>
  )
}
/*





*/
