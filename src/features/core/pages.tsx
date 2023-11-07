import { ReactElement, useEffect } from "react"
import { useResizeDetector } from "react-resize-detector"
import { Route, Routes, useLocation, useNavigate } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import Container from "../../components/container"
import { Count, resetCountUI } from "../count/count"
import { selectIsUserCounting } from "../count/countSlice"
import { History, resetHistoryUI } from "../history/history"
import { Org, resetOrgUI } from "../org/org"
import { Stock, resetStockUI } from "../stock/stock"
import { Authentication, WithAuth, resetAuthUI } from "../user/authentication"
import { UserProfile, resetUserUI } from "../user/user"
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
  const location = useLocation()
  const navigate = useNavigate()
  const { width, ref } = useResizeDetector()

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
      <Routes>
        {routes.map((route: any, index: number) => {
          return (
            <Route
              path={route.path}
              element={<WithAuth route={route} />}
              key={index}
            />
          )
        })}
      </Routes>
    </Container>
  )
}
