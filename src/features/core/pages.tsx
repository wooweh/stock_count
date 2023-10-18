import { ReactElement, useEffect } from "react"
import { useResizeDetector } from "react-resize-detector"
import { Route, Routes, useLocation, useNavigate } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import Container from "../../components/container"
import { Count, resetUseCount } from "../count/count"
import { selectIsUserCounting } from "../count/countSlice"
import { History, resetUseHistory } from "../history/history"
import { Organisation, resetUseOrg } from "../organisation/organisation"
import { Stock, resetUseStock } from "../stock/stock"
import { Authentication, WithAuth, resetUseAuth } from "../user/authentication"
import { UserProfile, resetUseUser } from "../user/user"
import { toggleMobile } from "./coreSliceUtils"
import { getRoutePaths } from "./coreUtils"
import { Home } from "./home"
/*





*/
export type Routes = {
  name: string
  path: string
  requiresAuth: boolean
  element: ReactElement
}[]
export const routes: Routes = [
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
    name: "Organisation",
    path: "/organisation",
    requiresAuth: true,
    element: <Organisation />,
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
    const isAuthPath = path === routePaths.signIn.path
    const isProfilePath = path === routePaths.profile.path
    const isOrgPath = path === routePaths.organisation.path
    const isStockPath = path === routePaths.stock.path
    const isCountPath = path === routePaths.count.path
    const isHistoryPath = path === routePaths.history.path

    if (!isAuthPath) resetUseAuth()
    if (!isProfilePath) resetUseUser()
    if (!isOrgPath) resetUseOrg()
    if (!isStockPath) resetUseStock()
    if (!isCountPath) resetUseCount()
    if (!isHistoryPath) resetUseHistory()
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
