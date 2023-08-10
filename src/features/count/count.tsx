import { Stack } from "@mui/material"
import { create } from "zustand"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import { Button } from "../../components/button"
import Icon from "../../components/icon"
import { selectCountStep } from "./countSlice"
/*





*/
type UseCountState = {
  isRemoving: boolean
}
type UseCountKeys = keyof UseCountState
const initialState: UseCountState = {
  isRemoving: false,
}
const useCountStore = create<UseCountState>()((set) => ({
  ...initialState,
}))

function setUseCount(path: UseCountKeys, value: any) {
  useCountStore.setState({ [path]: value })
}

export function resetUseCount() {
  useCountStore.setState(initialState)
}
/*





*/
export function Count() {
  return <CountSteps />
}
/*





*/
function CountSteps() {
  const theme = useTheme()
  const countStep = useAppSelector(selectCountStep)

  const countSteps = {
    idle: <Idle />,
    setup: <Setup />,
    preparation: <Preparation />,
    stockCount: <StockCount />,
    review: <Review />,
    finalize: <Finalize />,
  }
  return (
    <Stack
      width={"100%"}
      height={"100%"}
      padding={theme.module[3]}
      boxSizing={"border-box"}
    >
      {countSteps[countStep as keyof typeof countSteps]}
    </Stack>
  )
}
/*





*/
function Idle() {
  return (
    <CountContainer
      body={<IdleBody />}
      nextButton={{ label: "Start Count", onClick: () => {} }}
    />
  )
}
/*





*/
function IdleBody() {
  return <div>body</div>
}
/*





*/
function Setup() {
  return (
    <CountContainer
      body={<SetupBody />}
      nextButton={{ label: "Preparation", onClick: () => {} }}
    />
  )
}
/*





*/
function SetupBody() {
  return <div>body</div>
}
/*





*/
function Preparation() {
  return (
    <CountContainer
      body={<PreparationBody />}
      prevButton={{ label: "Setup", onClick: () => {} }}
      nextButton={{ label: "Count", onClick: () => {} }}
    />
  )
}
/*





*/
function PreparationBody() {
  return <div>body</div>
}
/*





*/
function StockCount() {
  return (
    <CountContainer
      body={<StockCountBody />}
      nextButton={{ label: "Review", onClick: () => {} }}
    />
  )
}
/*





*/
function StockCountBody() {
  return <div>body</div>
}
/*





*/
function Review() {
  return (
    <CountContainer
      body={<ReviewBody />}
      prevButton={{ label: "Count", onClick: () => {} }}
      nextButton={{ label: "Finalize", onClick: () => {} }}
    />
  )
}
/*





*/
function ReviewBody() {
  return <div>body</div>
}
/*





*/
function Finalize() {
  return (
    <CountContainer
      body={<FinalizeBody />}
      submitButton={{ label: "Submit", onClick: () => {} }}
    />
  )
}
/*





*/
function FinalizeBody() {
  return <div>body</div>
}
/*





*/
type ButtonProps = {
  label: string
  onClick: any
}
function CountContainer({
  body,
  nextButton,
  prevButton,
  submitButton,
}: {
  body: any
  nextButton?: ButtonProps
  prevButton?: ButtonProps
  submitButton?: ButtonProps
}) {
  const theme = useTheme()

  return (
    <Stack width={"100%"} height={"100%"} gap={theme.module[4]}>
      <Stack width={"100%"} height={"100%"} flexShrink={1}>
        {body}
      </Stack>
      <Stack width={"100%"} direction={"row"} gap={theme.module[4]}>
        {prevButton && (
          <Button variation={"navigation"} onClick={prevButton.onClick}>
            <Icon variation={"arrowLeft"} />
            <Stack width={"100%"} justifyContent={"center"} flexShrink={1}>
              {prevButton.label}
            </Stack>
          </Button>
        )}
        {nextButton && (
          <Button variation={"navigation"} onClick={nextButton.onClick}>
            <Stack width={"100%"} justifyContent={"center"} flexShrink={1}>
              {nextButton.label}
            </Stack>
            <Icon variation={"arrowRight"} />
          </Button>
        )}
        {submitButton && (
          <Button variation={"navigation"} onClick={submitButton.onClick}>
            <Stack width={"100%"} justifyContent={"center"} flexShrink={1}>
              {submitButton.label}
            </Stack>
            <Icon variation={"submit"} />
          </Button>
        )}
      </Stack>
    </Stack>
  )
}
/*





*/
