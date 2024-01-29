import { useLocation } from "react-router-dom"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import useTheme from "../../common/useTheme"
import { ErrorBoundary } from "../../components/errorBoundary"
import { Fade } from "../../components/fade"
import { Window } from "../../components/surface"
import { HistoryList } from "./historyList"
import { Review } from "./review"
/*




*/
export type HistoryUIState = {
  reviewItemUuid: string
  reviewSectionName: "details" | "comments" | "results"
}
type HistoryUIKeys = keyof HistoryUIState
const initialState: HistoryUIState = {
  reviewItemUuid: "",
  reviewSectionName: "details",
}
export const useHistoryUI = create<HistoryUIState>()(
  persist(
    (set) => ({
      ...initialState,
    }),
    {
      name: "history-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

export function setHistoryUI(path: HistoryUIKeys, value: any) {
  useHistoryUI.setState({ [path]: value })
}

export function resetHistoryUI() {
  useHistoryUI.setState(initialState)
}
/*




*/
export function History() {
  const location = useLocation()
  const historyUIState = useHistoryUI((state) => state)
  const path = location.pathname

  return (
    <ErrorBoundary
      componentName={"History"}
      featurePath={path}
      state={{ featureUI: { ...historyUIState } }}
    >
      <Fade>
        <Outer>
          <HistoryBody />
        </Outer>
      </Fade>
    </ErrorBoundary>
  )
}
/*





*/
function Outer({ children }: { children: any }) {
  const theme = useTheme()

  return (
    <Window
      padding={theme.module[3]}
      bgcolor={theme.scale.gray[8]}
      paddingBottom={theme.module[2]}
    >
      {children}
    </Window>
  )
}
/*




*/
function HistoryBody() {
  const isReviewing = !!useHistoryUI(
    (state: HistoryUIState) => state.reviewItemUuid,
  )
  return isReviewing ? <Review /> : <HistoryList />
}
/*





*/
