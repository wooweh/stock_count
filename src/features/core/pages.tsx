import { ReactElement, useEffect } from "react"
import { useResizeDetector } from "react-resize-detector"
import { Route, Routes, useLocation, useNavigate } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import useTheme from "../../common/useTheme"
import Container from "../../components/container"
import { ErrorBoundary } from "../../components/errorBoundary"
import { Window } from "../../components/surface"
import { Count, resetCountUI } from "../count/count"
import { selectIsUserCounting } from "../count/countSliceSelectors"
import { History, resetHistoryUI } from "../history/history"
import { Org, resetOrgUI } from "../org/org"
import { Stock, resetStockUI } from "../stock/stock"
import {
  AuthWrapper,
  Authentication,
  resetAuthUI,
} from "../user/authentication"
import { UserProfile, resetUserUI } from "../user/user"
import { selectIsMobile } from "./coreSliceSelectors"
import { toggleMobile } from "./coreSliceUtils"
import { getRoutePaths } from "./coreUtils"
import { Home } from "./home"
/*




*/
export type Route = {
  name: string
  path: string
  requiresAuth: boolean
  element: ReactElement
}
export const routes: Route[] = [
  {
    name: "Sign in",
    path: "/sign_in",
    requiresAuth: false,
    element: <Authentication />,
  },
  {
    name: "Register",
    path: "/register",
    requiresAuth: false,
    element: <Authentication isRegistering />,
  },
  {
    name: "Home",
    path: "/",
    requiresAuth: true,
    element: <Home />,
  },
  {
    name: "Count",
    path: "/count",
    requiresAuth: true,
    element: <Count />,
  },
  {
    name: "Stock",
    path: "/stock",
    requiresAuth: true,
    element: <Stock />,
  },
  {
    name: "History",
    path: "/history",
    requiresAuth: true,
    element: <History />,
  },
  {
    name: "Org",
    path: "/org",
    requiresAuth: true,
    element: <Org />,
  },
  {
    name: "Profile",
    path: "/profile",
    requiresAuth: true,
    element: <UserProfile />,
  },
]
/*




*/
export const routePaths = getRoutePaths(routes)
/*




*/
export function Pages() {
  const theme = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const { width, ref } = useResizeDetector()

  const isMobile = useAppSelector(selectIsMobile)
  const isUserCounting = useAppSelector(selectIsUserCounting)

  const path = location.pathname

  useEffect(() => {
    if (!!width) toggleMobile(width)
  }, [width])

  useEffect(() => {
    const isAuthPath =
      path === routePaths.signIn.path || path === routePaths.register.path
    const isProfilePath = path === routePaths.profile.path
    const isOrgPath = path === routePaths.org.path
    const isStockPath = path === routePaths.stock.path
    const isCountPath = path === routePaths.count.path
    const isHistoryPath = path === routePaths.history.path

    if (!isAuthPath) resetAuthUI()
    if (!isProfilePath) resetUserUI()
    if (!isOrgPath) resetOrgUI()
    if (!isStockPath) resetStockUI()
    if (!isCountPath) resetCountUI()
    if (!isHistoryPath) resetHistoryUI()
  }, [path])

  useEffect(() => {
    const isCountPath = path === routePaths.count.path
    if (isUserCounting && !isCountPath) navigate(routePaths.count.path)
  }, [isUserCounting, navigate, path])

  return (
    <Container resizeRef={ref}>
      <Window
        minWidth={"350px"}
        maxWidth={"700px"}
        justifyContent={"center"}
        borderRadius={isMobile ? 0 : theme.module[4]}
        margin={isMobile ? 0 : theme.module[4]}
        overflow={"hidden"}
      >
        <ErrorBoundary componentName={"Pages"} featurePath={path}>
          <Routes>
            {routes.map((route: any, index: number) => {
              return (
                <Route
                  path={route.path}
                  element={<AuthWrapper route={route} />}
                  key={index}
                />
              )
            })}
          </Routes>
        </ErrorBoundary>
      </Window>
    </Container>
  )
}
