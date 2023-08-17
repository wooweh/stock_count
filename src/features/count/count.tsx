import { Stack, Typography } from "@mui/material"
import _ from "lodash"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Button } from "../../components/button"
import { Select } from "../../components/control"
import Icon from "../../components/icon"
import { List, ListItem } from "../../components/list"
import Modal, { ModalActionProps } from "../../components/modal"
import {
  MemberProps,
  selectOrgMembers,
} from "../organisation/organisationSlice"
import { selectIsUserAdmin } from "../user/userSlice"
import {
  CountSteps,
  selectAvailableMembersList,
  selectCountStep,
  selectIsCountInvitePending,
  setCountStep,
} from "./countSlice"
/*





*/
type UseCountState = {
  isSettingUp: boolean
  isAddingMembers: boolean
  selectedMemberUuids: string[]
  countType: string
}
type UseCountKeys = keyof UseCountState
const initialState: UseCountState = {
  isSettingUp: false,
  isAddingMembers: false,
  selectedMemberUuids: [],
  countType: "",
}
const useCountStore = create<UseCountState>()(
  persist(
    (set) => ({
      ...initialState,
    }),
    { name: "count-storage", storage: createJSONStorage(() => sessionStorage) },
  ),
)

function setUseCount(path: UseCountKeys, value: any) {
  useCountStore.setState({ [path]: value })
}
function addUseCountSelectedMemberUuid(uuid: string) {
  const uuids = useCountStore.getState().selectedMemberUuids
  const index = _.indexOf(uuids, uuid)
  if (index === -1) {
    const newUuids = [uuid, ...uuids]
    useCountStore.setState({ selectedMemberUuids: newUuids })
  }
}
function removeUseCountSelectedMemberUuid(uuid: string) {
  const uuids = useCountStore.getState().selectedMemberUuids
  const indexToRemove = _.indexOf(uuids, uuid)
  const newUuids = [...uuids]
  newUuids.splice(indexToRemove, 1)
  useCountStore.setState({ selectedMemberUuids: newUuids })
}
export function resetUseCount() {
  useCountStore.setState(initialState)
}
/*





*/
export function Count() {
  return <CountStepsContainer />
}
/*





*/
type CountStepsPropsCreator<CountStepsProperties extends string> = {
  [key in CountStepsProperties as key]: CountStepProps
}
type CountStepsProps = CountStepsPropsCreator<CountSteps>
function CountStepsContainer() {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const countStep = useAppSelector(selectCountStep)

  function handleSetupNext() {
    dispatch(setCountStep("preparation"))
  }

  function handleSetupPrev() {
    dispatch(setCountStep("dashboard"))
  }

  function handlePreparationPrev() {
    dispatch(setCountStep("setup"))
  }

  function handlePreparationNext() {
    dispatch(setCountStep("stockCount"))
  }

  function handleStockCountNext() {
    dispatch(setCountStep("review"))
  }

  function handleReviewPrev() {
    dispatch(setCountStep("stockCount"))
  }

  function handleReviewNext() {
    dispatch(setCountStep("finalization"))
  }

  function handleFinalizationSubmit() {
    dispatch(setCountStep("dashboard"))
  }

  const countSteps: CountStepsProps = {
    dashboard: {
      label: "Dashboard",
      body: <DashboardBody />,
    },
    setup: {
      label: "Setup",
      body: <SetupBody />,
      prevButton: { label: "Dashboard", onClick: handleSetupPrev },
      nextButton: { label: "Preparation", onClick: handleSetupNext },
    },
    preparation: {
      label: "Preparation",
      body: <PreparationBody />,
      prevButton: { label: "Setup", onClick: handlePreparationPrev },
      nextButton: { label: "Start Count", onClick: handlePreparationNext },
    },
    stockCount: {
      label: "Stock Count",
      body: <StockCountBody />,
      nextButton: { label: "Review", onClick: handleStockCountNext },
    },
    review: {
      label: "Review",
      body: <ReviewBody />,
      prevButton: { label: "Count", onClick: handleReviewPrev },
      nextButton: { label: "Finalize", onClick: handleReviewNext },
    },
    finalization: {
      label: "Finalization",
      body: <FinalizationBody />,
      submitButton: { label: "Submit", onClick: handleFinalizationSubmit },
    },
  }
  return (
    <Stack
      width={"100%"}
      height={"100%"}
      padding={theme.module[3]}
      boxSizing={"border-box"}
    >
      <CountStep {...countSteps[countStep]} />
    </Stack>
  )
}
/*





*/
function DashboardBody() {
  return (
    <Stack width={"100%"} height={"100%"} justifyContent={"space-between"}>
      <Invite />
      <SetupCountButton />
    </Stack>
  )
}
/*





*/
function SetupCountButton() {
  const theme = useTheme()
  const dispatch = useAppDispatch()

  const isAdmin = useAppSelector(selectIsUserAdmin)

  return (
    isAdmin && (
      <Button
        variation={"profile"}
        label={"Setup Count"}
        bgColor={theme.scale.gray[7]}
        outlineColor={theme.scale.gray[6]}
        justifyCenter
        onClick={() => dispatch(setCountStep("setup"))}
      />
    )
  )
}
/*





*/
function Invite() {
  const theme = useTheme()

  const isInvitePending = useAppSelector(selectIsCountInvitePending)

  return isInvitePending ? (
    <Stack
      gap={theme.module[4]}
      borderRadius={theme.module[4]}
      padding={theme.module[3]}
      boxSizing={"border-box"}
      bgcolor={theme.scale.blue[8]}
      sx={{ outline: `1px solid ${theme.scale.blue[7]}` }}
    >
      <Stack
        width={"100%"}
        direction={"row"}
        gap={theme.module[4]}
        alignItems={"center"}
        padding={theme.module[3]}
        boxSizing={"border-box"}
      >
        <Icon
          variation="notification"
          fontSize="large"
          color={theme.scale.blue[6]}
        />
        <Typography
          variant={"h6"}
          color={theme.scale.gray[4]}
          sx={{ paddingLeft: theme.module[3] }}
        >
          You have been invited to a count:
        </Typography>
      </Stack>
      <Button
        variation="profile"
        label="Accept"
        iconName={"done"}
        justifyCenter
        bgColor={theme.scale.gray[7]}
        onClick={() => {}}
      />
      <Button
        variation="profile"
        label="Decline"
        iconName={"cancel"}
        justifyCenter
        bgColor={theme.scale.gray[7]}
        onClick={() => {}}
      />
    </Stack>
  ) : (
    <Typography
      variant={"h6"}
      color={theme.scale.gray[4]}
      sx={{ display: "flex", justifyContent: "center" }}
    >
      There are no new counts pending
    </Typography>
  )
}
/*





*/
function SetupBody() {
  const theme = useTheme()
  const dispatch = useAppDispatch()

  const orgMembers = useAppSelector(selectOrgMembers)
  const countType = useCountStore((state: any) => state.countType)
  const isAddingMembers = useCountStore((state: any) => state.isAddingMembers)
  const selectedMemberUuids = useCountStore(
    (state: any) => state.selectedMemberUuids,
  )

  const countMembers = _.pick(orgMembers, selectedMemberUuids)
  //TODO: Create array of count member objects to dispatch (abstract into function)

  const countTypes: any = {
    solo: "A single counter will count the entire stock holding.",
    dual: "Two counters will each count the entire stock holding and compare results.",
    team: "Two or more counters will together count the entire stock holding.",
  }
  const options = _.keys(countTypes)

  function handleCountTypeSelect(value: any) {
    setUseCount("countType", value)
  }

  const setupOptions = [
    {
      label: "Count Type",
      description: countTypes[countType] ?? "",
      control: (
        <Select
          value={countType}
          onChange={handleCountTypeSelect}
          options={options}
          placeholder="Choose Count Type"
        />
      ),
    },
    {
      label: "Choose Team",
      description: "Select the member(s) to perform the count.",
      control: (
        <Button
          variation={"profile"}
          label={"Add Member(s)"}
          iconName={"addMembers"}
          onClick={() => setUseCount("isAddingMembers", true)}
          bgColor={theme.scale.gray[7]}
          outlineColor={theme.scale.gray[6]}
          justifyCenter
        />
      ),
    },
  ]

  const modalActions: ModalActionProps[] = [
    {
      iconName: "cancel",
      handleClick: handleCancel,
    },
    {
      iconName: "done",
      handleClick: handleAccept,
    },
  ]

  function handleCancel() {
    setUseCount("selectedMemberUuids", [])
    setUseCount("isAddingMembers", false)
  }
  function handleAccept() {
    handleCancel()
  }

  return (
    <Stack gap={theme.module[5]}>
      {setupOptions.map((option: (typeof setupOptions)[number]) => (
        <SetupOption
          label={option.label}
          description={option.description}
          control={option.control}
          key={option.label}
        />
      ))}
      <Modal
        open={isAddingMembers}
        heading={"Add Members"}
        body={<MembersList />}
        actions={modalActions}
        onClose={() => setUseCount("isAddingMembers", false)}
      />
    </Stack>
  )
}
/*





*/
function MembersList() {
  const availableMembers = useAppSelector(selectAvailableMembersList)
  const selectedMemberUuids = useCountStore(
    (state: any) => state.selectedMemberUuids,
  )

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
type SetupOptionProps = {
  label: string
  description?: string
  control: any
}
function SetupOption(props: SetupOptionProps) {
  const theme = useTheme()

  return (
    <Stack
      gap={theme.module[3]}
      padding={theme.module[3]}
      boxSizing={"border-box"}
    >
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
function PreparationBody() {
  return <div>body</div>
}
/*





*/
function StockCountBody() {
  return <div>body</div>
}
/*





*/
function ReviewBody() {
  return <div>body</div>
}
/*





*/
function FinalizationBody() {
  return <div>body</div>
}
/*





*/
type CountStepProps = {
  label: string
  body: any
  nextButton?: ButtonProps
  prevButton?: ButtonProps
  submitButton?: ButtonProps
}
type ButtonProps = {
  label: string
  onClick: any
}
function CountStep(props: CountStepProps) {
  const theme = useTheme()

  const showButtons = props.nextButton || props.prevButton || props.submitButton

  return (
    <Stack
      width={"100%"}
      height={"100%"}
      gap={theme.module[4]}
      alignItems={"center"}
      boxSizing={"border-box"}
      paddingTop={theme.module[3]}
    >
      <Stack
        padding={`${theme.module[2]} ${theme.module[4]}`}
        alignItems={"center"}
        boxSizing={"border-box"}
        bgcolor={theme.scale.gray[9]}
        borderRadius={theme.module[4]}
        boxShadow={theme.shadow.neo[3]}
        sx={{ outline: `1px solid ${theme.scale.gray[7]}` }}
      >
        <Typography variant={"subtitle1"}>{props.label}</Typography>
      </Stack>
      <Stack
        width={"100%"}
        height={"100%"}
        flexShrink={1}
        paddingTop={theme.module[4]}
        boxSizing={"border-box"}
      >
        {props.body}
      </Stack>
      {showButtons && (
        <Stack width={"100%"} direction={"row"} gap={theme.module[4]}>
          {props.prevButton && (
            <Button
              variation={"navPrev"}
              label={props.prevButton.label}
              onClick={props.prevButton.onClick}
            />
          )}
          {props.nextButton && (
            <Button
              variation={"navNext"}
              label={props.nextButton.label}
              onClick={props.nextButton.onClick}
            />
          )}
          {props.submitButton && (
            <Button
              variation={"profile"}
              label={props.submitButton.label}
              onClick={props.submitButton.onClick}
              bgColor={theme.scale.gray[7]}
              outlineColor={theme.scale.gray[6]}
              justifyCenter
            />
          )}
        </Stack>
      )}
    </Stack>
  )
}
/*





*/
